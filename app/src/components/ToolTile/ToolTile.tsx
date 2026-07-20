import { cx } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import { containerFieldVariants } from "../ContainerField/ContainerField";
import styles from "./ToolTile.module.css";

interface ToolTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Illustration de l'outil (décorative : masquée aux lecteurs d'écran). */
  icon?: ReactNode;
  /** Libellé de l'outil — c'est lui l'intitulé accessible. */
  children: ReactNode;
}

/**
 * Tuile d'action d'une grille d'outils (boîte à outils anti-envie).
 * S'utilise en grille 2 colonnes. L'usage de chaque outil est journalisé
 * (signal JITAI : outil choisi, puis « ça t'a aidé ? »).
 */
export const ToolTile = ({ icon, children, className, ...props }: ToolTileProps) => (
  <ToolTile.Root
    className={cx(containerFieldVariants({ size: "tile" }), styles.tile, className)}
    {...props}
  >
    {icon && <ToolTile.Icon aria-hidden>{icon}</ToolTile.Icon>}
    <span>{children}</span>
  </ToolTile.Root>
);

/** La tuile est un bouton natif. */
ToolTile.Root = atom("button", "", { type: "button" });

/** Zone d'illustration, décorative. */
ToolTile.Icon = atom("span", styles.icon);
