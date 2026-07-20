import { cva, type VariantProps } from "class-variance-authority";
import { atom } from "../../atom";
import styles from "./ContainerField.module.css";

const { root, compact, tile } = styles;

export const containerFieldVariants = cva(root, {
  variants: {
    size: { default: "", compact, tile },
  },
});

export type ContainerFieldVariants = VariantProps<typeof containerFieldVariants>;

/**
 * Socle visuel commun des champs et tuiles interactives (options de choix,
 * déclencheurs de sélection, pastilles d'échelle, tuiles d'action).
 *
 * Porte exclusivement le look & feel des états — la sémantique vit dans les
 * consommateurs. Les états `selected`, `error`, `disabled` et `focus` dérivent
 * automatiquement du contenu natif (`input` coché, invalide, désactivé) ;
 * pour les usages sans input, poser `data-state="selected|error|disabled"`.
 * `pressed` = `:active` CSS, jamais un state React.
 */
export const ContainerField = atom("div", containerFieldVariants);
