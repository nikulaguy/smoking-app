import type { InputHTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import styles from "./Switch.module.css";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Intitulé du réglage (toute la rangée est cliquable). */
  children: ReactNode;
  /** Petite description secondaire sous l'intitulé (optionnelle). */
  description?: ReactNode;
}

/**
 * Interrupteur de réglage : active ou coupe un comportement (notifications,
 * canal de rappel). Toute la rangée est cliquable, intitulé à gauche et piste
 * à droite, description optionnelle sous l'intitulé. C'est une checkbox native
 * stylée avec role switch : l'état vient de l'input, jamais d'un state React.
 * Effet immédiat, sans bouton Valider.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const Switch = ({ children, description, ...inputProps }: SwitchProps) => (
  <Switch.Root>
    <Switch.Label>
      <span className={styles.title}>{children}</span>
      {description && <span className={styles.description}>{description}</span>}
    </Switch.Label>
    <Switch.Input type="checkbox" role="switch" {...inputProps} />
  </Switch.Root>
);

/** Rangée cliquable : label + interrupteur à droite. */
Switch.Root = atom("label", styles.root);

/** Input natif stylé en interrupteur (piste + curseur en ::before). */
Switch.Input = atom("input", styles.input);

/** Bloc intitulé + description. */
Switch.Label = atom("span", styles.label);
