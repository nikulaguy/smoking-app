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
 * Interrupteur marche/arrêt d'un réglage global (checkbox native
 * `role="switch"`, jamais de div cliquable). À réserver aux réglages à effet
 * immédiat (activer/couper les notifications) — pour un choix dans un
 * groupe, utiliser MultiChoiceOption / SingleChoiceOption.
 * Source Figma : switch (composant custom du fichier Smoking-App).
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
