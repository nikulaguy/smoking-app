import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SyncChoice } from "./sync/SyncChoice";
import { useAppNavigate } from "./lib/nav";
import { AppLayout } from "./app/AppLayout";
import { RootLayout } from "./app/RootLayout";
import { Connexion } from "./compte/Connexion";
import { Donnees } from "./compte/Donnees";
import { Feedback } from "./compte/Feedback";
import { Infos } from "./compte/Infos";
import { Notifications } from "./compte/Notifications";
import { Reponses } from "./compte/Reponses";
import { Suppression } from "./compte/Suppression";
import { Conso, DateChoice, Hsi, Joints, Onboarding, Phrase } from "./onboarding/Onboarding";
import { Phase2 } from "./phase2/Phase2";
import { Allie } from "./prep/Allie";
import { Alternatives } from "./prep/Alternatives";
import { Tri } from "./prep/Tri";
import { useProfileSync } from "./sync/useProfileSync";
import {
  ENTOURAGE_STEPS,
  MOMENTS_STEPS,
  PROFIL_FIELDS,
  PROFIL_STEPS,
  RETEST_STEPS,
} from "./phase2/steps";
// Chargée à la demande : les fiches outils (gros contenu éditorial) sortent
// du bundle initial — leur chunk reste précaché par le SW (dispo hors ligne).
const ToolRoute = lazy(() =>
  import("./tools/ToolRoute").then((m) => ({ default: m.ToolRoute })),
);
import { Dashboard } from "./screens/Dashboard";
import { DefiDetail } from "./screens/DefiDetail";
import { Defis } from "./screens/Defis";
import { Fil } from "./screens/Fil";
import { Profil } from "./screens/Profil";
import {
  dayKey,
  loadState,
  onboardingComplete,
  ProfileContext,
  resolveQuitAt,
  saveState,
  useProfile,
  type Account,
  type NotifPrefs,
  type OnboardingAnswers,
  type PrepAlly,
  type ProfileState,
  type ProfileStore,
  type Slip,
} from "./profile/profile";

const Phase2Route = () => {
  const { completePhase2 } = useProfile();
  const navigate = useAppNavigate();
  // « Ton profil psychologique » : les 3 mini-tunnels seuls. On revient d'où
  // l'on vient (check-list de prépa, accueil…), jamais forcé sur l'accueil.
  return (
    <Phase2
      steps={PROFIL_STEPS}
      doneCopy={{
        eyebrow: "On se connaît, maintenant",
        title: "Ton profil est calibré.",
        text: "Tes raisons, ta confiance et ton style de jeu guident tes défis et tes rappels.",
        cta: "Retour à ma préparation",
      }}
      onDone={() => {
        completePhase2();
        navigate(-1);
      }}
      onQuit={() => navigate(-1)}
    />
  );
};

/**
 * Écran de détail d'une mission : les écrans écrivent au fil de l'eau, donc
 * « Valider » garde les modifications (retour simple) et « Annuler » restaure
 * l'instantané du profil pris à l'entrée de l'écran.
 */
const usePrepDetail = () => {
  const navigate = useAppNavigate();
  const { state, restoreState } = useProfile();
  const snapshot = useRef(state);
  return {
    validate: () => navigate(-1),
    cancel: () => {
      restoreState(snapshot.current);
      navigate(-1);
    },
  };
};

/** Rangées de la check-list : rouvrent les écrans d'onboarding existants. */
const ConsoRoute = () => {
  const d = usePrepDetail();
  return <Conso onNext={d.validate} nextLabel="Valider" onCancel={d.cancel} />;
};

const DateRoute = () => {
  const d = usePrepDetail();
  const { completeOnboarding } = useProfile();
  return (
    <DateChoice
      onNext={() => {
        // changer la date recalcule quitAt (et donc phase et compteurs)
        completeOnboarding();
        d.validate();
      }}
      nextLabel="Valider"
      onCancel={d.cancel}
    />
  );
};

const JointsRoute = () => {
  const d = usePrepDetail();
  return <Joints onNext={d.validate} nextLabel="Valider" onCancel={d.cancel} />;
};

const HsiRoute = () => {
  const d = usePrepDetail();
  return <Hsi onNext={d.validate} nextLabel="Valider" onCancel={d.cancel} />;
};

/** Mission « Note tes raisons » : rouvre l'écran « Ta phrase » du Jour 0. */
const RaisonsRoute = () => {
  const d = usePrepDetail();
  return <Phrase onNext={d.validate} nextLabel="Valider" onCancel={d.cancel} />;
};

/** Mission « Repère tes moments à risque » : rouvre la question de Phase 2. */
const MomentsRoute = () => {
  const d = usePrepDetail();
  return (
    <Phase2
      steps={MOMENTS_STEPS}
      onQuit={d.cancel}
      doneCopy={{
        eyebrow: "C’est noté",
        title: "On sera là pile à ces moments.",
        text: "Tes rappels et ta préparation se calent sur les moments que tu viens de déclarer.",
        cta: "Retour à ma préparation",
      }}
      onDone={d.validate}
    />
  );
};

/** Mission « Les fumeurs autour de toi » : rouvre la question social_entourage. */
const EntourageRoute = () => {
  const d = usePrepDetail();
  return (
    <Phase2
      steps={ENTOURAGE_STEPS}
      onQuit={d.cancel}
      doneCopy={{
        eyebrow: "C’est noté",
        title: "On en tient compte.",
        text: "Ton environnement pèse dans ta stratégie : on adapte tes rappels et tes outils.",
        cta: "Retour à ma préparation",
      }}
      onDone={d.validate}
    />
  );
};

/** « Refaire le point (3 min) » : re-test motivation + SASEQ (doc 04). */
const RetestRoute = () => {
  const navigate = useAppNavigate();
  return (
    <Phase2
      steps={RETEST_STEPS}
      doneCopy={{
        eyebrow: "Profil recalibré",
        title: "Merci, on se recale.",
        text: "Tes réponses mettent à jour ton profil : le ton et les mécaniques s’ajustent dès maintenant.",
        cta: "Retour à mon espace",
      }}
      onDone={() => navigate("/profil")}
      onQuit={() => navigate("/profil")}
    />
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/profilage", element: <Phase2Route /> },
      { path: "/point", element: <RetestRoute /> },
      { path: "/defi", element: <DefiDetail /> },
      {
        path: "/outil/:toolKey",
        element: (
          <Suspense fallback={null}>
            <ToolRoute />
          </Suspense>
        ),
      },
      { path: "/compte/notifications", element: <Notifications /> },
      { path: "/compte/connexion", element: <Connexion /> },
      { path: "/compte/infos", element: <Infos /> },
      { path: "/compte/donnees", element: <Donnees /> },
      { path: "/compte/suppression", element: <Suppression /> },
      { path: "/compte/reponses", element: <Reponses /> },
      { path: "/feedback", element: <Feedback /> },
      { path: "/prep/conso", element: <ConsoRoute /> },
      { path: "/prep/date", element: <DateRoute /> },
      { path: "/prep/joints", element: <JointsRoute /> },
      { path: "/prep/hsi", element: <HsiRoute /> },
      { path: "/prep/raisons", element: <RaisonsRoute /> },
      { path: "/prep/moments", element: <MomentsRoute /> },
      { path: "/prep/entourage", element: <EntourageRoute /> },
      { path: "/prep/allie", element: <Allie /> },
      { path: "/prep/alternatives", element: <Alternatives /> },
      { path: "/prep/tri", element: <Tri /> },
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "fil", element: <Fil /> },
          { path: "defis", element: <Defis /> },
          { path: "profil", element: <Profil /> },
        ],
      },
    ],
  },
]);

export default function App() {
  const [state, setState] = useState<ProfileState>(loadState);

  // Un state ADOPTÉ du cloud garde son revisedAt d'origine à la sauvegarde
  // (comparaison par identité d'objet) ; toute mutation locale re-tamponne.
  const adopted = useRef<ProfileState | null>(null);
  useEffect(
    () => saveState(state, adopted.current === state ? state.revisedAt : undefined),
    [state],
  );

  // Sync Supabase (Phase B.1) : inactif sans configuration ou sans session.
  // Un conflit (compte rempli + saisies locales jamais synchronisées) est
  // tranché par l'utilisateur via la modale SyncChoice.
  const adoptRemote = useCallback((remote: ProfileState) => {
    adopted.current = remote;
    setState(remote);
  }, []);
  const conflict = useProfileSync(state, adoptRemote);

  const setAnswer = useCallback(
    <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) =>
      setState((s) => ({ ...s, answers: { ...s.answers, [key]: value } })),
    [],
  );

  const completeOnboarding = useCallback(
    () =>
      setState((s) => ({
        ...s,
        createdAt: s.createdAt ?? new Date().toISOString(),
        quitAt: resolveQuitAt(s.answers.quitDate, s.answers.customQuitDate).toISOString(),
      })),
    [],
  );

  const setPhase2Answer = useCallback(
    (key: string, value: number | string | string[]) =>
      setState((s) => ({ ...s, phase2: { ...s.phase2, [key]: value } })),
    [],
  );

  const completePhase2 = useCallback(
    () => setState((s) => ({ ...s, phase2Complete: true })),
    [],
  );

  const recordToolFeedback = useCallback(
    (tool: string, helped: "yes" | "some" | "no") =>
      setState((s) => {
        const prev = s.toolStats?.[tool] ?? { used: 0, helped: 0 };
        const gain = helped === "yes" ? 1 : helped === "some" ? 0.5 : 0;
        return {
          ...s,
          toolStats: {
            ...s.toolStats,
            [tool]: { used: prev.used + 1, helped: prev.helped + gain },
          },
        };
      }),
    [],
  );

  const recordSlip = useCallback(
    (kind: Slip["kind"]) =>
      setState((s) => ({
        ...s,
        slips: [...(s.slips ?? []), { at: new Date().toISOString(), kind }],
      })),
    [],
  );

  const markSeen = useCallback(
    () => setState((s) => ({ ...s, lastSeenAt: new Date().toISOString() })),
    [],
  );

  const setAccount = useCallback(
    (patch: Account) =>
      setState((s) => ({ ...s, account: { ...s.account, ...patch } })),
    [],
  );

  const setNotifPrefs = useCallback(
    (patch: NotifPrefs) =>
      setState((s) => ({ ...s, notifPrefs: { ...s.notifPrefs, ...patch } })),
    [],
  );

  const recordDefiDone = useCallback(
    () =>
      setState((s) =>
        s.defisDone?.includes(dayKey())
          ? s
          : { ...s, defisDone: [...(s.defisDone ?? []), dayKey()] },
      ),
    [],
  );

  const togglePrepMission = useCallback(
    (id: string) =>
      setState((s) => {
        const list = s.prepChecklist ?? [];
        return {
          ...s,
          prepChecklist: list.includes(id)
            ? list.filter((x) => x !== id)
            : [...list, id],
        };
      }),
    [],
  );

  const setPrepCelebrated = useCallback(
    (v: boolean) => setState((s) => ({ ...s, prepCelebrated: v })),
    [],
  );

  const setPrepAlly = useCallback(
    (patch: PrepAlly) =>
      setState((s) => ({ ...s, prepAlly: { ...s.prepAlly, ...patch } })),
    [],
  );

  const setTheme = useCallback(
    (theme: ProfileState["theme"]) => setState((s) => ({ ...s, theme })),
    [],
  );

  // Reset d'une mission de la check-list : efface la donnée qui la coche
  // (« Supprimer ces informations ? »). La date d'arrêt n'est jamais resetée
  // ici : sans quitAt l'app repasserait en onboarding (le détail la modifie).
  const resetPrepMission = useCallback(
    (id: string) =>
      setState((s) => {
        const wipe = (keys: (keyof OnboardingAnswers)[]) => ({
          ...s,
          answers: Object.fromEntries(
            Object.entries(s.answers).filter(
              ([k]) => !keys.includes(k as keyof OnboardingAnswers),
            ),
          ) as OnboardingAnswers,
        });
        switch (id) {
          case "conso":
            return wipe(["tobaccoType", "cigsPerDay", "packPrice", "yearsSmoking"]);
          case "joints":
            return wipe(["cannabis"]);
          case "hsi":
            return wipe(["hsiFirstCig"]);
          case "raisons":
            return wipe(["phrase"]);
          case "profil": {
            // vider les 3 échelles psychométriques : la reconfiguration
            // repart d'écrans vierges (pas d'anciennes réponses pré-remplies)
            const p2 = { ...s.phase2 };
            for (const f of PROFIL_FIELDS) delete p2[f];
            return { ...s, phase2: p2, phase2Complete: false };
          }
          case "moments": {
            const p2 = { ...s.phase2 };
            delete p2.social_moments;
            return { ...s, phase2: p2 };
          }
          case "entourage": {
            const p2 = { ...s.phase2 };
            delete p2.social_entourage;
            return { ...s, phase2: p2 };
          }
          case "allie":
            return { ...s, prepAlly: undefined };
          default:
            // missions cochées à la main (alternatives, tri)
            return {
              ...s,
              prepChecklist: (s.prepChecklist ?? []).filter((x) => x !== id),
            };
        }
      }),
    [],
  );

  // Restaure un instantané pris à l'entrée d'un écran de détail (« Annuler »).
  // Mutation locale assumée : revisedAt se re-tamponne à la sauvegarde.
  const restoreState = useCallback(
    (snapshot: ProfileState) => setState({ ...snapshot }),
    [],
  );

  // Applique le thème au document : « system » retire l'attribut (le media
  // query prend le relais) ; « light »/« dark » forcent le mode choisi.
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.theme ?? "system";
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [state.theme]);

  const store = useMemo<ProfileStore>(
    () => ({
      state,
      answers: state.answers,
      setAnswer,
      completeOnboarding,
      setPhase2Answer,
      completePhase2,
      recordToolFeedback,
      recordSlip,
      markSeen,
      setAccount,
      setNotifPrefs,
      recordDefiDone,
      togglePrepMission,
      resetPrepMission,
      restoreState,
      setPrepCelebrated,
      setPrepAlly,
      setTheme,
    }),
    [
      state,
      setAnswer,
      completeOnboarding,
      setPhase2Answer,
      completePhase2,
      recordToolFeedback,
      recordSlip,
      markSeen,
      setAccount,
      setNotifPrefs,
      recordDefiDone,
      togglePrepMission,
      resetPrepMission,
      restoreState,
      setPrepCelebrated,
      setPrepAlly,
      setTheme,
    ],
  );

  return (
    <ProfileContext.Provider value={store}>
      {onboardingComplete(state) ? (
        <RouterProvider router={router} />
      ) : (
        <Onboarding onDone={completeOnboarding} />
      )}
      {/* Conflit de sync à la connexion : décision requise, au-dessus de tout. */}
      <SyncChoice conflict={conflict} />
      {/* Paysage sur téléphone : voir index.css (.landscape-guard). */}
      <div className="landscape-guard" role="status">
        <h2>Tourne ton téléphone</h2>
        <p>L’app est pensée pour le format portrait.</p>
      </div>
    </ProfileContext.Provider>
  );
}
