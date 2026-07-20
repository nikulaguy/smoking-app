import { useEffect, useRef, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { supabase, useSession } from "../lib/supabase";
import {
  loadState,
  onboardingComplete,
  type ProfileState,
} from "../profile/profile";

/** Délai avant push après une modification (regroupe les rafales). */
const PUSH_DEBOUNCE_MS = 2000;

/** Dernier compte avec lequel CET appareil a déjà synchronisé : le dialogue
    de conflit n'est posé qu'à la première rencontre appareil ↔ compte. */
const SYNCED_USER_KEY = "smokingapp.syncedUser";

/** L'état porte-t-il des données saisies (même onboarding inachevé) ? */
const meaningful = (s: ProfileState | undefined): boolean =>
  Boolean(s) && (Boolean(s?.quitAt) || Object.keys(s?.answers ?? {}).length > 0);

/** Conflit à trancher par l'utilisateur : le compte a déjà des données ET
    l'appareil en a saisi d'autres, sans jamais avoir synchronisé ensemble. */
export interface SyncConflict {
  /** Le profil du compte (cloud), pour affichage éventuel. */
  remote: ProfileState;
  /** Tranche : reprendre le cloud, garder le local (écrase le compte),
      ou tout effacer (base + local) et repartir de zéro. */
  resolve: (choice: "remote" | "local" | "reset") => void;
}

/**
 * Synchronisation du profil (Phase B.1) : local-first, le localStorage reste
 * la source de vérité hors connexion.
 *
 * Protocole (dans cet ordre, il protège les données) :
 * 1. À la connexion, PULL d'abord — aucun push tant qu'il n'a pas statué.
 * 2. Compte VIDE : les saisies locales (même un onboarding en cours) sont
 *    associées immédiatement au compte.
 * 3. Compte REMPLI + saisies locales + première rencontre appareil ↔ compte :
 *    CONFLIT retourné à l'appelant, l'utilisateur tranche (aucune sync
 *    d'ici là). Ensuite (appareil déjà synchronisé) : adoption du distant si
 *    le local n'est pas onboardé alors que le distant l'est (nouvel
 *    appareil), sinon le `revisedAt` le plus récent gagne EN ENTIER (usage
 *    mono-appareil dominant, pas de fusion par champ).
 * 4. PUSH débouncé des changements ; jamais un profil vierge, et un profil
 *    non onboardé seulement quand le cloud est vide (rien à écraser).
 */
export const useProfileSync = (
  state: ProfileState,
  adopt: (remote: ProfileState) => void,
): SyncConflict | null => {
  const session = useSession();
  const pull = useRef<"idle" | "pending" | "conflict" | "done">("idle");
  const cloudEmpty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [conflict, setConflict] = useState<SyncConflict | null>(null);

  const schedulePush = (client: SupabaseClient, s: Session) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      // relire la sérialisation pour embarquer revisedAt
      const snapshot = loadState();
      // jamais pousser un profil vierge, ni un onboarding inachevé quand le
      // cloud a des données (la suppression volontaire passe par
      // deleteProfile, pas par la sync)
      if (!meaningful(snapshot)) return;
      if (!onboardingComplete(snapshot) && !cloudEmpty.current) return;
      // ATTENTION : les requêtes supabase-js sont des thenables paresseux,
      // sans .then()/await la requête ne part jamais.
      client
        .from("profiles")
        .upsert({ id: s.user.id, state: snapshot })
        .then(({ error }) => {
          if (error) console.warn("Sync du profil échouée :", error.message);
        });
    }, PUSH_DEBOUNCE_MS);
  };

  const runPull = async (client: SupabaseClient, s: Session) => {
    pull.current = "pending";
    const { data, error } = await client
      .from("profiles")
      .select("state")
      .eq("id", s.user.id)
      .maybeSingle();
    if (error) {
      pull.current = "idle"; // réseau : on retentera au prochain changement
      return;
    }
    const remote = data?.state as ProfileState | undefined;
    const local = loadState();

    // Compte vide : les saisies locales lui sont associées immédiatement.
    if (!meaningful(remote)) {
      cloudEmpty.current = true;
      localStorage.setItem(SYNCED_USER_KEY, s.user.id);
      pull.current = "done";
      schedulePush(client, s);
      return;
    }

    // Première rencontre appareil ↔ compte, des données des deux côtés :
    // l'utilisateur tranche. Pas de marqueur ni de sync tant que le choix
    // n'est pas fait (un refresh reposera la question).
    const syncedBefore = localStorage.getItem(SYNCED_USER_KEY) === s.user.id;
    if (!syncedBefore && meaningful(local)) {
      pull.current = "conflict";
      setConflict({
        remote: remote as ProfileState,
        resolve: (choice) => {
          setConflict(null);
          localStorage.setItem(SYNCED_USER_KEY, s.user.id);
          if (choice === "remote") {
            adopt(remote as ProfileState);
            pull.current = "done";
            schedulePush(client, s);
          } else if (choice === "local") {
            // le choix explicite autorise à écraser le compte, même avec un
            // onboarding local inachevé
            cloudEmpty.current = true;
            pull.current = "done";
            schedulePush(client, s);
          } else {
            // reset : efface la base ET le local, l'app redémarre sur
            // l'onboarding (la session, elle, est conservée)
            void client
              .from("profiles")
              .delete()
              .eq("id", s.user.id)
              .then(() => {
                localStorage.removeItem("smokingapp.profile");
                localStorage.removeItem("smokingapp.onboarding");
                window.location.assign("/");
              });
          }
        },
      });
      return;
    }

    const remoteWins =
      (!onboardingComplete(local) && onboardingComplete(remote as ProfileState)) ||
      ((remote as ProfileState).revisedAt ?? "") > (local.revisedAt ?? "");
    if (remoteWins) adopt(remote as ProfileState);
    localStorage.setItem(SYNCED_USER_KEY, s.user.id);
    pull.current = "done";
    // le pull statué pousse la version gagnante (rien ne rebougera sinon)
    schedulePush(client, s);
  };

  // À chaque (dé)connexion : repartir du pull
  useEffect(() => {
    pull.current = "idle";
    setConflict(null);
    cloudEmpty.current = false;
    if (!supabase || !session) return;
    void runPull(supabase, session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Push débouncé des changements locaux, une fois le pull statué
  useEffect(() => {
    if (!supabase || !session) return;
    const client = supabase;
    if (pull.current !== "done") {
      if (pull.current === "idle") void runPull(client, session);
      return;
    }
    schedulePush(client, session);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, session]);

  return conflict;
};
