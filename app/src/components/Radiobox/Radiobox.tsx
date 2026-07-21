import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { atom } from "../../atom";
import styles from "./Radiobox.module.css";

interface RadioboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Intitulé de l'option (prop Figma : label). */
  children: ReactNode;
  /** Petite ligne secondaire sous l'intitulé (prop Figma : conditions,
      affichée quand « Show conditions » est actif). */
  conditions?: ReactNode;
}

/**
 * Radiobox — miroir du composant DS (set « radiobox », états default/hover/
 * checked/disabled/error) : puce radio native stylée (atom Radiobox.Input =
 * atoms/radio/*), intitulé et conditions optionnelles. Les états dérivent de
 * l'input natif (`:checked`, `:disabled`, `aria-invalid` pour error, survol
 * réel pour hover) — jamais de state React.
 *
 * S'utilise nu (formulaires simples) ou composé : SingleChoiceOption =
 * coque container-field + ces atoms (structure Figma : le radiobox vit dans
 * le slot du container-field).
 */
export const Radiobox = ({
  children,
  conditions,
  className,
  id,
  ...inputProps
}: RadioboxProps) => {
  // RGAA 11.1.2 : même englobant, le label porte un for explicite vers l'id
  // de l'input.
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Radiobox.Root className={className} htmlFor={inputId}>
      <Radiobox.Input type="radio" id={inputId} {...inputProps} />
      <Radiobox.Texts>
        <span className={styles.label}>{children}</span>
        {conditions && <span className={styles.conditions}>{conditions}</span>}
      </Radiobox.Texts>
    </Radiobox.Root>
  );
};

/** Coque : un label qui englobe l'input (toute la rangée est cliquable). */
Radiobox.Root = atom("label", styles.radiobox);

/** Atom « atoms/radio/* » : l'input radio natif stylé (default, checked,
    disabled, error via aria-invalid, hover sur dispositifs à survol réel).
    Jamais de div role="radio". */
Radiobox.Input = atom("input", styles.radio);

/** Colonne intitulé + conditions. */
Radiobox.Texts = atom("span", styles.texts);

/** Classes des textes, pour les consommateurs qui composent les atoms
    (SingleChoiceOption réutilise l'intitulé et les conditions). */
export const radioboxText = {
  label: styles.label,
  conditions: styles.conditions,
};
