import type { ReactNode } from "react";
import { cx } from "class-variance-authority";
import styles from "./Link.module.css";

interface LinkProps {
  children: ReactNode;
  /** Si présent : rend une ancre (navigation) ; sinon un bouton (action). */
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  className?: string;
}

/**
 * Link — reprise du composant link du DS Frontguys (type=standalone) :
 * texte body-1 interactif, états hover/active du DS, sans soulignement.
 * Rend une ancre quand `href` est fourni, un bouton sinon (action in-app).
 */
export const Link = ({ href, className, children, ...rest }: LinkProps) =>
  href ? (
    <a href={href} className={cx(styles.root, className)} {...rest}>
      {children}
    </a>
  ) : (
    <button type="button" className={cx(styles.root, className)} {...rest}>
      {children}
    </button>
  );
