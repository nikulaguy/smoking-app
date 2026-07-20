// SmokingApp · envoi Web Push (VAPID). Convertit nos clés VAPID base64url
// (format web-push) en CryptoKeyPair pour @negrel/webpush, puis pousse un
// message chiffré à un abonnement. Réutilisable par push-send et le fan-out.

import * as webpush from "jsr:@negrel/webpush@0.3";

const b64urlToBytes = (s: string): Uint8Array => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw], (c) => c.charCodeAt(0));
};
const bytesToB64url = (b: Uint8Array): string =>
  btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Construit l'ApplicationServer à partir des clés VAPID base64url. */
export const makeAppServer = async () => {
  const pub = b64urlToBytes(Deno.env.get("VAPID_PUBLIC_KEY")!); // 65o : 0x04|X|Y
  const priv = Deno.env.get("VAPID_PRIVATE_KEY")!; // scalaire d (32o base64url)
  const x = bytesToB64url(pub.slice(1, 33));
  const y = bytesToB64url(pub.slice(33, 65));
  const alg = { name: "ECDSA", namedCurve: "P-256" } as const;
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x, y, ext: true },
    alg,
    true,
    [],
  );
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x, y, d: priv, ext: true },
    alg,
    true,
    ["sign"],
  );
  return webpush.ApplicationServer.new({
    contactInformation: Deno.env.get("VAPID_SUBJECT") ?? "mailto:contact@smokingapp",
    vapidKeys: { publicKey, privateKey },
  });
};

export type PushPayload = { title: string; body: string; url?: string; tag?: string };

/** Pousse le payload à un abonnement. Retourne false si l'abonnement est
 *  mort (404/410) — l'appelant doit alors le supprimer. */
export const pushTo = async (
  appServer: Awaited<ReturnType<typeof makeAppServer>>,
  subscription: webpush.PushSubscription,
  payload: PushPayload,
): Promise<{ ok: boolean; gone: boolean }> => {
  try {
    const subscriber = appServer.subscribe(subscription);
    await subscriber.pushTextMessage(JSON.stringify(payload), {});
    return { ok: true, gone: false };
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    return { ok: false, gone: status === 404 || status === 410 };
  }
};
