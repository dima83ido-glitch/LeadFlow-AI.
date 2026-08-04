import crypto from "node:crypto";
import { cache } from "react";
import { forbidden, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { WorkspaceRole } from "@/generated/prisma/enums";

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = crypto.randomBytes(3).toString("hex");
  return `${base || "workspace"}-${suffix}`;
}

const DEFAULT_PIPELINE_STAGES = ["New", "Contacted", "Proposal Sent", "Negotiation", "Won"];

export type BusinessOnboardingAnswers = {
  hasExistingBusiness: boolean;
  businessType?: string;
};

/**
 * Idempotent: creates a Workspace + default FREE Subscription for a user
 * that doesn't have one yet, and returns the (possibly pre-existing) workspaceId.
 * Also seeds a default set of pipeline stages — without this, a brand-new
 * workspace's CRM Pipeline page renders with zero columns and no way to add
 * one (there's no "create stage" UI), which looks broken on first login.
 *
 * `onboarding` (the registration business question) is only applied when the
 * workspace is actually created here — call sites that just need the id for
 * an already-onboarded user (the common case) omit it.
 */
export async function ensureWorkspaceForUser(
  userId: string,
  onboarding?: BusinessOnboardingAnswers,
): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.workspaceId) return user.workspaceId;

  const name = user.name ? `${user.name}'s Workspace` : "My Workspace";
  const workspace = await prisma.$transaction(async (tx) => {
    const ws = await tx.workspace.create({
      data: {
        name,
        slug: slugify(user.email),
        hasExistingBusiness: onboarding?.hasExistingBusiness ?? null,
        businessType: onboarding?.hasExistingBusiness ? onboarding.businessType?.trim() || null : null,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
        pipelineStages: {
          create: DEFAULT_PIPELINE_STAGES.map((stageName, index) => ({
            name: stageName,
            order: index,
          })),
        },
      },
    });
    await tx.user.update({
      where: { id: userId },
      data: { workspaceId: ws.id, workspaceRole: "OWNER" },
    });
    return ws;
  });

  return workspace.id;
}

export class AccountSuspendedError extends Error {
  constructor() {
    super("Account is suspended");
    this.name = "AccountSuspendedError";
  }
}

/**
 * Non-null session, redirecting to /login if absent (mirrors middleware).
 * Wrapped in React's `cache()` so the handful of Server Components that
 * each need the session (layout, topbar, the page itself) share one
 * `auth()` call per request instead of re-decoding the JWT repeatedly.
 */
export const requireSession = cache(async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
});

/**
 * The current user's full row, fetched at most once per request. Backs
 * both `getCurrentWorkspaceId` and `requireWorkspace` so they don't each
 * issue their own duplicate `prisma.user.findUnique` — also exported for
 * call sites (like the topbar avatar) that just need a user field and
 * would otherwise run their own redundant lookup.
 */
export const getCurrentUserRow = cache(async function getCurrentUserRow() {
  const session = await requireSession();
  const userId = session.user.id as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  if (user.status === "SUSPENDED") throw new AccountSuspendedError();

  return { session, userId, user };
});

export const getCurrentWorkspaceId = cache(async function getCurrentWorkspaceId(): Promise<string> {
  const { userId, user } = await getCurrentUserRow();
  if (user.workspaceId) return user.workspaceId;
  return ensureWorkspaceForUser(userId);
});

export const requireWorkspace = cache(async function requireWorkspace(): Promise<{
  workspaceId: string;
  userId: string;
  role: "USER" | "ADMIN";
  workspaceRole: WorkspaceRole;
}> {
  const { session, userId, user } = await getCurrentUserRow();
  const workspaceId = user.workspaceId ?? (await ensureWorkspaceForUser(userId));

  return {
    workspaceId,
    userId,
    role: session.user.role as "USER" | "ADMIN",
    workspaceRole: user.workspaceRole,
  };
});

/**
 * The workspace row itself (not just its id) — backs the dashboard's
 * personalization panel and the AI assistant's business-context prompt,
 * both of which need `hasExistingBusiness`/`businessType`/`personalization`.
 * `cache()`-wrapped so a request only fetches it once no matter how many
 * call sites need it.
 */
export const getCurrentWorkspaceRecord = cache(async function getCurrentWorkspaceRecord() {
  const workspaceId = await getCurrentWorkspaceId();
  return prisma.workspace.findUniqueOrThrow({ where: { id: workspaceId } });
});

/**
 * The single source of truth for "is this user allowed into the admin
 * system" — every admin page, layout, and server action must call this
 * (and must NOT wrap the call in a try/catch that would swallow the
 * `forbidden()` interrupt). Unauthenticated visitors are sent to log in
 * (via `requireSession`); authenticated non-admins get a real HTTP 403.
 */
export const requireAdmin = cache(async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    forbidden();
  }
  return session;
});
