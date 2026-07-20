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
 * Métrique valeur + libellé. `size="hero"` pour la métrique principale d'un
 * écran, `compact` pour les métriques secondaires en rangée. Valeur et
 * libellé forment une seule information, adjacents dans le DOM.
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
