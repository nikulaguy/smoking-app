import { forwardRef, useId, type ReactNode } from "react";
import speechBubble from "../../assets/illustrations/speech-bubble.svg";
import { Button } from "../Button/Button";
import styles from "./Drawer.module.css";

interface DrawerProps {
  /** Question ou information principale (Bold 18, centré). */
  title: ReactNode;
  /** Message secondaire optionnel sous le titre. */
  children?: ReactNode;
  /** Action principale (bouton primaire). */
  confirmLabel: ReactNode;
  onConfirm: () => void;
  /** Action de repli (bouton ghost) : ferme sans rien changer. */
  cancelLabel: ReactNode;
  /** Appelé à la fermeture, quelle qu'en soit la cause (Annuler, Échap). */
  onClose?: () => void;
}

/**
 * Drawer — modale ancrée en bas de l'écran (source Figma : « modale -
 * affichage par le bas avec overlay », 316:3584). Le contenu en dessous est
 * inerte (dialog modal natif) et ne défile plus. Ouverture par le parent :
 * `ref.current.showModal()` puis `ref.current.focus()` (le focus va au
 * dialog, pas au premier bouton — l'annonce passe par aria-labelledby).
 * Confirmer déclenche l'action ; Annuler et Échap ferment sans rien changer.
 */
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(
  ({ title, children, confirmLabel, onConfirm, cancelLabel, onClose }, ref) => {
    const titleId = useId();
    const close = (e: React.MouseEvent<HTMLButtonElement>) =>
      e.currentTarget.closest("dialog")?.close();
    return (
      <dialog
        ref={ref}
        className={styles.drawer}
        aria-labelledby={titleId}
        tabIndex={-1}
        onClose={onClose}
      >
        <img src={speechBubble} alt="" width={50} height={50} aria-hidden />
        <div className={styles.texts}>
          <p id={titleId} className={styles.title}>
            {title}
          </p>
          {children && <p className={styles.message}>{children}</p>}
        </div>
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={(e) => {
              e.currentTarget.closest("dialog")?.close();
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
          <Button variant="ghost" onClick={close}>
            {cancelLabel}
          </Button>
        </div>
      </dialog>
    );
  },
);
