import type { HTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import styles from "./RecapList.module.css";

interface RecapItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Libellé de la donnée (« Tes moteurs »). */
  label: ReactNode;
  /** Valeur (« Santé + liberté »). */
  children: ReactNode;
}

/**
 * Récapitulatif en lecture seule : liste de définitions (`<dl>`), une ligne
 * par donnée. Jamais interactif — pour un contenu tapable, utiliser une card
 * avec lien ou une nav-row.
 */
export const RecapList = atom("dl", styles.list);

/** Ligne libellé + valeur du récapitulatif. */
export const RecapItem = ({ label, children, ...props }: RecapItemProps) => (
  <div className={styles.item} {...props}>
    <dt className={styles.label}>{label}</dt>
    <dd className={styles.value}>{children}</dd>
  </div>
);
