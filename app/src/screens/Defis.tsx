import { useAppNavigate } from "../lib/nav";
import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import target from "../assets/illustrations/target.svg";
import { Badge } from "../components/Badge/Badge";
import { Confetti } from "../components/Confetti/Confetti";
import { Drawer } from "../components/Drawer/Drawer";
import { Hero } from "../components/Hero/Hero";
import { Link } from "../components/Link/Link";
import { MultiChoiceOption } from "../components/MultiChoiceOption/MultiChoiceOption";
import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator";
import {
  PREP_MISSIONS,
  climbTrail,
  dashboardModel,
  prepMissionDone,
  prepReadiness,
  useProfile,
  type PrepMission,
} from "../profile/profile";
import styles from "./Defis.module.css";

const dateLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

/**
 * Onglet Défis. Avant le jour d'arrêt (phase prep), il accompagne la
 * préparation : une check-list de missions (radios DS) + le palier « Jour J »
 * verrouillé. Après l'arrêt : « Le chemin du sommet » (paliers = jalons santé).
 */
export const Defis = () => {
  const { state, setPrepCelebrated, resetPrepMission } = useProfile();
  const navigate = useAppNavigate();
  // Reset d'une mission cochée : le clic sur le bloc demande confirmation
  // (modale Drawer) avant d'effacer la donnée. La flèche ouvre le détail.
  const [missionToReset, setMissionToReset] = useState<PrepMission | null>(null);
  const resetRef = useRef<HTMLDialogElement>(null);
  const askReset = (mi: PrepMission) => {
    setMissionToReset(mi);
    // ouverture directe (pas d'effect : rouvrir la même mission ne
    // re-déclencherait pas un rendu)
    resetRef.current?.showModal();
    resetRef.current?.focus();
  };
  const m = dashboardModel(state);
  const { done, total } = prepReadiness(state);
  const allDone = done === total;
  // Pluie de confettis (teintes Core) à CHAQUE complétion de la check-list :
  // le drapeau prepCelebrated se réarme dès que la liste redevient incomplète,
  // et la complétion peut arriver depuis un écran de détail (effet au retour).
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => {
    if (m.phase !== "prep") return;
    if (allDone && !state.prepCelebrated) {
      setCelebrate(true);
      setPrepCelebrated(true);
    } else if (!allDone && state.prepCelebrated) {
      setPrepCelebrated(false);
    }
  }, [m.phase, allDone, state.prepCelebrated, setPrepCelebrated]);

  if (m.phase === "prep") {
    const pct = Math.round((done / total) * 100);

    return (
      <div>
        <Hero creteHeight={110} flag>
          <p className={styles.eyebrow}>Ta préparation</p>
          <h1 className={styles.title}>Prépare ton expédition.</h1>
          <p className={styles.caption}>
            Avant l’ascension, on équipe le camp de base.
          </p>
        </Hero>

        <div className={styles.prepBody}>
          <div className={styles.prepHead}>
            <h2 className={styles.groupTitle}>Ta check-list avant le jour J</h2>
            <ProgressIndicator progress={total ? done / total : 0}>
              {done} mission{done > 1 ? "s" : ""} sur {total} · prêt à {pct} %
            </ProgressIndicator>
          </div>

          <fieldset className={styles.missions}>
            <legend className={styles.srOnly}>Missions de préparation</legend>
            {PREP_MISSIONS.map((mi) => {
              const checked = prepMissionDone(state, mi);
              return (
                <MultiChoiceOption
                  key={mi.id}
                  name={`prep-${mi.id}`}
                  checked={checked}
                  description={mi.sub}
                  onDetail={() => navigate(mi.detail)}
                  detailLabel={`Voir le détail : ${mi.title}`}
                  // Bloc/case : non cochée → écran pour renseigner ; cochée →
                  // confirmation de reset (sauf la date : sans elle l'app
                  // repasserait en onboarding, le détail la modifie).
                  onChange={() =>
                    checked && mi.id !== "date"
                      ? askReset(mi)
                      : navigate(mi.detail)
                  }
                >
                  {mi.title}
                </MultiChoiceOption>
              );
            })}
          </fieldset>

          {/* Palier « Jour J » — source Figma : palier-jour-j (215:1813). */}
          <div className={styles.jday}>
            <img src={target} alt="" width={46} height={46} aria-hidden />
            <div className={styles.rowTexts}>
              <p className={styles.jdaySub}>L’ascension commencera</p>
              <p className={styles.jdayTitle}>{dateLabel(state.quitAt)}</p>
            </div>
          </div>

          <p className={styles.prepNote}>
            Rien d’obligatoire : coche à ton rythme. Le jour J arrive quand tu es
            prêt.
          </p>
        </div>

        {celebrate && <Confetti onDone={() => setCelebrate(false)} />}

        {/* Confirmation du reset d'une mission (maquette 316:3352). */}
        <Drawer
          ref={resetRef}
          title="Supprimer ces informations ?"
          confirmLabel="Confirmer"
          onConfirm={() => {
            if (missionToReset) resetPrepMission(missionToReset.id);
          }}
          cancelLabel="Annuler"
          onClose={() => setMissionToReset(null)}
        >
          Tu pourras les ajouter plus tard.
        </Drawer>
      </div>
    );
  }

  // --- Phase ascension : « Le chemin du sommet » (jalons santé réels) ---
  const trail = climbTrail(m.dayNumber);

  return (
    <div>
      <Hero creteHeight={110} flag>
        <p className={styles.eyebrow}>Tes défis</p>
        <h1 className={styles.title}>Le chemin du sommet.</h1>
        <p className={styles.caption}>
          Chaque palier gravi rend le suivant plus proche.
        </p>
      </Hero>

      <ol
        className={styles.trail}
        style={{ listStyle: "none", margin: 0, padding: "var(--spacing-base-6) var(--spacing-base-4) 0" }}
      >
        {trail.map((p, i) => (
          <li key={p.day} className={styles.palier}>
            <div className={styles.marker}>
              <Badge
                variant={
                  p.state === "done"
                    ? "alternate2"
                    : p.state === "current"
                      ? "alternate1"
                      : "default"
                }
                aria-hidden
              >
                {p.state === "current" ? m.dayNumber : p.day}
              </Badge>
              {i < trail.length - 1 && (
                <span
                  className={cx(
                    styles.connector,
                    p.state === "done" ? styles.connectorDone : styles.connectorTodo,
                  )}
                />
              )}
            </div>
            <div className={styles.infos}>
              <p className={cx(styles.label, p.state === "locked" && styles.labelLocked)}>
                {p.label}
              </p>
              <p className={styles.sub}>{p.sub}</p>
              {p.state === "current" && (
                <div className={styles.currentBlock}>
                  <ProgressIndicator progress={Math.min(1, m.dayNumber / p.day)}>
                    Jour {m.dayNumber} sur {p.day}
                  </ProgressIndicator>
                  <Link className={styles.defiLink} onClick={() => navigate("/defi")}>
                    Voir le défi du jour
                  </Link>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
