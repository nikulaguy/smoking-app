import { cva, type VariantProps } from "class-variance-authority";
import { atom } from "../../atom";
import styles from "./Badge.module.css";

const badgeVariants = cva(styles.root, {
  variants: {
    variant: {
      default: styles.default,
      primary: styles.primary,
      alternate1: styles.alternate1,
      alternate2: styles.alternate2,
      alternate3: styles.alternate3,
      alternate4: styles.alternate4,
      alternate5: styles.alternate5,
    },
  },
  defaultVariants: { variant: "default" },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/**
 * Badge — reprise du composant badge du DS Frontguys (Web Components) :
 * pastille pleine largeur de contenu (pill), 7 variants de fond alignés sur
 * la prop `Type` de la librairie. Purement informatif (aucune interaction) ;
 * le choix du variant porte le sens (état, mise en avant) et appartient à
 * l'écran hôte.
 */
export const Badge = atom("span", badgeVariants);
