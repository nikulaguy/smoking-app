import { atom } from "../../atom";
import styles from "./TabBar.module.css";

/**
 * Barre de navigation principale, fixe en bas de tous les écrans de l'app
 * connectée (jamais dans l'onboarding ni les sur-couches plein écran).
 *
 * Contient des liens (`TabBar.Item`) — pas des boutons. L'onglet courant
 * porte `aria-current="page"` (posé par le routeur, ex. NavLink) : c'est lui
 * qui pilote le style actif et l'indicateur.
 */
export const TabBar = Object.assign(
  atom("nav", styles.root, { "aria-label": "Navigation principale" }),
  {
    /** Lien d'onglet. Actif via `aria-current="page"`. */
    Item: atom("a", styles.item),
  },
);
