import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import styles from "./BlockQuote.module.css";

const quoteVariants = cva(styles.quote, {
  variants: {
    size: {
      default: styles.quoteDefault,
      exergue: styles.quoteExergue,
    },
  },
  defaultVariants: { size: "default" },
});

interface BlockQuoteProps extends VariantProps<typeof quoteVariants> {
  /** La citation (sans guillemets : le composant les pose). */
  children: ReactNode;
  /** Attribution sous la citation. */
  author?: ReactNode;
  className?: string;
}

/**
 * BlockQuote — reprise du composant blockQuote du DS Frontguys :
 * citation en italique + attribution, sur fond doux. `size="exergue"`
 * correspond à l'override validé pour la phrase du dashboard (corps 20).
 */
export const BlockQuote = ({
  children,
  author,
  size,
  className,
}: BlockQuoteProps) => (
  <figure className={`${styles.root}${className ? ` ${className}` : ""}`}>
    <blockquote className={quoteVariants({ size })}>
      « {children} »
    </blockquote>
    {author && <figcaption className={styles.author}>{author}</figcaption>}
  </figure>
);
