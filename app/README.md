# SmokingApp — l'app

PWA d'aide à l'arrêt du tabac : React 19 + Vite (rolldown) + TypeScript strict,
Supabase (compte optionnel, sync, Edge Functions), design system maquetté dans
Figma et décliné en composants + tokens CSS.

## Démarrer

```bash
npm install
npm run dev              # http://localhost:5173
```

Sans configuration Supabase (`.env.local`, voir `.env.example`), l'app
fonctionne entièrement en local, sans compte.

## Storybook

- En ligne : https://nikulaguy.github.io/smoking-app/ (republiée à chaque push
  touchant `app/`, workflow `.github/workflows/storybook.yml`)
- En local : `npm run storybook` → http://localhost:6006

## Qualité

```bash
npx tsc -b                            # types
npm run lint                          # oxlint
npx vitest run --project=storybook    # stories + interactions + a11y (axe)
npm run build                         # build de production
```

## Déploiement

Netlify, à la demande uniquement (jamais automatique) :

```bash
npx netlify-cli deploy --prod --dir=dist
```

Chaque publication est marquée d'un tag git `deploy-AAAA-MM-JJ`.
Voir aussi `DEPLOY.md` et `../supabase/deploy-notes.md`.
