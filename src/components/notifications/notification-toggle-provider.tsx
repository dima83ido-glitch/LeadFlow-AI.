"use client";

import * as React from "react";

import { getPushSubscriptionStatus } from "@/lib/actions/push";
import {
  disablePushNotifications,
  enablePushNotifications,
  getNotificationPermission,
  type EnablePushReason,
} from "@/lib/push-client";

export type NotificationToggleStatus = "unsupported" | "denied" | "enabled" | "disabled";

export type ToggleOutcome = { ok: true; status: "enabled" | "disabled" } | { ok: false; reason: EnablePushReason };

interface NotificationToggleContextValue {
  /** `undefined` until the initial permission + subscription check resolves — lets callers avoid a hydration flash. */
  status: NotificationToggleStatus | undefined;
  busy: boolean;
  toggle: () => Promise<ToggleOutcome>;
}

const NotificationToggleContext = React.createContext<NotificationToggleContextValue | null>(null);

/**
 * Single source of truth for "is push enabled" across the app (topbar
 * toggle, the settings switch, and the one-time permission banner). Reflects
 * two independent facts that must both be true for notifications to
 * actually work: the browser-level `Notification.permission`, and whether
 * we have a live subscription persisted server-side. Both are re-derived on
 * mount instead of trusting client state left over from a previous session,
 * so a refresh always shows the real current state — and because every
 * consumer reads from this one provider instead of running its own copy of
 * the check, toggling in one place (e.g. the permission banner) is reflected
 * everywhere else immediately instead of only after a refresh.
 */
export function NotificationToggleProvider({ children }: { children: React.ReactNode }) {
  const [permission, setPermission] = React.useState<NotificationPermission | "unsupported" | undefined>(undefined);
  const [subscribed, setSubscribed] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const refreshSubscriptionStatus = React.useCallback(() => {
    getPushSubscriptionStatus()
      .then(({ subscribed }) => setSubscribed(subscribed))
      .catch((error) => {
        console.error("[notifications] Failed to load push subscription status:", error);
        setSubscribed(false);
      });
  }, []);

  React.useEffect(() => {
    setPermission(getNotificationPermission());
    refreshSubscriptionStatus();

    // Keeps the toggle in sync if the user grants/revokes the permission
    // from the browser's own site-settings UI while this tab stays open —
    // not every browser supports querying "notifications" via the
    // Permissions API (e.g. older Safari), so this is best-effort.
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;

    let disposed = false;
    let status: PermissionStatus | undefined;
    const onChange = () => setPermission(getNotificationPermission());

    navigator.permissions
      .query({ name: "notifications" })
      .then((result) => {
        if (disposed) return;
        status = result;
        status.addEventListener("change", onChange);
      })
      .catch((error) => {
        console.error("[notifications] Permissions API query for 'notifications' failed:", error);
      });

    return () => {
      disposed = true;
      status?.removeEventListener("change", onChange);
    };
  }, [refreshSubscriptionStatus]);

  const status: NotificationToggleStatus | undefined =
    permission === undefined
      ? undefined
      : permission === "unsupported"
        ? "unsupported"
        : permission === "denied"
          ? "denied"
          : permission === "granted" && subscribed
            ? "enabled"
            : "disabled";

  const toggle = React.useCallback(async (): Promise<ToggleOutcome> => {
    if (busy || status === undefined) return { ok: false, reason: "UNSUPPORTED" };
    setBusy(true);
    try {
      if (status === "enabled") {
        const result = await disablePushNotifications();
        if (result.ok) {
          setSubscribed(false);
          return { ok: true, status: "disabled" };
        }
        return { ok: false, reason: "SERVER_ERROR" };
      }

      if (status === "unsupported") {
        return { ok: false, reason: "UNSUPPORTED" };
      }

      if (status === "denied") {
        // The browser won't show a prompt again once denied — asking would
        // just silently re-resolve to "denied", so skip straight to the
        // friendly explanation instead of pretending to retry.
        return { ok: false, reason: "DENIED" };
      }

      const result = await enablePushNotifications();
      setPermission(getNotificationPermission());
      if (result.ok) {
        setSubscribed(true);
        return { ok: true, status: "enabled" };
      }
      return { ok: false, reason: result.reason };
    } finally {
      setBusy(false);
    }
  }, [busy, status]);

  const value = React.useMemo<NotificationToggleContextValue>(
    () => ({ status, busy, toggle }),
    [status, busy, toggle],
  );

  return <NotificationToggleContext.Provider value={value}>{children}</NotificationToggleContext.Provider>;
}

export function useNotificationToggle(): NotificationToggleContextValue {
  const ctx = React.useContext(NotificationToggleContext);
  if (!ctx) {
    throw new Error("useNotificationToggle must be used within a NotificationToggleProvider");
  }
  return ctx;
}
