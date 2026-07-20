import { cx } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Étiquette de catégorie (SANTÉ, DÉFI...). */
  badge?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  /** "panel" = info éditoriale (défaut) ; "link" = tapable, avec flèche ↗. */
  variant?: "panel" | "link";
}

const Arrow = () => (
  <svg
    className={styles.arrow}
    aria-hidden
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
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
 * Carte de contenu. `panel` pour un bloc d'information (rend une `<section>`),
 * `link` pour un contenu tapable (rend un `<button>` avec flèche ↗).
 */
export const Card = ({
  badge,
  title,
  children,
  variant = "panel",
  className,
  ...props
}: CardProps) => {
  const content = (
    <>
      {variant === "link" && <Arrow />}
      {badge && <span className={styles.badge}>{badge}</span>}
      <p className={styles.title}>{title}</p>
      {children && <p className={styles.text}>{children}</p>}
    </>
  );

  if (variant === "link") {
    return (
      <button
        type="button"
        className={cx(styles.root, styles.link, className)}
        {...props}
      >
        {content}
      </button>
    );
  }
  return <section className={cx(styles.root, styles.panel, className)}>{content}</section>;
};
