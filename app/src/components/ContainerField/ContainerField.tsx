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
 * Socle visuel commun de tous les champs et tuiles interactifs (options de
 * choix, déclencheurs de sélection, pastilles d'échelle, tuiles d'outils).
 * Porte exclusivement le look & feel des états : fond, bordure, radius,
 * padding. Les états selected, error, disabled et focus dérivent
 * automatiquement du contenu natif (input coché, invalide, désactivé) ;
 * pressed/hover = :active au doigt et :hover sur les dispositifs à survol
 * réel, mêmes styles. Le contenu est injecté via le slot : ne s'utilise jamais
 * nu, toujours au sein d'un composant consommateur qui porte la sémantique.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const ContainerField = atom("div", containerFieldVariants);
