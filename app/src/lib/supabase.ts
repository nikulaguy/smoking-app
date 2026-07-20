import { createClient, type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * Client Supabase, ou null si non configuré : le compte est OPTIONNEL
 * (doc 06), l'app doit fonctionner entièrement en local sans lui.
 * Tout code appelant doit tolérer `supabase === null`.
 */
export const supabase = url && key ? createClient(url, key) : null;

/** Session courante, réactive aux connexions/déconnexions (null sans compte). */
export const useSession = (): Session | null => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
};
