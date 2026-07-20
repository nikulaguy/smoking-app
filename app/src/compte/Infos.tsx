import { useAppNavigate } from "../lib/nav";
import { useState } from "react";
import { Button } from "../components/Button/Button";
import { SelectField } from "../components/SelectField/SelectField";
import { TextField } from "../components/TextField/TextField";
import { useProfile } from "../profile/profile";
import styles from "./Compte.module.css";

/** Options identiques au module « Toi » de la Phase 2 (une seule source). */
const AGES = [
  { value: "-18", label: "Moins de 18 ans" },
  { value: "18-24", label: "18 à 24 ans" },
  { value: "25-34", label: "25 à 34 ans" },
  { value: "35-44", label: "35 à 44 ans" },
  { value: "45-54", label: "45 à 54 ans" },
  { value: "55+", label: "55 ans et plus" },
];

const SEXES = [
  { value: "femme", label: "Une femme" },
  { value: "homme", label: "Un homme" },
  { value: "autre", label: "Autre / non-binaire" },
  { value: "nsp", label: "Je préfère ne pas le dire" },
];

/**
 * Infos personnelles (doc 06) : tout est optionnel, le prénom ne sert
 * qu'au ton. Modifier l'âge ou le sexe recalcule le profil (ces réponses
 * vivent dans la Phase 2, une seule source de vérité).
 */
export const Infos = () => {
  const navigate = useAppNavigate();
  const { state, setAccount, setPhase2Answer } = useProfile();
  const [firstName, setFirstName] = useState(state.account?.firstName ?? "");
  const [email, setEmail] = useState(state.account?.email ?? "");
  const [age, setAge] = useState(
    typeof state.phase2?.toi_age === "string" ? state.phase2.toi_age : undefined,
  );
  const [sexe, setSexe] = useState(
    typeof state.phase2?.toi_sexe === "string" ? state.phase2.toi_sexe : undefined,
  );

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ton compte</p>
        <h1 className={styles.titleLg}>Tes infos.</h1>
        <TextField
          label="Ton prénom (optionnel)"
          autoComplete="given-name"
          placeholder="Ton prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Ton adresse mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="toi@exemple.fr"
          caption="Sert uniquement à la connexion et aux rappels choisis."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SelectField
          label="Ton âge"
          selectorTitle="Ton âge ?"
          options={AGES}
          value={age}
          onChange={setAge}
        />
        <SelectField
          label="Tu es"
          selectorTitle="Tu es…"
          options={SEXES}
          value={sexe}
          onChange={setSexe}
        />
      </div>
      <div className={styles.ctaZone}>
        <Button
          variant="primary"
          onClick={() => {
            setAccount({ firstName, email });
            if (age) setPhase2Answer("toi_age", age);
            if (sexe) setPhase2Answer("toi_sexe", sexe);
            navigate(-1, { motion: "sheet-back" });
          }}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};
