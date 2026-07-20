import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { setNavKind, useAppNavigate } from "../lib/nav";
import { SosCraving } from "../components/SosCraving/SosCraving";
import { TabBar } from "../components/TabBar/TabBar";
import { personalize } from "../profile/personalization";
import {
  dashboardModel,
  daysAway,
  prepReadiness,
  useProfile,
} from "../profile/profile";
import { useLocalReminders } from "../lib/localNotifs";
import { ReturnOverlay } from "./ReturnOverlay";
import { SlipOverlay } from "./SlipOverlay";
import { SosOverlay } from "./SosOverlay";
import styles from "./AppLayout.module.css";

/** Onglets : « Défis » devient « Prépa » tant que le jour J n'est pas là. */
const tabs = (phase: string) => [
  { to: "/", label: "Accueil", end: true },
  { to: "/fil", label: "Fil" },
  { to: "/defis", label: phase === "prep" ? "Prépa" : "Défis" },
  { to: "/profil", label: "Profil" },
];

/** Seuil d'inactivité qui déclenche la sur-couche de retour (doc 06). */
const ABSENCE_DAYS = 7;

/** Marge garantie entre la fin du contenu défilant et les éléments sticky
    (tab bar, bouton du dock) : le contenu ne s'arrête jamais au ras du dock. */
const STICKY_GAP = 40;

/** Contexte offert aux écrans enfants (Outlet). */
interface LayoutContext {
  /** Ouvre la sur-couche de déclaration de glissade (« j'ai fumé »). */
  openSlipDialog: () => void;
}

/** Accès typé au contexte du layout depuis un écran enfant. */
export const useLayout = () => useOutletContext<LayoutContext>();

/**
 * Coque de l'app connectée : contenu défilant (Outlet) + dock persistant
 * (SOS flottant au-dessus de la tab bar). Porte aussi les sur-couches
 * transverses : SOS, déclaration de glissade, retour après absence.
 */
export const AppLayout = () => {
  const sosRef = useRef<HTMLDialogElement>(null);
  const slipRef = useRef<HTMLDialogElement>(null);
  const returnRef = useRef<HTMLDialogElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const navigate = useAppNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, recordSlip, markSeen } = useProfile();
  // Canal local : rappels sur cet appareil quand l'app est ouverte.
  useLocalReminders(state);

  // Le dock est fixe : on mesure sa hauteur réelle (SOS + tab bar + safe-area
  // du home indicator) pour dégager d'autant le bas du contenu défilant.
  // Sinon la dernière carte reste masquée derrière le dock (bug iOS standalone).
  const [dockH, setDockH] = useState(148);
  useLayoutEffect(() => {
    const el = dockRef.current;
    if (!el) return;
    const measure = () => setDockH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const perso = personalize(state);
  const m = dashboardModel(state);
  const prepReady = prepReadiness(state);

  // Détection du retour après absence : décidée à l'ouverture, AVANT de
  // réécrire lastSeenAt (sinon l'absence s'efface elle-même).
  const away = useRef(daysAway(state));
  useEffect(() => {
    if (away.current >= ABSENCE_DAYS && m.phase === "climb") {
      returnRef.current?.showModal();
    }
    markSeen();
    // à l'ouverture uniquement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep-link « ?envie=1 » (clic sur une notification de moment à risque) :
  // ouvrir directement la boîte à outils anti-envie. Jamais en phase prep
  // (le SOS envie n'existe pas encore). On retire le paramètre pour qu'un
  // rafraîchissement ne rouvre pas l'overlay.
  useEffect(() => {
    if (searchParams.get("envie") !== "1") return;
    if (m.phase === "climb") sosRef.current?.showModal();
    setSearchParams(
      (prev) => {
        prev.delete("envie");
        return prev;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className={styles.shell}>
      <main className={styles.scroll} style={{ paddingBottom: dockH + STICKY_GAP }}>
        <Outlet
          context={
            { openSlipDialog: () => slipRef.current?.showModal() } satisfies LayoutContext
          }
        />
      </main>

      <div className={styles.dock} ref={dockRef}>
        <div className={styles.dockInner}>
          {/* Avant l'arrêt : pas de SOS envie (rien à gérer encore) — le bouton
              renvoie vers la check-list de préparation, sauf sur l'écran Prépa
              lui-même (on y est déjà) et sauf préparation complète (plus rien
              à compléter) : le dock n'y montre alors que la tab bar. */}
          {!(
            m.phase === "prep" &&
            (pathname === "/defis" || prepReady.done === prepReady.total)
          ) && (
            <SosCraving
              onClick={
                m.phase === "prep"
                  ? () => navigate("/defis")
                  : () => sosRef.current?.showModal()
              }
            >
              {m.phase === "prep" ? "Complète ta préparation" : perso.sos.button}
            </SosCraving>
          )}
          <TabBar>
            {/* viewTransition + grammaire directionnelle : le contenu glisse
                latéralement (rebond) vers l'onglet visé, le dock (isolé par
                view-transition-name) reste immobile. */}
            {tabs(m.phase).map((t, idx) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                viewTransition
                onClick={() => {
                  const items = tabs(m.phase);
                  const cur = items.findIndex((x) =>
                    x.end ? pathname === x.to : pathname.startsWith(x.to),
                  );
                  setNavKind(idx >= cur ? "tab-fwd" : "tab-back");
                }}
                className={styles.tabItem}
              >
                {t.label}
              </NavLink>
            ))}
          </TabBar>
        </div>
      </div>

      <SosOverlay
        ref={sosRef}
        title={perso.sos.title}
        tools={perso.sos.tools}
        onSelect={(tool) => {
          sosRef.current?.close();
          navigate(`/outil/${tool}`);
        }}
      />
      <SlipOverlay
        ref={slipRef}
        daysClimbed={Math.max(1, m.dayNumber)}
        onDeclare={(kind) => {
          recordSlip(kind);
          navigate("/");
        }}
      />
      <ReturnOverlay
        ref={returnRef}
        daysAway={away.current}
        onResolve={(status) => {
          if (status === "smoked") {
            recordSlip("several");
            navigate("/");
          } else if (status === "lost") {
            // « Je ne sais plus » → check-in via la déclaration de glissade
            slipRef.current?.showModal();
          }
          // « tenu » : les compteurs courent depuis quitAt, rien à recaler.
        }}
      />
    </div>
  );
};
