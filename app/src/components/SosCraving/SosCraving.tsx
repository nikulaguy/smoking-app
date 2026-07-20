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
 * Action d'aide immédiate, présente dans le layout de l'app (pas dupliquée
 * par écran), flottante au-dessus de la tab-bar. Ouvre la sur-couche d'aide
 * plein écran ; le tap est aussi un signal JITAI (envie déclarée).
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
