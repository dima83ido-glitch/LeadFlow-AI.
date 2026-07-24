import crypto from "node:crypto";
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

/**
 * Idempotent: creates a Workspace + default FREE Subscription for a user
 * that doesn't have one yet, and returns the (possibly pre-existing) workspaceId.
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

/** Non-null session, redirecting to /login if absent (mirrors middleware). */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function getCurrentWorkspaceId(): Promise<string> {
  const session = await requireSession();
  const userId = session.user.id as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  if (user.status === "SUSPENDED") throw new AccountSuspendedError();

  if (user.workspaceId) return user.workspaceId;
  return ensureWorkspaceForUser(userId);
}

export async function requireWorkspace(): Promise<{
  workspaceId: string;
  userId: string;
  role: "USER" | "ADMIN";
  workspaceRole: WorkspaceRole;
}> {
  const session = await requireSession();
  const userId = session.user.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  if (user.status === "SUSPENDED") throw new AccountSuspendedError();

  const workspaceId = user.workspaceId ?? (await ensureWorkspaceForUser(userId));

  return {
    workspaceId,
    userId,
    role: session.user.role as "USER" | "ADMIN",
    workspaceRole: user.workspaceRole,
  };
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return session;
}
