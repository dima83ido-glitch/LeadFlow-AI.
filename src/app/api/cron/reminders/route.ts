import { NextResponse } from "next/server";

import { runReminderSweep } from "@/lib/reminders/run";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const summary = await runReminderSweep();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    console.error("reminder sweep failed:", error);
    return NextResponse.json({ ok: false, error: "SWEEP_FAILED" }, { status: 500 });
  }
}
