// SmokingApp · feedback utilisateur (Accueil préparation, état « tout prêt »).
// verify_jwt = true : réservé aux utilisateurs connectés, on joint leur adresse
// pour pouvoir répondre. Envoi via Resend vers l'équipe. Cap anti-spam par
// profil (profiles.last_feedback_at) : un message toutes les 5 minutes max.
//
// Déploiement : supabase functions deploy send-feedback --use-api

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** Destinataire du feedback (équipe produit). */
const FEEDBACK_TO = "nguy@frontguys.fr";
/** Cap anti-spam : un feedback toutes les 5 minutes par utilisateur. */
const CAP_MS = 5 * 60 * 1000;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
  );

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
  if (!user) return json({ error: "non authentifié" }, 401);

  const { message } = (await req.json().catch(() => ({}))) as { message?: string };
  const text = (message ?? "").trim();
  if (!text) return json({ error: "message vide" }, 400);
  if (text.length > 2000) return json({ error: "message trop long" }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // cap anti-spam par profil
  const { data: profile } = await admin
    .from("profiles")
    .select("last_feedback_at")
    .eq("id", user.id)
    .maybeSingle();
  if (
    profile?.last_feedback_at &&
    Date.now() - new Date(profile.last_feedback_at).getTime() < CAP_MS
  ) {
    return json({ error: "trop tôt", reason: "cap" }, 429);
  }

  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return json({ error: "email non configuré" }, 500);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "SmokingApp <nepasrepondre@frontguys.fr>",
      to: FEEDBACK_TO,
      reply_to: user.email,
      subject: `Feedback SmokingApp — ${user.email ?? "utilisateur"}`,
      html: `<p style="font-size:16px;color:#3c3c56;white-space:pre-wrap">${escapeHtml(text)}</p>
<p style="font-size:12px;color:#62627f">Envoyé depuis l'écran de préparation par ${escapeHtml(user.email ?? user.id)}.</p>`,
    }),
  });
  if (!res.ok) return json({ error: "envoi échoué" }, 502);

  await admin
    .from("profiles")
    .update({ last_feedback_at: new Date().toISOString() })
    .eq("id", user.id);

  return json({ ok: true });
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
