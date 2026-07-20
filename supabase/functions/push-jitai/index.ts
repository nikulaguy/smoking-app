// SmokingApp · fan-out JITAI planifié (doc 04) — multi-canal.
// verify_jwt = false, mais protégé : l'appelant (pg_cron via pg_net) doit
// présenter la clé service dans Authorization. Parcourt les PROFILS (pas
// seulement les abonnements push), calcule le rappel dû pour l'heure
// courante (conseil de préparation à 9 h en phase prep, moment à risque en
// phase ascension), et l'envoie sur les canaux choisis par l'utilisateur :
// push (tous ses appareils) et/ou mail (Resend). Le canal « local » vit
// entièrement sur l'appareil (src/lib/localNotifs.ts), pas ici.
//
// Rythme : cap par canal — push_subscriptions.last_sent_at (par appareil),
// profiles.last_email_at (mail).
//
// Déploiement : supabase functions deploy push-jitai --no-verify-jwt
// Planification : pg_cron horaire (voir supabase/deploy-notes.md).

import { createClient } from "jsr:@supabase/supabase-js@2";
import { makeAppServer, pushTo } from "../push-send/webpush.ts";
import {
  dueReminder,
  duePrepTip,
  isPrepPhase,
  parisHour,
  rhythmCapHours,
} from "../push-send/jitai.ts";
import { sendReminderEmail } from "../push-send/email.ts";

type State = Record<string, unknown>;

Deno.serve(async (req) => {
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (req.headers.get("Authorization") !== `Bearer ${service}`) {
    return new Response("forbidden", { status: 403 });
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, service);
  const hour = parisHour();
  const now = Date.now();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, state, last_email_at");
  if (!profiles?.length) return json({ push: 0, email: 0, hour });

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, user_id, subscription, last_sent_at");
  const subsByUser = new Map<string, NonNullable<typeof subs>>();
  for (const s of subs ?? []) {
    const list = subsByUser.get(s.user_id) ?? [];
    list.push(s);
    subsByUser.set(s.user_id, list);
  }

  let appServer: Awaited<ReturnType<typeof makeAppServer>> | null = null;
  let pushSent = 0;
  let emailSent = 0;

  for (const p of profiles) {
    const state = (p.state ?? {}) as State;
    const prefs = (state.notifPrefs as {
      enabled?: boolean;
      rhythm?: string;
      riskReminders?: boolean;
      channels?: { push?: boolean; email?: boolean };
    }) ?? {};
    // interrupteur global : false = plus aucune notification
    if (prefs.enabled === false) continue;
    if (prefs.riskReminders === false) continue;

    const moments =
      ((state.phase2 as State | undefined)?.social_moments as string[] | undefined) ?? [];
    const reminder = isPrepPhase(state)
      ? duePrepTip(state, hour)
      : dueReminder(moments, hour);
    if (!reminder) continue;

    const capMs = rhythmCapHours(prefs.rhythm) * 3_600_000;
    // rétro-compatibilité : sans préférence de canaux, un abonnement push
    // existant vaut opt-in push (comportement historique)
    const channels = prefs.channels ?? { push: true, email: false };

    // ---- canal push : chaque appareil abonné, cap par appareil ----
    if (channels.push !== false) {
      for (const s of subsByUser.get(p.id) ?? []) {
        if (s.last_sent_at && now - new Date(s.last_sent_at).getTime() < capMs) continue;
        appServer ??= await makeAppServer();
        const { ok, gone } = await pushTo(appServer, s.subscription, reminder);
        if (ok) {
          pushSent++;
          await admin
            .from("push_subscriptions")
            .update({ last_sent_at: new Date().toISOString() })
            .eq("endpoint", s.endpoint);
        }
        if (gone) {
          await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
        }
      }
    }

    // ---- canal mail : cap par profil ----
    if (channels.email) {
      if (p.last_email_at && now - new Date(p.last_email_at).getTime() < capMs) continue;
      const { data: userData } = await admin.auth.admin.getUserById(p.id);
      const email = userData?.user?.email;
      if (!email) continue;
      const sent = await sendReminderEmail(email, reminder);
      if (sent) {
        emailSent++;
        await admin
          .from("profiles")
          .update({ last_email_at: new Date().toISOString() })
          .eq("id", p.id);
      }
    }
  }

  return json({ push: pushSent, email: emailSent, hour });
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
