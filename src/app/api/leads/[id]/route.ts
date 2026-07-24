import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let workspaceId: string;
  try {
    workspaceId = await getCurrentWorkspaceId();
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const lead = await prisma.lead.findFirst({
    where: { id, workspaceId },
    select: { companyName: true },
  });

  if (!lead) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ companyName: lead.companyName });
}
