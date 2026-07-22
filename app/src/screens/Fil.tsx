import { useAppNavigate } from "../lib/nav";
import { useEffect, useState } from "react";
import target from "../assets/illustrations/target.svg";
import timeline from "../assets/illustrations/timeline.svg";
import { Card } from "../components/Card/Card";
import { Confetti } from "../components/Confetti/Confetti";
import { Hero } from "../components/Hero/Hero";
import { personalize, type FeedKey } from "../profile/personalization";
import {
  dashboardModel,
  euroSaved,
  prepMissionOfDay,
  prepMissionsRemaining,
  prepReadiness,
  useProfile,
} from "../profile/profile";
import styles from "./Fil.module.css";

const dateLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

/**
 * Onglet Fil : contenus pédagogiques pondérés par le profil (docs 03/06).
 * Avant le jour d'arrêt (phase prep), le Fil ne montre pas de contenus
 * prématurés (« la nicotine a quitté ton corps ») mais accompagne la
 * préparation : rappel du jour J, conseil du jour, programme, et l'objectif
 * n°1 (finir le profil). Fil FINI, jamais infini.
 */
export const Fil = () => {
  const { state, setPrepCelebrated } = useProfile();
  const navigate = useAppNavigate();
  const m = dashboardModel(state);
  const readiness = prepReadiness(state);
  const allPrepDone = readiness.done === readiness.total;
  // Confettis à chaque complétion de la check-list, où qu'elle se constate
  // (même logique que Défis, drapeau partagé prepCelebrated).
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => {
    if (m.phase !== "prep") return;
    if (allPrepDone && !state.prepCelebrated) {
      setCelebrate(true);
      setPrepCelebrated(true);
    } else if (!allPrepDone && state.prepCelebrated) {
      setPrepCelebrated(false);
    }
  }, [m.phase, allPrepDone, state.prepCelebrated, setPrepCelebrated]);

  if (m.phase === "prep") {
    const ready = allPrepDone;
    const days = Math.max(1, m.daysUntilQuit);
    // Le programme est DYNAMIQUE : uniquement les missions encore à faire, dans
    // l'ordre de la check-list. Une info déjà renseignée n'apparaît jamais.
    const remaining = prepMissionsRemaining(state);
    // Conseil du jour : seulement s'il reste une mission qui porte un conseil
    // (les infos d'onboarding, ex. « fumeurs autour de toi », n'en ont pas).
    const tipMission = remaining.some((r) => r.tip)
      ? prepMissionOfDay(state)
      : null;
    const upcoming = remaining.slice(0, 3).map((mission, i) => ({
      key: mission.id,
      tag: `J-${Math.max(1, days - i)}`,
      theme: mission.tip?.badge ?? mission.title,
      note: i === 0 ? "Aujourd’hui" : i === 1 ? "Demain" : `dans ${i} jours`,
      today: i === 0,
    }));

    return (
      <div>
        <Hero creteHeight={90} sun={false}>
          <p className={styles.eyebrow}>On te prépare</p>
          <h1 className={styles.title}>Bientôt, ton grand jour.</h1>
          <p className={styles.caption}>
            Jour J : {dateLabel(state.quitAt)} · dans {days} jour{days > 1 ? "s" : ""}
          </p>
        </Hero>

        <div className={`${styles.feed} ${styles.feedLoose}`}>
          <div className={styles.countdown}>
            <div className={styles.countdownText}>
              <p className={styles.countdownLabel}>Ton grand jour</p>
              <p className={styles.countdownDate}>{dateLabel(state.quitAt)}</p>
            </div>
            <p className={styles.countdownDay}>J-{days}</p>
          </div>

          {/* Conseil du jour piloté par la check-list : on ne conseille que ce
              qui reste à faire ; tout est fait → carte d'explication du Fil
              d'ascension (248:1987), pour éviter le doublon avec le bloc
              « Tu es prêt » de l'Accueil. Tapable → détail mission (211:1745). */}
          {ready ? (
            <div className={styles.duringCard}>
              <img src={timeline} alt="" width={69} height={69} aria-hidden />
              <p className={styles.duringTitle}>Pendant ton ascension !</p>
              <p className={styles.duringText}>
                C’est ici que tu retrouveras toutes les étapes de ta
                progression, avec les différents gains sur ton évolution, ta
                santé et ton porte-feuille, mais pas que !
              </p>
            </div>
          ) : (
            tipMission && (
              <Card
                variant="link"
                className={styles.tipCard}
                badge="Conseil du jour"
                title={tipMission.tip!.title}
                onClick={() => navigate(tipMission.detail)}
              >
                {tipMission.tip!.text}
                <span className={styles.tipNote}>
                  🔔 Reçu ce matin par notification.
                </span>
              </Card>
            )
          )}

          {!ready && (
            <section className={styles.prog}>
              <h2 className={styles.progTitle}>Ton programme de préparation</h2>
              <ul className={styles.progList}>
                {upcoming.map((r) => (
                  <li
                    key={r.key}
                    className={r.today ? styles.progRowToday : styles.progRow}
                  >
                    <span className={r.today ? styles.pillToday : styles.pill}>
                      {r.tag}
                    </span>
                    <div className={styles.rowTexts}>
                      <p className={styles.rowTheme}>{r.theme}</p>
                      <p className={styles.rowNote}>{r.note}</p>
                    </div>
                  </li>
                ))}
                {/* Palier « Jour J » — source Figma : palier-jour-j (248:2090). */}
                <li className={styles.jdayRow}>
                  <img src={target} alt="" width={46} height={46} aria-hidden />
                  <div className={styles.rowTexts}>
                    <p className={styles.rowNote}>L’ascension commencera</p>
                    <p className={styles.jdayDate}>{dateLabel(state.quitAt)}</p>
                  </div>
                </li>
              </ul>
            </section>
          )}

          <p className={styles.pauseText}>
            Un conseil chaque matin, jamais la nuit. Tu peux tout couper : l’app
            reste là.
          </p>
        </div>
        {celebrate && <Confetti onDone={() => setCelebrate(false)} />}
      </div>
    );
  }

  // --- Phase ascension : fil personnalisé (contenus santé/liberté/défi/argent) ---
  const perso = personalize(state);
  const saved = euroSaved(m.moneySaved);

  const byKey: Record<FeedKey, { badge: string; title: string; text: string }> = {
    sante: {
      badge: "Santé",
      title: "La nicotine a quitté ton corps",
      text: "Après 3 jours, il n’en reste plus une trace. Ce qui te tiraille maintenant, c’est l’habitude, pas la molécule. Et ça, ça se rééduque.",
    },
    liberte: {
      badge: "Liberté",
      title: `${m.dayNumber} jour${m.dayNumber > 1 ? "s" : ""} que tu décides`,
      text: "« Le déclic, c’est quand j’ai réalisé que ce n’était plus moi qui choisissais mes pauses. » — Karim, 11 mois sans tabac.",
    },
    defi: {
      badge: "Défi",
      title: "Palier 7 jours en vue",
      text: `Plus que ${m.daysToNextMilestone} jour${m.daysToNextMilestone > 1 ? "s" : ""}. À 7 jours, ton sommeil commence à se réparer.`,
    },
    argent: {
      badge: "Argent",
      title: `${saved} déjà de côté`,
      text: "De quoi financer une vraie récompense. Tu la vois venir ?",
    },
  };
  const cards = perso.feedOrder.map((k) => byKey[k]);

  return (
    <div>
      <Hero creteHeight={70} sun={false}>
        <p className={styles.eyebrow}>Ton fil</p>
        <h1 className={styles.title}>Choisi pour toi.</h1>
        <p className={styles.caption}>
          Jour {m.dayNumber} · pensé pour ta progression, pas pour te retenir.
        </p>
      </Hero>

      <div className={styles.feed}>
        {cards.map((c) => (
          <Card key={c.title} variant="panel" badge={c.badge} title={c.title}>
            {c.text}
          </Card>
        ))}

        <div className={styles.pause}>
          <p className={styles.pauseTitle}>Le tour est fait pour aujourd’hui.</p>
          <p className={styles.pauseText}>
            Rien d’autre à scroller : reviens demain pour la suite. Ton temps
            vaut mieux que notre fil.
          </p>
        </div>
      </div>
    </div>
  );
};
