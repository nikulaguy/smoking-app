import { useAppNavigate } from "../lib/nav";
import thumbUp from "../assets/illustrations/thumb-up.svg";
import { Link } from "../components/Link/Link";
import { useLayout } from "../app/AppLayout";
import { Badge } from "../components/Badge/Badge";
import { BlockQuote } from "../components/BlockQuote/BlockQuote";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { CreteDivider } from "../components/Deco/Deco";
import { Hero } from "../components/Hero/Hero";
import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator";
import { StatMetric } from "../components/StatMetric/StatMetric";
import { useSession } from "../lib/supabase";
import {
  dashboardModel,
  defiDoneToday,
  phase2Complete,
  prepReadiness,
  useProfile,
} from "../profile/profile";
import { personalize } from "../profile/personalization";
import styles from "./Dashboard.module.css";

const euro = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const dateLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : "";

/** Écran d'accueil « Sommet », piloté par le profil (docs 03/06). */
export const Dashboard = () => {
  const { state } = useProfile();
  const navigate = useAppNavigate();
  const session = useSession();
  const { openSlipDialog } = useLayout();
  const m = dashboardModel(state);
  const perso = personalize(state);
  const prep = m.phase === "prep";
  const remontee = m.remontee;
  const defiDone = defiDoneToday(state);
  const needsProfiling = !phase2Complete(state);

  // Accueil en préparation (maquette 316:3649/3849/3946) : blocs composables
  // selon l'avancement. « Tout prêt » = préparation finie ET notifications
  // activées (switch on + au moins un canal) ET compte connecté.
  if (prep) {
    const { done, total } = prepReadiness(state);
    const prepDone = done === total;
    const ch = state.notifPrefs?.channels ?? {};
    const notifsActive =
      state.notifPrefs?.enabled !== false &&
      Boolean(ch.local || ch.push || ch.email);
    const connected = Boolean(session);
    const allReady = prepDone && notifsActive && connected;
    const days = m.daysUntilQuit;

    return (
      <div>
        <Hero creteHeight={90} flag>
          <div className={styles.surtitle}>
            <p className={styles.surLabel}>Ton grand jour</p>
            <p className={styles.surDate}>{dateLabel(state.quitAt)}</p>
          </div>
          <h1 className={styles.title}>Prépare ton ascension.</h1>
          <div className={styles.week} aria-hidden>
            {m.weekDots.map((d) => (
              <Badge
                key={d.index}
                variant={d.current ? "alternate1" : d.done ? "alternate2" : "primary"}
              >
                {d.index}
              </Badge>
            ))}
          </div>
          <p className={styles.caption}>
            Encore {days} jour{days > 1 ? "s" : ""} pour te préparer, sans pression.
          </p>
        </Hero>

        <div className={styles.body}>
          {allReady ? (
            <>
              <div className={styles.countdown}>
                <div className={styles.countdownText}>
                  <p className={styles.countdownLabel}>Ton grand jour</p>
                  <p className={styles.countdownDate}>{dateLabel(state.quitAt)}</p>
                </div>
                <p className={styles.countdownDay}>J-{days}</p>
              </div>

              <div className={styles.readyCard}>
                <img src={thumbUp} alt="" width={46} height={46} aria-hidden />
                <p className={styles.readyTitle}>Tu es prêt !!!</p>
                <p className={styles.readyText}>Tu vas y arriver !</p>
              </div>

              <div className={styles.card}>
                <p className={styles.blockTitle}>Fais nous un feedback avant de commencer !</p>
                <p className={styles.cardText}>
                  Si tu penses qu’il manque un élément à la préparation, dis le
                  nous !
                </p>
                <Button variant="secondary" onClick={() => navigate("/feedback")}>
                  Dis nous tout !
                </Button>
              </div>
            </>
          ) : (
            <>
              {(!prepDone || !notifsActive) && (
                <div className={styles.card}>
                  <p className={styles.blockTitle}>D’ici là on t’équipe !</p>
                  <p className={styles.cardText}>
                    Chaque jour avant l’arrêt, l’app t’envoie de quoi partir bien
                    équipé pour l’ascension ! Tes raisons, tes déclencheurs, ta
                    stratégie, tes infos !
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(prepDone ? "/compte/notifications" : "/defis")
                    }
                  >
                    {prepDone ? "Règle tes notifications" : "Complète ta préparation"}
                  </Button>
                </div>
              )}

              {!connected && (
                <div className={styles.card}>
                  <p className={styles.blockTitle}>
                    Connecte toi pour avoir des notifs par mail et sur tous tes
                    appareils.
                  </p>
                  <p className={styles.cardText}>
                    Reçois des notifications pour toujours te sentir soutenu !
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/compte/connexion")}
                  >
                    Je me connecte
                  </Button>
                </div>
              )}

              {needsProfiling && (
                <Card
                  variant="link"
                  badge="Profil"
                  title="Apprends moi à te connaître"
                  onClick={() => navigate("/profilage")}
                >
                  Trois minutes pour que l’app s’adapte vraiment à toi : tes
                  raisons, ta confiance, ton style.
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ---- Ascension (et remontée) ----
  return (
    <div>
      <Hero creteHeight={150} flag>
        <p className={styles.eyebrow}>
          {remontee
            ? `Jour ${remontee.day} de la remontée`
            : `Jour ${m.dayNumber} sans fumer`}
        </p>
        <h1 className={styles.title}>
          {remontee ? "Ton chemin reste tracé." : perso.heroTitle}
        </h1>
        <Badge variant="alternate1" className={styles.chip}>
          {m.levelLabel}
        </Badge>
        {/* États des jours : gravi = alternate2, courant = alternate1,
            à venir = primary (se fond dans le hero immersif). */}
        <div className={styles.week} aria-hidden>
          {m.weekDots.map((d) => (
            <Badge
              key={d.index}
              variant={d.current ? "alternate1" : d.done ? "alternate2" : "primary"}
            >
              {d.index}
            </Badge>
          ))}
        </div>
        <p className={styles.caption}>
          {remontee
            ? `Tes ${remontee.daysClimbed} jour${remontee.daysClimbed > 1 ? "s" : ""} gravis restent gravis · on repart du refuge`
            : m.daysToNextMilestone > 0
              ? `Semaine ${Math.max(1, Math.ceil(m.dayNumber / 7))} · prochain palier dans ${m.daysToNextMilestone} jour${m.daysToNextMilestone > 1 ? "s" : ""}`
              : "Palier atteint, bravo."}
        </p>
      </Hero>

      <div className={styles.body}>
        {/* Ta phrase du Jour 0 en exergue, avant les chiffres : la voix la
            plus persuasive est la tienne (validé 2026-07-15). */}
        {state.answers.phrase && (
          <div className={styles.phrasePanel}>
            <BlockQuote size="exergue" author="Toi, au jour 0" className={styles.phraseQuote}>
              {state.answers.phrase}
            </BlockQuote>
            <CreteDivider />
          </div>
        )}

        <div className={styles.stats}>
          {/* Remontée : acquis reformulés en préservation (jamais cassés). */}
          <StatMetric
            size="compact"
            metricLabel={remontee ? "toujours dans ta poche" : perso.stats.money}
          >
            {euro(m.moneySaved)} €
          </StatMetric>
          <StatMetric
            size="compact"
            metricLabel={remontee ? "clopes jamais fumées" : perso.stats.cigs}
          >
            {m.cigsAvoided}
          </StatMetric>
        </div>

        {!remontee && (
          <div className={styles.card}>
            <p className={styles.cardTitle}>
              Prochain palier : {m.dayNumber < 7 ? "7 jours" : "le sommet"}
            </p>
            <ProgressIndicator progress={Math.min(1, m.dayNumber / 7)}>
              Jour {Math.min(m.dayNumber, 7)} sur 7
            </ProgressIndicator>
            <p className={styles.cardText}>
              Dans {m.daysToNextMilestone} jour{m.daysToNextMilestone > 1 ? "s" : ""},
              ton souffle change nettement.
            </p>
          </div>
        )}

        {needsProfiling && (
          <Card
            variant="link"
            badge="Profil"
            title="Apprends-moi à te connaître"
            onClick={() => navigate("/profilage")}
          >
            3 minutes pour que l’app s’adapte vraiment à toi : tes raisons, ta
            confiance, ton style.
          </Card>
        )}

        <button
          type="button"
          className={styles.defi}
          onClick={() => navigate("/defi")}
        >
          <svg
            className={styles.defiArrow}
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M5 13L13 5M13 5H6M13 5v7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.badge}>
            {defiDone ? "Relevé" : remontee ? "Défi du jour" : perso.defi.badge}
          </span>
          <p className={styles.cardTitle}>
            {remontee ? "Comprendre la glissade" : perso.defi.title}
          </p>
          <p className={styles.cardText}>
            {defiDone
              ? "Bien joué : +1 jour vers la crête. On remet ça demain."
              : remontee
                ? "Repère ce qui a déclenché la glissade : on ajuste ton plan ensemble."
                : perso.defi.text}
          </p>
        </button>

        <Link onClick={openSlipDialog}>Tu as fumé ? Ça arrive, dis-le nous.</Link>
      </div>
    </div>
  );
};
