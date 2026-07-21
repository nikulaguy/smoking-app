import { cx } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import { Button } from "../Button/Button";
import styles from "./SosCraving.module.css";

interface SosCravingProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Libellé du bouton — adaptable au profil (« Une envie, là ? », « Un moment difficile ? »). */
  children?: ReactNode;
}

/**
 * Bouton SOS flottant persistant au-dessus de la tab bar (le dock) : l'action
 * de secours toujours à portée de pouce. En ascension il ouvre la boîte à
 * outils anti-envie ; en préparation il mène à la check-list, et disparaît
 * quand la préparation est complète ou sur l'écran Prépa lui-même. Le libellé
 * est personnalisé par le profil.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const SosCraving = ({
  children = "Une envie, là ?",
  className,
  ...props
}: SosCravingProps) => (
  <SosCraving.Root>
    <Button
      variant="primary"
      className={cx(styles.button, className)}
      {...props}
    >
      {children}
    </Button>
  </SosCraving.Root>
);

/** Zone flottante du SOS. */
SosCraving.Root = atom("div", styles.root);
