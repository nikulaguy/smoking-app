import {
  prepReadiness,
  prepTipOfDay,
  type ProfileState,
} from "../profile/profile";

/**
 * Logique JITAI côté appareil — MIROIR de supabase/functions/push-send/jitai.ts
 * (toute évolution se fait des deux côtés). Sert au canal « local » : des
 * rappels sur CET appareil, sans compte, quand l'app est ouverte ou en
 * arrière-plan récent (limite de la plateforme web : aucune notification
 * programmée possible quand la PWA est complètement fermée).
 */

/** Moments à risque ancrables sur une heure (France). */
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

/** Heure d'envoi du conseil de préparation (jamais la nuit, doc 04). */
export const PREP_TIP_HOUR = 9;

export interface Reminder {
  title: string;
  body: string;
  url: string;
  tag: string;
}

/** Écart minimal entre deux rappels selon le rythme choisi (heures). */
export const rhythmCapHours = (rhythm: string | undefined): number =>
  rhythm === "rapproche" ? 0 : rhythm === "discret" ? 48 : 20;

/**
 * Le rappel dû pour ce profil à cette heure, ou null.
 * Phase préparation : un conseil par matin tant que la check-list n'est pas
 * complète. Phase ascension : rappel au moment à risque déclaré.
 */
export const dueReminder = (
  state: ProfileState,
  hour: number,
  now = new Date(),
): Reminder | null => {
  const prep = Boolean(state.quitAt && new Date(state.quitAt).getTime() > now.getTime());

  if (prep) {
    if (hour !== PREP_TIP_HOUR) return null;
    const { done, total } = prepReadiness(state);
    if (done === total) return null;
    const tip = prepTipOfDay(state, now);
    return { title: tip.title, body: tip.text, url: "/defis", tag: "prep-tip" };
  }

  const moments = (state.phase2?.social_moments as string[] | undefined) ?? [];
  const moment = moments.find((m) => MOMENT_HOURS[m] === hour);
  if (!moment) return null;
  const msg = MESSAGES[moment];
  // Au clic : ouvrir directement la boîte à outils anti-envie (SosOverlay),
  // pas seulement l'accueil. Le paramètre est lu par AppLayout.
  return { ...msg, url: "/?envie=1", tag: `jitai-${moment}` };
};
