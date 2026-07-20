/**
 * Générateur de tokens : design/figma-tokens.json → src/styles/tokens.css.
 *
 * Le JSON est un instantané des variables Figma (voir design/README.md pour
 * la procédure de re-dump). Ce script est la SEULE façon légitime de
 * modifier tokens.css : jamais d'édition à la main.
 *
 * Usage : npm run tokens
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(
  readFileSync(join(root, "design/figma-tokens.json"), "utf8"),
);

/** figma `a/b c` → custom property `--a-b-c`. */
const cssName = (figmaName) => `--${figmaName.replace(/[/\s]/g, "-")}`;

/**
 * Interlignes des styles de texte — relevés sur Foundation Typography Web
 * (fileKey DARJub5ezZ8Kr4hr24KGYm, 2026-07-13). Les styles de texte Figma
 * ne sont pas des variables : leur interligne vit ici, dans la recette.
 */
const TEXT_STYLES = {
  h1: { weight: "medium", size: "heading1", lh: 1.4 },
  h2: { weight: "medium", size: "heading2", lh: 1.2 },
  h3: { weight: "medium", size: "heading3", lh: 1.2 },
  h4: { weight: "semi bold", size: "heading4", lh: 1.4 },
  h5: { weight: "bold", size: "heading5", lh: 1.4 },
  h6: { weight: "bold", size: "heading6", lh: 1.4 },
  subtitle: { weight: "regular", size: "subtitle", lh: 1.45 },
  "body-1": { weight: "regular", size: "body1", lh: 1.65 },
  "body-2": { weight: "regular", size: "body2", lh: 1.6 },
  "caption-1": { weight: "medium", size: "caption1", lh: 1.5 },
  "caption-2": { weight: "regular", size: "caption2", lh: 1.4 },
};

/** Conventions locales de l'app : pas des variables Figma, documentées ici. */
const LOCAL = {
  "shadow-floating": {
    value: "0 4px 16px rgb(0 0 0 / 0.18)",
    comment: "élévation du dock SOS (drop-shadow des maquettes)",
  },
  "layout-max-width": {
    value: "480px",
    comment: "largeur max du flux mobile sur grand écran",
  },
};

const t = tokens.typography;
const family = `"${t["font/family/familyFont1"]}", system-ui, -apple-system, sans-serif`;
const font = (def) =>
  `${t[`font/weight/${def.weight}`]} ${t[`font/size/${def.size}`]}px/${def.lh} var(--font-family)`;

const section = (obj, unit = "") =>
  Object.entries(obj)
    .map(([name, value]) => `  ${cssName(name)}: ${value}${unit};`)
    .join("\n");

const group = (prefix, obj, unit = "") =>
  section(
    Object.fromEntries(
      Object.entries(obj).filter(([n]) => n.startsWith(prefix)),
    ),
    unit,
  );

const css = `/**
 * FICHIER GÉNÉRÉ — ne pas éditer à la main.
 * Source : design/figma-tokens.json (instantané des variables Figma,
 * ${tokens.dumpedAt}) + scripts/generate-tokens.mjs. Régénérer : npm run tokens.
 * Nommage aligné sur les variables Figma (slash → tiret).
 */
:root {
  /* pilote le rendu des contrôles natifs (calendrier des input date,
     scrollbars, autofill) : sans lui, leurs icônes restent sombres en dark */
  color-scheme: light;

  /* brand — ${tokens.sources.colors} */
${group("brand/", tokens.colors)}

  /* background */
${group("background/", tokens.colors)}

  /* foreground */
${group("foreground/", tokens.colors)}

  /* border */
${group("border/", tokens.colors)}

  /* base — fonds des badges */
${group("base/", tokens.colors)}

  /* App Semantic (local Smoking-App — identité « Ligne de crête ») */
${section(tokens.localColors)}

  /* spacing — ${tokens.sources.spacing} */
${section(tokens.spacing, "px")}

  /* radius */
${section(tokens.radius, "px")}
  --radius-field: var(--radius-md); /* alias historique des champs */

  /* conventions locales de l'app */
${Object.entries(LOCAL)
  .map(([n, d]) => `  --${n}: ${d.value}; /* ${d.comment} */`)
  .join("\n")}

  /* typography — ${tokens.sources.typography} + interlignes Typography Web */
  --font-family: ${family};
${Object.entries(TEXT_STYLES)
  .map(([n, def]) => `  --text-${n}: ${font(def)};`)
  .join("\n")}
}
`;

/**
 * Mode sombre : seules les couleurs sémantiques (brand/background/foreground/
 * border) changent. Les fonds de badges (base), l'identité immersive locale,
 * les espacements et la typo restent identiques (déjà adaptés au sombre).
 * `[data-theme="dark"]` = choix explicite ; le media query = préférence système
 * quand l'utilisateur laisse « Système » (aucun data-theme posé).
 */
const darkVars = section(tokens.colorsDark);
const darkCss = `
:root[data-theme="dark"] {
  color-scheme: dark;
  /* ${tokens.sources.colorsDark} */
${darkVars}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
${darkVars}
  }
}
`;

writeFileSync(join(root, "src/styles/tokens.css"), css + darkCss);
console.log("tokens.css régénéré depuis design/figma-tokens.json");
