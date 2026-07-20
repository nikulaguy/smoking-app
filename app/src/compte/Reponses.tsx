import { useAppNavigate } from "../lib/nav";
import { Button } from "../components/Button/Button";
import { useEffect, useRef, useState } from "react";
import { Conso, DateChoice, Joints, Phrase } from "../onboarding/Onboarding";
import { hexadType, useProfile } from "../profile/profile";
import styles from "./Compte.module.css";

const CIGS_LABEL: Record<string, string> = {
  "-5": "Moins de 5",
  "5-10": "5 à 10",
  "11-20": "11 à 20",
  "21-30": "21 à 30",
  "30+": "Plus de 30",
};

const YEARS_LABEL: Record<string, string> = {
  "-5": "Moins de 5 ans",
  "5-10": "5 à 10 ans",
  "11-20": "11 à 20 ans",
  "21-30": "21 à 30 ans",
  "30+": "Plus de 30 ans",
};

const CANNABIS_LABEL: Record<string, string> = {
  regular: "Oui, régulièrement",
  sometimes: "De temps en temps",
  never: "Non, jamais",
  skip: "Non renseigné",
};

const ENTOURAGE_LABEL: Record<string, string> = {
  "0": "Personne",
  "1-2": "1 ou 2",
  "3-5": "3 à 5",
  beaucoup: "Beaucoup",
};

const dateLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "—";

type EditKey = "conso" | "date" | "joints" | "phrase";

const Chevron = () => (
  <svg
    className={styles.answerChevron}
    aria-hidden
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
    <path
      d="M6 4l6 5-6 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
 * Tes réponses d'onboarding (doc 06) : chaque ligne rouvre l'écran
 * d'onboarding existant en sur-couche (réutilisation, jamais de
 * duplication). Toute modification recalcule compteurs et profil,
 * les dérivations étant calculées à la volée depuis les réponses.
 */
export const Reponses = () => {
  const navigate = useAppNavigate();
  const { state, answers, completeOnboarding } = useProfile();
  const [editing, setEditing] = useState<EditKey | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (editing) dialogRef.current?.showModal();
  }, [editing]);

  const close = () => {
    // changer la date d'arrêt recalcule quitAt (et donc tous les compteurs)
    if (editing === "date") completeOnboarding();
    dialogRef.current?.close();
    setEditing(null);
  };

  // Une ligne se modifie soit en sur-couche (edit : écran d'onboarding léger),
  // soit par navigation (to : parcours multi-étapes — profil psy, entourage).
  // Toutes les infos d'onboarding SAUF les infos perso (âge, sexe).
  const entourage = state.phase2?.social_entourage as string | undefined;
  const rows: { label: string; value: string; edit?: EditKey; to?: string }[] = [
    {
      label: "Tu fumes",
      value: answers.tobaccoType === "rolling" ? "Du tabac à rouler" : "Des cigarettes",
      edit: "conso",
    },
    {
      label: "Par jour",
      value: CIGS_LABEL[answers.cigsPerDay ?? ""] ?? "—",
      edit: "conso",
    },
    {
      label: answers.tobaccoType === "rolling" ? "Prix du pot" : "Prix du paquet",
      value:
        answers.packPrice !== undefined
          ? `${answers.packPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`
          : "—",
      edit: "conso",
    },
    {
      label: "Tu fumes depuis",
      value: YEARS_LABEL[answers.yearsSmoking ?? ""] ?? "—",
      edit: "conso",
    },
    { label: "Ta date d’arrêt", value: dateLabel(state.quitAt), edit: "date" },
    {
      label: "Les joints",
      value: CANNABIS_LABEL[answers.cannabis ?? ""] ?? "—",
      edit: "joints",
    },
    {
      label: "Fumeurs autour de toi",
      value: entourage ? (ENTOURAGE_LABEL[entourage] ?? "—") : "—",
      to: "/prep/entourage",
    },
    {
      label: "Ta phrase",
      value: answers.phrase ? `« ${answers.phrase} »` : "—",
      edit: "phrase",
    },
    {
      label: "Ton profil psychologique",
      value: state.phase2Complete
        ? (hexadType(state.phase2) ?? "Complété")
        : "À configurer",
      to: "/profilage",
    },
  ];

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ton profil</p>
        <h1 className={styles.titleLg}>Tes réponses du départ.</h1>
        <p className={styles.helperSm}>
          Chaque modification recalcule tes compteurs et ton profil.
        </p>
        <div className={styles.answers}>
          {rows.map((r) => (
            <button
              key={r.label}
              type="button"
              className={styles.answerRow}
              onClick={() => (r.to ? navigate(r.to) : setEditing(r.edit ?? null))}
            >
              <span className={styles.answerLabel}>{r.label}</span>
              <span className={styles.answerValue}>{r.value}</span>
              <Chevron />
            </button>
          ))}
        </div>
      </div>
      <div className={styles.stickyBack}>
        <Button variant="ghost" onClick={() => navigate(-1, { motion: "sheet-back" })}>
          <BackIcon />
          Retour au profil
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.editDialog}
        aria-label="Modifier ta réponse"
        onClose={(e) => {
          // React fait remonter le close des dialogs imbriqués (sélecteurs
          // plein écran) : ne réagir qu'à la fermeture de CETTE sur-couche.
          if (e.target === e.currentTarget) setEditing(null);
        }}
      >
        {editing === "conso" && <Conso onNext={close} />}
        {editing === "date" && <DateChoice onNext={close} />}
        {editing === "joints" && <Joints onNext={close} />}
        {editing === "phrase" && <Phrase onNext={close} />}
      </dialog>
    </div>
  );
};
