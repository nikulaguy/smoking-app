/**
 * Intention de canal en attente de connexion : l'utilisateur a choisi une
 * option compte-requis (« Sur tous tes appareils », « Par mail ») sans
 * session, puis « Se connecter » dans la modale. On mémorise son choix le
 * temps du parcours de connexion (sessionStorage : survit à la navigation,
 * pas à la fermeture de l'app) et on l'applique à son retour.
 */

const KEY = "smokingapp.notifIntent";

export type NotifIntent = "push-all" | "email";

export const setNotifIntent = (intent: NotifIntent) =>
  sessionStorage.setItem(KEY, intent);

/** Lit sans consommer (redirection post-connexion). */
export const peekNotifIntent = (): NotifIntent | null =>
  sessionStorage.getItem(KEY) as NotifIntent | null;

/** Lit ET consomme (application de l'intention, une seule fois). */
export const takeNotifIntent = (): NotifIntent | null => {
  const intent = peekNotifIntent();
  if (intent) sessionStorage.removeItem(KEY);
  return intent;
};
