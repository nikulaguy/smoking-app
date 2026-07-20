// SmokingApp · logique JITAI (doc 04) : quel rappel, à quel moment.
// Règles simples et auto-déclaratives, pas d'IA prédictive (doc 01).
// Partagé par push-send (envoi au demandeur) et le fan-out planifié.

/** Moments à risque ancrables sur une heure (France). Les autres (stress,
 *  ennui, alcool, social) sont réactifs (SOS/fil), pas planifiés. */
export const MOMENT_HOURS: Record<string, number> = {
  reveil: 7,
  cafe: 10,
  pause: 15,
  repas: 13,
  trajet: 18,
  soiree: 21,
};

/** Messages doux par moment (jamais culpabilisants, orientés outil). */
const MESSAGES: Record<string, { title: string; body: string }> = {
  reveil: { title: "Bonjour 🌄", body: "La première du matin est la plus dure. Trois respirations avant le café ?" },
  cafe: { title: "La pause arrive", body: "Café sans clope aujourd'hui : ton moment le plus risqué, et tu le gagnes." },
  pause: { title: "Un moment pour toi", body: "Envie d'une pause ? Ouvre un allié plutôt qu'un paquet." },
  repas: { title: "Après le repas", body: "Le café d'après repas t'appelle ? On respire 3 minutes ensemble." },
  trajet: { title: "Sur le trajet", body: "Les mains occupées, l'esprit ailleurs : un mini-jeu pour tenir." },
  soiree: { title: "La soirée", body: "Un moment convivial sans cigarette, ça se prépare. Tes raisons t'attendent." },
};

/** Heure locale Paris (le cron tourne en UTC). */
export const parisHour = (now = new Date()): number =>
  // fr-FR formate l'heure « 20 h » (suffixe « h ») → Number() donnerait NaN et
  // aucun moment ne matcherait jamais. parseInt s'arrête au premier non-chiffre.
  parseInt(
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      hour12: false,
    }).format(now),
    10,
  );

/** Le rappel à pousser pour ce profil à cette heure, ou null. */
export const dueReminder = (
  moments: string[],
  hour: number,
): { title: string; body: string; url: string; tag: string } | null => {
  const moment = moments.find((m) => MOMENT_HOURS[m] === hour);
  if (!moment) return null;
  const msg = MESSAGES[moment];
  // Au clic : ouvrir directement la boîte à outils anti-envie (SosOverlay),
  // pas seulement l'accueil. Le paramètre est lu par AppLayout.
  return { ...msg, url: "/?envie=1", tag: `jitai-${moment}` };
};

/** Écart minimal entre deux rappels selon le rythme choisi (heures). */
export const rhythmCapHours = (rhythm: string | undefined): number =>
  rhythm === "rapproche" ? 0 : rhythm === "discret" ? 48 : 20;

/* ------------------------------------------------------------------ *
 * Phase préparation (date d'arrêt future) : un conseil par matin (9 h)
 * tant que la check-list n'est pas complète — miroir de prepTipOfDay()
 * côté app (src/profile/profile.ts). Tout est dérivé du JSON profiles.state.
 * ------------------------------------------------------------------ */

/** Heure d'envoi du conseil de préparation (Paris). Jamais la nuit (doc 04). */
export const PREP_TIP_HOUR = 9;

type PrepState = {
  quitAt?: string;
  phase2Complete?: boolean;
  prepChecklist?: string[];
  prepAlly?: { name?: string };
  answers?: { phrase?: string };
  phase2?: { social_moments?: string[] };
};

const PREP_TIPS: { id: string; done: (s: PrepState) => boolean; title: string; body: string }[] = [
  {
    id: "profil",
    done: (s) => Boolean(s.phase2Complete),
    title: "Termine ton profil · 2 min",
    body: "Tes raisons, ta confiance, ton style de jeu : 2 minutes pour que l’app s’adapte vraiment à toi.",
  },
  {
    id: "raisons",
    done: (s) => Boolean(s.answers?.phrase),
    title: "Écris pourquoi tu arrêtes",
    body: "Une phrase, la tienne. On te la ressortira aux moments difficiles.",
  },
  {
    id: "moments",
    done: (s) => Boolean(s.phase2?.social_moments?.length),
    title: "Repère tes 3 moments à risque",
    body: "Café, pause, soirée… les repérer maintenant, c’est les désamorcer le jour J.",
  },
  {
    id: "allie",
    done: (s) => Boolean(s.prepAlly?.name),
    title: "Préviens un proche",
    body: "Dire « j’arrête bientôt » à quelqu’un, c’est déjà s’engager.",
  },
  {
    id: "alternatives",
    done: (s) => Boolean(s.prepChecklist?.includes("alternatives")),
    title: "Prépare tes alternatives",
    body: "Eau, chewing-gum, marche, respiration : le réflexe prêt, l’envie passe.",
  },
  {
    id: "tri",
    done: (s) => Boolean(s.prepChecklist?.includes("tri")),
    title: "Fais le tri la veille",
    body: "Paquets, briquets, cendriers : hors de vue, hors de portée.",
  },
];

/** Le profil est-il en phase de préparation (date d'arrêt à venir) ? */
export const isPrepPhase = (state: PrepState, now = new Date()): boolean =>
  Boolean(state.quitAt && new Date(state.quitAt).getTime() > now.getTime());

/** Conseil de préparation du jour à 9 h : tourne parmi les missions non
 *  faites (même rotation déterministe que l'app). Null si tout est fait. */
export const duePrepTip = (
  state: PrepState,
  hour: number,
  now = new Date(),
): { title: string; body: string; url: string; tag: string } | null => {
  if (hour !== PREP_TIP_HOUR) return null;
  const pool = PREP_TIPS.filter((t) => !t.done(state));
  if (!pool.length) return null;
  const dayIndex = Math.floor(now.getTime() / 86_400_000);
  const tip = pool[dayIndex % pool.length];
  return { title: tip.title, body: tip.body, url: "/defis", tag: `prep-${tip.id}` };
};
