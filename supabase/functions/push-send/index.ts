// SmokingApp · Phase B.2 : envoi d'un rappel push au demandeur (doc 04)
// verify_jwt = true : envoie aux abonnements de l'utilisateur authentifié.
// Sert au bouton « Tester une notification » et de brique testable ; le
// fan-out planifié (tous les utilisateurs) réutilise webpush.ts + jitai.ts.
//
// Body optionnel : { title, body } pour un envoi de test ; sinon le rappel
// JITAI de l'heure courante (rien à pousser hors moment → 204).

import { createClient } from "jsr:@supabase/supabase-js@2";
import { makeAppServer, pushTo, type PushPayload } from "./webpush.ts";
import { dueReminder, parisHour } from "./jitai.ts";
import { sendReminderEmail } from "./email.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};


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

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // message : override de test, ou rappel JITAI de l'heure courante
  const override = (await req.json().catch(() => ({}))) as Partial<PushPayload>;
  const { data: profile } = await admin
    .from("profiles")
    .select("state")
    .eq("id", user.id)
    .maybeSingle();
  const prefs = profile?.state?.notifPrefs as
    | { enabled?: boolean; channels?: { push?: boolean; email?: boolean } }
    | undefined;
  // interrupteur global : false = plus aucune notification, test compris
  if (prefs?.enabled === false) {
    return json({ push: 0, email: false, reason: "notifications coupées" }, 200);
  }
  const channels = prefs?.channels ?? { push: true, email: false };

  let payload: PushPayload;
  if (override.title && override.body) {
    payload = { title: override.title, body: override.body, url: "/", tag: "test" };
  } else {
    const moments =
      (profile?.state?.phase2?.social_moments as string[] | undefined) ?? [];
    const reminder = dueReminder(moments, parisHour());
    if (!reminder) return json({ push: 0, email: false, reason: "hors moment" }, 200);
    payload = reminder;
  }

  // ---- canal push : tous les appareils abonnés de l'utilisateur ----
  let sent = 0;
  if (channels.push !== false) {
    const { data: subs } = await admin
      .from("push_subscriptions")
      .select("endpoint, subscription")
      .eq("user_id", user.id);
    if (subs?.length) {
      const appServer = await makeAppServer();
      for (const s of subs) {
        const { ok, gone } = await pushTo(appServer, s.subscription, payload);
        if (ok) sent++;
        if (gone) await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      }
    }
  }

  // ---- canal mail ----
  let emailed = false;
  if (channels.email && user.email) {
    emailed = await sendReminderEmail(user.email, payload);
  }

  return json({ push: sent, email: emailed });
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
