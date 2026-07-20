# Déploiement back-end SmokingApp

Secrets d'admin dans `supabase/.env.local` (local, non versionné). Charger :

```bash
set -a; source supabase/.env.local; set +a
```

## Base de données

SQL appliqué via l'API de management (SQL Editor du dashboard aussi possible) :

- `schema.sql` — Phase B.1 : table `profiles` + RLS + trigger.
- `schema-b2.sql` — Phase B.2 : table `deletion_requests`, fonction
  `purge_expired_deletions()` + job pg_cron nocturne (3 h).

Note : l'`urllib` de Python échoue en TLS sur cette machine ; passer par
`curl` pour l'API `https://api.supabase.com/v1/...`.

## Edge Functions

```bash
npx supabase functions deploy delete-account   --project-ref $SUPABASE_PROJECT_REF --use-api
npx supabase functions deploy cancel-deletion  --project-ref $SUPABASE_PROJECT_REF --use-api --no-verify-jwt
npx supabase functions deploy push-send        --project-ref $SUPABASE_PROJECT_REF --use-api
npx supabase functions deploy push-jitai       --project-ref $SUPABASE_PROJECT_REF --use-api --no-verify-jwt
```

- `delete-account` : verify_jwt = true (appelée par l'app authentifiée).
- `cancel-deletion` : verify_jwt = false (lien public du mail, protégé par le
  `cancel_token` uuid).
- `push-send` : verify_jwt = true (envoie au demandeur : bouton de test +
  brique testable).
- `push-jitai` : verify_jwt = false, protégé : `Authorization: Bearer
  <service_role_key>`. Fan-out planifié réutilisant push-send/{webpush,jitai}.ts.

Secrets runtime : `RESEND_API_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`,
`VAPID_SUBJECT` (déjà posés).

## Web Push (VAPID + JITAI)

- Clés VAPID : publique dans `app/.env.local` (VITE_VAPID_PUBLIC_KEY) et
  côté fonctions ; privée = secret de fonction. Régénérer :
  `npx web-push generate-vapid-keys --json`.
- Table `push_subscriptions` (schema-b2 étendu) : un abonnement navigateur
  par ligne, RLS « own row ».
- SW : `public/push-sw.js` importé par workbox (`workbox.importScripts`).
- Cron `push-jitai-hourly` (pg_cron, minute 5) appelle push-jitai via pg_net.
  Il lit la clé service dans **Supabase Vault** (jamais dans le code / la
  commande cron). **ACTIVATION (1 étape, côté Nicolas)** : Dashboard →
  Project Settings → Vault → New secret, nom `edge_service_key`, valeur =
  la clé `service_role` (Settings → API). Tant qu'elle n'existe pas, le cron
  poste un bearer vide → 403 (inoffensif).

## Emails (Resend)

SMTP configuré dans Auth (smtp.resend.com:465). Templates magic link +
confirmation avec `{{ .ConfirmationURL }}` et code `{{ .Token }}`.
Sandbox : n'envoie qu'à l'adresse du compte Resend tant que le domaine
`frontguys.fr` n'est pas vérifié (Resend → Domains → DNS).
