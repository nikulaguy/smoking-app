import { forwardRef, useState } from "react";
import { Button } from "../components/Button/Button";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import styles from "./ReturnOverlay.module.css";

type ReturnStatus = "held" | "smoked" | "lost";

interface ReturnOverlayProps {
  /** Jours écoulés depuis la dernière ouverture. */
  daysAway: number;
  /** Recalage choisi — le parent route (célébration / remontée / check-in). */
  onResolve: (status: ReturnStatus) => void;
}

/** Petits nombres en toutes lettres (au-delà, le chiffre reste lisible). */
const DAYS_IN_WORDS: Record<number, string> = {
  7: "Sept",
  8: "Huit",
  9: "Neuf",
  10: "Dix",
  11: "Onze",
  12: "Douze",
  13: "Treize",
  14: "Quatorze",
  15: "Quinze",
  16: "Seize",
};

/**
 * Sur-couche de retour après ≥ 7 jours d'inactivité (doc 06) : zéro
 * culpabilisation, l'absence n'est jamais un échec. Trois réponses qui
 * routent : tenu → compteurs recalés + célébration ; refumé → parcours
 * remontée ; je ne sais plus → check-in via la déclaration de glissade.
 */
export const ReturnOverlay = forwardRef<HTMLDialogElement, ReturnOverlayProps>(
  ({ daysAway, onResolve }, ref) => {
    const [status, setStatus] = useState<ReturnStatus | null>(null);
    const days = DAYS_IN_WORDS[daysAway] ?? `${daysAway}`;

    return (
      <dialog ref={ref} className={styles.dialog} aria-labelledby="return-title">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Te revoilà</p>
          <h2 id="return-title" className={styles.title}>
            Content de te revoir.
          </h2>
          <p className={styles.helper}>
            {days} jours sans se voir. Aucun reproche : dis-nous juste où tu en
            es, on recale tout.
          </p>
          <fieldset className={styles.options}>
            <legend className={styles.legend}>Depuis la dernière fois :</legend>
            <SingleChoiceOption
              name="return-status"
              checked={status === "held"}
              onChange={() => setStatus("held")}
            >
              J’ai tenu sans l’app
            </SingleChoiceOption>
            <SingleChoiceOption
              name="return-status"
              checked={status === "smoked"}
              onChange={() => setStatus("smoked")}
            >
              J’ai refumé entre-temps
            </SingleChoiceOption>
            <SingleChoiceOption
              name="return-status"
              checked={status === "lost"}
              onChange={() => setStatus("lost")}
            >
              Je ne sais plus trop
            </SingleChoiceOption>
          </fieldset>
        </div>
        <div className={styles.footer}>
          <Button
            variant="primary"
            disabled={!status}
            onClick={(e) => {
              if (!status) return;
              e.currentTarget.closest("dialog")?.close();
              onResolve(status);
            }}
          >
            On recale ensemble
          </Button>
        </div>
      </dialog>
    );
  },
);
ReturnOverlay.displayName = "ReturnOverlay";
