import { forwardRef } from "react";
import { Button } from "../Button/Button";
import styles from "./FlowNav.module.css";

/**
 * Navigation des flux à étapes (onboarding, profilage) : revenir à l'étape
 * précédente et quitter le flux. Le retour ne perd rien (les réponses sont
 * enregistrées au fil de l'eau), la sortie demande confirmation (QuitDialog).
 */
export const FlowNav = ({
  onBack,
  onQuit,
}: {
  onBack?: () => void;
  onQuit?: () => void;
}) => (
  <nav className={styles.nav} aria-label="Navigation de l’onboarding">
    {onBack ? (
      <button type="button" className={styles.back} onClick={onBack}>
        <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
          <path
            d="M11 4L6 9l5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Retour
      </button>
    ) : (
      <span />
    )}
    {onQuit && (
      <button
        type="button"
        className={styles.quit}
        aria-label="Quitter l’onboarding"
        onClick={onQuit}
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
          <path
            d="M5 5l8 8M13 5l-8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )}
  </nav>
);

/**
 * Confirmation de sortie d'un flux à étapes. Rassure avant tout : rien n'est
 * perdu, on reprend là où on en était. Reprendre = action principale.
 */
export const QuitDialog = forwardRef<HTMLDialogElement, { onQuit: () => void }>(
  ({ onQuit }, ref) => {
    const close = (e: React.MouseEvent<HTMLElement>) =>
      e.currentTarget.closest("dialog")?.close();

    return (
      <dialog ref={ref} className={styles.dialog} aria-labelledby="quit-title">
        <h2 id="quit-title" className={styles.dialogTitle}>
          Tu veux quitter ?
        </h2>
        <p className={styles.dialogText}>
          Pas de souci : tes réponses sont gardées, tu reprendras là où tu en
          étais.
        </p>
        <div className={styles.dialogActions}>
          <Button variant="primary" onClick={close}>
            Reprendre
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => {
              close(e);
              onQuit();
            }}
          >
            Quitter quand même
          </Button>
        </div>
      </dialog>
    );
  },
);
