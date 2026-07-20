import { useEffect, useMemo, useState } from "react";
import styles from "./Confetti.module.css";

/**
 * Teintes de la collection Core (Foundation - Colors Styles) : la pluie
 * célèbre avec la palette de la marque, pas des couleurs arbitraires.
 * watery-green 50/40/30 · lavender-70 · crayola-yellow-60 · raspberry-60.
 */
const CORE_TINTS = [
  "#04c6cd",
  "#65d9d7",
  "#9ae4e3",
  "#6162ae",
  "#ffde44",
  "#ff3370",
];

const PIECES = 140;

/**
 * Pluie de confettis très fins — célébration ponctuelle (ex. check-list de
 * préparation complétée). Purement décorative : aria-hidden, aucune
 * interaction, se retire toute seule. Respecte prefers-reduced-motion.
 */
export const Confetti = ({ onDone }: { onDone?: () => void }) => {
  const [alive, setAlive] = useState(true);

  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.2 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 160,
        spin: 360 + Math.random() * 540,
        color: CORE_TINTS[i % CORE_TINTS.length],
        height: 6 + Math.random() * 5,
      })),
    [],
  );

  useEffect(() => {
    if (reduced) {
      onDone?.();
      return;
    }
    const id = window.setTimeout(() => {
      setAlive(false);
      onDone?.();
    }, 4600);
    return () => window.clearTimeout(id);
  }, [reduced, onDone]);

  if (reduced || !alive) return null;

  return (
    <div className={styles.sky} aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className={styles.piece}
          style={{
            left: `${p.left}%`,
            height: p.height,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
};
