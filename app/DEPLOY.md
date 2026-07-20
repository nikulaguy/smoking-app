# Déploiement front (Netlify)

L'app est une SPA Vite + PWA. `netlify.toml` porte le build, le fallback SPA
(toutes les routes → index.html) et les 3 variables publiques `VITE_*` au build
(clé publishable, URL Supabase, clé VAPID publique — toutes destinées au
client). Aucune variable secrète côté front.

## Premier déploiement (CLI, sans git)

Depuis `app/` :

```bash
npx netlify login                  # connexion (navigateur), une seule fois
npx netlify deploy --build --prod  # build (avec netlify.toml) puis déploie
```

Au 1er run, la CLI propose de créer/configurer un nouveau site (équipe, nom).
À la fin, elle affiche l'URL de prod (ex. `https://smokingapp-xxx.netlify.app`).
→ **Communiquer cette URL** : elle doit être ajoutée aux redirections d'auth
Supabase (sinon le lien magique ne revient pas sur l'app déployée).

## Déploiements suivants

```bash
npx netlify deploy --build --prod
```

## Config Supabase liée (faite côté agent avec le token)

- Authentication → URL Configuration : Site URL + Redirect URLs incluant
  `https://<url-netlify>` et `https://<url-netlify>/compte/connexion`.

## Test en local sur l'ordinateur (localhost = contexte sécurisé)

`npm run dev` → http://localhost:5173. Le service worker est actif en dev
(`devOptions.enabled` dans vite.config), donc **push et install PWA
testables sur l'ordi** (contrairement au téléphone en LAN qui exige HTTPS).
Auth/mails déjà fonctionnels (redirections Supabase incluent localhost/**).

## Test sur téléphone

Ouvrir l'URL HTTPS dans Safari/Chrome mobile → « Ajouter à l'écran d'accueil »
→ ouvrir l'app installée → Profil → Notifications & rythme → activer les
rappels (accepter la permission) → « Tester une notification ».
