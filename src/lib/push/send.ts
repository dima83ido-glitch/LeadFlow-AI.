import webpush from "web-push";

import { prisma } from "@/lib/db";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;
const vapidConfigured = Boolean(vapidPublicKey && vapidPrivateKey && vapidSubject);

if (vapidConfigured) {
  webpush.setVapidDetails(vapidSubject!, vapidPublicKey!, vapidPrivateKey!);
}

export interface PushPayload {
  title: string;
  body: string;
  url: string;
}

/**
 * Sends a push to every subscription registered for a user, pruning any
 * that the push service reports as gone (404/410 — the standard signal a
 * subscription has expired or the user uninstalled/blocked it) so future
 * sweeps stop wasting a request on it.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  if (!vapidConfigured) return;

  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error("sendPushToUser failed:", error);
        }
      }
    }),
  );
}
