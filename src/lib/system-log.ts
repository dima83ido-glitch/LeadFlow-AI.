import { prisma } from "@/lib/db";
import type { SystemLogLevel } from "@/generated/prisma/enums";

export async function logSystemEvent(input: {
  level?: SystemLogLevel;
  message: string;
  source?: string;
  feature?: string;
  context?: Record<string, unknown>;
}) {
  await prisma.systemLog.create({
    data: {
      level: input.level ?? "INFO",
      message: input.message,
      context: { source: input.source, feature: input.feature, ...input.context },
    },
  });
}
