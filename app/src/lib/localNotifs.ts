import { useEffect } from "react";
import { dueReminder, rhythmCapHours, type Reminder } from "./reminders";
import type { ProfileState } from "../profile/profile";

/**
 * Canal « local » : des notifications sur CET appareil, sans compte ni
 * serveur — les données restent sur le device. Limite de plateforme assumée :
 * le web ne permet aucune notification programmée app fermée ; le
 * planificateur tourne donc quand l'app est ouverte (ou en arrière-plan
 * récent), et rattrape le moment du jour à l'ouverture. Pour la couverture
 * app fermée / multi-appareils : canaux push et mail (compte requis).
 */

const LAST_KEY = "smokingapp.lastLocalNotifAt";

export const localNotifsSupported = (): boolean =>
  typeof window !== "undefined" && "Notification" in window;

export const localPermission = (): NotificationPermission | "unsupported" =>
  localNotifsSupported() ? Notification.permission : "unsupported";

/** Demande la permission (geste utilisateur requis). */
export const enableLocalNotifs = async (): Promise<boolean> => {
  if (!localNotifsSupported()) return false;
  const perm = await Notification.requestPermission();
  return perm === "granted";
};

/** Affiche une notification locale (via le service worker si dispo). */
export const showLocal = async (reminder: Reminder): Promise<boolean> => {
  if (localPermission() !== "granted") return false;
  const options: NotificationOptions = {
    body: reminder.body,
    tag: reminder.tag,
    icon: "/pwa-192x192.png",
    data: { url: reminder.url },
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(reminder.title, options);
      return true;
    }
  } catch {
    /* repli constructeur ci-dessous */
  }
  try {
    new Notification(reminder.title, options);
    return true;
  } catch {
    return false;
  }
};

/** Cap de rythme du canal local (indépendant du serveur, propre au device). */
const capOk = (rhythm: string | undefined, now: number): boolean => {
  const last = Number(localStorage.getItem(LAST_KEY) ?? 0);
  return now - last >= rhythmCapHours(rhythm) * 3_600_000;
};

/**
 * Planificateur du canal local : vérifie chaque minute (app ouverte) si un
 * rappel est dû pour l'heure courante, dans le respect du rythme choisi.
 */
export const useLocalReminders = (state: ProfileState) => {
  // local et push sont exclusifs (une portée, pas deux canaux) : si le push
  // multi-appareils est actif, il couvre déjà ce device — pas de doublon.
  const enabled =
    state.notifPrefs?.enabled !== false &&
    state.notifPrefs?.riskReminders !== false &&
    Boolean(state.notifPrefs?.channels?.local) &&
    !state.notifPrefs?.channels?.push &&
    localPermission() === "granted";

  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const now = new Date();
      const reminder = dueReminder(state, now.getHours(), now);
      if (!reminder) return;
      if (!capOk(state.notifPrefs?.rhythm, now.getTime())) return;
      void showLocal(reminder).then((shown) => {
        if (shown) localStorage.setItem(LAST_KEY, String(Date.now()));
      });
    };
    check(); // rattrapage à l'ouverture
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [enabled, state]);
};
