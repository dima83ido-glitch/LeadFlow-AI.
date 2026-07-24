import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { ensureWorkspaceForUser } from "@/lib/workspace";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errorCode: "INVALID_INPUT", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ errorCode: "EMAIL_EXISTS" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  await ensureWorkspaceForUser(user.id);

  return NextResponse.json({ user }, { status: 201 });
}
