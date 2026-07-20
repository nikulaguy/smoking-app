import { cx } from "class-variance-authority";
import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { Crete, Soleil } from "../Deco/Deco";
import styles from "./Hero.module.css";

interface HeroProps extends HTMLAttributes<HTMLElement> {
  /** Contenu textuel (toujours rendu au-dessus de l'illustration). */
  children: ReactNode;
  /** Hauteur de la bande de crête (px). Le padding bas s'y ajuste. */
  creteHeight?: number;
  /** Planter le drapeau sur le pic (marqueur de progression / destination). */
  flag?: boolean;
  /** Afficher l'astre (soleil le jour, lune la nuit). */
  sun?: boolean;
}

export type SkyPhase = "dawn" | "day" | "dusk" | "night";
interface Sky {
  phase: SkyPhase;
  body: "sun" | "moon";
  /** 0 (horizon) → 1 (zénith), courbe sinus sur la période jour/nuit. */
  elevation: number;
  /** 0 (lever) → 1 (coucher), progression dans la période. */
  azimuth: number;
}

/**
 * Ciel en fonction de l'heure locale : soleil de 6h à 20h, lune sinon. Le fond
 * du hero, la couleur de la lumière et l'astre s'adaptent (voir Hero.module.css
 * / Deco.module.css). Fonction pure, testable.
 */
export const skyStateFor = (hour: number): Sky => {
  const h = ((hour % 24) + 24) % 24;
  const isDay = h >= 6 && h < 20;
  let phase: SkyPhase;
  if (h >= 6 && h < 8) phase = "dawn";
  else if (h >= 8 && h < 18) phase = "day";
  else if (h >= 18 && h < 20) phase = "dusk";
  else phase = "night";
  // progression dans la période : jour = 6→20 (14h), nuit = 20→6 (10h)
  const p = isDay ? (h - 6) / 14 : (h >= 20 ? h - 20 : h + 4) / 10;
  const clamped = Math.min(Math.max(p, 0), 1);
  return {
    phase,
    body: isDay ? "sun" : "moon",
    elevation: Math.sin(Math.PI * clamped),
    azimuth: clamped,
  };
};

/** Heure courante, avec forçage optionnel via ?sky=dawn|day|dusk|night (QA). */
const readSky = (): Sky => {
  const forced = new URLSearchParams(window.location.search).get("sky");
  const preset: Record<string, number> = { dawn: 7, day: 13, dusk: 19, night: 0 };
  if (forced && forced in preset) return skyStateFor(preset[forced]);
  const now = new Date();
  return skyStateFor(now.getHours() + now.getMinutes() / 60);
};

/**
 * En-tête immersif partagé (identité « Ligne de crête »). Centralise l'usage de
 * l'illustration : drapeau sur le pic, texte au-dessus, aucun chevauchement.
 * L'astre et les couleurs suivent le moment de la journée, avec un mouvement
 * perpétuel très lent (voir Deco.module.css). Contrastes A11Y garantis : le fond
 * reste sombre à toute heure, la « lumière » vient de l'astre et d'un halo doux.
 */
export const Hero = ({
  children,
  creteHeight = 110,
  flag = false,
  sun = true,
  className,
  style,
  ...props
}: HeroProps) => {
  const [sky, setSky] = useState(readSky);
  // Réévalue périodiquement pour suivre le passage jour/nuit si l'app reste
  // ouverte (PWA), sans coût notable.
  useEffect(() => {
    const id = window.setInterval(() => setSky(readSky()), 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header
      data-sky={sky.phase}
      className={cx(styles.hero, className)}
      style={{
        ["--crete-height" as string]: `${creteHeight}px`,
        ["--sky-elevation" as string]: String(sky.elevation),
        ...style,
      }}
      {...props}
    >
      <div className={styles.content}>{children}</div>
      {/* Micro-brumes : trois nappes floues qui traversent la scène à des
          rythmes différents (47/71/93 s). Opacité pilotée par la phase du
          ciel (--mist-alpha) : visibles le jour, presque éteintes la nuit. */}
      <i aria-hidden className={styles.mist} />
      <i aria-hidden className={styles.mist} />
      <i aria-hidden className={styles.mist} />
      {sun && <Soleil className={styles.deco} body={sky.body} />}
      <Crete className={styles.deco} height={creteHeight} flag={flag} />
    </header>
  );
};
