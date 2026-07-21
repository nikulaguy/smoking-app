import { cx } from "class-variance-authority";
import { type FieldsetHTMLAttributes, type ReactNode, useId } from "react";
import { atom } from "../../atom";
import { containerFieldVariants } from "../ContainerField/ContainerField";
import styles from "./LikertScale.module.css";

interface LikertScaleProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  /** Énoncé de l'échelle (porté par la legend du fieldset). */
  legend: ReactNode;
  /** Nombre de valeurs : 7 (accord) ou 5 (confiance). */
  points?: 5 | 7;
  /** Nom partagé du groupe radio. */
  name: string;
  /** Libellés des deux extrémités. */
  anchorMin: string;
  anchorMax: string;
  /** Valeur sélectionnée (contrôlé). */
  value?: number;
  onChange?: (value: number) => void;
  /** Message d'erreur (échelle requise non renseignée). */
  error?: ReactNode;
}

/**
 * Échelle d'accord en rangée segmentée (7 ou 5 points) pour les questionnaires
 * du profilage : une affirmation, des pastilles numérotées, deux ancres
 * textuelles aux extrémités. Un groupe radio natif : une seule valeur, clavier
 * natif. Chaque pastille est un likert-segment (container-field compact
 * 46×48). L'affirmation est la légende du groupe.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const LikertScale = ({
  legend,
  points = 7,
  name,
  anchorMin,
  anchorMax,
  value,
  onChange,
  error,
  className,
  ...props
}: LikertScaleProps) => {
  const errorId = useId();
  const values = Array.from({ length: points }, (_, i) => i + 1);
  return (
    <LikertScale.Root
      className={className}
      aria-describedby={error ? errorId : undefined}
      {...props}
    >
      <LikertScale.Legend>{legend}</LikertScale.Legend>
      <LikertScale.Row>
        {values.map((v) => (
          <label
            key={v}
            className={cx(
              containerFieldVariants({ size: "compact" }),
              styles.cell,
            )}
          >
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={v}
              checked={onChange ? value === v : undefined}
              onChange={() => onChange?.(v)}
              aria-invalid={error ? true : undefined}
              aria-label={
                v === 1
                  ? `1 — ${anchorMin}`
                  : v === points
                    ? `${points} — ${anchorMax}`
                    : String(v)
              }
            />
            <span aria-hidden>{v}</span>
          </label>
        ))}
      </LikertScale.Row>
      <LikertScale.Anchors aria-hidden>
        <span>{anchorMin}</span>
        <span>{anchorMax}</span>
      </LikertScale.Anchors>
      {error && (
        <LikertScale.Error id={errorId}>{error}</LikertScale.Error>
      )}
    </LikertScale.Root>
  );
};

/** Groupe de l'échelle : fieldset natif. */
LikertScale.Root = atom("fieldset", styles.root);

/** Énoncé de l'échelle. */
LikertScale.Legend = atom("legend", styles.legend);

/** Rangée de pastilles. */
LikertScale.Row = atom("div", styles.row);

/** Ancres des extrémités (visuel ; l'info est dans les intitulés des inputs). */
LikertScale.Anchors = atom("div", styles.anchors);

/** Message d'erreur, relié au groupe par aria-describedby. */
LikertScale.Error = atom("p", styles.error);
