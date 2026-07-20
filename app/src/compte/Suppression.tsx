import { useAppNavigate } from "../lib/nav";
import { cx } from "class-variance-authority";
import { Button } from "../components/Button/Button";
import { useProfile } from "../profile/profile";
import { deleteProfile, downloadProfileExport } from "./actions";
import styles from "./Compte.module.css";

/**
 * Confirmation de suppression (doc 06) : action destructive à double
 * garde-fou (écran dédié + mail de confirmation + 30 jours de
 * rétractation, ces deux derniers avec le back-end). L'export est
 * proposé AVANT. Le départ pour réussite est célébré, pas retenu :
 * l'app vise à se rendre inutile.
 */
export const Suppression = () => {
  const navigate = useAppNavigate();
  const { state } = useProfile();
  // le ton s'accorde à la personne (comme le prénom, jamais requis)
  const sure =
    state.phase2?.toi_sexe === "femme"
      ? "sûre"
      : state.phase2?.toi_sexe === "homme"
        ? "sûr"
        : "sûr·e";

  return (
    <div className={cx(styles.screen, styles.screenSubtle)}>
      <div className={styles.content}>
        <p className={cx(styles.eyebrow, styles.eyebrowError)}>
          On efface tout ?
        </p>
        <h1 className={styles.titleLg}>Tu es {sure} de toi ?</h1>
        <p className={styles.helper}>
          Profil, progrès, trophées, ta phrase : tout sera supprimé. Tu as 30
          jours pour changer d’avis via le mail de confirmation, ensuite c’est
          définitif.
        </p>
        <div className={cx(styles.panel, styles.panelPlain)}>
          <p className={styles.panelTitle}>Tu pars parce que tu as réussi ?</p>
          <p className={styles.panelText}>
            C’est le plus beau départ possible. Emporte ton export en souvenir.
          </p>
        </div>
        <p className={styles.caption}>
          Ton compte est mis en pause 30 jours : si tu te reconnectes d’ici
          là, tu peux tout restaurer tel quel. Après, tout est définitivement
          effacé et ton adresse repart d’une feuille blanche.
        </p>
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" onClick={() => downloadProfileExport(state)}>
          Exporter mes données d’abord
        </Button>
        <Button
          variant="secondary"
          className={styles.dangerAction}
          onClick={() => void deleteProfile()}
        >
          Supprimer définitivement
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Annuler
        </Button>
      </div>
    </div>
  );
};
