import type { Metadata } from "next";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/workspace";
import { ProfileView } from "@/components/settings/profile-view";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfileSettingsPage() {
  const session = await requireSession();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id as string },
    select: { name: true, email: true, jobTitle: true, image: true },
  });

  return (
    <ProfileView
      initialData={{
        name: user.name ?? "",
        email: user.email,
        jobTitle: user.jobTitle ?? "",
        image: user.image,
      }}
    />
  );
}
