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
 * Indicateur d'avancement dans une séquence. L'information est portée par le
 * texte visible ; la barre est purement décorative (aria-hidden), pas de
 * role progressbar nécessaire tant que le texte est présent.
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
