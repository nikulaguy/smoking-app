# Inventaire des composants (maquette Figma)

Composants candidats DS créés pour l'app, vivant dans la page « Composants » du fichier Figma Smoking-App. Tous sont entièrement bindés sur les tokens Frontguys, décrits nativement (descriptions fonctionnelles, agnostiques du sujet) et annotés en Dev Mode (Accessibility / Interaction / Development / Content), stack cible React + CSS Modules.

## Architecture : le socle container-field

`container-field` (créé par Nicolas, complété le 2026-07-12) est le **socle visuel commun de tous les champs interactifs de saisie**. Il porte exclusivement le look & feel des états ; le contenu est injecté via un **slot natif Figma** ; la sémantique vit dans les consommateurs.

- **États** : default, selected, pressed, disabled, error (5)
- **Tailles** : default (rangée pleine largeur, padding 12/16) et compact (cellule 46×48 centrée)
- **En code** : un module partagé `containerField.module.css`, classes composables (`.field` + `.selected` / `.pressed` / `.disabled` / `.error` + `.compact`), composées par les consommateurs.

```
container-field (états × tailles)
  ├── single-choice-option   slot = radiobox DS + label      (rôle radio)
  ├── multi-choice-option    slot = checkbox DS (label natif) (rôle checkbox)
  ├── select-field (trigger) slot = value + icon-down        (rôle button, ouvre un sélecteur plein écran)
  └── likert-segment         slot = number (size=compact)    (rôle radio au sein d'une échelle)
```

## Catalogue

| Composant | Rôle | Variants | Contenu du slot / structure |
|---|---|---|---|
| `container-field` | Socle visuel des champs et tuiles interactives | 5 états × 3 tailles (default / compact / tile) | slot natif |
| `tool-tile` | Tuile d'action d'une grille d'outils | Default / Pressed / Disabled | illustration swappable + label, sur container-field size=tile |
| `single-choice-option` | Option a choix unique (une seule par groupe) | Unselected / Selected / Pressed / Disabled | radiobox DS (label inclus) |
| `multi-choice-option` | Option a sélection multiple (case carrée = multi) | Unselected / Selected / Pressed / Disabled | checkbox DS telle quelle (libellé via sa prop `label`) |
| `select-field` | Champ de sélection fermé, ouvre un sélecteur plein écran | Empty / Filled / Error / Disabled | field-label au-dessus, trigger = container-field (value + icon-down), error-caption dessous |
| `likert-scale` | Échelle de réponse graduée | Points 7/5 × Default/Error | rangée de likert-segment + ancres overridables |
| `likert-segment` | Pastille de valeur d'une échelle | Unselected / Selected / Pressed / Disabled | number, sur container-field compact |
| `progress-indicator` | Avancement dans une séquence | (overrides) | step-label + barre décorative |
| `recap-item` | Ligne de récapitulatif lecture seule (libellé + valeur) | Divider Yes/No | s'empile en liste, `<dl>` en code |
| `tab-item` / `tab-bar` | Navigation principale | Active/Inactive | libellés (icônes manquantes a la lib) |
| `sos-craving` | Aide immédiate flottante persistante | — | Button DS + ombre |
| `badge` (DS) | Pastille informative (niveau, jours de la semaine) | Type : default / primary / alternate1-5 | instancié tel quel ; convention dashboard : jour courant = alternate1 (jaune), jour gravi = alternate2, jour a venir = primary (se fond dans le hero) |
| `blockQuote` (DS) | Citation + attribution (« ta phrase » en exergue du dashboard) | override : citation en 20 pour l'exergue | dans un panneau fond subtle + crete-divider en signature, padding bas base-6 (validé 2026-07-15) |
| `stat-metric` | Métrique valeur + libellé | hero / compact | — |
| `deco/crete-hero` | Décor strates de crête (zones immersives) | — | absolu, ancré bas, étiré ; ~100px de padding bas requis |
| `deco/crete-divider` | Séparateur ligne de crête | — | remplace les filets droits |
| `deco/drapeau` | Marqueur de palier atteint | — | absent au Jour 1, présent ensuite |
| `deco/soleil` | Ponctuation lumineuse des heros | — | un seul par écran |

## Règles transverses

- **Hiérarchie des actions (2026-07-15)** : Button Type primary (action principale, une seule par écran) > secondary (second rang) > **ghost** (tertiaire). **Jamais deux boutons du même Type superposés.** Un lien (`link`) ne se superpose jamais a un bouton : dans une pile d'actions, l'action tertiaire est un Button ghost. Le composant `link` est réservé aux liens isolés dans un contenu (ex. « Retour au profil », « Tu as fumé ? », liens inline).
- Le Button de la librairie (tous types) : Regular 16 (body-2), padding 12/24, hauteur 49 : le miroir code est aligné.
- Rond = choix unique, carré = sélection multiple, jamais l'inverse.
- Une icône est toujours une instance de `Foundation - Icons` (`icon/action/*`), jamais dessinée.
- Composants DS existants (checkbox, radiobox, input, button, card, link) toujours instanciés, jamais reconstruits.
- Les descriptions Figma sont fonctionnelles et agnostiques ; les specs a11y et la guidance code vivent dans les annotations natives.
- Multi-sélection avec maximum : options restantes en Disabled quand le max est atteint + compteur explicatif (`aria-live="polite"`).
- Sélection : jamais portée par la couleur seule (bordure 2px + fond + marqueur).
- **Sémantique des cards (règle 2026-07-12)** : card avec `arrowOblique` = contenu tapable (lien) ; card sans flèche (icône masquée) = panneau d'information éditorial ; récapitulatif structuré (données clé-valeur) = liste de `recap-item`, jamais une card. Un récap n'est jamais un lien.
