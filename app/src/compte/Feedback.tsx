import { useAppNavigate } from "../lib/nav";
import { useState } from "react";
import { Button } from "../components/Button/Button";
import { FlowNav } from "../components/FlowNav/FlowNav";
import { supabase, useSession } from "../lib/supabase";
import styles from "./Compte.module.css";

/**
 * Feedback de préparation (Accueil, état « tout prêt ») : un message libre qui
 * arrive par mail à l'équipe. Réservé aux connectés (on joint leur adresse pour
 * répondre) via l'Edge Function send-feedback (Resend + cap anti-spam).
 * Gabarit repris de « Ta phrase » : flow-nav, question, textarea, Envoyer/Annuler.
 */
export const Feedback = () => {
  const navigate = useAppNavigate();
  const session = useSession();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const send = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setNotice(null);
    setSending(true);
    if (!supabase || !session) {
      setNotice("Connecte-toi pour envoyer ton feedback.");
      setSending(false);
      return;
    }
    const { data, error } = await supabase.functions.invoke("send-feedback", {
      body: { message: text },
    });
    setSending(false);
    if (error || !data?.ok) {
      setNotice(
        (error as { context?: { status?: number } })?.context?.status === 429
          ? "Tu viens d’envoyer un message : laisse-nous quelques minutes."
          : "L’envoi a échoué. Réessaie dans un instant.",
      );
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.screen}>
        <div className={`${styles.content} ${styles.contentCentered}`}>
          <p className={styles.eyebrow}>Merci 🙏</p>
          <h1 className={styles.titleLg}>Message bien reçu.</h1>
          <p className={styles.helper}>
            On lit chaque retour : c’est comme ça que l’app s’améliore.
          </p>
        </div>
        <div className={styles.ctaZone}>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Retour à ma préparation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <FlowNav onBack={() => navigate(-1)} onQuit={() => navigate(-1)} />
        <div className={styles.headerBlock}>
          <p className={styles.eyebrow}>Ton feedback</p>
          <h1 className={styles.titleLg}>
            En une phrase : comment on pourrait mieux faire ?
          </h1>
        </div>
        <div className={styles.field}>
          <label className={styles.helperSm} htmlFor="feedback">
            Ton message
          </label>
          <textarea
            id="feedback"
            className={styles.textArea}
            placeholder="Dis-nous ce qui te manque, ou ce qu’on pourrait améliorer."
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        {notice && (
          <p className={styles.caption} aria-live="polite">
            {notice}
          </p>
        )}
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" disabled={!message.trim() || sending} onClick={() => void send()}>
          {sending ? "Envoi…" : "Envoyer"}
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Annuler
        </Button>
      </div>
    </div>
  );
};
