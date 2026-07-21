import { cx } from "class-variance-authority";
import type { InputHTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import {
  containerFieldVariants,
  type ContainerFieldVariants,
} from "../ContainerField/ContainerField";
import styles from "./MultiChoiceOption.module.css";

interface MultiChoiceOptionProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Intitulé de l'option (texte ou contenu riche). */
  children: ReactNode;
  /** Petite description secondaire sous l'intitulé (optionnelle). */
  description?: ReactNode;
  /**
   * Ouvre l'écran de détail de l'option (flèche lien ↗ en fin de rangée).
   * La flèche est un bouton séparé du label : cocher et ouvrir le détail
   * restent deux gestes distincts.
   */
  onDetail?: () => void;
  /** Intitulé accessible de la flèche de détail (obligatoire avec onDetail). */
  detailLabel?: string;
  /** Taille de la coque container-field. */
  size?: ContainerFieldVariants["size"];
  className?: string;
}

const Arrow = () => (
  <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M5 13L13 5M13 5H6M13 5v7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Option multi-sélection au sein d'un groupe : plusieurs options cochables,
 * avec un plafond métier possible (max atteint : options restantes désactivées
 * + compteur). Toute la rangée est cliquable. Structure : coque container-
 * field, et dans son slot la checkbox avec son label (label, mention
 * conditions, flèche de détail optionnelle). La flèche « Voir le détail » est
 * un bouton FRÈRE du label, jamais imbriqué : deux éléments étiquetables
 * distincts.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const MultiChoiceOption = ({
  children,
  description,
  onDetail,
  detailLabel,
  size = "default",
  className,
  ...inputProps
}: MultiChoiceOptionProps) => (
  <div className={cx(containerFieldVariants({ size }), className)}>
    <MultiChoiceOption.Root className={styles.option}>
      <MultiChoiceOption.Input type="checkbox" {...inputProps} />
      <MultiChoiceOption.Label>
        <span className={styles.title}>{children}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </MultiChoiceOption.Label>
    </MultiChoiceOption.Root>
    {onDetail && (
      <button
        type="button"
        className={styles.detail}
        aria-label={detailLabel}
        onClick={onDetail}
      >
        <Arrow />
      </button>
    )}
  </div>
);

/** Zone cochable de l'option — label englobant la case et les textes. */
MultiChoiceOption.Root = atom("label", styles.option);

/** Input checkbox natif, stylé en CSS (jamais de div role="checkbox"). */
MultiChoiceOption.Input = atom("input", styles.input);

/** Intitulé de l'option. */
MultiChoiceOption.Label = atom("span", styles.label);
