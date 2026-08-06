import { z } from "zod";

import type { AiTool } from "@/lib/ai/types";
import { createCampaign } from "@/lib/actions/campaigns";
import { createLead } from "@/lib/actions/leads";
import { createContact } from "@/lib/actions/contacts";
import { createCompany } from "@/lib/actions/companies";
import { createMeeting } from "@/lib/actions/meetings";
import { createTask } from "@/lib/actions/tasks";
import { draftEmail } from "@/lib/actions/ai-email-draft";
import { translateEmail } from "@/lib/actions/ai-translate-email";
import { generateMarketingPlan } from "@/lib/actions/ai-marketing-plan";
import { analyzeLandingPage } from "@/lib/actions/ai-landing-page-analyzer";
import { analyzeSeo } from "@/lib/actions/ai-seo-audit";
import { LANGUAGES } from "@/lib/languages";

export type AssistantToolContext = { workspaceId: string; userId: string; locale: string };
export type ToolExecutionResult = { ok: boolean; summary: string };

interface ToolSpec<Args> {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  schema: z.ZodType<Args>;
  execute: (args: Args, ctx: AssistantToolContext) => Promise<ToolExecutionResult>;
}

function threeDaysFromNow(): string {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
}

const createCampaignTool: ToolSpec<{ name: string; subject?: string }> = {
  name: "create_campaign",
  description: "Create a new email campaign in the workspace (starts as a draft).",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "Campaign name" },
      subject: { type: "string", description: "Email subject line for the campaign" },
    },
    required: ["name"],
    additionalProperties: false,
  },
  schema: z.object({ name: z.string().min(1), subject: z.string().optional() }),
  execute: async (args) => {
    const result = await createCampaign({ name: args.name, subject: args.subject });
    return result.ok
      ? { ok: true, summary: `Created campaign "${args.name}" (status: draft).` }
      : { ok: false, summary: `Failed to create campaign (${result.errorCode}).` };
  },
};

const createLeadTool: ToolSpec<{
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  industry?: string;
  source?: string;
}> = {
  name: "create_lead",
  description: "Add a new lead to the workspace.",
  parameters: {
    type: "object",
    properties: {
      companyName: { type: "string", description: "The lead's company name" },
      contactName: { type: "string", description: "Name of the contact person" },
      email: { type: "string", description: "Contact email address" },
      phone: { type: "string", description: "Contact phone number" },
      website: { type: "string", description: "Company website" },
      country: { type: "string", description: "Country" },
      city: { type: "string", description: "City" },
      industry: { type: "string", description: "Industry" },
      source: { type: "string", description: "Where this lead came from" },
    },
    required: ["companyName"],
    additionalProperties: false,
  },
  schema: z.object({
    companyName: z.string().min(1),
    contactName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    industry: z.string().optional(),
    source: z.string().optional(),
  }),
  execute: async (args) => {
    const result = await createLead(args);
    return result.ok
      ? { ok: true, summary: `Added lead "${args.companyName}".` }
      : { ok: false, summary: `Failed to add lead (${result.errorCode}).` };
  },
};

const createContactTool: ToolSpec<{
  firstName: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  telegramUsername?: string;
}> = {
  name: "create_contact",
  description: "Add a new CRM contact to the workspace.",
  parameters: {
    type: "object",
    properties: {
      firstName: { type: "string", description: "Contact's first name" },
      lastName: { type: "string", description: "Contact's last name" },
      email: { type: "string", description: "Contact's email address" },
      jobTitle: { type: "string", description: "Contact's job title" },
      telegramUsername: { type: "string", description: "Contact's Telegram username" },
    },
    required: ["firstName"],
    additionalProperties: false,
  },
  schema: z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional(),
    email: z.string().optional(),
    jobTitle: z.string().optional(),
    telegramUsername: z.string().optional(),
  }),
  execute: async (args) => {
    const result = await createContact(args);
    return result.ok
      ? { ok: true, summary: `Added contact "${args.firstName}${args.lastName ? ` ${args.lastName}` : ""}".` }
      : { ok: false, summary: `Failed to add contact (${result.errorCode}).` };
  },
};

const createCompanyTool: ToolSpec<{
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  country?: string;
  city?: string;
}> = {
  name: "create_company",
  description: "Add a new company to the workspace.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "Company name" },
      domain: { type: "string", description: "Company website domain" },
      industry: { type: "string", description: "Industry" },
      size: { type: "string", description: "Company size, e.g. '1-10', '50-200'" },
      country: { type: "string", description: "Country" },
      city: { type: "string", description: "City" },
    },
    required: ["name"],
    additionalProperties: false,
  },
  schema: z.object({
    name: z.string().min(1),
    domain: z.string().optional(),
    industry: z.string().optional(),
    size: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
  }),
  execute: async (args) => {
    const result = await createCompany(args);
    return result.ok
      ? { ok: true, summary: `Added company "${args.name}".` }
      : { ok: false, summary: `Failed to add company (${result.errorCode}).` };
  },
};

const createMeetingTool: ToolSpec<{ title: string; startTime: string; location?: string }> = {
  name: "create_meeting",
  description: "Schedule a meeting on the workspace calendar.",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Meeting title" },
      startTime: { type: "string", description: "Meeting start time as an ISO 8601 datetime string" },
      location: { type: "string", description: "Meeting location or video call link" },
    },
    required: ["title", "startTime"],
    additionalProperties: false,
  },
  schema: z.object({ title: z.string().min(1), startTime: z.string().min(1), location: z.string().optional() }),
  execute: async (args) => {
    const result = await createMeeting(args);
    return result.ok
      ? { ok: true, summary: `Scheduled meeting "${args.title}" at ${args.startTime}.` }
      : { ok: false, summary: `Failed to schedule meeting (${result.errorCode}).` };
  },
};

const createTaskTool: ToolSpec<{
  title: string;
  description?: string;
  dueDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}> = {
  name: "create_task",
  description: "Create a task in the workspace.",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Task title" },
      description: { type: "string", description: "Task details" },
      dueDate: { type: "string", description: "Due date as an ISO 8601 datetime string" },
      priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], description: "Task priority" },
    },
    required: ["title", "priority"],
    additionalProperties: false,
  },
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  }),
  execute: async (args) => {
    const result = await createTask(args);
    return result.ok
      ? { ok: true, summary: `Created task "${args.title}" (priority: ${args.priority}).` }
      : { ok: false, summary: `Failed to create task (${result.errorCode}).` };
  },
};

const draftEmailTool: ToolSpec<{ purpose: string; recipient: string; tone: string; keyPoints: string }> = {
  name: "draft_email",
  description: "Draft an email (subject + body). This does NOT send the email — it only produces a draft to show the user.",
  parameters: {
    type: "object",
    properties: {
      purpose: { type: "string", description: "What the email is for" },
      recipient: { type: "string", description: "Who the email is being sent to" },
      tone: { type: "string", description: "Desired tone, e.g. 'friendly', 'formal', 'persuasive'" },
      keyPoints: { type: "string", description: "Key points the email must include" },
    },
    required: ["purpose", "recipient", "tone", "keyPoints"],
    additionalProperties: false,
  },
  schema: z.object({
    purpose: z.string().min(1),
    recipient: z.string().min(1),
    tone: z.string().min(1),
    keyPoints: z.string().min(1),
  }),
  execute: async (args) => {
    const result = await draftEmail(args);
    return result.ok
      ? { ok: true, summary: `DRAFT (not sent) — Subject: ${result.data.subject}\n\n${result.data.body}` }
      : { ok: false, summary: `Failed to draft email (${result.errorCode}).` };
  },
};

const translateEmailTool: ToolSpec<{ text: string; languageCode: string }> = {
  name: "translate_email",
  description: `Translate email text into another language. languageCode must be one of: ${LANGUAGES.map((l) => l.code).join(", ")}.`,
  parameters: {
    type: "object",
    properties: {
      text: { type: "string", description: "The email text to translate" },
      languageCode: { type: "string", description: "ISO language code to translate into" },
    },
    required: ["text", "languageCode"],
    additionalProperties: false,
  },
  schema: z.object({ text: z.string().min(1), languageCode: z.string().min(1) }),
  execute: async (args) => {
    const result = await translateEmail(args.text, args.languageCode);
    return result.ok
      ? { ok: true, summary: `Translated: ${result.data.translatedText}` }
      : { ok: false, summary: `Failed to translate (${result.errorCode}).` };
  },
};

const marketingPlanSchema = z.object({
  businessName: z.string().min(1),
  industry: z.string().min(1),
  targetAudience: z.string().min(1),
  marketingGoals: z.string().min(1),
  monthlyBudget: z.string().min(1),
  timeline: z.string().min(1),
  biggestChallenge: z.string().min(1),
  uniqueSellingProposition: z.string().min(1),
  products: z.string().optional(),
  services: z.string().optional(),
  socialNetworks: z.string().optional(),
  hasEmailList: z.boolean().optional(),
  currentMarketingActivities: z.string().optional(),
});

const generateMarketingPlanTool: ToolSpec<z.infer<typeof marketingPlanSchema>> = {
  name: "generate_marketing_plan",
  description: "Generate a full marketing strategy for the user's business. Requires all listed fields.",
  parameters: {
    type: "object",
    properties: {
      businessName: { type: "string" },
      industry: { type: "string" },
      targetAudience: { type: "string" },
      marketingGoals: { type: "string" },
      monthlyBudget: { type: "string" },
      timeline: { type: "string" },
      biggestChallenge: { type: "string" },
      uniqueSellingProposition: { type: "string" },
      products: { type: "string" },
      services: { type: "string" },
      socialNetworks: { type: "string" },
      hasEmailList: { type: "boolean" },
      currentMarketingActivities: { type: "string" },
    },
    required: [
      "businessName",
      "industry",
      "targetAudience",
      "marketingGoals",
      "monthlyBudget",
      "timeline",
      "biggestChallenge",
      "uniqueSellingProposition",
    ],
    additionalProperties: false,
  },
  schema: marketingPlanSchema,
  execute: async (args) => {
    const result = await generateMarketingPlan({
      businessName: args.businessName,
      industry: args.industry,
      targetAudience: args.targetAudience,
      products: args.products ?? "",
      services: args.services ?? "",
      marketingGoals: args.marketingGoals,
      monthlyBudget: args.monthlyBudget,
      timeline: args.timeline,
      socialNetworks: args.socialNetworks ?? "",
      hasEmailList: args.hasEmailList ?? false,
      currentMarketingActivities: args.currentMarketingActivities ?? "",
      biggestChallenge: args.biggestChallenge,
      uniqueSellingProposition: args.uniqueSellingProposition,
    });
    return result.ok
      ? {
          ok: true,
          summary: `Generated a full marketing plan. Executive summary: ${result.data.executiveSummary} Key recommendations: ${result.data.recommendations.join("; ")}`,
        }
      : { ok: false, summary: `Failed to generate marketing plan (${result.errorCode}).` };
  },
};

const analyzeLandingPageTool: ToolSpec<{ url: string }> = {
  name: "analyze_landing_page",
  description: "Analyze a landing page URL for conversion rate optimization issues.",
  parameters: {
    type: "object",
    properties: { url: { type: "string", description: "The landing page URL to analyze" } },
    required: ["url"],
    additionalProperties: false,
  },
  schema: z.object({ url: z.string().min(1) }),
  execute: async (args) => {
    const result = await analyzeLandingPage(args.url);
    return result.ok
      ? {
          ok: true,
          summary: `Landing page score: ${result.data.score}/100. Findings: ${result.data.findings.map((f) => `[${f.status}] ${f.label}: ${f.detail}`).join(" | ")}`,
        }
      : { ok: false, summary: `Failed to analyze landing page (${result.errorCode}).` };
  },
};

const analyzeSeoTool: ToolSpec<{ url: string }> = {
  name: "analyze_seo",
  description: "Run an SEO health audit on a URL.",
  parameters: {
    type: "object",
    properties: { url: { type: "string", description: "The URL to audit" } },
    required: ["url"],
    additionalProperties: false,
  },
  schema: z.object({ url: z.string().min(1) }),
  execute: async (args) => {
    const result = await analyzeSeo(args.url);
    return result.ok
      ? {
          ok: true,
          summary: `SEO score: ${result.data.score}/100. Findings: ${result.data.findings.map((f) => `[${f.status}] ${f.label}: ${f.detail}`).join(" | ")}`,
        }
      : { ok: false, summary: `Failed to run SEO audit (${result.errorCode}).` };
  },
};

const captureWebsiteBriefTool: ToolSpec<{
  siteName: string;
  siteType: string;
  pagesNeeded: string;
  styleNotes?: string;
  budget?: string;
  deadline?: string;
}> = {
  name: "capture_website_brief",
  description:
    "Capture a website-creation brief as a task for the team to build the site. There is no automated site generator — this creates a real task the team will execute on.",
  parameters: {
    type: "object",
    properties: {
      siteName: { type: "string", description: "Business or site name" },
      siteType: { type: "string", description: "Type of site, e.g. 'marketing landing page', 'e-commerce store'" },
      pagesNeeded: { type: "string", description: "Pages/sections needed" },
      styleNotes: { type: "string", description: "Branding/style preferences" },
      budget: { type: "string", description: "Budget" },
      deadline: { type: "string", description: "Desired deadline" },
    },
    required: ["siteName", "siteType", "pagesNeeded"],
    additionalProperties: false,
  },
  schema: z.object({
    siteName: z.string().min(1),
    siteType: z.string().min(1),
    pagesNeeded: z.string().min(1),
    styleNotes: z.string().optional(),
    budget: z.string().optional(),
    deadline: z.string().optional(),
  }),
  execute: async (args) => {
    const description = [
      `Site type: ${args.siteType}`,
      `Pages needed: ${args.pagesNeeded}`,
      args.styleNotes ? `Style notes: ${args.styleNotes}` : null,
      args.budget ? `Budget: ${args.budget}` : null,
      args.deadline ? `Deadline: ${args.deadline}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await createTask({
      title: `Website brief: ${args.siteName}`,
      description,
      dueDate: threeDaysFromNow(),
      priority: "MEDIUM",
    });
    return result.ok
      ? { ok: true, summary: `Captured website brief for "${args.siteName}" as a task for the team.` }
      : { ok: false, summary: `Failed to capture website brief (${result.errorCode}).` };
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ASSISTANT_TOOLS: ToolSpec<any>[] = [
  createCampaignTool,
  createLeadTool,
  createContactTool,
  createCompanyTool,
  createMeetingTool,
  createTaskTool,
  draftEmailTool,
  translateEmailTool,
  generateMarketingPlanTool,
  analyzeLandingPageTool,
  analyzeSeoTool,
  captureWebsiteBriefTool,
];

export function getAssistantTools(): AiTool[] {
  return ASSISTANT_TOOLS.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

export async function executeAssistantTool(
  name: string,
  rawArgs: unknown,
  ctx: AssistantToolContext,
): Promise<ToolExecutionResult> {
  const tool = ASSISTANT_TOOLS.find((t) => t.name === name);
  if (!tool) return { ok: false, summary: `Unknown tool: ${name}` };

  const parsed = tool.schema.safeParse(rawArgs);
  if (!parsed.success) return { ok: false, summary: `Invalid arguments for ${name}: ${parsed.error.message}` };

  try {
    return await tool.execute(parsed.data, ctx);
  } catch (error) {
    console.error(`Assistant tool "${name}" execution failed:`, error);
    return { ok: false, summary: `Tool ${name} failed unexpectedly.` };
  }
}
