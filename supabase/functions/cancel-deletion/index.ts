// SmokingApp · Phase B.2 : rétractation d'une suppression (lien du mail)
// Public (verify_jwt = false) : le compte est banni, l'utilisateur ne peut
// pas se connecter pour annuler. Protégé par le cancel_token (uuid) du mail.
// Lève le ban, supprime la demande, renvoie une page de confirmation.
//
// Déploiement : supabase functions deploy cancel-deletion --no-verify-jwt

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return page("Lien invalide", "Ce lien de rétractation est incomplet.");

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: request } = await admin
    .from("deletion_requests")
    .select("user_id, purge_at")
    .eq("cancel_token", token)
    .maybeSingle();

  if (!request) {
    return page(
      "Trop tard, ou déjà fait",
      "Ce lien n'est plus valable : soit ton compte a déjà été rétabli, soit le délai de 30 jours est écoulé.",
    );
  }

  // lever le ban et retirer la demande
  await admin.auth.admin.updateUserById(request.user_id, { ban_duration: "none" });
  await admin.from("deletion_requests").delete().eq("cancel_token", token);

  return page(
    "Ton compte est rétabli.",
    "Bon retour. Reconnecte-toi dans l'app avec ton adresse mail : ton ascension t'attend.",
  );
});

/** Page HTML minimale, aux couleurs de l'app (le lien s'ouvre hors app). */
const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-content:center; gap:16px;
    padding:24px; text-align:center; background:#e9f9f9; color:#3c3c56;
    font-family:system-ui,-apple-system,sans-serif; }
  h1 { margin:0; font-size:32px; color:#004c61; }
  p { margin:0; font-size:18px; color:#62627f; max-width:34ch; }
</style></head>
<body><h1>${title}</h1><p>${body}</p></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
