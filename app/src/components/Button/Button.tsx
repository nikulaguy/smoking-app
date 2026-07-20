import { cva, type VariantProps } from "class-variance-authority";
import { atom } from "../../atom";
import styles from "./Button.module.css";

const { root, primary, secondary, ghost } = styles;

const buttonVariants = cva(root, {
  variants: {
    variant: { primary, secondary, ghost },
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Bouton d'action (reprise du Button DS). `variant="primary"` pour l'action
 * principale (une seule par écran), `secondary` pour les actions de second
 * rang, `ghost` pour l'action tertiaire sous un bouton plein. Règle : jamais
 * deux boutons du même Type superposés. L'état désactivé passe par `disabled`.
 */
export const Button = atom("button", buttonVariants, { type: "button" });
