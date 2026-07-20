import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Idea,
  Medal,
  ThumbUp,
  Trophy,
} from "../components/Illustrations/Illustrations";
import { Card } from "../components/Card/Card";
import { FlowNav, QuitDialog } from "../components/FlowNav/FlowNav";
import { Button } from "../components/Button/Button";
import { CreteDivider } from "../components/Deco/Deco";
import { LikertScale } from "../components/LikertScale/LikertScale";
import { MultiChoiceOption } from "../components/MultiChoiceOption/MultiChoiceOption";
import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import { transitionStep } from "../lib/nav";
import { useProfile } from "../profile/profile";
import { STEPS, type Step } from "./steps";
import styles from "./Phase2.module.css";

const isQuestion = (s: Step) =>
  s.kind === "likert" || s.kind === "single" || s.kind === "multi";

/** Illustration animée d'intro par module (maquettes 28:299 / 64:1011 / 32:338). */
const INTRO_ILLUSTRATIONS: Record<
  string,
  ComponentType<{ size?: number; className?: string }>
> = {
  Motivation: Idea,
  "Auto-efficacité": ThumbUp,
  "Type de joueur": Trophy,
};

/** Copy de l'écran de clôture (surchargé par le re-test). */
export interface DoneCopy {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
}

const DEFAULT_DONE: DoneCopy = {
  eyebrow: "Ton profil est complet",
  title: "On se connaît, maintenant.",
  text: "Tes raisons, ta confiance, ton style : ton espace est calibré. Et il continuera d’apprendre avec toi.",
  cta: "Découvrir mon espace adapté",
};

/**
 * Flow de questionnaire piloté par les données (steps.ts) : profilage
 * progressif complet par défaut, ou toute séquence de steps (re-test).
 */
export const Phase2 = ({
  onDone,
  onQuit,
  steps = STEPS,
  doneCopy = DEFAULT_DONE,
}: {
  onDone: () => void;
  /** Quitter le flux (avec confirmation) : retour à l'app. */
  onQuit?: () => void;
  steps?: Step[];
  doneCopy?: DoneCopy;
}) => {
  const { state, setPhase2Answer } = useProfile();
  const [i, setI] = useState(0);
  // Chaque étape démarre en haut de l'écran.
  useEffect(() => window.scrollTo(0, 0), [i]);
  const questionTotal = steps.filter(isQuestion).length;
  const step = steps[i];
  const quitRef = useRef<HTMLDialogElement>(null);
  // Transition latérale entre étapes (même grammaire que l'onboarding).
  const next = () =>
    transitionStep("push", () => setI((n) => Math.min(n + 1, steps.length - 1)));
  // Retour à l'étape précédente (les réponses restent enregistrées).
  const back =
    i > 0
      ? () => transitionStep("pop", () => setI((n) => Math.max(n - 1, 0)))
      : undefined;
  const askQuit = onQuit ? () => quitRef.current?.showModal() : undefined;
  const nav = (back || askQuit) && <FlowNav onBack={back} onQuit={askQuit} />;
  const quitDialog = onQuit && <QuitDialog ref={quitRef} onQuit={onQuit} />;

  if (step.kind === "done") {
    // Le contenu part du haut (règle transverse : Retour en haut, CTA en bas).
    // Médaille animée : parité avec la maquette 65:1030.
    return (
      <div className={styles.screen}>
        <div className={`${styles.content} ${styles.centerText}`}>
          <Medal size={110} className={styles.illu} />
          <p className={styles.eyebrow}>{doneCopy.eyebrow}</p>
          <h1 className={styles.title}>{doneCopy.title}</h1>
          <p className={styles.helper}>{doneCopy.text}</p>
          <CreteDivider />
        </div>
        <div className={styles.ctaZone}>
          <Button variant="primary" onClick={onDone}>
            {doneCopy.cta}
          </Button>
        </div>
      </div>
    );
  }

  // Gabarit intro / fin de chapitre (maquettes 28:299 / 28:363) : nav en haut,
  // contenu top-aligné centré, illustration du module (intro) ou carte de
  // synthèse personnalisée (feedback), CTA en bas.
  if (step.kind === "intro" || step.kind === "feedback") {
    const c = step.kind === "feedback" && step.compute ? step.compute(state) : null;
    const card = step.kind === "feedback" && step.card ? step.card(state) : null;
    const Illu = step.kind === "intro" ? INTRO_ILLUSTRATIONS[step.module] : null;
    return (
      <div className={styles.screen}>
        <div className={`${styles.content} ${styles.centerText}`}>
          {nav}
          {Illu && <Illu size={110} className={styles.illu} />}
          <p className={styles.eyebrow}>{step.eyebrow}</p>
          <h1 className={styles.titleXl}>{c?.title ?? step.title}</h1>
          <p className={styles.subtitle}>{c?.text ?? step.text}</p>
          {card && (
            <Card variant="panel" title={card.title} className={styles.recapCard}>
              {card.text}
            </Card>
          )}
        </div>
        <div className={styles.ctaZone}>
          <Button variant="primary" onClick={next}>
            {step.kind === "intro" ? "C’est parti" : "Continuer"}
          </Button>
          {step.kind === "intro" && onQuit && (
            <Button variant="ghost" onClick={onQuit}>
              Plus tard
            </Button>
          )}
        </div>
        {quitDialog}
      </div>
    );
  }

  // étape question : progression par nombre de questions
  const questionOrdinal =
    steps.slice(0, i + 1).filter(isQuestion).length;
  const progress = questionOrdinal / questionTotal;

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        {nav}
        <ProgressIndicator progress={progress}>
          Profilage · {questionOrdinal} sur {questionTotal}
        </ProgressIndicator>

        {step.kind === "likert" ? (
          <LikertScale
            legend={<span className={styles.statement}>{step.statement}</span>}
            points={step.points}
            name={step.name}
            anchorMin={step.anchorMin}
            anchorMax={step.anchorMax}
            value={typeof state.phase2?.[step.name] === "number" ? (state.phase2[step.name] as number) : undefined}
            onChange={(v) => setPhase2Answer(step.name, v)}
          />
        ) : (
          <QuestionChoice step={step} />
        )}
      </div>

      <div className={styles.ctaZone}>
        <Button
          variant="primary"
          disabled={!answered(step, state.phase2)}
          onClick={next}
        >
          Continuer
        </Button>
        {(step.module === "Toi") && (
          <Button variant="ghost" onClick={next}>
            Passer cette question
          </Button>
        )}
      </div>
      {quitDialog}
    </div>
  );
};

const answered = (
  step: Step,
  p2: Record<string, number | string | string[]> | undefined,
): boolean => {
  if (!isQuestion(step)) return true;
  const v = p2?.[(step as { name: string }).name];
  if (step.kind === "multi") return Array.isArray(v) && v.length > 0;
  return v !== undefined && v !== "";
};

/** Rendu des étapes single / multi (choix). */
const QuestionChoice = ({ step }: { step: Step }) => {
  const { state, setPhase2Answer } = useProfile();
  if (step.kind !== "single" && step.kind !== "multi") return null;
  const current = state.phase2?.[step.name];

  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: "var(--spacing-base-3)" }}>
      <legend style={{ display: "grid", gap: "var(--spacing-base-2)", paddingBottom: "var(--spacing-base-3)" }}>
        <span className={styles.eyebrow}>{step.eyebrow}</span>
        <span className={styles.statement}>{step.question}</span>
        {step.helper && <span className={styles.helper}>{step.helper}</span>}
      </legend>

      {step.kind === "single" ? (
        <div className={styles.options}>
          {step.options.map((o) => (
            <SingleChoiceOption
              key={o.value}
              name={step.name}
              checked={current === o.value}
              onChange={() => setPhase2Answer(step.name, o.value)}
            >
              {o.label}
            </SingleChoiceOption>
          ))}
        </div>
      ) : (
        <MultiGrid step={step} />
      )}
    </fieldset>
  );
};

/** Grille multi-sélection avec plafond (max) et compteur. */
const MultiGrid = ({
  step,
}: {
  step: Extract<Step, { kind: "multi" }>;
}) => {
  const { state, setPhase2Answer } = useProfile();
  const selected = (state.phase2?.[step.name] as string[] | undefined) ?? [];
  const full = selected.length >= step.max;
  const toggle = (v: string) => {
    const nextSel = selected.includes(v)
      ? selected.filter((x) => x !== v)
      : [...selected, v];
    setPhase2Answer(step.name, nextSel);
  };
  return (
    <>
      <div className={styles.grid}>
        {step.options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <MultiChoiceOption
              key={o.value}
              name={step.name}
              checked={on}
              disabled={!on && full}
              onChange={() => toggle(o.value)}
            >
              {o.label}
            </MultiChoiceOption>
          );
        })}
      </div>
      <p className={styles.counter} aria-live="polite">
        {selected.length} sur {step.max} sélectionné{selected.length > 1 ? "s" : ""}
        {full ? " · retire un choix pour en changer" : ""}
      </p>
    </>
  );
};
