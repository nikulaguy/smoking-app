import { forwardRef, useState } from "react";
import { Button } from "../components/Button/Button";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import type { Slip } from "../profile/profile";
import styles from "./SlipOverlay.module.css";

interface SlipOverlayProps {
  /** Jours gravis avant la glissade (« n'efface pas N jours d'ascension »). */
  daysClimbed: number;
  /** Déclare la glissade choisie et referme la sur-couche. */
  onDeclare: (kind: Slip["kind"]) => void;
}

/**
 * Sur-couche de déclaration de glissade (« j'ai fumé ») — l'écran le plus
 * sensible du produit (doc 06) : aucune culpabilisation, aucun rouge, aucun
 * compteur cassé. « Je refume régulièrement » fait de l'aide humaine le
 * chemin principal (garde-fou doc 03). À la validation, retour au dashboard
 * en état « remontée », jamais un écran vide.
 */
export const SlipOverlay = forwardRef<HTMLDialogElement, SlipOverlayProps>(
  ({ daysClimbed, onDeclare }, ref) => {
    const [kind, setKind] = useState<Slip["kind"] | null>(null);
    const close = (e: React.MouseEvent<HTMLElement>) =>
      e.currentTarget.closest("dialog")?.close();

    return (
      <dialog ref={ref} className={styles.dialog} aria-labelledby="slip-title">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Ça arrive</p>
          <h2 id="slip-title" className={styles.title}>
            Une glissade, pas une chute.
          </h2>
          <p className={styles.helper}>
            Fumer une cigarette n’efface pas {daysClimbed} jour
            {daysClimbed > 1 ? "s" : ""} d’ascension. Ton corps garde tout le
            terrain gagné.
          </p>
          <fieldset className={styles.options}>
            <legend className={styles.legend}>Dis-nous où tu en es :</legend>
            <SingleChoiceOption
              name="slip-kind"
              checked={kind === "one"}
              onChange={() => setKind("one")}
            >
              Une cigarette
            </SingleChoiceOption>
            <SingleChoiceOption
              name="slip-kind"
              checked={kind === "several"}
              onChange={() => setKind("several")}
            >
              Plusieurs, aujourd’hui
            </SingleChoiceOption>
            <SingleChoiceOption
              name="slip-kind"
              checked={kind === "regular"}
              onChange={() => setKind("regular")}
            >
              Je refume régulièrement
            </SingleChoiceOption>
          </fieldset>
          {kind === "regular" && (
            <p className={styles.support}>
              Là, un vrai coup de main peut tout changer. Tabac info service,
              c’est gratuit et sans jugement.
            </p>
          )}
        </div>
        <div className={styles.footer}>
          {kind === "regular" ? (
            <>
              <a
                className={styles.helpCta}
                href="https://www.tabac-info-service.fr"
                target="_blank"
                rel="noreferrer"
              >
                Parler à quelqu’un
              </a>
              <Button
                variant="secondary"
                onClick={(e) => {
                  onDeclare(kind);
                  close(e);
                }}
              >
                Reprendre l’ascension
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                disabled={!kind}
                onClick={(e) => {
                  if (!kind) return;
                  onDeclare(kind);
                  close(e);
                }}
              >
                Reprendre l’ascension
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  window.open("https://www.tabac-info-service.fr", "_blank", "noreferrer")
                }
              >
                Parler à quelqu’un
              </Button>
            </>
          )}
        </div>
      </dialog>
    );
  },
);
SlipOverlay.displayName = "SlipOverlay";
