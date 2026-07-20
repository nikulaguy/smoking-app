# Pipeline tokens Figma → CSS

`src/styles/tokens.css` est **généré** : ne jamais l'éditer à la main.

```
Figma (variables) ──dump──> design/figma-tokens.json ──npm run tokens──> src/styles/tokens.css
```

## Régénérer le CSS

```bash
npm run tokens
```

Déterministe : seul `design/figma-tokens.json` (valeurs) et
`scripts/generate-tokens.mjs` (recette : interlignes, conventions locales,
alias) font foi.

## Re-dumper depuis Figma (quand le DS bouge)

Le dump se fait via le MCP Figma (`use_figma`, fichier Smoking-App
`LDK3DSGI3aNuG0TeQhmZhq`), l'API REST des variables étant réservée au plan
Enterprise. Demander à l'agent : « re-dumpe les tokens Figma », qui exécute :

1. `figma.teamLibrary.getVariablesInLibraryCollectionAsync(key)` pour chaque
   collection source, puis `importVariableByKeyAsync` + résolution récursive
   des alias (`valuesByMode`, premier mode) :
   - Couleurs : `Foundation - Colors Styles` · Semantic
     (key `a5ccaae3742a64066c59ab3001320b07a9df1bc3`) — inclut les `base/*`
     du badge (absents du listing teamLibrary, accessibles via la collection
     résolue d'une variable liée).
   - Spacing/radius : `Foundation - Radius & Spacings` · Semantic
     (key `4793e98fa9a6fd615c9b6eb2ab7f336b86d548b0`).
   - Typo : `Foundation - Website Text Styles` · Semantic
     (key `880ac1d9d9d613cf54830559e4f10bf97ba80a78`).
2. Collection locale `App Semantic (local)` du fichier :
   `getLocalVariableCollectionsAsync()`.
3. Écrire les valeurs dans `design/figma-tokens.json` (couleurs en hex,
   nombres bruts), mettre à jour `dumpedAt`, puis `npm run tokens` et
   vérifier le diff de `tokens.css`.

## Ce qui ne vient PAS de Figma

Déclaré dans `scripts/generate-tokens.mjs`, avec provenance :

- **Interlignes** des styles de texte (les styles Figma ne sont pas des
  variables) — relevés sur Foundation Typography Web.
- `--shadow-floating`, `--layout-max-width` — conventions locales de l'app.
- `--radius-field` — alias historique de `--radius-md`.
