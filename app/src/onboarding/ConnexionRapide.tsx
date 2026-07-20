import { forwardRef, useEffect, useRef, useState } from "react";
import { Button } from "../components/Button/Button";
import { TextField } from "../components/TextField/TextField";
import { supabase, useSession } from "../lib/supabase";
import styles from "./ConseilsDate.module.css";

/**
 * Connexion depuis le PREMIER écran (maquette 7:163, bouton « Se connecter ») :
 * sur-couche plein écran avec le lien magique, sans le router (l'onboarding
 * n'est pas monté sur les routes). Même mécanique que Compte & connexion :
 * lien par mail, ou code à 6 chiffres / lien collé. Au succès, la session
 * déclenche la sync : compte rempli = l'app s'ouvre directement, compte
 * vide = l'onboarding continue, connecté (les saisies seront associées).
 * Réutilise le gabarit visuel des sur-couches d'onboarding (ConseilsDate).
 */
export const ConnexionRapide = forwardRef<HTMLDialogElement>((_props, ref) => {
  const session = useSession();
  const innerRef = useRef<HTMLDialogElement | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session établie (code validé dans cet onglet) : la sur-couche se ferme,
  // la sync prend la main (adoption du profil du compte ou association).
  useEffect(() => {
    if (session) innerRef.current?.close();
  }, [session]);

  const sendLink = async () => {
    setError(null);
    if (!supabase) {
      setSent(true); // mode démo : pas de back configuré
      return;
    }
    setSending(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
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
  const verifyCode = async () => {
    if (!supabase) return;
    setError(null);
    setSending(true);
    const link = code.match(/[?&]token=([^&\s]+)/);
    const linkType = code.match(/[?&]type=([^&\s]+)/)?.[1];
    const { error: err } = link
      ? await supabase.auth.verifyOtp({
          token_hash: link[1],
          type: (linkType ?? "email") as "email",
        })
      : await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setSending(false);
    if (err) {
      setError(
        /banned/i.test(err.message) || err.code === "user_banned"
          ? "Ce compte est en cours de suppression : termine d’abord ton parcours, puis restaure-le depuis Profil, Compte & connexion."
          : "Code ou lien invalide, ou expiré. Reprends le dernier mail reçu, ou renvoie-le.",
      );
    }
    // succès : useSession ferme la sur-couche tout seul (effet ci-dessus)
  };

  return (
    <dialog
      ref={(el) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className={styles.dialog}
      aria-label="Se connecter"
      tabIndex={-1}
      onToggle={(e) => {
        if (e.currentTarget.open) {
          e.currentTarget.scrollTop = 0;
          e.currentTarget.focus();
        }
      }}
    >
      <div className={styles.screen}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Ton compte</p>
          <h1 className={styles.title}>Content de te revoir.</h1>
          <p className={styles.intro}>
            {sent
              ? "C’est envoyé ! Ouvre le lien du mail, ou colle ici le code reçu."
              : "Reçois un lien magique par mail : pas de mot de passe. Ton parcours reprendra là où tu l’avais laissé."}
          </p>
          <TextField
            label="Ton adresse mail"
            type="email"
            autoComplete="email"
            placeholder="toi@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {sent && (
            <TextField
              label="Le code du mail (ou le lien collé)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          )}
          {error && (
            <p className={styles.caption} aria-live="polite">
              {error}
            </p>
          )}
        </div>
        <div className={styles.ctaZone}>
          {sent ? (
            <Button
              variant="primary"
              disabled={!code.trim() || sending}
              onClick={() => void verifyCode()}
            >
              {sending ? "Vérification…" : "Valider le code"}
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={!/.+@.+\..+/.test(email) || sending}
              onClick={() => void sendLink()}
            >
              {sending ? "Envoi…" : "Recevoir mon lien magique"}
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={(e) => e.currentTarget.closest("dialog")?.close()}
          >
            Annuler
          </Button>
        </div>
      </div>
    </dialog>
  );
});
