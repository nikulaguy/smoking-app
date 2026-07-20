import { supabase } from "./supabase";

const VAPID_PUBLIC = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

/** Web Push disponible : navigateur compatible + client Supabase + clé VAPID. */
export const pushSupported = (): boolean =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window &&
  Boolean(supabase) &&
  Boolean(VAPID_PUBLIC);

/**
 * `navigator.serviceWorker.ready` ne se résout JAMAIS tant qu'aucun SW ne
 * contrôle la page (SW encore en activation, ou purgé — ex. pendant un audit
 * Lighthouse qui vide les service workers). On borne l'attente pour ne jamais
 * bloquer l'UI : sans SW prêt, on renonce proprement plutôt que de figer un
 * `busy` qui garderait les réglages en disabled.
 */
const swReady = async (
  timeoutMs = 4000,
): Promise<ServiceWorkerRegistration | null> => {
  try {
    return await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
  } catch {
    return null;
  }
};

/** base64url → Uint8Array (format applicationServerKey). */
const urlBase64ToUint8Array = (base64: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

/** L'utilisateur est-il déjà abonné aux notifications sur cet appareil ? */
export const isPushEnabled = async (): Promise<boolean> => {
  if (!pushSupported()) return false;
  const reg = await swReady();
  return reg ? Boolean(await reg.pushManager.getSubscription()) : false;
};

/**
 * Active les rappels : demande la permission, abonne le navigateur, et
 * stocke l'abonnement côté Supabase. Retourne false si refusé/indisponible.
 */
export const enablePush = async (): Promise<boolean> => {
  if (!pushSupported() || !supabase) return false;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const reg = await swReady();
  if (!reg) return false;
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC!) as BufferSource,
    }));

  const { data } = await supabase.auth.getUser();
  if (!data.user) return false; // les rappels exigent un compte (sync serveur)

  const json = sub.toJSON();
  const { error } = await supabase.from("push_subscriptions").upsert({
    endpoint: sub.endpoint,
    user_id: data.user.id,
    subscription: json,
  });
  return !error;
};

/** Désactive les rappels : désabonne le navigateur et retire l'abonnement. */
export const disablePush = async (): Promise<void> => {
  if (!pushSupported() || !supabase) return;
  const reg = await swReady();
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
  await sub.unsubscribe();
};
