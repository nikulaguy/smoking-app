import { useEffect, useRef, useState } from "react";
import { FlowNav, QuitDialog } from "../components/FlowNav/FlowNav";
import { Button } from "../components/Button/Button";
import { CreteDivider } from "../components/Deco/Deco";
import { Hero } from "../components/Hero/Hero";
import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator";
import { SelectField } from "../components/SelectField/SelectField";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import { StatMetric } from "../components/StatMetric/StatMetric";
import { TextField } from "../components/TextField/TextField";
import { Rocket } from "../components/Illustrations/Illustrations";
import { transitionStep } from "../lib/nav";
import { ConnexionRapide } from "./ConnexionRapide";
import { ConseilsDate } from "./ConseilsDate";
import {
  costPerCigarette,
  useProfile,
  type OnboardingAnswers,
} from "../profile/profile";
import styles from "./Onboarding.module.css";

const RANGES = [
  { value: "-5", label: "Moins de 5" },
  { value: "5-10", label: "5 à 10" },
  { value: "11-20", label: "11 à 20" },
  { value: "21-30", label: "21 à 30" },
  { value: "30+", label: "Plus de 30" },
] as const;

const YEARS = RANGES.map((r) => ({
  value: r.value,
  label: r.value === "-5" ? "Moins de 5 ans" : `${r.label} ans`,
}));

const CIGS_MIDPOINT: Record<string, number> = {
  "-5": 3,
  "5-10": 7.5,
  "11-20": 15,
  "21-30": 25,
  "30+": 35,
};

/** Navigation de flux : revenir en arrière / quitter (avec confirmation). */
export interface FlowProps {
  onBack?: () => void;
  onQuit?: () => void;
  /** Mode détail (check-list de prépa) : libellé du CTA (« Valider »). */
  nextLabel?: string;
  /** Mode détail : « Annuler » (ghost) — revient sans garder les modifs. */
  onCancel?: () => void;
}

type StepId =
  | "welcome"
  | "conso"
  | "date"
  | "joints"
  | "hsi"
  | "phrase"
  | "ready";

const SEQUENCE: StepId[] = [
  "welcome",
  "conso",
  "date",
  "joints",
  "hsi",
  "phrase",
  "ready",
];

/** Parcours d'onboarding Jour 0 (docs/02-questionnaire.md, Phase 1). */
export const Onboarding = ({ onDone }: { onDone?: () => void }) => {
  const [step, setStep] = useState<StepId>("welcome");
  const quitRef = useRef<HTMLDialogElement>(null);
  // Chaque étape démarre en haut de l'écran.
  useEffect(() => window.scrollTo(0, 0), [step]);
  // Transition latérale entre étapes : la suivante entre par la droite,
  // la précédente ressort en sens inverse (grammaire push/pop, nav.ts).
  const next = () =>
    transitionStep("push", () =>
      setStep((s) => SEQUENCE[Math.min(SEQUENCE.indexOf(s) + 1, SEQUENCE.length - 1)]),
    );
  const prev = () =>
    transitionStep("pop", () =>
      setStep((s) => SEQUENCE[Math.max(SEQUENCE.indexOf(s) - 1, 0)]),
    );
  const askQuit = () => quitRef.current?.showModal();
  // Les réponses sont enregistrées au fil de l'eau : quitter ramène à
  // l'accueil, reprendre l'onboarding retrouve tout.
  const flow = { onBack: prev, onQuit: askQuit };

  const screen = (() => {
    switch (step) {
      case "welcome":
        return <Welcome onNext={next} />;
      case "conso":
        return <Conso onNext={next} {...flow} />;
      case "date":
        return <DateChoice onNext={next} {...flow} />;
      case "joints":
        return <Joints onNext={next} {...flow} />;
      case "hsi":
        return <Hsi onNext={next} {...flow} />;
      case "phrase":
        return <Phrase onNext={next} {...flow} />;
      case "ready":
        return <Ready onDone={onDone} {...flow} />;
    }
  })();

  return (
    <>
      {screen}
      <QuitDialog ref={quitRef} onQuit={() => setStep("welcome")} />
    </>
  );
};

const Welcome = ({ onNext }: { onNext: () => void }) => {
  const connexionRef = useRef<HTMLDialogElement>(null);
  return (
    <div className={styles.screen}>
      <Hero className={styles.welcomeHero} creteHeight={150} flag>
        <p className={styles.heroEyebrow}>Ton compagnon d’ascension</p>
        <h1 className={styles.heroTitle}>
          Arrête de fumer,
          <br />à ta façon.
        </h1>
        <p className={styles.heroHelper}>
          Deux minutes pour apprendre à te connaître, et l’app s’adapte à toi.
          Pas de leçon, pas de jugement.
        </p>
      </Hero>
      <div className={styles.ctaZone}>
        <Button variant="primary" onClick={onNext}>
          Commencer l’ascension
        </Button>
        {/* Déjà un compte (maquette 7:163) : lien magique sans quitter
            l'accueil. Compte rempli = l'app s'ouvre directement après le
            retour du mail ; compte vide = l'onboarding continue, connecté. */}
        <Button
          variant="secondary"
          onClick={() => connexionRef.current?.showModal()}
        >
          Se connecter
        </Button>
        <p className={styles.caption}>3 minutes · gratuit · sans compte</p>
      </div>
      <ConnexionRapide ref={connexionRef} />
    </div>
  );
};

export const Conso = ({ onNext, onBack, onQuit, nextLabel, onCancel }: { onNext: () => void } & FlowProps) => {
  const { answers, setAnswer } = useProfile();
  const type = answers.tobaccoType;
  const defaultPrice = type === "rolling" ? 16.5 : 12.5;
  const price = answers.packPrice ?? defaultPrice;
  const complete =
    type !== undefined &&
    answers.cigsPerDay !== undefined &&
    answers.yearsSmoking !== undefined &&
    price > 0;

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        {(onBack || onQuit) && <FlowNav onBack={onBack} onQuit={onQuit} />}
        <ProgressIndicator progress={1 / 3}>Étape 1 sur 3</ProgressIndicator>
        <div className={styles.qblock}>
          <p className={styles.eyebrow}>Ton tabac</p>
          <h1 className={styles.title}>Parlons de ta conso.</h1>
        </div>
        <fieldset className={styles.options} style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className={styles.helper} style={{ paddingBottom: 8 }}>
            Tu fumes plutôt…
          </legend>
          <div className={styles.typeRow}>
            <SingleChoiceOption
              name="type"
              checked={type === "cigarettes"}
              onChange={() => setAnswer("tobaccoType", "cigarettes")}
            >
              Cigarettes
            </SingleChoiceOption>
            <SingleChoiceOption
              name="type"
              checked={type === "rolling"}
              onChange={() => setAnswer("tobaccoType", "rolling")}
            >
              À rouler
            </SingleChoiceOption>
          </div>
        </fieldset>
        <SelectField
          label={type === "rolling" ? "Cigarettes roulées par jour" : "Cigarettes par jour"}
          selectorTitle="Combien de cigarettes par jour ?"
          options={[...RANGES]}
          value={answers.cigsPerDay}
          onChange={(v) => setAnswer("cigsPerDay", v as OnboardingAnswers["cigsPerDay"])}
        />
        <TextField
          label={type === "rolling" ? "Prix de ton pot de tabac" : "Prix de ton paquet"}
          inputMode="decimal"
          value={String(price)}
          onChange={(e) => setAnswer("packPrice", Number(e.target.value) || 0)}
          caption={
            type === "rolling"
              ? "Pot de 30 g, soit environ 40 cigarettes. Ajuste si besoin."
              : "Prix moyen en France. Ajuste si besoin."
          }
        />
        <SelectField
          label="Tu fumes depuis"
          selectorTitle="Depuis quand tu fumes ?"
          options={YEARS}
          value={answers.yearsSmoking}
          onChange={(v) => setAnswer("yearsSmoking", v as OnboardingAnswers["yearsSmoking"])}
        />
      </div>
      <div className={styles.ctaZone}>
        <Button
          variant="primary"
          disabled={!complete}
          onClick={() => {
            // committe le prix pré-rempli s'il n'a pas été édité
            if (answers.packPrice === undefined) setAnswer("packPrice", defaultPrice);
            onNext();
          }}
        >
          {nextLabel ?? "Continuer"}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
};

export const DateChoice = ({ onNext, onBack, onQuit, nextLabel, onCancel }: { onNext: () => void } & FlowProps) => {
  const { answers, setAnswer } = useProfile();
  const conseilsRef = useRef<HTMLDialogElement>(null);
  const options: { value: NonNullable<OnboardingAnswers["quitDate"]>; label: string }[] = [
    { value: "tomorrow", label: "Demain" },
    { value: "3days", label: "Dans 3 jours" },
    { value: "weekend", label: "Ce week-end" },
    { value: "2weeks", label: "Dans 2 semaines" },
    { value: "custom", label: "Une autre date" },
    { value: "already", label: "J’ai déjà arrêté" },
  ];
  const isCustom = answers.quitDate === "custom";
  const isAlready = answers.quitDate === "already";
  const needsDate = isCustom || isAlready;
  // custom : borne min = demain (arrêter « aujourd'hui » n'a pas de sens
  // rétroactif) ; already : borne max = aujourd'hui (l'arrêt est passé).
  const minDate = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  // une date enregistrée pour l'autre branche (passée vs à venir) ne vaut pas
  const storedDate = answers.customQuitDate ?? "";
  const dateOk = isAlready ? storedDate <= today : storedDate >= minDate;
  const canContinue =
    answers.quitDate !== undefined &&
    (!needsDate || (Boolean(storedDate) && dateOk));
  return (
    <QuestionScreen
      progress={{ label: "Étape 2 sur 3", value: 2 / 3 }}
      eyebrow="Ta date"
      title="On vise quand ?"
      helper="Assez proche pour rester motivé, assez loin pour te préparer. Et si c’est déjà fait, bravo : on reprend ton ascension en cours."
      helperExtra={
        <Button
          variant="ghost"
          onClick={() => conseilsRef.current?.showModal()}
        >
          Des conseils pour choisir une date ?
        </Button>
      }
      canContinue={canContinue}
      onNext={onNext}
      onBack={onBack}
      onQuit={onQuit}
      ctaLabel={nextLabel ?? (needsDate ? "Valider ma date" : "Continuer")}
      onCancel={onCancel}
    >
      {options.map((o) => (
        <SingleChoiceOption
          key={o.value}
          name="date"
          checked={answers.quitDate === o.value}
          onChange={() => setAnswer("quitDate", o.value)}
        >
          {o.label}
        </SingleChoiceOption>
      ))}
      {isCustom && (
        <TextField
          label="Ta date"
          type="date"
          min={minDate}
          value={storedDate}
          caption="Une date à venir, proche de préférence."
          onChange={(e) => setAnswer("customQuitDate", e.target.value)}
        />
      )}
      {isAlready && (
        <TextField
          label="Depuis quand ?"
          type="date"
          max={today}
          value={storedDate}
          caption="Le jour de ta dernière cigarette : tes compteurs reprennent depuis ce jour-là."
          onChange={(e) => setAnswer("customQuitDate", e.target.value)}
        />
      )}
      <ConseilsDate ref={conseilsRef} />
    </QuestionScreen>
  );
};

export const Joints = ({ onNext, onBack, onQuit, nextLabel, onCancel }: { onNext: () => void } & FlowProps) => {
  const { answers, setAnswer } = useProfile();
  const options: { value: NonNullable<OnboardingAnswers["cannabis"]>; label: string }[] = [
    { value: "regular", label: "Oui, régulièrement" },
    { value: "sometimes", label: "De temps en temps" },
    { value: "never", label: "Non, jamais" },
    { value: "skip", label: "Je préfère ne pas répondre" },
  ];
  return (
    <QuestionScreen
      eyebrow="Ton tabac"
      title="Tu fumes aussi des joints ?"
      helper="Sans jugement : le tabac des joints compte aussi dans ta dépendance. Ta réponse reste privée."
      canContinue={answers.cannabis !== undefined}
      onNext={onNext}
      onBack={onBack}
      onQuit={onQuit}
      ctaLabel={nextLabel}
      onCancel={onCancel}
    >
      {options.map((o) => (
        <SingleChoiceOption
          key={o.value}
          name="cannabis"
          checked={answers.cannabis === o.value}
          onChange={() => setAnswer("cannabis", o.value)}
        >
          {o.label}
        </SingleChoiceOption>
      ))}
    </QuestionScreen>
  );
};

export const Hsi = ({ onNext, onBack, onQuit, nextLabel, onCancel }: { onNext: () => void } & FlowProps) => {
  const { answers, setAnswer } = useProfile();
  const options: { value: 0 | 1 | 2 | 3; label: string }[] = [
    { value: 3, label: "Dans les 5 minutes" },
    { value: 2, label: "6 à 30 minutes" },
    { value: 1, label: "31 à 60 minutes" },
    { value: 0, label: "Après 60 minutes" },
  ];
  return (
    <QuestionScreen
      progress={{ label: "Étape 3 sur 3", value: 1 }}
      eyebrow="Ta dépendance"
      title="Le matin, combien de temps après ton réveil fumes-tu ta première cigarette ?"
      canContinue={answers.hsiFirstCig !== undefined}
      onNext={onNext}
      onBack={onBack}
      onQuit={onQuit}
      ctaLabel={nextLabel}
      onCancel={onCancel}
    >
      {options.map((o) => (
        <SingleChoiceOption
          key={o.value}
          name="hsi"
          checked={answers.hsiFirstCig === o.value}
          onChange={() => setAnswer("hsiFirstCig", o.value)}
        >
          {o.label}
        </SingleChoiceOption>
      ))}
    </QuestionScreen>
  );
};

export const Phrase = ({ onNext, onBack, onQuit, nextLabel, onCancel }: { onNext: () => void } & FlowProps) => {
  const { answers, setAnswer } = useProfile();
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        {(onBack || onQuit) && <FlowNav onBack={onBack} onQuit={onQuit} />}
        <div className={styles.qblock}>
          <p className={styles.eyebrow}>Ta phrase</p>
          <h1 className={styles.title}>En une phrase : pourquoi tu arrêtes ?</h1>
          <p className={styles.helper}>
            Optionnel, mais puissant : c’est toi qu’on citera aux moments
            difficiles.
          </p>
        </div>
        <div className={styles.options}>
          <label className={styles.helper} htmlFor="phrase">
            Ta phrase à toi
          </label>
          <div style={{ display: "grid" }}>
            <textarea
              id="phrase"
              className={styles.phraseInput}
              placeholder="« Je veux monter les escaliers sans y penser. »"
              maxLength={120}
              value={answers.phrase ?? ""}
              onChange={(e) => setAnswer("phrase", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" onClick={onNext}>
          {nextLabel ?? "Continuer"}
        </Button>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        ) : (
          <Button variant="ghost" onClick={onNext}>
            Passer
          </Button>
        )}
      </div>
    </div>
  );
};

/** Bénéfices universels affichés au bout de la Phase 1 (source Figma 8:231). */
const BENEFITS = [
  {
    title: "Je veux économiser de l’argent",
    text: "Ton compteur démarre aujourd’hui. Chaque cigarette non fumée compte.",
  },
  {
    title: "Ma priorité est ma santé",
    text: "Tes premiers bénéfices arrivent dès 20 minutes après la dernière cigarette.",
  },
];

const Ready = ({ onDone, onBack, onQuit }: { onDone?: () => void } & FlowProps) => {
  const { answers } = useProfile();
  const perDay = CIGS_MIDPOINT[answers.cigsPerDay ?? "11-20"];
  const cost = costPerCigarette(answers) ?? 0.6;
  const daily = perDay * cost;
  return (
    <div className={styles.screen}>
      {/* Contenu top-aligné : Retour en haut, CTA en bas (maquette 8:231). */}
      <div className={styles.content}>
        {(onBack || onQuit) && <FlowNav onBack={onBack} onQuit={onQuit} />}
        <div className={styles.ready}>
          <div className={styles.readyIntro}>
            <Rocket size={92} />
            <p className={styles.eyebrow}>Ton profil est prêt</p>
          </div>
          <div className={styles.readyTitles}>
            <h1 className={styles.titleXl}>C’est parti.</h1>
            <p className={styles.subtitle}>Ton espace s’adapte déjà à toi.</p>
          </div>
          <div className={styles.statsRow}>
            <StatMetric size="compact" metricLabel="dans ta poche, chaque jour">
              {daily.toFixed(2).replace(".", ",")} €
            </StatMetric>
            <StatMetric size="compact" metricLabel="clopes évitées chaque jour">
              {Math.round(perDay)}
            </StatMetric>
          </div>
          {answers.phrase && (
            <figure className={styles.phrasePanel}>
              <blockquote className={styles.phraseQuote}>
                « {answers.phrase} »
              </blockquote>
              <figcaption className={styles.phraseWho}>Toi, au jour 0</figcaption>
              <CreteDivider />
            </figure>
          )}
          <div className={styles.benefits}>
            {BENEFITS.map((b) => (
              /* Blocs d'information, pas de navigation : ni flèche ni clic
                 (maquette 8:231). */
              <section key={b.title} className={styles.benefit}>
                <h2 className={styles.benefitTitle}>{b.title}</h2>
                <p className={styles.benefitText}>{b.text}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" onClick={onDone}>
          Découvrir mon espace
        </Button>
      </div>
    </div>
  );
};

/** Gabarit d'écran question : progress, question-block, options, CTA. */
const QuestionScreen = ({
  progress,
  eyebrow,
  title,
  helper,
  helperExtra,
  children,
  canContinue,
  onNext,
  onBack,
  onQuit,
  onCancel,
  ctaLabel = "Continuer",
}: {
  progress?: { label: string; value: number };
  eyebrow: string;
  title: string;
  helper?: string;
  /** Action secondaire affichée sous le texte d'aide (ex. lien conseils). */
  helperExtra?: React.ReactNode;
  children: React.ReactNode;
  canContinue: boolean;
  onNext: () => void;
  ctaLabel?: string;
} & FlowProps) => (
  <div className={styles.screen}>
    <div className={styles.content}>
      {(onBack || onQuit) && <FlowNav onBack={onBack} onQuit={onQuit} />}
      {progress && (
        <ProgressIndicator progress={progress.value}>
          {progress.label}
        </ProgressIndicator>
      )}
      <div className={styles.qblock}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {helper && <p className={styles.helper}>{helper}</p>}
        {helperExtra}
      </div>
      <fieldset
        className={styles.options}
        style={{ border: 0, padding: 0, margin: 0 }}
      >
        <legend
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            margin: -1,
            clipPath: "inset(50%)",
            overflow: "hidden",
          }}
        >
          {title}
        </legend>
        {children}
      </fieldset>
    </div>
    <div className={styles.ctaZone}>
      <Button variant="primary" disabled={!canContinue} onClick={onNext}>
        {ctaLabel}
      </Button>
      {onCancel && (
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      )}
    </div>
  </div>
);
