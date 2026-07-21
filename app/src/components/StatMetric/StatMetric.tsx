import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import styles from "./StatMetric.module.css";

const { root, hero, compact, value, label } = styles;

const statMetricVariants = cva(root, {
  variants: { size: { hero, compact } },
});

interface StatMetricProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statMetricVariants> {
  /** La valeur mise en avant (« 48 € »). */
  children: ReactNode;
  /** Le libellé qui complète la valeur (« économisés »). */
  metricLabel: ReactNode;
}

/**
 * Compteur de statistique (argent économisé, cigarettes évitées) : une valeur
 * mise en avant et son libellé de contexte. Deux tailles : hero pour la stat
 * vedette du dashboard, compact pour les rangées de stats. Les libellés sont
 * recadrés par le profil : jamais de reproche.
 * (Description canonique, synchronisée avec le champ natif Figma et la
 * fiche de doc de la page Composants.)
 */
export const StatMetric = ({
  children,
  metricLabel,
  size = "compact",
  className,
  ...props
}: StatMetricProps) => (
  <StatMetric.Root className={statMetricVariants({ size, className })} {...props}>
    <StatMetric.Value>{children}</StatMetric.Value>
    <StatMetric.Label>{metricLabel}</StatMetric.Label>
  </StatMetric.Root>
);

/** Conteneur de la métrique. */
StatMetric.Root = atom("div");

/** Valeur mise en avant. */
StatMetric.Value = atom("span", value);

/** Libellé de la valeur. */
StatMetric.Label = atom("span", label);
