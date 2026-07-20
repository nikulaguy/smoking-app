import { useAppNavigate } from "../lib/nav";
import { Button } from "../components/Button/Button";
import { useProfile } from "../profile/profile";
import { downloadProfileExport } from "./actions";
import styles from "./Compte.module.css";

/** Flèche retour (icon/action/arrowLeft de la librairie, 274:2150). */
const BackIcon = () => (
  <svg
    aria-hidden
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11.4697 4.46973C11.7626 4.17683 12.2374 4.17683 12.5303 4.46973C12.8232 4.76262 12.8232 5.23738 12.5303 5.53027L6.81055 11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H6.81055L12.5303 18.4697C12.8232 18.7626 12.8232 19.2374 12.5303 19.5303C12.2374 19.8232 11.7626 19.8232 11.4697 19.5303L4.46973 12.5303C4.17683 12.2374 4.17683 11.7626 4.46973 11.4697L11.4697 4.46973Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Tes données (doc 06) : concrétise la promesse RGPD du Profil.
 * Export = portabilité réelle (JSON). La zone de suppression est
 * séparée, bordée erreur, et n'agit JAMAIS à un tap : elle ouvre
 * l'écran de confirmation.
 */
export const Donnees = () => {
  const navigate = useAppNavigate();
  const { state } = useProfile();

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Tes données</p>
        <h1 className={styles.titleLg}>Tes données, tes règles.</h1>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Exporter</p>
          <p className={styles.panelText}>
            Tout ce qu’on sait : profil, réponses, progrès, usage des outils.
            Un fichier lisible, à toi.
          </p>
          <Button variant="secondary" onClick={() => downloadProfileExport(state)}>
            Télécharger mes données
          </Button>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Ce qu’on stocke, et rien d’autre</p>
          <p className={styles.panelText}>
            Ton profil, tes réponses, ton avancée et l’usage des outils : pour
            personnaliser, point. Hébergé en Europe, jamais vendu, jamais
            partagé.
          </p>
        </div>

        <button
          type="button"
          className={`${styles.panel} ${styles.panelDanger}`}
          onClick={() => navigate("/compte/suppression")}
        >
          <p className={`${styles.panelTitle} ${styles.panelTitleError}`}>
            Supprimer mon compte
          </p>
          <p className={styles.panelText}>
            Tout est effacé, définitivement. On te proposera d’exporter avant.
          </p>
        </button>
      </div>
      <div className={styles.stickyBack}>
        <Button variant="ghost" onClick={() => navigate(-1, { motion: "sheet-back" })}>
          <BackIcon />
          Retour au profil
        </Button>
      </div>
    </div>
  );
};
