import { useAppNavigate } from "../lib/nav";
import { Button } from "../components/Button/Button";
import { Hero } from "../components/Hero/Hero";
import { personalize } from "../profile/personalization";
import {
  dashboardModel,
  defiDoneToday,
  useProfile,
} from "../profile/profile";
import styles from "./DefiDetail.module.css";

/** Libellés des moments à risque (mêmes valeurs que social_moments, Phase 2). */
const MOMENTS: Record<string, string> = {
  reveil: "le réveil",
  cafe: "la pause café",
  pause: "la pause",
  trajet: "le trajet",
  repas: "l’après-repas",
  soiree: "la soirée",
  stress: "le coup de stress",
  ennui: "l’ennui",
  alcool: "les verres",
  social: "les moments entre amis",
};

/**
 * Détail du défi du jour (doc 06) : déclaratif basé sur la confiance,
 * aucune preuve demandée. « Pas aujourd'hui » = refus sans pénalité ni
 * perte de série. Le pourquoi cite les données du profil (transparence).
 */
export const DefiDetail = () => {
  const navigate = useAppNavigate();
  const { state, recordDefiDone } = useProfile();
  const m = dashboardModel(state);
  const perso = personalize(state);
  const done = defiDoneToday(state);

  const remontee = Boolean(m.remontee);
  const moments = (state.phase2?.social_moments as string[] | undefined) ?? [];
  const moment = moments.length ? MOMENTS[moments[0]] : undefined;

  const title = remontee ? "Comprendre la glissade" : perso.defi.title;
  const why = remontee
    ? "Repère ce qui a déclenché la glissade : le moment, le lieu, l’émotion. Le nommer, c’est déjà ajuster ton plan."
    : moment
      ? `${moment.charAt(0).toUpperCase()}${moment.slice(1)}, c’est ton moment le plus risqué (tu nous l’as dit, et tes données le confirment). Le gagner une fois, c’est le gagner pour de bon : ce moment redevient à toi en quelques jours.`
      : "Les premières fois sont les plus dures : chaque moment gagné une fois est gagné pour de bon, l’automatisme se défait en quelques jours.";
  const reward = remontee
    ? "+1 jour de remontée · +40 XP · et ton plan s’affine."
    : "+1 jour vers la crête · +40 XP · et ce moment t’appartient à nouveau.";

  return (
    <div className={styles.screen}>
      <Hero creteHeight={90} flag sun={false}>
        <p className={styles.eyebrow}>
          {remontee ? "Défi du jour · la remontée" : "Défi du jour · +1 jour"}
        </p>
        <h1 className={styles.title}>{title}</h1>
      </Hero>

      <div className={styles.content}>
        <p className={styles.why}>{why}</p>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Si tu tiens</p>
          <p className={styles.panelText}>{reward}</p>
        </div>

        <p className={styles.tip}>
          Astuce de grimpeur : change ta routine d’un détail. Le geste
          inhabituel casse l’automatisme.
        </p>
      </div>

      <div className={styles.ctaZone}>
        {done ? (
          <p className={styles.doneNote} aria-live="polite">
            Défi relevé aujourd’hui. On remet ça demain.
          </p>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              recordDefiDone();
              navigate("/");
            }}
          >
            Je l’ai fait
          </Button>
        )}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          {done ? "Retour" : "Pas aujourd’hui"}
        </Button>
      </div>
    </div>
  );
};
