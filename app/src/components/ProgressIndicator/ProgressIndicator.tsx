import type { HTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import styles from "./ProgressIndicator.module.css";

interface ProgressIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Texte d'avancement visible (« Étape 2 sur 3 ») — c'est lui qui porte l'information. */
  children: ReactNode;
  /** Progression accomplie, entre 0 et 1. */
  progress: number;
}

/**
 * Progression d'un flux à étapes (onboarding, profilage) : libellé « Étape X
 * sur Y » et barre de remplissage. Purement informatif, mis à jour à chaque
 * étape ; le libellé textuel porte l'information, la barre l'illustre.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const ProgressIndicator = ({
  children,
  progress,
  ...props
}: ProgressIndicatorProps) => (
  <ProgressIndicator.Root {...props}>
    <ProgressIndicator.Label>{children}</ProgressIndicator.Label>
    <ProgressIndicator.Track aria-hidden>
      <div
        className={styles.fill}
        style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }}
      />
    </ProgressIndicator.Track>
  </ProgressIndicator.Root>
);

/** Conteneur de l'indicateur. */
ProgressIndicator.Root = atom("div", styles.root);

/** Texte d'avancement. */
ProgressIndicator.Label = atom("span", styles.label);

/** Barre décorative. */
ProgressIndicator.Track = atom("div", styles.track);
