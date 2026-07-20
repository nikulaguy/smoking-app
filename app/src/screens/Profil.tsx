import { useAppNavigate } from "../lib/nav";
import { Hero } from "../components/Hero/Hero";
import { RecapItem, RecapList } from "../components/RecapList/RecapList";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import { useSession } from "../lib/supabase";
import {
  cigsPerDay,
  dashboardModel,
  hsiScore,
  useProfile,
  type ThemePref,
} from "../profile/profile";
import styles from "./Profil.module.css";

const THEMES: { value: ThemePref; label: string }[] = [
  { value: "system", label: "Système" },
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
];

const CIGS_LABEL: Record<string, string> = {
  "-5": "moins de 5 / jour",
  "5-10": "5 à 10 / jour",
  "11-20": "11 à 20 / jour",
  "21-30": "21 à 30 / jour",
  "30+": "plus de 30 / jour",
};

const hsiLabel = (score?: number) =>
  score === undefined
    ? "—"
    : score <= 1
      ? "Faible"
      : score <= 4
        ? "Modérée"
        : "Forte";

const Chevron = () => (
  <svg className={styles.chevron} aria-hidden width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M6 4l6 5-6 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Onglet Profil : « Ton camp de base » — personnalisation transparente + réglages. */
export const Profil = () => {
  const { state, answers, setTheme } = useProfile();
  const navigate = useAppNavigate();
  const session = useSession();
  const m = dashboardModel(state);
  const theme = state.theme ?? "system";

  return (
    <div>
      <Hero creteHeight={70} sun={false}>
        <p className={styles.eyebrow}>Ton profil</p>
        <h1 className={styles.title}>Ton camp de base.</h1>
        <p className={styles.caption}>
          {m.levelLabel} · jour {m.dayNumber}
        </p>
      </Hero>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ce que l’app sait de toi</h2>
          <RecapList>
            <RecapItem label="Ta conso">
              {CIGS_LABEL[answers.cigsPerDay ?? ""] ?? "—"}
            </RecapItem>
            <RecapItem label="Ta dépendance">
              {hsiLabel(hsiScore(answers))}
            </RecapItem>
            <RecapItem label="Cigarettes évitées / jour">
              {Math.round(cigsPerDay(answers))}
            </RecapItem>
            {answers.phrase && <RecapItem label="Ta phrase">« {answers.phrase} »</RecapItem>}
          </RecapList>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Réglages</h2>
          <div className={styles.settings}>
            <button
              type="button"
              className={styles.row}
              onClick={() => navigate("/compte/connexion", { motion: "sheet" })}
            >
              Compte &amp; connexion
              <span className={styles.rowValue}>
                {session ? `${session.user.email} · synchronisé` : "Non connecté"}
              </span>
              <Chevron />
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={() => navigate("/compte/infos", { motion: "sheet" })}
            >
              Infos personnelles <Chevron />
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={() => navigate("/compte/reponses", { motion: "sheet" })}
            >
              Tes réponses d’onboarding <Chevron />
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={() => navigate("/compte/notifications", { motion: "sheet" })}
            >
              Notifications &amp; rythme <Chevron />
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={() => navigate("/compte/donnees", { motion: "sheet" })}
            >
              Tes données (export, suppression) <Chevron />
            </button>
            <a
              className={styles.row}
              href="https://www.tabac-info-service.fr"
              target="_blank"
              rel="noreferrer"
            >
              Aide &amp; ressources humaines <Chevron />
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Apparence</h2>
          <fieldset className={styles.themeOptions}>
            <legend className={styles.srOnly}>Thème d’affichage</legend>
            {THEMES.map((t) => (
              <SingleChoiceOption
                key={t.value}
                name="theme"
                checked={theme === t.value}
                onChange={() => setTheme(t.value)}
              >
                {t.label}
              </SingleChoiceOption>
            ))}
          </fieldset>
        </section>

        <p className={styles.note}>
          Tes données restent à toi : export et suppression à tout moment, rien
          n’est vendu, jamais.
        </p>
      </div>
    </div>
  );
};
