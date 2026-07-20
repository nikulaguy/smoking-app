import { useAppNavigate } from "../lib/nav";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button/Button";
import { Drawer } from "../components/Drawer/Drawer";
import { FlowNav } from "../components/FlowNav/FlowNav";
import { TextField } from "../components/TextField/TextField";
import { localPermission } from "../lib/localNotifs";
import { setNotifIntent, type NotifIntent } from "../lib/notifIntent";
import { disablePush } from "../lib/push";
import { supabase, useSession } from "../lib/supabase";
import { useProfile } from "../profile/profile";
import { cx } from "class-variance-authority";
import styles from "./Compte.module.css";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * Connexion par lien magique (doc 06) : compte OPTIONNEL et différé,
 * pas de mot de passe à stocker ni à fuiter. « Continuer sans compte »
 * laisse les données en local. Envoi réel via Supabase quand configuré,
 * mode démo sinon.
 */
export const Connexion = () => {
  const navigate = useAppNavigate();
  const session = useSession();
  const { state, setAccount, setNotifPrefs } = useProfile();
  // Déconnexion : les rappels par mail / tous appareils suivent le compte —
  // avertir avant, puis basculer la portée du push sur cet appareil.
  const signOutRef = useRef<HTMLDialogElement>(null);
  const channels = state.notifPrefs?.channels ?? {};
  const accountNotifs = Boolean(channels.push || channels.email);
  const doSignOut = async () => {
    // couper les canaux liés au compte AVANT de perdre la session (RLS)
    if (channels.push) await disablePush();
    await supabase?.auth.signOut();
    setNotifPrefs({
      channels: {
        ...channels,
        push: false,
        email: false,
        // la portée bascule sur cet appareil (si la permission est déjà là)
        local: channels.push ? localPermission() === "granted" : channels.local,
      },
    });
  };
  const [email, setEmail] = useState(state.account?.email ?? "");
  const [sent, setSent] = useState(false);
  // compte en cours de suppression : proposer la restauration (30 jours)
  const [pendingDeletion, setPendingDeletion] = useState(false);
  // confirmation « repartir de zéro » (purge immédiate, irréversible)
  const [freshConfirm, setFreshConfirm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Canal de notification demandé avant de se connecter (« Se connecter »
  // depuis la modale des réglages). Capturé à la volée depuis l'URL, AVANT
  // que Supabase ne nettoie les paramètres du lien magique. Il voyage dans
  // l'URL (et donc dans emailRedirectTo) pour survivre à l'aller-retour mail,
  // même si l'app rouvre dans un autre onglet.
  const [canal] = useState<NotifIntent | null>(
    () => new URLSearchParams(window.location.search).get("canal") as NotifIntent | null,
  );

  // Une fois connecté avec un canal en attente : on le ramène aux réglages
  // pour finaliser (Notifications applique l'intention via takeNotifIntent).
  useEffect(() => {
    if (session && canal) {
      setNotifIntent(canal);
      navigate("/compte/notifications", { replace: true });
    }
  }, [session, canal, navigate]);

  const sendLink = async () => {
    setAccount({ email });
    setError(null);
    if (!supabase) {
      setSent(true); // mode démo : pas de back configuré
      return;
    }
    setSending(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // le canal demandé rentre dans le lien magique : au retour, on saura
        // reprendre le parcours (push tous appareils / mail) même en nouvel onglet
        emailRedirectTo: `${window.location.origin}/compte/connexion${
          canal ? `?canal=${canal}` : ""
        }`,
      },
    });
    setSending(false);
    if (err) {
      setError(
        err.code === "over_email_send_rate_limit"
          ? "Trop de demandes pour l’instant : réessaie dans quelques minutes."
          : "L’envoi a échoué. Vérifie l’adresse, ou réessaie dans un instant.",
      );
      return;
    }
    setSent(true);
  };

  /** Accepte le code à 6 chiffres OU le lien du mail collé tel quel. */
  const verifyCode = async (value: string) => {
    if (!supabase) return;
    setError(null);
    setSending(true);
    const link = value.match(/[?&]token=([^&\s]+)/);
    const linkType = value.match(/[?&]type=([^&\s]+)/)?.[1];
    const { error: err } = link
      ? await supabase.auth.verifyOtp({
          token_hash: link[1],
          type: (linkType ?? "email") as "email",
        })
      : await supabase.auth.verifyOtp({ email, token: value, type: "email" });
    setSending(false);
    if (err) {
      if (/banned/i.test(err.message) || err.code === "user_banned") {
        // Compte en cours de suppression : on propose la restauration.
        setPendingDeletion(true);
        return;
      }
      setError(
        "Code ou lien invalide, ou expiré. Reprends le dernier mail reçu, ou renvoie-le.",
      );
    }
    // succès : useSession bascule la vue « connecté » toute seule
  };

  /**
   * Restaure un compte en cours de suppression : le code du mail prouve
   * l'adresse, la fonction lève la suspension, annule la demande et renvoie
   * la session — les données, conservées pendant les 30 jours, reviennent
   * telles quelles. Après la purge, l'adresse repart d'une feuille blanche.
   */
  const restore = async (value: string) => {
    if (!supabase) return;
    setError(null);
    setSending(true);
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restore-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email, token: value }),
      },
    );
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.session?.access_token) {
      setSending(false);
      setError(
        "Ce code n’est plus valable. Renvoie un code et réessaie : la restauration reste possible.",
      );
      return;
    }
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
    setSending(false);
    setPendingDeletion(false);
    // succès : useSession bascule la vue « connecté », les données restaurées
  };

  /**
   * Feuille blanche immédiate : purge définitive du compte en pause (prouvée
   * par le code), puis remise à zéro locale — l'app repart sur l'onboarding.
   */
  const freshStart = async (value: string) => {
    setError(null);
    setSending(true);
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restore-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ email, token: value, fresh: true }),
      },
    );
    const data = await res.json().catch(() => null);
    setSending(false);
    if (!res.ok || !data?.fresh) {
      setFreshConfirm(false);
      setError(
        "Ce code n’est plus valable. Renvoie un code et réessaie.",
      );
      return;
    }
    // ardoise vierge : on efface aussi les données locales de l'appareil
    localStorage.removeItem("smokingapp.profile");
    window.location.href = "/";
  };

  const resendCode = async () => {
    if (!supabase) return;
    setError(null);
    setNotice(null);
    await supabase.auth.signInWithOtp({ email });
    setCode("");
    setNotice("Nouveau code envoyé : vérifie tes mails.");
  };

  // Retour connecté avec un canal en attente : la redirection vers les
  // réglages part dans l'effet ci-dessus — on n'affiche pas la vue « chez
  // toi » entre-temps (évite un flash de l'écran + du bouton « Retour »).
  if (session && canal) return null;

  // Connecté (retour du lien magique, ou déjà en session)
  if (session) {
    return (
      <div className={cx(styles.screen, styles.screenSubtle)}>
        <div className={cx(styles.content, styles.contentCentered)}>
          <p className={styles.eyebrow}>Ton compte</p>
          <h1 className={styles.titleLg}>Te voilà chez toi.</h1>
          <p className={styles.helper}>
            Connecté avec {session.user.email}.
            <br />
            Ton ascension est sauvegardée et synchronisée.
          </p>
        </div>
        <div className={styles.ctaZone}>
          <Button variant="primary" onClick={() => navigate("/profil")}>
            Retour à mon espace
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (accountNotifs) {
                signOutRef.current?.showModal();
                signOutRef.current?.focus();
              } else void doSignOut();
            }}
          >
            Se déconnecter (les données restent sur cet appareil)
          </Button>
        </div>

        {/* Avertissement avant déconnexion : les rappels mail / tous
            appareils suivent le compte, la portée bascule sur cet appareil. */}
        <Drawer
          ref={signOutRef}
          title="Te déconnecter ?"
          confirmLabel="Se déconnecter quand même"
          onConfirm={() => void doSignOut()}
          cancelLabel="Rester connecté"
        >
          Tu ne recevras plus les rappels par mail ni sur tous tes appareils.
          Ils continueront sur cet appareil uniquement.
        </Drawer>
      </div>
    );
  }

  // Confirmation « repartir de zéro » : purge immédiate, irréversible.
  if (pendingDeletion && freshConfirm && !session) {
    return (
      <div className={cx(styles.screen, styles.screenSubtle)}>
        <div className={styles.content}>
          <FlowNav onBack={() => setFreshConfirm(false)} />
          <p className={styles.eyebrow}>Feuille blanche</p>
          <h1 className={styles.titleLg}>Tout effacer maintenant ?</h1>
          <p className={styles.helper}>
            Ton ancien compte et toutes ses données seront définitivement
            effacés tout de suite, sans attendre la fin des 30 jours. C’est
            irréversible. Tu pourras ensuite repartir de zéro avec la même
            adresse.
          </p>
        </div>
        <div className={styles.ctaZone}>
          <Button
            variant="secondary"
            className={styles.dangerAction}
            disabled={sending || code.trim().length < 6}
            onClick={() => void freshStart(code.trim())}
          >
            {sending ? "Effacement…" : "Oui, tout effacer et repartir de zéro"}
          </Button>
          <Button variant="ghost" onClick={() => setFreshConfirm(false)}>
            Revenir
          </Button>
        </div>
      </div>
    );
  }

  // Compte en pause (suppression demandée, purge pas encore passée) :
  // restaurer tel quel, ou repartir de zéro tout de suite.
  if (pendingDeletion && !session) {
    return (
      <div className={cx(styles.screen, styles.screenSubtle)}>
        <div className={styles.content}>
          <FlowNav
            onBack={() => {
              setPendingDeletion(false);
              setSent(false);
              setError(null);
              setNotice(null);
            }}
          />
          <p className={styles.eyebrow}>Ton compte</p>
          <h1 className={styles.titleLg}>Ton compte est en pause.</h1>
          <p className={styles.helper}>
            Tu as demandé sa suppression. Tes données sont conservées 30 jours
            après la demande : d’ici là, tu peux tout restaurer, exactement
            comme avant — ou repartir de zéro tout de suite.
          </p>
          <TextField
            label="Le code reçu par mail"
            autoComplete="one-time-code"
            placeholder="Code du dernier mail"
            value={code}
            error={error}
            caption={notice ?? "Le code du dernier mail de connexion reçu."}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="primary"
            disabled={sending || code.trim().length < 6}
            onClick={() => void restore(code.trim())}
          >
            {sending ? "Restauration…" : "Restaurer mon compte"}
          </Button>
        </div>
        <div className={styles.ctaZone}>
          <Button variant="secondary" disabled={sending} onClick={() => void resendCode()}>
            Renvoyer un code
          </Button>
          <Button
            variant="ghost"
            disabled={code.trim().length < 6}
            onClick={() => setFreshConfirm(true)}
          >
            Repartir de zéro
          </Button>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className={cx(styles.screen, styles.screenSubtle)}>
        <div className={cx(styles.content, styles.contentCentered)}>
          <p className={styles.eyebrow}>C’est envoyé</p>
          <h1 className={styles.titleLg}>Vérifie tes mails.</h1>
          <p className={styles.helper} aria-live="polite">
            Lien envoyé à {email}.
            <br />
            Il expire dans 15 minutes.
          </p>
          {!supabase && (
            <p className={styles.caption}>
              Démo : l’envoi réel du lien arrive avec la configuration du
              back-end.
            </p>
          )}
          {supabase && (
            <>
              <TextField
                label="Ou saisis le code (ou colle le lien) du mail"
                autoComplete="one-time-code"
                placeholder="Code du mail, ou lien complet"
                value={code}
                error={error}
                caption="Pratique si le lien ne s’ouvre pas sur cet appareil."
                onChange={(e) => {
                  const v = e.target.value;
                  setCode(v);
                  // un lien collé s'ouvre tout seul ; un code se valide au bouton
                  if (v.includes("token=")) void verifyCode(v.trim());
                }}
              />
              <Button
                variant="primary"
                disabled={sending || code.trim().length < 6}
                onClick={() => void verifyCode(code.trim())}
              >
                {sending ? "Vérification…" : "Valider le code"}
              </Button>
            </>
          )}
        </div>
        <div className={styles.ctaZone}>
          <Button
            variant="secondary"
            disabled={sending || resent}
            onClick={async () => {
              await sendLink();
              setResent(true);
            }}
          >
            {resent ? "Lien renvoyé !" : "Renvoyer le lien"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSent(false);
              setResent(false);
            }}
          >
            Changer d’adresse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ton compte</p>
        <h1 className={styles.titleLg}>Retrouve ton ascension partout.</h1>
        <p className={styles.helper}>
          Ton profil et tes progrès, sauvegardés et synchronisés. Rien d’autre.
        </p>
        <TextField
          label="Ton adresse mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="toi@exemple.fr"
          value={email}
          error={error}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!error && (
          <p className={styles.caption}>
            Pas de mot de passe : on t’envoie un lien, tu cliques, c’est tout.
          </p>
        )}
      </div>
      <div className={styles.ctaZone}>
        <Button
          variant="primary"
          disabled={!isEmail(email) || sending}
          onClick={sendLink}
        >
          {sending ? "Envoi…" : "Recevoir mon lien magique"}
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1, { motion: "sheet-back" })}>
          Continuer sans compte
        </Button>
      </div>
    </div>
  );
};
