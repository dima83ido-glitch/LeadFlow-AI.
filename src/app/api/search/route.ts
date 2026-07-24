import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";

const TAKE = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  let workspaceId: string;
  try {
    workspaceId = await getCurrentWorkspaceId();
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (q.length < 2) {
    return NextResponse.json({
      leads: [], contacts: [], companies: [], meetings: [], tasks: [], notes: [], templates: [], campaigns: [],
    });
  }

  const contains = { contains: q, mode: "insensitive" as const };

  const [leads, contacts, companies, meetings, tasks, notes, templates, campaigns] = await Promise.all([
    prisma.lead.findMany({
      where: { workspaceId, OR: [{ companyName: contains }, { contactName: contains }, { email: contains }] },
      take: TAKE,
      select: { id: true, companyName: true, contactName: true },
    }),
    prisma.contact.findMany({
      where: { workspaceId, OR: [{ firstName: contains }, { lastName: contains }, { email: contains }] },
      take: TAKE,
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.company.findMany({
      where: { workspaceId, name: contains },
      take: TAKE,
      select: { id: true, name: true },
    }),
    prisma.meeting.findMany({
      where: { workspaceId, title: contains },
      take: TAKE,
      select: { id: true, title: true },
    }),
    prisma.task.findMany({
      where: { workspaceId, title: contains },
      take: TAKE,
      select: { id: true, title: true },
    }),
    prisma.note.findMany({
      where: { workspaceId, content: contains },
      take: 3,
      select: { id: true, content: true },
    }),
    prisma.template.findMany({
      where: { workspaceId, OR: [{ name: contains }, { subject: contains }] },
      take: TAKE,
      select: { id: true, name: true },
    }),
    prisma.campaign.findMany({
      where: { workspaceId, name: contains },
      take: TAKE,
      select: { id: true, name: true },
    }),
  ]);

  return NextResponse.json({ leads, contacts, companies, meetings, tasks, notes, templates, campaigns });
}
