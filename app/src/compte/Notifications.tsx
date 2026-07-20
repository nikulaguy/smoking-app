import { useAppNavigate } from "../lib/nav";
import { useEffect, useRef, useState } from "react";
import { MultiChoiceOption } from "../components/MultiChoiceOption/MultiChoiceOption";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import { Button } from "../components/Button/Button";
import { Switch } from "../components/Switch/Switch";
import { Drawer } from "../components/Drawer/Drawer";
import { supabase, useSession } from "../lib/supabase";
import {
  enableLocalNotifs,
  localNotifsSupported,
  localPermission,
  showLocal,
} from "../lib/localNotifs";
import { disablePush, enablePush, isPushEnabled, pushSupported } from "../lib/push";
import { takeNotifIntent, type NotifIntent } from "../lib/notifIntent";
import { useProfile, type NotifChannels, type NotifPrefs } from "../profile/profile";
import styles from "./Compte.module.css";

const RHYTHMS: { value: NonNullable<NotifPrefs["rhythm"]>; label: string }[] = [
  { value: "discret", label: "Discret · quelques rappels par semaine" },
  { value: "equilibre", label: "Équilibré · un rappel par jour, pas plus" },
  { value: "rapproche", label: "Rapproché · présent aux moments à risque" },
];

/** Libellés des moments à risque déclarés (social_moments, Phase 2). */
const MOMENTS: Record<string, string> = {
  reveil: "Réveil",
  cafe: "Café",
  pause: "Pause",
  trajet: "Trajet",
  repas: "Repas",
  soiree: "Soirée",
  stress: "Stress",
  ennui: "Ennui",
  alcool: "Alcool",
  social: "Entre amis",
};

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
 * Notifications & rythme (doc 04) : l'app propose un coup de pouce aux bons
 * moments (JITAI), l'utilisateur décide du volume, du canal ET de la portée :
 * - types cumulables : push (notification) et/ou mail ;
 * - portée du push, EXCLUSIVE (sinon doublon sur l'appareil abonné) :
 *   « sur cet appareil » (channels.local, sans compte, app ouverte) OU
 *   « sur tous tes appareils » (channels.push, Web Push, compte requis).
 * Anti-métriques : jamais compulsif, jamais la nuit, tout est coupable.
 */
export const Notifications = () => {
  const navigate = useAppNavigate();
  const session = useSession();
  const { state, setNotifPrefs } = useProfile();
  const notifsOn = state.notifPrefs?.enabled !== false;
  const rhythm = state.notifPrefs?.rhythm ?? "equilibre";
  const riskReminders = state.notifPrefs?.riskReminders !== false;
  const channels = state.notifPrefs?.channels ?? {};
  const moments = (state.phase2?.social_moments as string[] | undefined) ?? [];
  const momentLabels = moments.map((m) => MOMENTS[m]).filter(Boolean);

  // L'état réel du push = l'abonnement effectif du navigateur (la permission
  // peut être refusée ou révoquée hors app), pas la préférence seule.
  const [pushOn, setPushOn] = useState(false);
  const [busy, setBusy] = useState(false);
  // Message d'information sous les canaux (résultat de test, refus…).
  const [notice, setNotice] = useState<string | null>(null);
  // Invite de connexion : drawer bas (maquette 309:2312), jamais dans le
  // contenu. Fermer sans se connecter ne sélectionne rien.
  const [connectAsk, setConnectAsk] = useState<{
    text: string;
    intent: NotifIntent;
  } | null>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    void isPushEnabled().then(setPushOn);
  }, []);
  useEffect(() => {
    if (!connectAsk) return;
    drawerRef.current?.showModal();
    // focus sur le drawer (pas le premier bouton : évite l'anneau de focus
    // dès l'ouverture, le contenu est annoncé via aria-labelledby)
    drawerRef.current?.focus();
  }, [connectAsk]);

  // Retour de connexion : applique l'intention mémorisée (« Se connecter »
  // depuis la modale) — le canal choisi s'active sans re-taper l'option.
  useEffect(() => {
    if (!session) return;
    const intent = takeNotifIntent();
    if (!intent) return;
    if (intent === "email") {
      setNotifPrefs({ channels: { ...channels, email: true } });
      setNotice("C’est fait : tes rappels arriveront aussi par mail.");
      return;
    }
    // push-all : l'abonnement peut exiger un geste (permission navigateur)
    void (async () => {
      setBusy(true);
      try {
        const ok = await enablePush();
        setPushOn(ok);
        if (ok) {
          setNotifPrefs({ channels: { ...channels, local: false, push: true } });
          setNotice("C’est fait : tes rappels arriveront sur tous tes appareils.");
        } else {
          setNotice(
            "Te voilà connecté ! Retape « Sur tous tes appareils » pour finaliser l’activation.",
          );
        }
      } finally {
        setBusy(false);
      }
    })();
    // à l'arrivée de la session uniquement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const localOn = Boolean(channels.local) && localPermission() === "granted";
  // Portée « tous tes appareils » : préférence push active (rétro-compat :
  // pas de préférence mais un abonnement navigateur = opt-in historique).
  const pushAll = channels.push === true || (channels.push !== false && pushOn);
  // Type « en push » choisi, quelle que soit la portée.
  const pushChosen = Boolean(channels.local) || pushAll;
  const scope: "device" | "all" = pushAll ? "all" : "device";
  const anyChannel = localOn || pushAll || Boolean(channels.email);

  const setChannels = (patch: NotifChannels) =>
    setNotifPrefs({ channels: { ...channels, ...patch } });

  /** Portée « sur cet appareil » : sans compte, notifications locales. */
  const chooseDevice = async () => {
    setNotice(null);
    if (!localNotifsSupported()) {
      setNotice("Ce navigateur ne gère pas les notifications.");
      return;
    }
    setBusy(true);
    try {
      // quitter la portée « tous les appareils » : désabonner ce navigateur
      // (pas besoin de session, le serveur purge les abonnements morts)
      if (pushOn) {
        await disablePush();
        setPushOn(false);
      }
      const ok = await enableLocalNotifs();
      setChannels({ local: ok, push: false });
      if (!ok)
        setNotice(
          "Notifications refusées : tu peux les réactiver dans les réglages du navigateur.",
        );
    } finally {
      setBusy(false);
    }
  };

  /** Portée « sur tous tes appareils » : Web Push, compte requis. */
  const chooseAll = async () => {
    setNotice(null);
    if (!session) {
      setConnectAsk({
        text: "Les rappels sur tous tes appareils nécessitent d’avoir un compte (gratuit)",
        intent: "push-all",
      });
      return;
    }
    if (!pushSupported()) {
      setNotice("Ce navigateur ne gère pas le push.");
      return;
    }
    setBusy(true);
    try {
      const ok = await enablePush();
      setPushOn(ok);
      if (ok) setChannels({ local: false, push: true });
      else
        setNotice("Notifications refusées : tu peux les réactiver quand tu veux.");
    } finally {
      setBusy(false);
    }
  };

  // Au moins un mode (push OU mail) doit rester actif : pour tout couper,
  // l'utilisateur passe par l'interrupteur global en haut de l'écran.
  const lastChannelNotice =
    "Garde au moins le push ou le mail. Pour tout couper, utilise l’interrupteur en haut.";

  /** Coche/décoche le type « en push » (la portée se règle en dessous). */
  const togglePushType = async () => {
    setNotice(null);
    if (!pushChosen) {
      // activation par défaut : la portée locale, qui marche sans compte
      await chooseDevice();
      return;
    }
    // désélection interdite si c'est le dernier mode actif
    if (!channels.email) {
      setNotice(lastChannelNotice);
      return;
    }
    setBusy(true);
    try {
      if (pushOn) await disablePush();
    } finally {
      setPushOn(false);
      setChannels({ local: false, push: false });
      setBusy(false);
    }
  };

  const toggleEmail = () => {
    setNotice(null);
    if (channels.email) {
      // désélection interdite si c'est le dernier mode actif
      if (!pushChosen) {
        setNotice(lastChannelNotice);
        return;
      }
      setChannels({ email: false });
      return;
    }
    if (!session) {
      setConnectAsk({
        text: "Les rappels par mail nécessitent d’avoir un compte (gratuit)",
        intent: "email",
      });
      return;
    }
    setChannels({ email: true });
  };

  /** Teste tous les canaux actifs d'un coup. */
  const sendTest = async () => {
    setNotice(null);
    const parts: string[] = [];
    if (localOn) {
      const shown = await showLocal({
        title: "Un test réussi 🎉",
        body: "Voilà un coup de pouce local, directement depuis ton appareil.",
        url: "/",
        tag: "test-local",
      });
      if (shown) parts.push("appareil");
    }
    if (session && supabase && (pushAll || channels.email)) {
      const { data, error } = await supabase.functions.invoke("push-send", {
        body: {
          title: "Un test réussi 🎉",
          body: "Voilà à quoi ressemblera un petit coup de pouce au bon moment.",
        },
      });
      if (!error) {
        if (data?.push) parts.push("push");
        if (data?.email) parts.push("mail");
      }
    }
    setNotice(
      parts.length
        ? `Test envoyé (${parts.join(", ")}) : regarde tes notifications${parts.includes("mail") ? " et tes mails" : ""}.`
        : "Aucun canal actif ou envoi impossible pour l’instant.",
    );
  };

  return (
    <div className={styles.screen}>
      <div className={`${styles.content} ${styles.contentLoose}`}>
        <div className={styles.headerBlock}>
          <p className={styles.eyebrow}>Tes réglages</p>
          <h1 className={styles.titleLg}>Notifications &amp; rythme.</h1>
        </div>
        <p className={styles.helperSm}>
          L’app te propose un coup de pouce aux bons moments. Toi, tu décides
          du volume et du canal.
        </p>

        {/* Interrupteur global : off = plus AUCUNE notification, tous les
            réglages en dessous passent en désactivé (fieldset disabled). */}
        <div className={styles.masterRow}>
          <Switch
            name="notifs-enabled"
            checked={notifsOn}
            description="Coupe tous les rappels d’un coup. Tu peux les rallumer quand tu veux."
            onChange={() => {
              setNotice(null);
              setNotifPrefs({ enabled: !notifsOn });
            }}
          >
            Toutes les notifications
          </Switch>
        </div>

        <fieldset className={styles.fieldset} disabled={!notifsOn}>
          <legend className={styles.groupTitle}>Ton rythme</legend>
          {RHYTHMS.map((r) => (
            <SingleChoiceOption
              key={r.value}
              name="rhythm"
              checked={rhythm === r.value}
              onChange={() => setNotifPrefs({ rhythm: r.value })}
            >
              {r.label}
            </SingleChoiceOption>
          ))}
        </fieldset>

        <fieldset className={styles.fieldset} disabled={!notifsOn}>
          <legend className={styles.groupTitle}>Aux moments à risque</legend>
          <MultiChoiceOption
            name="riskReminders"
            checked={riskReminders}
            onChange={() => setNotifPrefs({ riskReminders: !riskReminders })}
          >
            Un rappel à tes moments déclarés
          </MultiChoiceOption>
          <p className={styles.caption}>
            {momentLabels.length
              ? `Tes moments : ${momentLabels.join(", ")}.`
              : "Déclare tes moments à risque dans le profilage pour des rappels au bon moment."}
          </p>
        </fieldset>

        <fieldset className={styles.fieldset} disabled={!notifsOn}>
          <legend className={styles.groupTitle}>Comment te prévenir ?</legend>
          <MultiChoiceOption
            name="channel-push"
            checked={pushChosen}
            disabled={busy}
            description="Une notification au bon moment, à ton rythme"
            onChange={() => void togglePushType()}
          >
            En push
          </MultiChoiceOption>
          <MultiChoiceOption
            name="channel-email"
            checked={Boolean(channels.email)}
            description={
              session?.user.email
                ? `Sur ${session.user.email} · au même rythme`
                : "Sur ton adresse, au même rythme · compte requis"
            }
            onChange={toggleEmail}
          >
            Par mail
          </MultiChoiceOption>
        </fieldset>

        {pushChosen && (
          <fieldset className={styles.fieldset} disabled={!notifsOn}>
            <legend className={styles.groupTitle}>Où recevoir le push ?</legend>
            <SingleChoiceOption
              name="push-scope"
              checked={scope === "device"}
              disabled={busy}
              description="Sans compte, quand l’app est ouverte. Tout reste sur ton appareil."
              onChange={() => void chooseDevice()}
            >
              Sur cet appareil
            </SingleChoiceOption>
            <SingleChoiceOption
              name="push-scope"
              checked={scope === "all"}
              disabled={busy}
              description="Même app fermée · compte requis"
              onChange={() => void chooseAll()}
            >
              Sur tous tes appareils
            </SingleChoiceOption>
          </fieldset>
        )}

        {notice && (
          <p className={styles.caption} aria-live="polite">
            {notice}
          </p>
        )}
        {notifsOn && riskReminders && anyChannel && (
          <Button variant="ghost" onClick={() => void sendTest()}>
            Tester une notification
          </Button>
        )}

        <p className={styles.caption}>
          Jamais la nuit, jamais pour te faire culpabiliser. Tu peux tout
          couper : l’app reste là.
        </p>
      </div>
      <div className={styles.stickyBack}>
        <Button variant="ghost" onClick={() => navigate(-1, { motion: "sheet-back" })}>
          <BackIcon />
          Retour au profil
        </Button>
      </div>

      {/* Invite de connexion en modale basse (composant Drawer, 316:3584) :
          apparaît au choix d'une option compte-requis sans session. Fermer
          (Plus tard, Échap) ne sélectionne rien. */}
      <Drawer
        ref={drawerRef}
        title={connectAsk?.text}
        confirmLabel="Se connecter"
        onConfirm={() => {
          // le canal demandé voyage dans l'URL : il survit à tout l'aller-
          // retour du lien magique (même si l'app rouvre dans un autre onglet)
          navigate(`/compte/connexion?canal=${connectAsk?.intent ?? ""}`);
        }}
        cancelLabel="Plus tard"
        onClose={() => setConnectAsk(null)}
      />
    </div>
  );
};
