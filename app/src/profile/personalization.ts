import { deriveArchetype, type Archetype, type ProfileState } from "./profile";
import zen from "../assets/illustrations/zen.svg";
import puzzle from "../assets/illustrations/puzzle.svg";
import humanNote from "../assets/illustrations/human-note.svg";
import videoPlay from "../assets/illustrations/video-play.svg";
import gift from "../assets/illustrations/gift.svg";
import heartCare from "../assets/illustrations/heart-care.svg";

export type ToolKey = "respirer" | "jeu" | "audio" | "video" | "blague" | "raisons";
export type FeedKey = "sante" | "liberte" | "defi" | "argent";

export interface Tool {
  key: ToolKey;
  /** Illustration de la librairie (exportée de Figma), décorative. */
  illustration: string;
  label: string;
}

/** Catalogue complet des outils anti-envie (l'ordre est personnalisé ensuite).
 *  Illustrations = composants de la maquette SOS (zen, puzzle, human-note,
 *  video-play, gift, heart-care). */
export const TOOLS: Record<ToolKey, Tool> = {
  respirer: { key: "respirer", illustration: zen, label: "Respirer · 3 min" },
  jeu: { key: "jeu", illustration: puzzle, label: "Mini-jeu" },
  audio: { key: "audio", illustration: humanNote, label: "Histoire audio" },
  video: { key: "video", illustration: videoPlay, label: "Vidéo · 1 min" },
  blague: { key: "blague", illustration: gift, label: "Une blague" },
  raisons: { key: "raisons", illustration: heartCare, label: "Tes raisons" },
};

/** Configuration de personnalisation dérivée du profil (matrice doc 03). */
export interface Personalization {
  archetype: Archetype;
  /** Titre du hero du dashboard (état ascension). */
  heroTitle: string;
  /** Libellés des compteurs (recadrage selon le profil). */
  stats: { money: string; cigs: string };
  /** Défi du jour (ton + mécanique). */
  defi: { badge: string; title: string; text: string };
  /** SOS : libellé du bouton + titre de la sur-couche + ordre des outils. */
  sos: { button: string; title: string; tools: ToolKey[] };
  /** Ordre de pondération du fil. */
  feedOrder: FeedKey[];
  /** Compétition amicale autorisée (jeunes hédonistes uniquement). */
  competition: boolean;
}

const CONFIG: Record<Archetype, Omit<Personalization, "archetype">> = {
  jeune_hedoniste: {
    heroTitle: "La série continue.",
    stats: { money: "à claquer ailleurs", cigs: "clopes zappées" },
    defi: {
      badge: "Défi flash",
      title: "Pause café sans clope, chrono en main",
      text: "Tiens 3 minutes et décroche le badge Éclair.",
    },
    sos: {
      button: "Une envie, là ?",
      title: "On se change les idées.",
      tools: ["jeu", "blague", "video", "respirer", "raisons", "audio"],
    },
    feedOrder: ["liberte", "defi", "argent", "sante"],
    competition: true,
  },
  habituel: {
    heroTitle: "Ton ascension.",
    stats: { money: "dans ta poche", cigs: "cigarettes évitées" },
    defi: {
      badge: "Défi du jour",
      title: "Passe ta pause café sans clope",
      text: "Casse l’automatisme du geste : c’est là que se joue l’habitude.",
    },
    sos: {
      button: "Une envie, là ?",
      title: "On tient 3 minutes ensemble.",
      tools: ["video", "respirer", "raisons", "jeu", "audio", "blague"],
    },
    feedOrder: ["sante", "argent", "defi", "liberte"],
    competition: false,
  },
  detresse: {
    heroTitle: "Un pas après l’autre.",
    stats: { money: "mis de côté", cigs: "moments surmontés" },
    defi: {
      badge: "Pas à pas",
      title: "Ton rituel du jour",
      text: "Trois minutes de respiration après le déjeuner. Rien d’autre. On y va ensemble.",
    },
    sos: {
      button: "Un moment difficile ?",
      title: "Respire avec moi.",
      tools: ["respirer", "audio", "raisons", "video", "jeu", "blague"],
    },
    feedOrder: ["sante", "liberte", "defi", "argent"],
    competition: false,
  },
  mixte: {
    heroTitle: "Ton ascension.",
    stats: { money: "dans ta poche", cigs: "cigarettes évitées" },
    defi: {
      badge: "Défi du jour",
      title: "Passe ta pause café sans clope",
      text: "Tiens, et ton palier avance d’un cran vers le sommet.",
    },
    sos: {
      button: "Une envie, là ?",
      title: "On tient 3 minutes ensemble.",
      tools: ["respirer", "jeu", "audio", "video", "blague", "raisons"],
    },
    feedOrder: ["sante", "liberte", "defi", "argent"],
    competition: false,
  },
};

/**
 * Réordonne les outils selon le feedback utilisateur (« ça t'a aidé ? ») :
 * les outils au meilleur taux d'aide remontent ; sans feedback, l'ordre
 * de l'archétype fait foi. Boucle de feedback du doc 04.
 */
const reorderByFeedback = (
  base: ToolKey[],
  stats: ProfileState["toolStats"],
): ToolKey[] => {
  if (!stats) return base;
  const score = (k: ToolKey): number | undefined => {
    const s = stats[k];
    return s && s.used > 0 ? s.helped / s.used : undefined;
  };
  return [...base].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa === undefined && sb === undefined) return base.indexOf(a) - base.indexOf(b);
    if (sa === undefined) return sb! >= 0.5 ? 1 : -1;
    if (sb === undefined) return sa >= 0.5 ? -1 : 1;
    return sb - sa || base.indexOf(a) - base.indexOf(b);
  });
};

/** Calcule la configuration de personnalisation pour le profil courant. */
export const personalize = (state: ProfileState): Personalization => {
  const archetype = deriveArchetype(state);
  const config = CONFIG[archetype];
  return {
    archetype,
    ...config,
    sos: { ...config.sos, tools: reorderByFeedback(config.sos.tools, state.toolStats) },
  };
};
