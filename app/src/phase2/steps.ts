import {
  hexadType,
  motivationBalance,
  selfEfficacy,
  type ProfileState,
} from "../profile/profile";

export interface Option {
  value: string;
  label: string;
}

export type Step =
  | { kind: "intro"; module: string; eyebrow: string; title: string; text: string }
  | {
      kind: "likert";
      module: string;
      name: string;
      points: 5 | 7;
      eyebrow: string;
      statement: string;
      anchorMin: string;
      anchorMax: string;
    }
  | {
      kind: "single";
      module: string;
      name: string;
      eyebrow: string;
      question: string;
      helper?: string;
      options: Option[];
    }
  | {
      kind: "multi";
      module: string;
      name: string;
      eyebrow: string;
      question: string;
      helper?: string;
      max: number;
      options: Option[];
    }
  | {
      kind: "feedback";
      module: string;
      eyebrow: string;
      title: string;
      text: string;
      compute?: (state: ProfileState) => { title: string; text: string };
      /** Carte de synthèse personnalisée (maquette : card-moteur/filet/gamification). */
      card?: (state: ProfileState) => { title: string; text: string };
    }
  | { kind: "done"; module: string };

const AGREE = { min: "Pas du tout", max: "Tout à fait" };
const CONFIANCE = { min: "Pas sûr du tout", max: "Totalement sûr" };

export const STEPS: Step[] = [
  // ---- Motivation (SDT) ----
  {
    kind: "intro",
    module: "Motivation",
    eyebrow: "Chapitre · Tes raisons",
    title: "Pourquoi tu veux arrêter ?",
    text: "Trois phrases. Dis-nous à quel point elles te ressemblent, ton profil s’affine à chaque réponse.",
  },
  {
    kind: "likert",
    module: "Motivation",
    name: "motiv_introjectee",
    points: 7,
    eyebrow: "Tes raisons",
    statement: "« J’arrête parce que je culpabiliserais de continuer. »",
    anchorMin: AGREE.min,
    anchorMax: AGREE.max,
  },
  {
    kind: "likert",
    module: "Motivation",
    name: "motiv_identifiee",
    points: 7,
    eyebrow: "Tes raisons",
    statement: "« Parce que c’est important pour mes objectifs (santé, sport…). »",
    anchorMin: AGREE.min,
    anchorMax: AGREE.max,
  },
  {
    kind: "likert",
    module: "Motivation",
    name: "motiv_intrinseque",
    points: 7,
    eyebrow: "Tes raisons",
    statement: "« Parce que je me sentirai libre et fier de moi. »",
    anchorMin: AGREE.min,
    anchorMax: AGREE.max,
  },
  {
    kind: "feedback",
    module: "Motivation",
    eyebrow: "Ce qu’on apprend",
    title: "Tu le fais d’abord pour toi.",
    text: "L’app va nourrir cette énergie, pas te faire la morale.",
    compute: (s) => {
      const b = motivationBalance(s.phase2);
      return b !== undefined && b < 0
        ? {
            title: "On avance à ton rythme.",
            text: "Au début, on s’appuiera sur des récompenses concrètes, puis on reconnectera à ce qui compte vraiment pour toi.",
          }
        : {
            title: "Tu le fais d’abord pour toi.",
            text: "Ta motivation vient de l’intérieur : c’est le meilleur prédicteur de réussite. On va nourrir cette énergie.",
          };
    },
    card: (s) => {
      const b = motivationBalance(s.phase2);
      return {
        title: "Ton moteur principal",
        text:
          b !== undefined && b < 0
            ? "Des récompenses concrètes pour commencer, puis on reconnectera à ce qui compte vraiment pour toi."
            : "Être fier de toi et te sentir libre. On te proposera des défis qui te le rappellent au bon moment.",
      };
    },
  },
  // ---- Auto-efficacité (SASEQ) ----
  {
    kind: "intro",
    module: "Auto-efficacité",
    eyebrow: "Chapitre · Ta confiance",
    title: "Confiant face aux pièges ?",
    text: "Trois situations à risque. Réponds sans bluff : on renforcera tes points chauds.",
  },
  {
    kind: "likert",
    module: "Auto-efficacité",
    name: "saseq_stress",
    points: 5,
    eyebrow: "Ta confiance",
    statement: "« Tu tiens sans fumer quand tu es stressé ou anxieux. »",
    anchorMin: CONFIANCE.min,
    anchorMax: CONFIANCE.max,
  },
  {
    kind: "likert",
    module: "Auto-efficacité",
    name: "saseq_soiree",
    points: 5,
    eyebrow: "Ta confiance",
    statement: "« … quand tu bois un verre en soirée. »",
    anchorMin: CONFIANCE.min,
    anchorMax: CONFIANCE.max,
  },
  {
    kind: "likert",
    module: "Auto-efficacité",
    name: "saseq_entourage",
    points: 5,
    eyebrow: "Ta confiance",
    statement: "« … quand tu es entouré de fumeurs. »",
    anchorMin: CONFIANCE.min,
    anchorMax: CONFIANCE.max,
  },
  {
    kind: "feedback",
    module: "Auto-efficacité",
    eyebrow: "Ce qu’on apprend",
    title: "On repère tes points chauds.",
    text: "C’est là qu’on sera le plus présent, avec des outils courts au bon moment.",
    compute: (s) => {
      const e = selfEfficacy(s.phase2);
      return e !== undefined && e < 3
        ? {
            title: "On avance en douceur.",
            text: "Tu doutes un peu, c’est normal. On mise sur des micro-victoires et un filet de sécurité, jamais sur la pression.",
          }
        : {
            title: "Tu te sens solide.",
            text: "Belle confiance. On garde des outils sous la main pour les moments qui piquent quand même.",
          };
    },
    card: (s) => {
      const e = selfEfficacy(s.phase2);
      return {
        title: "Ton filet de sécurité",
        text:
          e !== undefined && e < 3
            ? "Micro-victoires, respiration guidée et distractions express : un filet toujours sous la main, jamais de pression."
            : "Respiration guidée et distractions express dans tes moments à risque.",
      };
    },
  },
  // ---- Hexad ----
  {
    kind: "intro",
    module: "Type de joueur",
    eyebrow: "Chapitre · Ton style de jeu",
    title: "Qu’est-ce qui te fait jouer ?",
    text: "Trois phrases pour calibrer tes défis. On construit une expérience qui te ressemble.",
  },
  {
    kind: "likert",
    module: "Type de joueur",
    name: "hexad_battant",
    points: 7,
    eyebrow: "Ton style de jeu",
    statement: "« J’aime relever des défis et progresser. »",
    anchorMin: AGREE.min,
    anchorMax: AGREE.max,
  },
  {
    kind: "likert",
    module: "Type de joueur",
    name: "hexad_sociable",
    points: 7,
    eyebrow: "Ton style de jeu",
    statement: "« Interagir avec les autres me motive. »",
    anchorMin: AGREE.min,
    anchorMax: AGREE.max,
  },
  {
    kind: "likert",
    module: "Type de joueur",
    name: "hexad_joueur",
    points: 7,
    eyebrow: "Ton style de jeu",
    statement: "« Les points et les récompenses me motivent. »",
    anchorMin: AGREE.min,
    anchorMax: AGREE.max,
  },
  {
    kind: "feedback",
    module: "Type de joueur",
    eyebrow: "Ce qu’on apprend",
    title: "On calibre ton jeu.",
    text: "Tes défis vont s’adapter à ce qui te motive vraiment.",
    compute: (s) => {
      const t = hexadType(s.phase2);
      const map: Record<string, string> = {
        Battant: "Profil Battant : des objectifs à gravir, des paliers et des badges de maîtrise.",
        Sociable: "Profil Sociable : de l’entraide et des défis à partager.",
        Joueur: "Profil Joueur : des séries, des récompenses fréquentes et de la surprise.",
      };
      return {
        title: t ? `Toi, tu es plutôt ${t}.` : "On calibre ton jeu.",
        text: (t && map[t]) || "Tes défis vont s’adapter à ce qui te motive.",
      };
    },
    card: (s) => {
      const t = hexadType(s.phase2);
      const map: Record<string, string> = {
        Battant: "Objectifs personnels, niveaux, badges de maîtrise.",
        Sociable: "Entraide, défis à partager, ton allié dans la boucle.",
        Joueur: "Séries, récompenses fréquentes et surprises.",
      };
      return {
        title: "Ta gamification",
        text: (t && map[t]) || "Objectifs personnels, niveaux, badges de maîtrise.",
      };
    },
  },
  // ---- Toi (optionnel) ----
  {
    kind: "single",
    module: "Toi",
    name: "toi_age",
    eyebrow: "Toi",
    question: "Ton âge ?",
    helper: "Optionnel : pour des contenus plus justes.",
    options: [
      { value: "-18", label: "Moins de 18 ans" },
      { value: "18-24", label: "18 à 24 ans" },
      { value: "25-34", label: "25 à 34 ans" },
      { value: "35-44", label: "35 à 44 ans" },
      { value: "45-54", label: "45 à 54 ans" },
      { value: "55+", label: "55 ans et plus" },
    ],
  },
  {
    kind: "single",
    module: "Toi",
    name: "toi_sexe",
    eyebrow: "Toi",
    question: "Tu es…",
    helper: "Optionnel : certains contenus santé diffèrent selon les corps.",
    options: [
      { value: "femme", label: "Une femme" },
      { value: "homme", label: "Un homme" },
      { value: "autre", label: "Autre / non-binaire" },
      { value: "nsp", label: "Je préfère ne pas le dire" },
    ],
  },
  // ---- Contexte social ----
  {
    kind: "single",
    module: "Contexte",
    name: "social_entourage",
    eyebrow: "Ton entourage",
    question: "Combien de proches fument autour de toi ?",
    helper: "Ton environnement compte dans ta stratégie.",
    options: [
      { value: "0", label: "Personne" },
      { value: "1-2", label: "1 ou 2" },
      { value: "3-5", label: "3 à 5" },
      { value: "beaucoup", label: "Beaucoup" },
    ],
  },
  {
    kind: "multi",
    module: "Contexte",
    name: "social_moments",
    eyebrow: "Tes moments à risque",
    question: "Quand la clope t’appelle le plus ?",
    helper: "Choisis jusqu’à 5 moments. On sera là pile à ces moments-là.",
    max: 5,
    options: [
      { value: "reveil", label: "Réveil" },
      { value: "cafe", label: "Café" },
      { value: "pause", label: "Pause" },
      { value: "trajet", label: "Trajet" },
      { value: "repas", label: "Repas" },
      { value: "soiree", label: "Soirée" },
      { value: "stress", label: "Stress" },
      { value: "ennui", label: "Ennui" },
      { value: "alcool", label: "Alcool" },
      { value: "social", label: "Entre amis" },
    ],
  },
  { kind: "done", module: "Clôture" },
];

/**
 * « Refaire le point (3 min) » — re-test périodique des échelles clés
 * (doc 04 § macro-feedback) : motivation (le ratio doit s'internaliser)
 * et auto-efficacité SASEQ (prédicteur de rechute, doit monter).
 * Réutilise les questions de la Phase 2, jamais de duplication.
 */
export const RETEST_STEPS: Step[] = [
  {
    kind: "intro",
    module: "Retest",
    eyebrow: "On refait le point",
    title: "Trois minutes pour recalibrer.",
    text: "Tes raisons et ta confiance bougent avec le temps. Redis-nous où tu en es : l'app se recale dessus.",
  },
  ...STEPS.filter(
    (s) =>
      (s.module === "Motivation" || s.module === "Auto-efficacité") &&
      s.kind !== "intro",
  ),
  { kind: "done", module: "Retest" },
];

/**
 * Mission « Repère tes moments à risque » (préparation) : rouvre la question
 * social_moments de la Phase 2 telle quelle — réutilisation, jamais de
 * duplication. La mission se coche via la donnée (moments déclarés).
 */
export const MOMENTS_STEPS: Step[] = [
  ...STEPS.filter((s) => s.kind === "multi" && s.name === "social_moments"),
  { kind: "done", module: "Contexte" },
];

/**
 * « Ton profil psychologique » (mission de préparation ET écran /profilage) :
 * UNIQUEMENT les 3 mini-tunnels psychométriques — Motivation (« Pourquoi tu
 * veux arrêter ? »), Auto-efficacité (« Confiant face aux pièges ? ») et Type
 * de joueur (« Qu’est-ce qui te fait jouer ? »). Pas d'âge/sexe/entourage ni
 * de moments à risque : ceux-ci ont leurs propres écrans.
 */
const PROFIL_MODULES = ["Motivation", "Auto-efficacité", "Type de joueur"];

export const PROFIL_STEPS: Step[] = [
  ...STEPS.filter((s) => PROFIL_MODULES.includes(s.module)),
  { kind: "done", module: "Clôture" },
];

/** Champs (échelles Likert) écrits par le profil psy — servent à le réinitialiser. */
export const PROFIL_FIELDS: string[] = PROFIL_STEPS.filter(
  (s): s is Extract<Step, { kind: "likert" }> => s.kind === "likert",
).map((s) => s.name);

/**
 * Mission « Les fumeurs autour de toi » (préparation) : rouvre la question
 * social_entourage de la Phase 2 telle quelle. Se coche via la donnée.
 */
export const ENTOURAGE_STEPS: Step[] = [
  ...STEPS.filter((s) => s.kind === "single" && s.name === "social_entourage"),
  { kind: "done", module: "Contexte" },
];
