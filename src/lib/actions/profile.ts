"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/workspace";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function updateProfile(input: { name: string; jobTitle?: string }): Promise<ActionResult> {
  try {
    const session = await requireSession();
    const name = input.name.trim();
    if (name.length < 2) return { ok: false, errorCode: "INVALID_NAME" };

    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { name, jobTitle: input.jobTitle?.trim() || null },
    });

    revalidatePath("/settings/profile");
    return { ok: true };
  } catch (error) {
    console.error("updateProfile failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function uploadAvatar(dataUri: string): Promise<ActionResult> {
  try {
    const session = await requireSession();

    if (!/^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(dataUri)) {
      return { ok: false, errorCode: "INVALID_TYPE" };
    }

    const base64Length = dataUri.slice(dataUri.indexOf(",") + 1).length;
    const approxBytes = base64Length * 0.75;
    if (approxBytes > MAX_AVATAR_BYTES) {
      return { ok: false, errorCode: "TOO_LARGE" };
    }

    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { image: dataUri },
    });

    revalidatePath("/settings/profile");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    console.error("uploadAvatar failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function removeAvatar(): Promise<ActionResult> {
  try {
    const session = await requireSession();

    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { image: null },
    });

    revalidatePath("/settings/profile");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    console.error("removeAvatar failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
