import { supabase } from "./supabase";

export interface Content {
  id: string;
  type: "audio" | "video";
  title: string;
  description: string | null;
  theme: string | null;
  duration_sec: number | null;
  source: string | null;
  ref: string; // audio : chemin Storage ; vidéo : id YouTube
}

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/** URL publique d'un audio du bucket `audios`. */
export const audioUrl = (ref: string): string =>
  `${SUPA_URL}/storage/v1/object/public/audios/${ref}`;

/**
 * Un contenu au hasard du catalogue (table `contents`), du type demandé.
 * Retourne null si le back n'est pas configuré ou si le catalogue est vide :
 * les outils retombent alors sur leur contenu de démo.
 */
export const fetchRandomContent = async (
  type: "audio" | "video",
): Promise<Content | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("contents")
    .select("id,type,title,description,theme,duration_sec,source,ref")
    .eq("type", type)
    .eq("published", true);
  if (error || !data?.length) return null;
  return data[Math.floor(Math.random() * data.length)] as Content;
};
