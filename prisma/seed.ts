import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/db";
import * as data from "./seed-data";

const ADMIN_EMAIL = "dima83ido@gmail.com";
const ADMIN_NAME = "Dmitry";

function generatePassword(length = 20) {
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => charset[byte % charset.length]).join("");
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function hoursFromNow(n: number) {
  return new Date(Date.now() + n * 60 * 60 * 1000);
}

async function seedWorkspace(workspaceId: string) {
  // Idempotent re-seed: wipe this workspace's demo rows in FK-safe order.
  await prisma.campaignEmail.deleteMany({ where: { campaign: { workspaceId } } });
  await prisma.campaign.deleteMany({ where: { workspaceId } });
  await prisma.template.deleteMany({ where: { workspaceId } });
  await prisma.note.deleteMany({ where: { workspaceId } });
  await prisma.task.deleteMany({ where: { workspaceId } });
  await prisma.meeting.deleteMany({ where: { workspaceId } });
  await prisma.deal.deleteMany({ where: { workspaceId } });
  await prisma.pipelineStage.deleteMany({ where: { workspaceId } });
  await prisma.lead.deleteMany({ where: { workspaceId } });
  await prisma.contact.deleteMany({ where: { workspaceId } });
  await prisma.company.deleteMany({ where: { workspaceId } });

  const stageIdByKey = new Map<string, string>();
  for (const s of data.pipelineStages) {
    const row = await prisma.pipelineStage.create({
      data: { workspaceId, name: s.name, order: s.order },
    });
    stageIdByKey.set(s.key, row.id);
  }

  const companyIdByKey = new Map<string, string>();
  for (const c of data.companies) {
    const row = await prisma.company.create({
      data: {
        workspaceId,
        name: c.name,
        domain: c.domain,
        industry: c.industry,
        size: c.size,
        country: c.country,
        city: c.city,
        address: "address" in c ? c.address : undefined,
        socials: "socials" in c ? c.socials : undefined,
        createdAt: daysAgo(c.daysAgo),
      },
    });
    companyIdByKey.set(c.key, row.id);
  }

  const contactIdByKey = new Map<string, string>();
  for (const ct of data.contacts) {
    const row = await prisma.contact.create({
      data: {
        workspaceId,
        companyId: ct.companyKey ? companyIdByKey.get(ct.companyKey) : undefined,
        firstName: ct.firstName,
        lastName: ct.lastName,
        email: ct.email ?? undefined,
        phone: ct.phone ?? undefined,
        jobTitle: ct.jobTitle,
        telegramUsername: ct.telegramUsername ?? undefined,
        createdAt: daysAgo(ct.daysAgo),
      },
    });
    contactIdByKey.set(ct.key, row.id);
  }

  for (const lead of data.leads) {
    await prisma.lead.create({
      data: {
        workspaceId,
        companyName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email ?? undefined,
        phone: lead.phone ?? undefined,
        website: lead.website,
        country: lead.country,
        city: lead.city,
        industry: lead.industry,
        rating: lead.rating,
        status: lead.status as never,
        source: lead.source,
        companyId: lead.companyKey ? companyIdByKey.get(lead.companyKey) : undefined,
        createdAt: daysAgo(lead.daysAgo),
        updatedAt: daysAgo(Math.max(0, lead.daysAgo - 2)),
      },
    });
  }

  for (const d of data.deals) {
    await prisma.deal.create({
      data: {
        workspaceId,
        pipelineStageId: stageIdByKey.get(d.stageKey)!,
        companyId: d.companyKey ? companyIdByKey.get(d.companyKey) : undefined,
        contactId: d.contactKey ? contactIdByKey.get(d.contactKey) : undefined,
        title: d.title,
        value: d.value,
        status: d.status as never,
        closeDate: hoursFromNow(d.closeInDays * 24),
        createdAt: daysAgo(d.daysAgo),
      },
    });
  }

  for (const m of data.meetings) {
    const start = hoursFromNow(m.startInHours);
    await prisma.meeting.create({
      data: {
        workspaceId,
        title: m.title,
        contactId: m.contactKey ? contactIdByKey.get(m.contactKey) : undefined,
        startTime: start,
        endTime: new Date(start.getTime() + m.durationMinutes * 60 * 1000),
        location: m.location,
        status: m.status as never,
      },
    });
  }

  const adminUser = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  for (const t of data.tasks) {
    const relatedLead = t.relatedLeadCompany
      ? await prisma.lead.findFirst({ where: { workspaceId, companyName: t.relatedLeadCompany } })
      : null;
    await prisma.task.create({
      data: {
        workspaceId,
        title: t.title,
        description: t.description ?? undefined,
        status: t.status as never,
        priority: t.priority as never,
        dueDate: hoursFromNow(t.dueInDays * 24),
        assigneeId: adminUser?.id,
        relatedLeadId: relatedLead?.id,
      },
    });
  }

  for (const n of data.notes) {
    await prisma.note.create({
      data: {
        workspaceId,
        content: n.content,
        authorId: adminUser?.id,
        companyId: n.companyKey ? companyIdByKey.get(n.companyKey) : undefined,
        contactId: n.contactKey ? contactIdByKey.get(n.contactKey) : undefined,
        createdAt: daysAgo(n.daysAgo),
      },
    });
  }

  const templateIdByKey = new Map<string, string>();
  for (const t of data.templates) {
    const row = await prisma.template.create({
      data: {
        workspaceId,
        name: t.name,
        category: t.category,
        subject: t.subject,
        body: t.body,
        isAiGenerated: t.isAiGenerated,
      },
    });
    templateIdByKey.set(t.key, row.id);
  }

  for (const c of data.campaigns) {
    const createdAt = daysAgo(c.daysAgo);
    const campaign = await prisma.campaign.create({
      data: {
        workspaceId,
        name: c.name,
        status: c.status as never,
        subject: c.subject || undefined,
        templateId: c.templateKey ? templateIdByKey.get(c.templateKey) : undefined,
        sentCount: c.sentCount,
        openCount: c.openCount,
        replyCount: c.replyCount,
        clickCount: c.clickCount,
        createdAt,
        updatedAt: daysAgo(Math.max(0, c.daysAgo - 3)),
      },
    });

    // Spread a handful of representative CampaignEmail rows across the
    // campaign's active window so time-bucketed email analytics has data.
    for (let i = 0; i < c.emailBatches; i++) {
      const sentAt = daysAgo(Math.max(0, c.daysAgo - i * 3));
      const opened = i % 2 === 0;
      const replied = i % 3 === 0;
      const clicked = i % 2 === 0;
      await prisma.campaignEmail.create({
        data: {
          campaignId: campaign.id,
          sentAt,
          openedAt: opened ? new Date(sentAt.getTime() + 2 * 60 * 60 * 1000) : undefined,
          repliedAt: replied ? new Date(sentAt.getTime() + 6 * 60 * 60 * 1000) : undefined,
          clickedAt: clicked ? new Date(sentAt.getTime() + 3 * 60 * 60 * 1000) : undefined,
        },
      });
    }
  }
}

async function seedAdminSubscriptionAndPayments(workspaceId: string) {
  const subscription = await prisma.subscription.upsert({
    where: { workspaceId },
    update: { plan: "PRO", status: "ACTIVE" },
    create: { workspaceId, plan: "PRO", status: "ACTIVE" },
  });

  await prisma.payment.deleteMany({ where: { workspaceId } });
  for (const p of data.payments) {
    await prisma.payment.create({
      data: {
        workspaceId,
        subscriptionId: subscription.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status as never,
        description: p.description,
        method: ("method" in p ? p.method : "CARD") as never,
        cryptoAsset: "cryptoAsset" in p ? p.cryptoAsset : undefined,
        cryptoTxHash: "cryptoTxHash" in p ? p.cryptoTxHash : undefined,
        createdAt: daysAgo(p.daysAgo),
      },
    });
  }
}

async function seedPlatformConfig() {
  for (const pc of data.planConfigs) {
    await prisma.planConfig.upsert({
      where: { plan: pc.plan as never },
      update: {
        priceCents: pc.priceCents,
        leadSearchLimit: pc.leadSearchLimit,
        campaignLimit: pc.campaignLimit,
        aiToolLimit: pc.aiToolLimit,
        seatsLimit: pc.seatsLimit,
      },
      create: {
        plan: pc.plan as never,
        priceCents: pc.priceCents,
        leadSearchLimit: pc.leadSearchLimit,
        campaignLimit: pc.campaignLimit,
        aiToolLimit: pc.aiToolLimit,
        seatsLimit: pc.seatsLimit,
      },
    });
  }

  for (const ff of data.featureFlags) {
    await prisma.featureFlag.upsert({
      where: { key: ff.key },
      update: { label: ff.label, description: ff.description, enabled: ff.enabled },
      create: ff,
    });
  }

  for (const s of data.appSettings) {
    await prisma.appSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
}

async function seedSystemLogs() {
  await prisma.systemLog.deleteMany({});
  for (const log of data.systemLogs) {
    await prisma.systemLog.create({
      data: {
        level: log.level as never,
        message: log.message,
        context: { source: "source" in log ? log.source : undefined, feature: "feature" in log ? log.feature : undefined },
        createdAt: new Date(Date.now() - log.daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }
}

async function main() {
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", password: passwordHash },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("ADMIN_ACCOUNT_CREATED");
  console.log(`email: ${user.email}`);
  console.log(`password: ${password}`);
  console.log(`role: ${user.role}`);

  let workspaceId = user.workspaceId;
  if (!workspaceId) {
    const workspace = await prisma.workspace.create({
      data: { name: `${user.name}'s Workspace`, slug: `admin-${crypto.randomBytes(3).toString("hex")}` },
    });
    await prisma.user.update({ where: { id: user.id }, data: { workspaceId: workspace.id, workspaceRole: "OWNER" } });
    workspaceId = workspace.id;
  }

  await seedAdminSubscriptionAndPayments(workspaceId);
  await seedWorkspace(workspaceId);
  await seedPlatformConfig();
  await seedSystemLogs();

  console.log("SEED_COMPLETE");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
