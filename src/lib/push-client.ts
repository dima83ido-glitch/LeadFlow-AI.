import { subscribeToPush, unsubscribeFromPush } from "@/lib/actions/push";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

export type EnablePushResult =
  | { ok: true }
  | { ok: false; reason: "UNSUPPORTED" | "DENIED" | "NOT_CONFIGURED" | "INVALID_SUBSCRIPTION" | "SERVER_ERROR" };

/** Asks for browser permission, registers the service worker, and persists the subscription server-side. */
export async function enablePushNotifications(): Promise<EnablePushResult> {
  if (!isPushSupported()) return { ok: false, reason: "UNSUPPORTED" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: "DENIED" };

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) return { ok: false, reason: "NOT_CONFIGURED" };

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
    });
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return { ok: false, reason: "INVALID_SUBSCRIPTION" };
  }

  const result = await subscribeToPush({
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
  });

  return result.ok ? { ok: true } : { ok: false, reason: "SERVER_ERROR" };
}

export async function disablePushNotifications(): Promise<void> {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await unsubscribeFromPush(subscription.endpoint);
    await subscription.unsubscribe();
  }
}
