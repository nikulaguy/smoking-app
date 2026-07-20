# SmokingApp

Web app d'aide à l'arrêt du tabac, personnalisée selon le profil psychologique du fumeur. Compagnon proactif, gamification adaptée aux motivations profondes, contenu pédagogique et flux infini.

## Statut

Conception **terminée** (maquettes Figma complètes, identité « Ligne de crête »). Phase de **développement en cours** : `app/` (Vite + React + TypeScript + CSS Modules + CVA, skill ds-builder).

**PWA installable** (manifest + service worker + icônes + meta iOS) : sur mobile, « Ajouter à l'écran d'accueil ». Lancer en dev : `npm run dev` dans `app/` (port 5173) ; Storybook : `npm run storybook` (6006).

Fait : design system code (13 composants + Storybook + 37 tests), onboarding Jour 0 complet, navigation (react-router + tab bar + SOS), dashboard « Sommet » connecté au profil (états préparation / ascension), sur-couche boîte à outils. Écrans Fil / Défis / Profil : placeholders (à venir).

## Principe fondateur

Viser un **engagement sain** qui rend l'utilisateur progressivement autonome, et non une « substitution d'addiction ». Ce qui prédit le succès durable selon la recherche : la motivation intrinsèque et le sentiment de contrôle (auto-efficacité), pas la compulsion.

## Décisions actées

- **Profilage en deux temps** : onboarding express (Jour 0, moins de 2 min) puis profilage progressif gamifié (J1 a J7). Motif : les jeunes fumeurs hédonistes décrochent a 70% des la 1re session.
- **Items d'échelles** : formulations design prêtes a maquetter, a remplacer par les items verbatim validés juste avant le développement.

## Arborescence

```
SmokingApp/
  README.md                 ce fichier
  docs/
    01-recherche.md              rapport de recherche vérifié (base de preuves)
    02-questionnaire.md          spécification du questionnaire de profilage
    03-matrice-personnalisation.md  moteur profil vers comportement de l'app
    04-boucle-feedback.md        adaptation évolutive dans le temps
    05-composants.md             inventaire des composants Figma (socle container-field)
    06-dashboard-feed.md         dashboard, SOS envie et fil personnalisé
```

## Documents

- [Rapport de recherche](docs/01-recherche.md)
- [Questionnaire de profilage](docs/02-questionnaire.md)
- [Matrice de personnalisation](docs/03-matrice-personnalisation.md)
- [Boucle de feedback](docs/04-boucle-feedback.md)
- [Inventaire des composants](docs/05-composants.md)
- [Dashboard et fil](docs/06-dashboard-feed.md)
