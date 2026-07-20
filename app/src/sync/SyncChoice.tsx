import { useEffect, useRef } from "react";
import speechBubble from "../assets/illustrations/speech-bubble.svg";
import { Button } from "../components/Button/Button";
import { Drawer } from "../components/Drawer/Drawer";
import type { SyncConflict } from "./useProfileSync";
import styles from "./SyncChoice.module.css";

/**
 * Choix des données à la connexion (conflit de sync) : le compte contient
 * déjà un profil ET l'appareil porte des saisies jamais synchronisées.
 * Modale basse NON esquivable (Échap ne ferme pas : une décision est
 * requise, la sync est en pause d'ici là) avec trois issues :
 * reprendre le compte, garder le local (écrase le compte), ou tout
 * effacer et repartir de zéro (warning de confirmation, base + local).
 */
export const SyncChoice = ({ conflict }: { conflict: SyncConflict | null }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const warnRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (conflict && dlg && !dlg.open) {
      dlg.showModal();
      dlg.focus();
    }
    if (!conflict) dlg?.close();
  }, [conflict]);

  return (
    <>
      <dialog
        ref={ref}
        className={styles.sheet}
        aria-labelledby="sync-choice-title"
        tabIndex={-1}
        onCancel={(e) => e.preventDefault()}
      >
        <img src={speechBubble} alt="" width={50} height={50} aria-hidden />
        <div className={styles.texts}>
          <p id="sync-choice-title" className={styles.title}>
            Ton compte contient déjà des données
          </p>
          <p className={styles.message}>
            Et tu viens d’en saisir sur cet appareil. On garde quoi ?
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => conflict?.resolve("remote")}>
            Reprendre les données de mon compte
          </Button>
          <Button variant="secondary" onClick={() => conflict?.resolve("local")}>
            Garder ce que je viens de saisir
          </Button>
          <Button variant="ghost" onClick={() => warnRef.current?.showModal()}>
            Repartir de zéro
          </Button>
        </div>
      </dialog>

      {/* Warning avant le reset : destructif, base + local. */}
      <Drawer
        ref={warnRef}
        title="Tout effacer et repartir de zéro ?"
        confirmLabel="Tout effacer"
        cancelLabel="Annuler"
        onConfirm={() => conflict?.resolve("reset")}
      >
        Tes saisies sur cet appareil et les données de ton compte seront
        supprimées. Tu devras tout reconfigurer.
      </Drawer>
    </>
  );
};
