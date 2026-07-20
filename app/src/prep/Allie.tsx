import { useAppNavigate } from "../lib/nav";
import { useState } from "react";
import { Button } from "../components/Button/Button";
import { TextField } from "../components/TextField/TextField";
import { useProfile } from "../profile/profile";
import styles from "../compte/Compte.module.css";

/**
 * Mission « Préviens un proche » : l'allié du jour J. Dire son projet à
 * quelqu'un, c'est s'engager (doc 03 — soutien social). Les coordonnées
 * restent locales : elles servent à l'utilisateur, jamais à l'app.
 */
export const Allie = () => {
  const navigate = useAppNavigate();
  const { state, setPrepAlly } = useProfile();
  const [name, setName] = useState(state.prepAlly?.name ?? "");
  const [phone, setPhone] = useState(state.prepAlly?.phone ?? "");

  const save = () => {
    setPrepAlly({ name: name.trim(), phone: phone.trim() });
    // La mission se coche via la donnée (derived) : rien d'autre à faire.
    navigate(-1);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ta préparation</p>
        <h1 className={styles.titleLg}>Ton allié du jour J.</h1>
        <p className={styles.helperSm}>
          Dire « j’arrête bientôt » à quelqu’un, c’est déjà s’engager. Choisis
          une personne qui te soutiendra, sans juger.
        </p>
        <TextField
          label="Son prénom"
          autoComplete="name"
          placeholder="Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Son numéro de téléphone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          value={phone}
          caption="Pour l’appeler vite fait au moment où ça tangue. Ça reste sur ton appareil."
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" disabled={!name.trim()} onClick={save}>
          Valider
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Annuler
        </Button>
      </div>
    </div>
  );
};
