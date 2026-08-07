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

export type EnablePushReason =
  | "UNSUPPORTED"
  | "DENIED"
  | "NOT_CONFIGURED"
  | "INVALID_SUBSCRIPTION"
  | "REGISTRATION_FAILED"
  | "SERVER_ERROR";

export type EnablePushResult = { ok: true } | { ok: false; reason: EnablePushReason };

/**
 * Asks for browser permission, registers the service worker, and persists
 * the subscription server-side.
 *
 * This function's whole contract is that it never throws — every browser
 * API it touches (`Notification.requestPermission`, service worker
 * registration, `PushManager.subscribe`, ...) can reject with a
 * `DOMException` for reasons entirely outside our control (push service
 * unreachable, permission revoked mid-flight, browser-specific quirks), and
 * callers rely on always getting a typed result back so they can show the
 * right UI state instead of crashing. Every failure is logged with the real
 * `DOMException` name/message so the cause is diagnosable from the console.
 */
export async function enablePushNotifications(): Promise<EnablePushResult> {
  if (!isPushSupported()) return { ok: false, reason: "UNSUPPORTED" };

  let permission: NotificationPermission;
  try {
    permission = await Notification.requestPermission();
  } catch (error) {
    console.error("[push] Notification.requestPermission() failed:", error);
    return { ok: false, reason: "REGISTRATION_FAILED" };
  }
  if (permission !== "granted") return { ok: false, reason: "DENIED" };

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    console.error("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set — push notifications cannot be enabled.");
    return { ok: false, reason: "NOT_CONFIGURED" };
  }

  let subscription: PushSubscription;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
      }));
  } catch (error) {
    console.error("[push] Service worker registration or PushManager.subscribe() failed:", error);
    return { ok: false, reason: "REGISTRATION_FAILED" };
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    console.error("[push] Browser returned an incomplete push subscription:", json);
    return { ok: false, reason: "INVALID_SUBSCRIPTION" };
  }

  const result = await subscribeToPush({
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
  });

  if (!result.ok) {
    console.error("[push] subscribeToPush server action failed:", result.errorCode);
    return { ok: false, reason: "SERVER_ERROR" };
  }

  return { ok: true };
}

export async function disablePushNotifications(): Promise<{ ok: boolean }> {
  if (!isPushSupported()) return { ok: true };
  try {
    const registration = await navigator.serviceWorker.getRegistration("/sw.js");
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) {
      await unsubscribeFromPush(subscription.endpoint);
      await subscription.unsubscribe();
    }
    return { ok: true };
  } catch (error) {
    console.error("[push] Failed to disable push notifications:", error);
    return { ok: false };
  }
}
