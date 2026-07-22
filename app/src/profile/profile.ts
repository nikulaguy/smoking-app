import { createContext, useContext } from "react";

/** Réponses du Jour 0 (onboarding express) — voir docs/02-questionnaire.md. */
export interface OnboardingAnswers {
  /** 0.0 — type de tabac. */
  tobaccoType?: "cigarettes" | "rolling";
  /** 0.1 — tranche de cigarettes par jour (bornes alignées scoring HSI). */
  cigsPerDay?: "-5" | "5-10" | "11-20" | "21-30" | "30+";
  /** 0.2 — prix du paquet (ou du pot de 30 g). */
  packPrice?: number;
  /** 0.4 — tranche d'ancienneté. */
  yearsSmoking?: "-5" | "5-10" | "11-20" | "21-30" | "30+";
  /** 0.5 — choix de date (« already » = a déjà arrêté avant d'installer l'app). */
  quitDate?: "tomorrow" | "3days" | "weekend" | "2weeks" | "custom" | "already";
  /** 0.5b — date précise (ISO YYYY-MM-DD) : à venir (custom) ou passée (already). */
  customQuitDate?: string;
  /** 0.6 — co-consommation cannabis (optionnel, privé). */
  cannabis?: "regular" | "sometimes" | "never" | "skip";
  /** 1.1 — HSI : délai avant la première cigarette du matin (points 0-3). */
  hsiFirstCig?: 0 | 1 | 2 | 3;
  /** 0.7 — « ta phrase » (optionnel). */
  phrase?: string;
}

/** Réponses de la Phase 2 (profilage progressif), indexées par nom de question. */
export type Phase2Answers = Record<string, number | string | string[]>;

/** État persisté du profil : réponses + dates calculées à la fin de l'onboarding. */
export interface ProfileState {
  answers: OnboardingAnswers;
  /** Jour d'arrêt (ISO, minuit local) — sa présence marque l'onboarding terminé. */
  quitAt?: string;
  /** Date de création du profil (ISO). */
  createdAt?: string;
  /** Réponses du profilage progressif (Phase 2). */
  phase2?: Phase2Answers;
  /** Phase 2 terminée. */
  phase2Complete?: boolean;
  /** Signal JITAI : usages et efficacité perçue des outils anti-envie. */
  toolStats?: Record<string, ToolStats>;
  /** Glissades déclarées (signal EMA majeur, doc 04 : mode soutien). */
  slips?: Slip[];
  /** Dernière ouverture de l'app (ISO) — détection du retour après absence. */
  lastSeenAt?: string;
  /** Compte optionnel et différé (doc 06) — synchronisé quand connecté. */
  account?: Account;
  /** Horodatage de la dernière écriture locale (fusion de sync : le plus récent gagne). */
  revisedAt?: string;
  /** Préférences de notifications (doc 04 : le rythme appartient à l'utilisateur). */
  notifPrefs?: NotifPrefs;
  /** Jours (YYYY-MM-DD) où le défi du jour a été déclaré relevé (confiance, doc 06). */
  defisDone?: string[];
  /** Missions de préparation cochées manuellement (phase prep, onglet Défis). */
  prepChecklist?: string[];
  /** Confettis de check-list complète déjà joués (rejoués à chaque re-complétion). */
  prepCelebrated?: boolean;
  /** L'allié prévenu pour le jour J (mission « Préviens un proche »). */
  prepAlly?: PrepAlly;
  /** Thème d'affichage (clair / sombre / suit le système). */
  theme?: ThemePref;
}

/** Le proche qui soutient le jour J. Données locales, jamais transmises. */
export interface PrepAlly {
  name?: string;
  phone?: string;
}

/** Préférence de thème. « system » suit `prefers-color-scheme`. */
export type ThemePref = "light" | "dark" | "system";

/** Préférences de notifications — jamais compulsives (anti-métriques doc 04). */
export interface NotifPrefs {
  /** Interrupteur global : false = plus AUCUNE notification (défaut true). */
  enabled?: boolean;
  rhythm?: "discret" | "equilibre" | "rapproche";
  /** Rappels JITAI aux moments à risque déclarés (social_moments). */
  riskReminders?: boolean;
  /** Canaux de réception (cumulables). */
  channels?: NotifChannels;
}

/**
 * Canaux de notification :
 * - local : sur CET appareil, sans compte (app ouverte — limite web assumée) ;
 * - push : tous les appareils abonnés (compte requis) ;
 * - email : par mail (compte requis).
 */
export interface NotifChannels {
  local?: boolean;
  push?: boolean;
  email?: boolean;
}

/** Infos de compte : jamais requises, le prénom ne sert qu'au ton. */
export interface Account {
  firstName?: string;
  email?: string;
}

/**
 * Une glissade déclarée. Règle produit (doc 06) : elle ne remet JAMAIS un
 * compteur à zéro à l'écran — les acquis restent gravis, seul le cadrage
 * du hero change (la remontée).
 */
export interface Slip {
  /** Date de la déclaration (ISO). */
  at: string;
  /** Ampleur déclarée — « regular » déclenche l'orientation vers une aide humaine. */
  kind: "one" | "several" | "regular";
}

/** Statistiques d'un outil anti-envie (boucle de feedback, doc 04). */
export interface ToolStats {
  /** Nombre d'utilisations. */
  used: number;
  /** Somme des feedbacks (oui = 1, un peu = 0.5, non = 0). */
  helped: number;
}

/** Points HSI de la tranche quotidienne (item 1.2, dérivé de 0.1). */
export const HSI_CIGS_POINTS: Record<
  NonNullable<OnboardingAnswers["cigsPerDay"]>,
  number
> = { "-5": 0, "5-10": 0, "11-20": 1, "21-30": 2, "30+": 3 };

/** Nombre de cigarettes/jour représentatif d'une tranche (pour les compteurs). */
export const CIGS_MIDPOINT: Record<
  NonNullable<OnboardingAnswers["cigsPerDay"]>,
  number
> = { "-5": 3, "5-10": 7.5, "11-20": 15, "21-30": 25, "30+": 35 };

/** Score HSI (0-6) : dépendance faible (0-1), modérée (2-4), forte (5-6). */
export const hsiScore = (a: OnboardingAnswers): number | undefined =>
  a.hsiFirstCig === undefined || a.cigsPerDay === undefined
    ? undefined
    : a.hsiFirstCig + HSI_CIGS_POINTS[a.cigsPerDay];

/** Coût moyen d'une cigarette (tabac a rouler : pot de 30 g ≈ 40 cigarettes). */
export const costPerCigarette = (a: OnboardingAnswers): number | undefined =>
  a.packPrice === undefined || a.tobaccoType === undefined
    ? undefined
    : a.tobaccoType === "rolling"
      ? a.packPrice / 40
      : a.packPrice / 20;

/** Cigarettes évitées par jour, selon la conso déclarée. */
export const cigsPerDay = (a: OnboardingAnswers): number =>
  CIGS_MIDPOINT[a.cigsPerDay ?? "11-20"];

/** Coût quotidien du tabac (€/jour). */
export const dailyCost = (a: OnboardingAnswers): number =>
  cigsPerDay(a) * (costPerCigarette(a) ?? 0.6);

/** Formatage € sans décimales (compteurs). */
export const euroSaved = (n: number): string =>
  `${n.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;

const DAY_MS = 86_400_000;
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** Résout le choix de date en une vraie date d'arrêt (minuit local). */
export const resolveQuitAt = (
  choice: OnboardingAnswers["quitDate"],
  customDate?: string,
  from = new Date(),
): Date => {
  const base = startOfDay(from);
  switch (choice) {
    case "tomorrow":
      return new Date(base.getTime() + DAY_MS);
    case "3days":
      return new Date(base.getTime() + 3 * DAY_MS);
    case "weekend": {
      // prochain samedi (0 = dimanche, 6 = samedi)
      const days = (6 - base.getDay() + 7) % 7 || 7;
      return new Date(base.getTime() + days * DAY_MS);
    }
    case "2weeks":
      return new Date(base.getTime() + 14 * DAY_MS);
    case "custom":
      // date choisie au picker (locale, minuit) ; repli à 1 semaine si vide
      return customDate
        ? startOfDay(new Date(`${customDate}T00:00:00`))
        : new Date(base.getTime() + 7 * DAY_MS);
    case "already":
      // déjà arrêté : la date d'arrêt est passée, l'app démarre directement
      // en phase ascension et tous les compteurs courent depuis ce jour-là.
      return customDate
        ? startOfDay(new Date(`${customDate}T00:00:00`))
        : base;
    default:
      return new Date(base.getTime() + 7 * DAY_MS);
  }
};

/** Modèle prêt à afficher pour le dashboard, dérivé de l'état et de l'instant. */
export interface DashboardModel {
  /** Avant le jour d'arrêt : phase de préparation. */
  phase: "prep" | "climb";
  /** Numéro de jour depuis l'arrêt (1 = jour d'arrêt). Négatif ou 0 avant. */
  dayNumber: number;
  /** Jours restants avant l'arrêt (phase prep). */
  daysUntilQuit: number;
  moneySaved: number;
  cigsAvoided: number;
  /** Position dans la semaine en cours (1-7) pour la bande de pastilles. */
  weekDots: { index: number; done: boolean; current: boolean }[];
  levelLabel: string;
  daysToNextMilestone: number;
  /**
   * État « la remontée » (7 jours après une glissade déclarée) : le hero
   * se recadre en dédramatisation, tout le reste (niveau, acquis) est conservé.
   */
  remontee?: {
    /** Jour de la remontée (jour de la glissade et lendemain = jour 1). */
    day: number;
    /** Jours gravis avant la glissade (« restent gravis »). */
    daysClimbed: number;
  };
}

const MILESTONES = [1, 3, 7, 14, 30, 90];

/** Durée du cadrage « remontée » après une glissade (jours). */
const REMONTEE_WINDOW = 7;

/** Clé de jour local (YYYY-MM-DD) pour les déclaratifs quotidiens. */
export const dayKey = (d = new Date()): string => {
  const x = startOfDay(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

/** Le défi du jour a-t-il été déclaré relevé aujourd'hui ? */
export const defiDoneToday = (state: ProfileState, now = new Date()): boolean =>
  Boolean(state.defisDone?.includes(dayKey(now)));

/** Nombre de jours écoulés depuis la dernière ouverture (0 si inconnue). */
export const daysAway = (state: ProfileState, now = new Date()): number =>
  state.lastSeenAt
    ? Math.floor(
        (startOfDay(now).getTime() - startOfDay(new Date(state.lastSeenAt)).getTime()) /
          DAY_MS,
      )
    : 0;

export const dashboardModel = (
  state: ProfileState,
  now = new Date(),
): DashboardModel => {
  const quit = state.quitAt ? new Date(state.quitAt) : startOfDay(now);
  const diffDays = Math.floor((startOfDay(now).getTime() - quit.getTime()) / DAY_MS);
  const dayNumber = diffDays + 1;
  const climbing = dayNumber >= 1;
  const daysSmokeFree = climbing ? dayNumber : 0;
  const perDay = cigsPerDay(state.answers);
  const next = MILESTONES.find((m) => m > dayNumber) ?? dayNumber;

  // Remontée : glissade déclarée il y a moins d'une semaine (doc 06).
  const lastSlip = state.slips?.length
    ? state.slips[state.slips.length - 1]
    : undefined;
  const daysSinceSlip = lastSlip
    ? Math.floor(
        (startOfDay(now).getTime() - startOfDay(new Date(lastSlip.at)).getTime()) /
          DAY_MS,
      )
    : undefined;
  const remontee =
    lastSlip && daysSinceSlip !== undefined && daysSinceSlip <= REMONTEE_WINDOW && climbing
      ? {
          day: Math.max(1, daysSinceSlip),
          daysClimbed: Math.max(
            1,
            Math.floor(
              (startOfDay(new Date(lastSlip.at)).getTime() - quit.getTime()) / DAY_MS,
            ) + 1,
          ),
        }
      : undefined;

  // La bande de semaine repart de la glissade en remontée (le reste est conservé).
  const weekStart = Math.floor(Math.max(0, dayNumber - 1) / 7) * 7;
  const weekDots = Array.from({ length: 7 }, (_, i) => {
    if (remontee) {
      const d = i + 1;
      return { index: d, done: d < remontee.day, current: d === remontee.day };
    }
    const d = weekStart + i + 1;
    return { index: d, done: d < dayNumber, current: d === dayNumber };
  });

  return {
    remontee,
    phase: climbing ? "climb" : "prep",
    dayNumber,
    daysUntilQuit: Math.max(0, -diffDays),
    moneySaved: daysSmokeFree * dailyCost(state.answers),
    cigsAvoided: Math.round(daysSmokeFree * perDay),
    weekDots,
    levelLabel:
      dayNumber < 1
        ? "Niveau 1 · Premier pas"
        : dayNumber < 7
          ? "Niveau 1 · Grimpeur"
          : dayNumber < 30
            ? "Niveau 2 · Grimpeur"
            : "Niveau 3 · Alpiniste",
    daysToNextMilestone: Math.max(0, next - dayNumber),
  };
};

/** Un palier de l'ascension (onglet Défis) — jalons santé réels. */
export interface Palier {
  day: number;
  label: string;
  sub: string;
  state: "done" | "current" | "locked";
}

const TRAIL: { day: number; label: string; sub: string }[] = [
  { day: 1, label: "Camp de base", sub: "24 h · le monoxyde a disparu" },
  { day: 3, label: "Premier refuge", sub: "3 jours · nicotine éliminée" },
  { day: 7, label: "La crête", sub: "7 jours · le souffle s’ouvre" },
  { day: 14, label: "Haute altitude", sub: "14 jours · l’énergie remonte" },
  { day: 30, label: "Les nuages", sub: "1 mois · la toux s’apaise" },
  { day: 90, label: "Le sommet", sub: "3 mois · le risque cardiaque chute" },
];

/** Construit le chemin de paliers selon le jour courant. */
export const climbTrail = (dayNumber: number): Palier[] => {
  let currentAssigned = false;
  return TRAIL.map((p) => {
    if (dayNumber >= p.day) return { ...p, state: "done" as const };
    if (!currentAssigned) {
      currentAssigned = true;
      return { ...p, state: "current" as const };
    }
    return { ...p, state: "locked" as const };
  });
};

export const onboardingComplete = (state: ProfileState): boolean =>
  Boolean(state.quitAt);

// ---- Dérivations Phase 2 ----

const num = (p2: Phase2Answers | undefined, key: string): number | undefined =>
  typeof p2?.[key] === "number" ? (p2[key] as number) : undefined;

/**
 * Profil motivationnel (théorie de l'autodétermination) : moyenne des motivations
 * internalisées (intrinsèque + identifiée) moins la motivation contrôlée
 * (introjectée / culpabilité). > 0 = plutôt intrinsèque (prédicteur de réussite).
 */
export const motivationBalance = (p2?: Phase2Answers): number | undefined => {
  const intr = num(p2, "motiv_intrinseque");
  const ident = num(p2, "motiv_identifiee");
  const introj = num(p2, "motiv_introjectee");
  if (intr === undefined || ident === undefined || introj === undefined) return undefined;
  return (intr + ident) / 2 - introj;
};

/** Auto-efficacité (SASEQ) : moyenne 1-5 ; < 3 = fragile (soutien élevé). */
export const selfEfficacy = (p2?: Phase2Answers): number | undefined => {
  const items = ["saseq_stress", "saseq_soiree", "saseq_entourage"]
    .map((k) => num(p2, k))
    .filter((v): v is number => v !== undefined);
  return items.length ? items.reduce((a, b) => a + b, 0) / items.length : undefined;
};

/** Type de joueur Hexad dominant (parmi les dimensions mesurées). */
export const hexadType = (p2?: Phase2Answers): string | undefined => {
  const types: Record<string, number | undefined> = {
    Battant: num(p2, "hexad_battant"),
    Sociable: num(p2, "hexad_sociable"),
    Joueur: num(p2, "hexad_joueur"),
  };
  const entries = Object.entries(types).filter(([, v]) => v !== undefined) as [string, number][];
  if (!entries.length) return undefined;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

export type Archetype =
  | "jeune_hedoniste"
  | "habituel"
  | "detresse"
  | "mixte";

/**
 * Archétype principal (matrice doc 03) dérivé par faisceau d'indices mesurés.
 * Classification souple : « mixte » si aucun faisceau ne domine.
 */
export const deriveArchetype = (state: ProfileState): Archetype => {
  const p2 = state.phase2;
  const eff = selfEfficacy(p2);
  const balance = motivationBalance(p2);
  const player = hexadType(p2);
  const hsi = hsiScore(state.answers);
  const cannabis = state.answers.cannabis;

  // détresse : faible auto-efficacité + forte dépendance
  if (eff !== undefined && eff < 3 && (hsi ?? 0) >= 3) return "detresse";
  // jeune hédoniste : profil joueur + motivation peu internalisée ou cannabis
  if (
    (player === "Joueur" || player === "Sociable") &&
    ((balance !== undefined && balance < 0) || cannabis === "regular" || cannabis === "sometimes")
  )
    return "jeune_hedoniste";
  // habituel : dépendance modérée/forte + motivation plutôt internalisée
  if ((hsi ?? 0) >= 2 && balance !== undefined && balance >= 0) return "habituel";
  return "mixte";
};

export const phase2Complete = (state: ProfileState): boolean =>
  Boolean(state.phase2Complete);

/* ------------------------------------------------------------------ *
 * Phase de préparation (date d'arrêt future) : l'objectif est de finir
 * le profil et de préparer l'arrêt. Le Fil pousse un conseil par jour,
 * les Défis deviennent une check-list de préparation.
 * ------------------------------------------------------------------ */

/**
 * Une mission de préparation (onglet Défis, phase prep). L'ordre = affichage.
 * Une rangée ne se coche jamais à la main : cliquer OUVRE l'écran de détail
 * (renseigner ou modifier la donnée) et la coche découle de la donnée
 * (`derived`) ou de la validation de l'écran (`prepChecklist`). Jamais de
 * décochage depuis la liste.
 */
export interface PrepMission {
  id: string;
  title: string;
  sub: string;
  /** Écran de détail de la mission (toute la rangée y mène). */
  detail: string;
  /** Conseil du jour associé (Fil) tant que la mission n'est pas faite. */
  tip?: PrepTip;
  /** Auto-cochée si la donnée existe déjà (ex. phrase écrite au Jour 0). */
  derived?: (s: ProfileState) => boolean;
}

export const PREP_MISSIONS: PrepMission[] = [
  // ---- Tes réponses d'onboarding (cochées dès que la donnée existe) ----
  {
    id: "conso",
    title: "Tes infos tabac",
    sub: "Type, quantité, prix, ancienneté",
    detail: "/prep/conso",
    derived: (s) =>
      s.answers.tobaccoType !== undefined &&
      s.answers.cigsPerDay !== undefined &&
      s.answers.yearsSmoking !== undefined &&
      s.answers.packPrice !== undefined,
  },
  {
    id: "date",
    title: "Ta date d’arrêt",
    sub: "Le jour J est posé",
    detail: "/prep/date",
    derived: (s) => Boolean(s.quitAt),
  },
  {
    id: "joints",
    title: "Les joints",
    sub: "Ta réponse reste privée",
    detail: "/prep/joints",
    derived: (s) => s.answers.cannabis !== undefined,
  },
  {
    id: "hsi",
    title: "Ta première cigarette",
    sub: "Le matin, après le réveil",
    detail: "/prep/hsi",
    derived: (s) => s.answers.hsiFirstCig !== undefined,
  },
  {
    id: "entourage",
    title: "Les fumeurs autour de toi",
    sub: "Ton environnement compte dans ta stratégie",
    detail: "/prep/entourage",
    derived: (s) => s.phase2?.social_entourage !== undefined,
  },
  {
    id: "profil",
    title: "Ton profil psychologique",
    sub: "2 min pour que l’app s’adapte à toi",
    detail: "/profilage",
    tip: {
      badge: "Ton profil",
      title: "Termine ton profil · 2 min",
      text: "Tes raisons, ta confiance, ton style de jeu : 2 minutes pour que l’app s’adapte vraiment à toi.",
    },
    derived: (s) => Boolean(s.phase2Complete),
  },
  // ---- Missions de préparation ----
  {
    id: "raisons",
    title: "Note tes raisons",
    sub: "Pourquoi tu arrêtes, en une phrase",
    detail: "/prep/raisons",
    tip: {
      badge: "Tes raisons",
      title: "Écris pourquoi tu arrêtes",
      text: "Une phrase, la tienne. On te la ressortira aux moments difficiles : c’est la voix la plus convaincante.",
    },
    derived: (s) => Boolean(s.answers.phrase),
  },
  {
    id: "moments",
    title: "Repère tes moments à risque",
    sub: "Café, pause, soirée…",
    detail: "/prep/moments",
    tip: {
      badge: "Tes moments à risque",
      title: "Repère tes 3 moments à risque",
      text: "Café, pause, soirée… les situations où l’envie sera la plus forte. Les repérer maintenant, c’est pouvoir les désamorcer le jour J.",
    },
    derived: (s) =>
      Boolean((s.phase2?.social_moments as string[] | undefined)?.length),
  },
  {
    id: "allie",
    title: "Préviens un proche",
    sub: "Un allié qui te soutient le jour J",
    detail: "/prep/allie",
    tip: {
      badge: "Ton allié",
      title: "Préviens un proche",
      text: "Dire « j’arrête bientôt » à quelqu’un, c’est déjà s’engager. Choisis une personne qui te soutiendra, sans juger.",
    },
    derived: (s) => Boolean(s.prepAlly?.name),
  },
  {
    id: "alternatives",
    title: "Prépare tes alternatives",
    sub: "Eau, chewing-gum, marche, respiration",
    detail: "/prep/alternatives",
    tip: {
      badge: "Tes alternatives",
      title: "Prépare de quoi occuper tes mains",
      text: "Eau, chewing-gum, une courte marche, quelques respirations. Avoir le réflexe prêt, c’est passer l’envie plus vite.",
    },
  },
  {
    id: "tri",
    title: "Fais le tri",
    sub: "Paquets, briquets, cendriers",
    detail: "/prep/tri",
    tip: {
      badge: "Le grand ménage",
      title: "Fais le tri la veille",
      text: "Paquets, briquets, cendriers : hors de vue, hors de portée. Un environnement net, c’est moins de déclencheurs.",
    },
  },
];

/** Mission de préparation accomplie (dérivée d'une donnée ou cochée à la main). */
export const prepMissionDone = (s: ProfileState, m: PrepMission): boolean =>
  Boolean(m.derived?.(s)) || Boolean(s.prepChecklist?.includes(m.id));

/** Avancement de la préparation (missions accomplies / total). */
export const prepReadiness = (
  s: ProfileState,
): { done: number; total: number } => ({
  done: PREP_MISSIONS.filter((m) => prepMissionDone(s, m)).length,
  total: PREP_MISSIONS.length,
});

/** Missions de préparation restant à faire, dans l'ordre de la check-list.
 *  Sert au programme du Fil : ce qui est déjà fait n'y apparaît jamais. */
export const prepMissionsRemaining = (s: ProfileState): PrepMission[] =>
  PREP_MISSIONS.filter((m) => !prepMissionDone(s, m));

/** Conseil de préparation (Fil, phase prep) — un par jour, poussé le matin. */
export interface PrepTip {
  badge: string;
  title: string;
  text: string;
}

/** Thèmes du programme de préparation, dans l'ordre (badges des conseils). */
export const PREP_TIPS: PrepTip[] = PREP_MISSIONS.flatMap((m) =>
  m.tip ? [m.tip] : [],
);

/**
 * Conseil du jour : déterministe (change chaque jour), et piloté par la
 * check-list — on ne conseille que ce qui reste à faire. Si tout est fait,
 * il n'y a plus de conseil : le Fil bascule sur « Tu es prêt » (doc 06).
 */
export const prepTipOfDay = (state: ProfileState, now = new Date()): PrepTip =>
  prepMissionOfDay(state, now).tip as PrepTip;

/** La mission derrière le conseil du jour : la carte du Fil y mène (détail). */
export const prepMissionOfDay = (
  state: ProfileState,
  now = new Date(),
): PrepMission => {
  const withTip = PREP_MISSIONS.filter((m) => m.tip);
  const pool = withTip.filter((m) => !prepMissionDone(state, m));
  const source = pool.length ? pool : withTip;
  const dayIndex = Math.floor(startOfDay(now).getTime() / DAY_MS);
  return source[((dayIndex % source.length) + source.length) % source.length];
};

const STORAGE_KEY = "smokingapp.profile";

export const loadState = (): ProfileState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // migration depuis l'ancien format (réponses seules)
    const legacy = localStorage.getItem("smokingapp.onboarding");
    return legacy ? { answers: JSON.parse(legacy) } : { answers: {} };
  } catch {
    return { answers: {} };
  }
};

export const saveState = (state: ProfileState, revisedAt?: string) => {
  // le tampon vit dans la sérialisation : pas de re-render, relu par loadState.
  // `revisedAt` explicite = state ADOPTÉ depuis le cloud : on conserve son
  // tampon d'origine. Re-tamponner un state simplement adopté le ferait
  // passer pour « le plus récent » et écraserait, au pull suivant des autres
  // appareils, des changements réels (vécu : canaux de notification annulés).
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, revisedAt: revisedAt ?? new Date().toISOString() }),
  );
};

export interface ProfileStore {
  state: ProfileState;
  answers: OnboardingAnswers;
  setAnswer: <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K],
  ) => void;
  /** Clôt l'onboarding : résout la date d'arrêt et horodate le profil. */
  completeOnboarding: () => void;
  /** Enregistre une réponse de Phase 2. */
  setPhase2Answer: (key: string, value: number | string | string[]) => void;
  /** Marque la Phase 2 terminée. */
  completePhase2: () => void;
  /** Enregistre le feedback d'un outil anti-envie (« ça t'a aidé ? »). */
  recordToolFeedback: (tool: string, helped: "yes" | "some" | "no") => void;
  /** Déclare une glissade (« j'ai fumé ») — passage en mode remontée. */
  recordSlip: (kind: Slip["kind"]) => void;
  /** Horodate l'ouverture de l'app (détection du retour après absence). */
  markSeen: () => void;
  /** Met à jour les infos de compte (fusion partielle). */
  setAccount: (patch: Account) => void;
  /** Met à jour les préférences de notifications (fusion partielle). */
  setNotifPrefs: (patch: NotifPrefs) => void;
  /** Déclare le défi du jour relevé (déclaratif, basé sur la confiance). */
  recordDefiDone: () => void;
  /** Bascule une mission de préparation (phase prep, onglet Défis). */
  togglePrepMission: (id: string) => void;
  /** Reset d'une mission : efface la donnée associée (bloc désélectionné). */
  resetPrepMission: (id: string) => void;
  /** Restaure un instantané du profil (« Annuler » d'un écran de détail). */
  restoreState: (snapshot: ProfileState) => void;
  /** Mémorise l'état « confettis joués » de la check-list complète. */
  setPrepCelebrated: (v: boolean) => void;
  /** Enregistre l'allié du jour J (fusion partielle). */
  setPrepAlly: (patch: PrepAlly) => void;
  /** Change le thème d'affichage (clair / sombre / système). */
  setTheme: (theme: ThemePref) => void;
}

export const ProfileContext = createContext<ProfileStore | null>(null);

export const useProfile = (): ProfileStore => {
  const store = useContext(ProfileContext);
  if (!store) throw new Error("useProfile doit être utilisé sous ProfileProvider");
  return store;
};
