import crypto from "node:crypto";
import { cache } from "react";
import { redirect } from "next/navigation";

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

/**
 * Idempotent: creates a Workspace + default FREE Subscription for a user
 * that doesn't have one yet, and returns the (possibly pre-existing) workspaceId.
 * Also seeds a default set of pipeline stages — without this, a brand-new
 * workspace's CRM Pipeline page renders with zero columns and no way to add
 * one (there's no "create stage" UI), which looks broken on first login.
 */
export async function ensureWorkspaceForUser(userId: string): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.workspaceId) return user.workspaceId;

  const name = user.name ? `${user.name}'s Workspace` : "My Workspace";
  const workspace = await prisma.$transaction(async (tx) => {
    const ws = await tx.workspace.create({
      data: {
        name,
        slug: slugify(user.email),
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

export const requireAdmin = cache(async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return session;
});
