import { cx } from "class-variance-authority";
import type { HTMLAttributes, SVGAttributes } from "react";
import styles from "./Deco.module.css";

/**
 * Strates de crête pour le bas des zones immersives (heros), avec drapeau
 * optionnel PLANTÉ SUR LE PIC. Le drapeau fait partie de l'illustration : il
 * est toujours sur le sommet, quelle que soit la hauteur, jamais placé « à la
 * main » par l'écran. Le parent doit être `position: relative`. Décoratif.
 */
export const Crete = ({
  height = 110,
  flag = false,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  height?: number;
  flag?: boolean;
}) => (
  <div
    aria-hidden
    className={cx(styles.creteWrap, className)}
    style={{ height, ...style }}
    {...props}
  >
    {/* Deux strates séparées, dessinées plus larges que l'écran et animées en
        travelling latéral à des vitesses différentes : la parallaxe (avant
        rapide / arrière lente) donne la sensation d'une caméra lointaine en
        très léger mouvement. Le drapeau vit DANS la strate avant : planté sur
        le pic, il voyage avec sa montagne. */}
    <div className={cx(styles.strate, styles.strateBack)}>
      <svg className={styles.creteSvg} viewBox="0 0 375 90" preserveAspectRatio="none">
        <path
          d="M0 90V52L70 14L128 58L196 20L262 62L316 34L375 60V90Z"
          fill="var(--game-progress-done)"
          opacity="0.25"
        />
      </svg>
    </div>
    <div className={cx(styles.strate, styles.strateFront)}>
      <svg className={styles.creteSvg} viewBox="0 0 375 90" preserveAspectRatio="none">
        <path
          d="M0 90V66L92 32L158 72L238 42L306 76L375 58V90Z"
          fill="var(--game-progress-todo)"
          opacity="0.85"
        />
      </svg>
      {flag && (
        <svg className={styles.flag} viewBox="0 0 16 22" width="16" height="22">
          <rect x="0" y="0" width="2" height="22" fill="var(--content-on-immersive)" />
          {/* Fanion en 3 segments articulés depuis la hampe : la vague se
              propage vers la pointe (rotations déphasées), une modulation
              lente simule les rafales irrégulières. Léger recouvrement entre
              segments pour ne jamais laisser de fente pendant l'ondulation. */}
          <g className={styles.flagCloth} fill="var(--game-level)">
            <path className={styles.flagSeg1} d="M2 0L6.4 1.28L6.4 5.72L2 7Z" />
            <path className={styles.flagSeg2} d="M6 1.17L10.4 2.45L10.4 4.55L6 5.83Z" />
            <path className={styles.flagSeg3} d="M10 2.33L14 3.5L10 4.67Z" />
          </g>
        </svg>
      )}
    </div>
  </div>
);

/**
 * Séparateur en ligne de crête — remplace les filets droits entre blocs.
 * Purement décoratif.
 */
export const CreteDivider = (props: SVGAttributes<SVGSVGElement>) => (
  <svg
    aria-hidden
    className={styles.divider}
    viewBox="0 0 343 12"
    preserveAspectRatio="none"
    {...props}
  >
    <path
      d="M0 12L40 4L80 10L130 0L180 9L230 3L290 11L343 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Astre : ponctuation lumineuse des heros immersifs (soleil le jour, lune la
 * nuit). Un seul par écran. Position et couleur pilotées par le moment de la
 * journée via des variables CSS posées par le Hero. Purement décoratif.
 */
export const Soleil = ({
  size = 44,
  body = "sun",
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: number; body?: "sun" | "moon" }) => (
  <div
    aria-hidden
    data-body={body}
    className={cx(styles.soleil, className)}
    style={{ width: size, height: size, ...style }}
    {...props}
  />
);
