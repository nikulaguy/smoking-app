// SmokingApp · restauration d'un compte en cours de suppression, depuis l'app.
// Public (verify_jwt = false) : le compte est banni, l'utilisateur ne peut pas
// s'authentifier normalement. La preuve de possession de l'adresse est le code
// OTP du mail de connexion : on lève le ban le temps de vérifier le code ; si
// le code est bon, la demande de suppression est annulée et la session est
// renvoyée à l'app ; sinon le ban est rétabli jusqu'à la purge.
//
// Déploiement : supabase functions deploy restore-account --no-verify-jwt

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "méthode invalide" }, 405);
  // fresh = « repartir de zéro » : purge immédiate et définitive au lieu
  // de la restauration. Même preuve de possession de l'adresse (code OTP).
  const { email, token, fresh } = await req.json().catch(() => ({}));
  if (!email || !token) return json({ error: "email et code requis" }, 400);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // demande de suppression encore ouverte ?
  const { data: request } = await admin
    .from("deletion_requests")
    .select("user_id, purge_at")
    .eq("email", email)
    .maybeSingle();
  if (!request || new Date(request.purge_at).getTime() < Date.now()) {
    return json({ error: "aucune suppression en cours pour cette adresse" }, 404);
  }

  // lever le ban le temps de prouver la possession de l'adresse
  await admin.auth.admin.updateUserById(request.user_id, { ban_duration: "none" });

  const verify = await fetch(`${url}/auth/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: Deno.env.get("SUPABASE_ANON_KEY")!,
    },
    body: JSON.stringify({ type: "email", email, token }),
  });

  if (!verify.ok) {
    // code invalide : on referme la porte jusqu'à la purge
    const remainingH = Math.ceil(
      (new Date(request.purge_at).getTime() - Date.now()) / 3_600_000,
    );
    await admin.auth.admin.updateUserById(request.user_id, {
      ban_duration: `${Math.max(1, remainingH)}h`,
    });
    return json({ error: "code invalide ou expiré" }, 400);
  }

  if (fresh) {
    // adresse prouvée : purge immédiate et définitive (cascade sur profiles
    // et deletion_requests) — l'adresse repart d'une feuille blanche.
    await admin.auth.admin.deleteUser(request.user_id);
    return json({ ok: true, fresh: true });
  }

  // adresse prouvée : la suppression est annulée, le compte restauré tel quel
  await admin.from("deletion_requests").delete().eq("user_id", request.user_id);
  const session = await verify.json();
  return json({ ok: true, session });
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
