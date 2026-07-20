import { useCallback } from "react";
import { flushSync } from "react-dom";
import {
  useNavigate,
  type NavigateOptions,
  type To,
} from "react-router-dom";

/** Grammaire de mouvement d'une navigation (pilote le CSS ::view-transition).
    Règle transverse : une entrée dans un sens ressort TOUJOURS en sens
    inverse (push/pop latéral, sheet/sheet-back vertical par le haut).
    Les onglets sont directionnels : fwd = onglet plus à droite, back = plus à
    gauche (glissement latéral rapide avec rebond, voir index.css). */
export type NavKind =
  | "push"
  | "pop"
  | "tab-fwd"
  | "tab-back"
  | "sheet"
  | "sheet-back";

/** L'utilisateur préfère réduire les animations : aucune transition d'écran. */
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pose la grammaire du geste sur <html> AVANT la capture de la View
 * Transition : le CSS (index.css) choisit l'animation (fondu d'onglet,
 * glissement push, glissement inverse pop) via html[data-nav="…"].
 */
export const setNavKind = (kind: NavKind) => {
  document.documentElement.dataset.nav = kind;
};

/**
 * useNavigate + View Transitions API : chaque navigation transite en douceur
 * (fondu/glissement selon le geste). Drop-in : même signature que useNavigate.
 * - `navigate(-1)` = geste « pop » (glissement inverse) ;
 * - `navigate(to)` = geste « push » (les onglets passent par <NavLink
 *   viewTransition> + setNavKind("tab-fwd"/"tab-back"), pas par ce hook).
 * Sans support navigateur ou avec prefers-reduced-motion : navigation sèche.
 */
export const useAppNavigate = () => {
  const navigate = useNavigate();
  return useCallback(
    (to: To | number, options?: NavigateOptions & { motion?: NavKind }) => {
      const { motion, ...navOptions } = options ?? {};
      const go = () =>
        typeof to === "number" ? navigate(to) : navigate(to, navOptions);
      if (!document.startViewTransition || reducedMotion()) {
        go();
        return;
      }
      setNavKind(
        motion ?? (typeof to === "number" && to < 0 ? "pop" : "push"),
      );
      // flushSync : le nouvel écran doit être rendu DANS le callback pour que
      // la View Transition capture bien l'avant/après (même mécanique que
      // l'option viewTransition de react-router).
      document.startViewTransition(() => {
        flushSync(go);
      });
    },
    [navigate],
  );
};

/**
 * Transition d'étape SANS navigation (flows pilotés par un state local :
 * onboarding, profilage). Même grammaire que les routes : l'étape suivante
 * entre par la droite (push), l'étape précédente ressort par la droite (pop).
 */
export const transitionStep = (kind: NavKind, apply: () => void) => {
  if (!document.startViewTransition || reducedMotion()) {
    apply();
    return;
  }
  setNavKind(kind);
  document.startViewTransition(() => {
    flushSync(apply);
  });
};
