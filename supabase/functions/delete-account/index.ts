// SmokingApp · Phase B.2 : demande de suppression conforme (doc 06)
// Appelée par l'app (utilisateur authentifié). Efface les données produit
// immédiatement, horodate la demande avec 30 jours de rétractation, suspend
// la connexion, et envoie un mail de confirmation contenant le lien de
// rétractation. La purge définitive est faite en SQL par la fonction
// public.purge_expired_deletions() planifiée en pg_cron (voir schema-b2.sql).
//
// Déploiement : voir supabase/deploy-notes.md (verify_jwt = true, défaut).

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};


const RETENTION_DAYS = 30;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  const authHeader = req.headers.get("Authorization") ?? "";

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) {
    return json({ error: "non authentifié" }, 401);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const purgeAt = new Date(Date.now() + RETENTION_DAYS * 86_400_000);

  // 1. enregistrer la demande (génère le cancel_token) et le récupérer
  const { data: request, error: markError } = await admin
    .from("deletion_requests")
    .upsert({
      user_id: user.id,
      email: user.email,
      requested_at: new Date().toISOString(),
      purge_at: purgeAt.toISOString(),
    })
    .select("cancel_token")
    .single();
  if (markError) return json({ error: markError.message }, 500);

  // 2. les données produit sont CONSERVÉES pendant la fenêtre de
  // rétractation (restauration intégrale possible) ; la purge à 30 jours
  // supprime auth.users, qui cascade sur profiles et deletion_requests.
  // Seuls les abonnements push sont coupés tout de suite (plus de notifs).
  await admin.from("push_subscriptions").delete().eq("user_id", user.id);

  // 3. suspendre la connexion pendant la fenêtre de rétractation
  await admin.auth.admin.updateUserById(user.id, {
    ban_duration: `${RETENTION_DAYS * 24}h`,
  });

  // 4. mail de confirmation avec le lien de rétractation
  if (user.email && request) {
    const cancelUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/cancel-deletion?token=${request.cancel_token}`;
    await sendMail(user.email, cancelUrl, purgeAt);
  }

  return json({ ok: true, purgeAt: purgeAt.toISOString() });
});

const sendMail = async (to: string, cancelUrl: string, purgeAt: Date) => {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return; // pas de SMTP : la demande reste valable sans mail
  const jour = purgeAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "SmokingApp <nepasrepondre@frontguys.fr>",
      to,
      subject: "Ta demande de suppression SmokingApp",
      html: `<h2>C'est noté.</h2>
<p>Ton compte est en pause. Tes données sont conservées jusqu'au <strong>${jour}</strong> : si tu changes d'avis d'ici là, tu retrouves tout, exactement comme avant.</p>
<p><a href="${cancelUrl}">Restaurer mon compte</a></p>
<p>Tu peux aussi simplement te reconnecter dans l'app : elle te proposera la restauration.</p>
<p>Après le <strong>${jour}</strong>, tout sera définitivement effacé et ton adresse repartira d'une feuille blanche. Si tout est en ordre pour toi, tu n'as rien à faire.</p>`,
    }),
  });
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
