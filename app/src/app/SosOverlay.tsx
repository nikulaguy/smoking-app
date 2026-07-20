import { forwardRef } from "react";
import { Button } from "../components/Button/Button";
import { ToolTile } from "../components/ToolTile/ToolTile";
import { TOOLS, type ToolKey } from "../profile/personalization";
import styles from "./SosOverlay.module.css";

interface SosOverlayProps {
  /** Titre de la sur-couche (personnalisé par archétype). */
  title: string;
  /** Outils, dans l'ordre de pertinence du profil. */
  tools: ToolKey[];
  /** Ouvre l'expérience d'un outil (le tap est aussi un signal JITAI). */
  onSelect: (tool: ToolKey) => void;
}

/**
 * Sur-couche d'aide immédiate (boîte à outils anti-envie), ouverte par le SOS.
 * `<dialog>` natif : focus piégé et Échap gratuits. Le titre et l'ordre des
 * outils sont personnalisés par le profil (docs 03/04, personalization.ts).
 */
export const SosOverlay = forwardRef<HTMLDialogElement, SosOverlayProps>(
  ({ title, tools, onSelect }, ref) => (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="sos-title">
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ça va passer</p>
        <h2 id="sos-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.helper}>
          L’envie redescend toujours. Choisis ton allié :
        </p>
        <div className={styles.grid}>
          {tools.map((k) => (
            <ToolTile
              key={k}
              icon={<img src={TOOLS[k].illustration} alt="" width={44} height={44} />}
              onClick={() => onSelect(k)}
            >
              {TOOLS[k].label}
            </ToolTile>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={(e) => e.currentTarget.closest("dialog")?.close()}
        >
          Ça va mieux, merci
        </Button>
      </div>
    </dialog>
  ),
);
SosOverlay.displayName = "SosOverlay";
