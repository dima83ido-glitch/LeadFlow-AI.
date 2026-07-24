// Demo dataset for the seeded admin workspace. Cross-entity references use
// stable string keys (e.g. "co_1") resolved to real DB ids in prisma/seed.ts —
// these are NOT real Prisma ids. Company/contact names intentionally match
// what previously lived in src/lib/mock/* for visual continuity.

export const pipelineStages = [
  { key: "stage_1", name: "New", order: 1 },
  { key: "stage_2", name: "Contacted", order: 2 },
  { key: "stage_3", name: "Proposal Sent", order: 3 },
  { key: "stage_4", name: "Negotiation", order: 4 },
  { key: "stage_5", name: "Won", order: 5 },
];

export const companies = [
  { key: "co_1", name: "Northwind Analytics", domain: "northwindanalytics.com", industry: "Data & Analytics", size: "51-200", country: "United States", city: "San Francisco", address: "455 Market St, San Francisco, CA", socials: { linkedin: "linkedin.com/company/northwind-analytics" }, daysAgo: 5 },
  { key: "co_2", name: "Fjord Studio", domain: "fjordstudio.no", industry: "Design Agency", size: "11-50", country: "Norway", city: "Oslo", socials: { linkedin: "linkedin.com/company/fjord-studio", instagram: "@fjordstudio" }, daysAgo: 9 },
  { key: "co_3", name: "Kaido Robotics", domain: "kaidorobotics.jp", industry: "Robotics", size: "51-200", country: "Japan", city: "Tokyo", socials: { linkedin: "linkedin.com/company/kaido-robotics" }, daysAgo: 29 },
  { key: "co_4", name: "Meridian Health Partners", domain: "meridianhealth.com", industry: "Healthcare", size: "501-1000", country: "United States", city: "Austin", address: "600 Congress Ave, Austin, TX", daysAgo: 11 },
  { key: "co_5", name: "Lumen Interiors", domain: "luminteriors.fr", industry: "Interior Design", size: "1-10", country: "France", city: "Lyon", socials: { instagram: "@luminteriors" }, daysAgo: 14 },
  { key: "co_6", name: "Atlas Freight Co.", domain: "atlasfreight.com", industry: "Logistics", size: "11-50", country: "United States", city: "Chicago", daysAgo: 1 },
  { key: "co_7", name: "Sable & Finch Law", domain: "sablefinchlaw.co.uk", industry: "Legal Services", size: "11-50", country: "United Kingdom", city: "London", address: "22 Chancery Lane, London", daysAgo: 22 },
];

export const contacts = [
  { key: "ct_1", companyKey: "co_1", firstName: "Ava", lastName: "Chen", email: "ava.chen@northwindanalytics.com", phone: "+1 (415) 555-0142", jobTitle: "VP of Data", telegramUsername: "ava_chen", daysAgo: 5 },
  { key: "ct_2", companyKey: "co_2", firstName: "Lars", lastName: "Eriksen", email: "lars@fjordstudio.no", phone: "+47 21 93 44 10", jobTitle: "Creative Director", telegramUsername: null, daysAgo: 9 },
  { key: "ct_3", companyKey: "co_3", firstName: "Yuki", lastName: "Tanaka", email: "yuki.tanaka@kaidorobotics.jp", phone: "+81 3 4567 8901", jobTitle: "Head of Partnerships", telegramUsername: "yukitanaka", daysAgo: 29 },
  { key: "ct_4", companyKey: "co_4", firstName: "Sofia", lastName: "Alvarez", email: "sofia.alvarez@meridianhealth.com", phone: null, jobTitle: "Director of Procurement", telegramUsername: null, daysAgo: 11 },
  { key: "ct_5", companyKey: "co_5", firstName: "Claire", lastName: "Dubois", email: "claire@luminteriors.fr", phone: null, jobTitle: "Founder", telegramUsername: "claire_dubois", daysAgo: 14 },
  { key: "ct_6", companyKey: "co_7", firstName: "Marcus", lastName: "Reid", email: null, phone: "+44 20 7946 0958", jobTitle: "Managing Partner", telegramUsername: null, daysAgo: 22 },
];

export const leads = [
  { companyName: "Northwind Analytics", contactName: "Ava Chen", email: "ava.chen@northwindanalytics.com", phone: "+1 (415) 555-0142", website: "northwindanalytics.com", country: "United States", city: "San Francisco", industry: "Data & Analytics", rating: 4.6, status: "NEW", source: "Google Maps", companyKey: "co_1", daysAgo: 5 },
  { companyName: "Fjord Studio", contactName: "Lars Eriksen", email: "lars@fjordstudio.no", phone: "+47 21 93 44 10", website: "fjordstudio.no", country: "Norway", city: "Oslo", industry: "Design Agency", rating: 4.9, status: "CONTACTED", source: "LinkedIn", companyKey: "co_2", daysAgo: 9 },
  { companyName: "Terraform Logistics", contactName: "Priya Nair", email: "priya.nair@terraformlogistics.com", phone: "+91 22 4567 1230", website: "terraformlogistics.com", country: "India", city: "Mumbai", industry: "Logistics", rating: 3.8, status: "QUALIFIED", source: "Manual Import", companyKey: null, daysAgo: 19 },
  { companyName: "Berlin Brew Collective", contactName: "Jonas Weber", email: "jonas@berlinbrew.de", phone: null, website: "berlinbrew.de", country: "Germany", city: "Berlin", industry: "Food & Beverage", rating: 4.2, status: "NEW", source: "Website Contact Form", companyKey: null, daysAgo: 2 },
  { companyName: "Sable & Finch Law", contactName: "Marcus Reid", email: null, phone: "+44 20 7946 0958", website: "sablefinchlaw.co.uk", country: "United Kingdom", city: "London", industry: "Legal Services", rating: 4.4, status: "UNQUALIFIED", source: "Referral", companyKey: "co_7", daysAgo: 22 },
  { companyName: "Kaido Robotics", contactName: "Yuki Tanaka", email: "yuki.tanaka@kaidorobotics.jp", phone: "+81 3 4567 8901", website: "kaidorobotics.jp", country: "Japan", city: "Tokyo", industry: "Robotics", rating: 4.8, status: "CONVERTED", source: "Trade Show", companyKey: "co_3", daysAgo: 29 },
  { companyName: "Meridian Health Partners", contactName: "Sofia Alvarez", email: "sofia.alvarez@meridianhealth.com", phone: null, website: "meridianhealth.com", country: "United States", city: "Austin", industry: "Healthcare", rating: 4.1, status: "CONTACTED", source: "Cold Outreach", companyKey: "co_4", daysAgo: 11 },
  { companyName: "Atlas Freight Co.", contactName: "Deion Brooks", email: null, phone: "+1 (312) 555-0199", website: "atlasfreight.com", country: "United States", city: "Chicago", industry: "Logistics", rating: 3.5, status: "NEW", source: "Google Maps", companyKey: "co_6", daysAgo: 1 },
  { companyName: "Lumen Interiors", contactName: "Claire Dubois", email: "claire@luminteriors.fr", phone: null, website: "luminteriors.fr", country: "France", city: "Lyon", industry: "Interior Design", rating: 4.7, status: "QUALIFIED", source: "Instagram", companyKey: "co_5", daysAgo: 14 },
  { companyName: "Copperhead Outfitters", contactName: "Wade Calloway", email: "wade@copperheadoutfitters.com", phone: "+1 (720) 555-0110", website: "copperheadoutfitters.com", country: "United States", city: "Denver", industry: "Retail", rating: 4.0, status: "CONTACTED", source: "Referral", companyKey: null, daysAgo: 40 },
  { companyName: "Sunstone Realty Group", contactName: "Helena Voss", email: "helena.voss@sunstonerealty.com", phone: null, website: "sunstonerealty.com", country: "Australia", city: "Sydney", industry: "Real Estate", rating: 3.9, status: "NEW", source: "LinkedIn", companyKey: null, daysAgo: 3 },
  { companyName: "Ironclad Fitness", contactName: "Diego Morales", email: null, phone: "+1 (786) 555-0133", website: "ironcladfitness.com", country: "United States", city: "Miami", industry: "Health & Fitness", rating: 4.3, status: "UNQUALIFIED", source: "Website Contact Form", companyKey: null, daysAgo: 45 },
  { companyName: "Pinegrove Furniture Co.", contactName: "Nora Bergman", email: "nora@pinegrovefurniture.com", phone: null, website: "pinegrovefurniture.com", country: "Sweden", city: "Malmo", industry: "Retail", rating: 4.5, status: "QUALIFIED", source: "Google Search", companyKey: null, daysAgo: 60 },
  { companyName: "Vantage Point Consulting", contactName: "Ethan Cole", email: "ethan@vantagepointco.com", phone: null, website: "vantagepointco.com", country: "Canada", city: "Toronto", industry: "Consulting", rating: 4.0, status: "CONVERTED", source: "Referral", companyKey: null, daysAgo: 75 },
  { companyName: "Solace Wellness Studio", contactName: "Maya Patel", email: "maya@solacewellness.com", phone: null, website: "solacewellness.com", country: "United States", city: "Portland", industry: "Health & Fitness", rating: 3.7, status: "NEW", source: "Instagram", companyKey: null, daysAgo: 100 },
  { companyName: "Ridgeline Outdoor Gear", contactName: "Tyler Brooks", email: "tyler@ridgelinegear.com", phone: null, website: "ridgelinegear.com", country: "United States", city: "Denver", industry: "Retail", rating: 4.1, status: "CONTACTED", source: "Google Maps", companyKey: null, daysAgo: 130 },
  { companyName: "Bluewater Marine Supply", contactName: "Grace Lin", email: "grace@bluewatermarine.com", phone: null, website: "bluewatermarine.com", country: "Australia", city: "Brisbane", industry: "Retail", rating: 3.9, status: "QUALIFIED", source: "Trade Show", companyKey: null, daysAgo: 150 },
  { companyName: "Ember & Oak Restaurant Group", contactName: "Leo Marsh", email: "leo@emberoak.com", phone: null, website: "emberoak.com", country: "United States", city: "Nashville", industry: "Food & Beverage", rating: 4.3, status: "CONVERTED", source: "Referral", companyKey: null, daysAgo: 165 },
];

export const deals = [
  { key: "deal_1", title: "Northwind — Annual Plan", companyKey: "co_1", contactKey: "ct_1", value: 24000, stageKey: "stage_3", status: "OPEN", closeInDays: 25, daysAgo: 15 },
  { key: "deal_2", title: "Fjord Studio — Team Plan", companyKey: "co_2", contactKey: "ct_2", value: 8400, stageKey: "stage_2", status: "OPEN", closeInDays: 12, daysAgo: 9 },
  { key: "deal_3", title: "Kaido Robotics — Enterprise", companyKey: "co_3", contactKey: "ct_3", value: 96000, stageKey: "stage_5", status: "WON", closeInDays: -5, daysAgo: 29 },
  { key: "deal_4", title: "Meridian Health — Pilot", companyKey: "co_4", contactKey: "ct_4", value: 15000, stageKey: "stage_4", status: "OPEN", closeInDays: 16, daysAgo: 11 },
  { key: "deal_5", title: "Lumen Interiors — Starter", companyKey: "co_5", contactKey: "ct_5", value: 2400, stageKey: "stage_1", status: "OPEN", closeInDays: 40, daysAgo: 14 },
  { key: "deal_6", title: "Atlas Freight — Fleet Plan", companyKey: "co_6", contactKey: null, value: 32000, stageKey: "stage_1", status: "OPEN", closeInDays: 50, daysAgo: 1 },
  { key: "deal_7", title: "Sable & Finch — Team Plan", companyKey: "co_7", contactKey: "ct_6", value: 6000, stageKey: "stage_2", status: "LOST", closeInDays: -10, daysAgo: 22 },
  { key: "deal_8", title: "Vantage Point — Consulting Retainer", companyKey: null, contactKey: null, value: 18000, stageKey: "stage_5", status: "WON", closeInDays: -40, daysAgo: 75 },
  { key: "deal_9", title: "Ember & Oak — Multi-location Rollout", companyKey: null, contactKey: null, value: 45000, stageKey: "stage_5", status: "WON", closeInDays: -100, daysAgo: 165 },
  { key: "deal_10", title: "Ridgeline Outdoor — Trial", companyKey: null, contactKey: null, value: 5200, stageKey: "stage_3", status: "LOST", closeInDays: -60, daysAgo: 130 },
];

export const meetings = [
  { title: "Discovery Call", contactKey: "ct_1", startInHours: 6, durationMinutes: 30, location: "Google Meet", status: "SCHEDULED" },
  { title: "Product Demo", contactKey: "ct_2", startInHours: 30, durationMinutes: 45, location: "Zoom", status: "SCHEDULED" },
  { title: "Contract Review", contactKey: "ct_4", startInHours: 54, durationMinutes: 60, location: "Google Meet", status: "SCHEDULED" },
  { title: "Quarterly Business Review", contactKey: "ct_3", startInHours: 78, durationMinutes: 60, location: "In person — Tokyo office", status: "SCHEDULED" },
  { title: "Onboarding Kickoff", contactKey: "ct_3", startInHours: -72, durationMinutes: 45, location: "Zoom", status: "COMPLETED" },
  { title: "Pricing Negotiation", contactKey: "ct_2", startInHours: -240, durationMinutes: 30, location: "Google Meet", status: "COMPLETED" },
  { title: "Initial Outreach Call", contactKey: "ct_6", startInHours: -480, durationMinutes: 20, location: "Phone", status: "CANCELLED" },
];

export const tasks = [
  { title: "Send proposal to Northwind Analytics", description: "Include the Q3 pricing tiers and the annual-plan discount.", status: "IN_PROGRESS", priority: "HIGH", dueInDays: 2, relatedLeadCompany: "Northwind Analytics" },
  { title: "Follow up on Fjord Studio demo", description: null, status: "TODO", priority: "MEDIUM", dueInDays: 3, relatedLeadCompany: "Fjord Studio" },
  { title: "Prepare Kaido Robotics onboarding checklist", description: "Coordinate with their IT team on SSO setup.", status: "DONE", priority: "MEDIUM", dueInDays: -1, relatedLeadCompany: "Kaido Robotics" },
  { title: "Confirm contract terms with legal", description: null, status: "TODO", priority: "HIGH", dueInDays: 5, relatedLeadCompany: "Meridian Health Partners" },
  { title: "Draft Q3 outreach segment for Retail", description: "Pull lists from Copperhead Outfitters and similar accounts.", status: "TODO", priority: "LOW", dueInDays: 8, relatedLeadCompany: null },
  { title: "Review last month's campaign performance", description: null, status: "DONE", priority: "LOW", dueInDays: -10, relatedLeadCompany: null },
  { title: "Chase overdue invoice for Sable & Finch", description: "Second reminder — first one sent two weeks ago.", status: "TODO", priority: "HIGH", dueInDays: -3, relatedLeadCompany: "Sable & Finch Law" },
];

export const notes = [
  { content: "Ava mentioned budget approval expected by end of month — follow up early August.", companyKey: "co_1", contactKey: "ct_1", daysAgo: 6 },
  { content: "Lars wants a custom onboarding session for their design team, 5 seats minimum.", companyKey: "co_2", contactKey: "ct_2", daysAgo: 8 },
  { content: "Legal flagged a data residency question — routed to Priya for enterprise terms.", companyKey: "co_4", contactKey: "ct_4", daysAgo: 9 },
  { content: "Yuki confirmed the enterprise contract renews automatically each March.", companyKey: "co_3", contactKey: "ct_3", daysAgo: 20 },
];

export const templates = [
  { key: "tpl_1", name: "Cold Outreach — SaaS", category: "Cold Outreach", subject: "A faster way to ship your analytics dashboards", body: "Hi {{firstName}}, noticed {{companyName}} is scaling its data team — wanted to share how teams like yours cut reporting time in half.", isAiGenerated: true },
  { key: "tpl_2", name: "Introduction — Creative", category: "Introduction", subject: "Loved your latest case study, quick idea", body: "Hi {{firstName}}, your recent work on {{project}} stood out — I had an idea that could help {{companyName}} land more clients like that one.", isAiGenerated: true },
  { key: "tpl_3", name: "Re-engagement — Ops", category: "Re-engagement", subject: "Still exploring better routing software?", body: "Hi {{firstName}}, circling back — a lot changed since we last spoke. Worth a quick 15-min refresh?", isAiGenerated: false },
  { key: "tpl_4", name: "Follow-up — Enterprise", category: "Follow-up", subject: "Following up on our proposal", body: "Hi {{firstName}}, wanted to make sure the proposal reached the right team. Happy to walk through any of the numbers.", isAiGenerated: false },
  { key: "tpl_5", name: "Proposal — Standard", category: "Proposal", subject: "Proposal for {{companyName}}", body: "Hi {{firstName}}, attached is a tailored proposal based on what we discussed. Let me know if you'd like to adjust scope.", isAiGenerated: true },
];

export const campaigns = [
  { name: "Q3 Data Teams Outreach", status: "ACTIVE", subject: "A faster way to ship your analytics dashboards", templateKey: "tpl_1", sentCount: 480, openCount: 312, replyCount: 41, clickCount: 118, daysAgo: 19, emailBatches: 6 },
  { name: "Design Agencies — Nordics", status: "SCHEDULED", subject: "Loved your latest case study, quick idea", templateKey: "tpl_2", sentCount: 0, openCount: 0, replyCount: 0, clickCount: 0, daysAgo: 5, emailBatches: 0 },
  { name: "Logistics Re-engagement", status: "PAUSED", subject: "Still exploring better routing software?", templateKey: "tpl_3", sentCount: 140, openCount: 76, replyCount: 9, clickCount: 22, daysAgo: 30, emailBatches: 4 },
  { name: "Healthcare Providers — Follow Up", status: "COMPLETED", subject: "Following up on our proposal", templateKey: "tpl_4", sentCount: 90, openCount: 68, replyCount: 19, clickCount: 31, daysAgo: 50, emailBatches: 3 },
  { name: "Retail Prospects — New Leads", status: "DRAFT", subject: "", templateKey: null, sentCount: 0, openCount: 0, replyCount: 0, clickCount: 0, daysAgo: 1, emailBatches: 0 },
  { name: "Fintech Series A Startups", status: "ACTIVE", subject: "Quick idea for your outbound motion", templateKey: "tpl_1", sentCount: 220, openCount: 140, replyCount: 18, clickCount: 52, daysAgo: 100, emailBatches: 3 },
  { name: "Consulting Firms — Q1 Push", status: "COMPLETED", subject: "Proposal for {{companyName}}", templateKey: "tpl_5", sentCount: 160, openCount: 95, replyCount: 22, clickCount: 40, daysAgo: 150, emailBatches: 2 },
];

export const payments = [
  { amount: 14900, currency: "USD", status: "SUCCEEDED", description: "Pro plan — monthly subscription", daysAgo: 1 },
  { amount: 14900, currency: "USD", status: "SUCCEEDED", description: "Pro plan — monthly subscription", daysAgo: 31 },
  { amount: 14900, currency: "USD", status: "SUCCEEDED", description: "Pro plan — monthly subscription", daysAgo: 61 },
  { amount: 4900, currency: "USD", status: "SUCCEEDED", description: "Starter plan — monthly subscription", daysAgo: 91 },
  { amount: 14900, currency: "USD", status: "FAILED", description: "Pro plan — monthly subscription (card declined)", daysAgo: 92 },
  { amount: 14900, currency: "USD", status: "REFUNDED", description: "Pro plan — refunded after downgrade", daysAgo: 95 },
  {
    amount: 14900,
    currency: "USD",
    status: "PENDING",
    description: "Pro plan — monthly subscription (crypto)",
    method: "CRYPTO",
    cryptoAsset: "USDT-TRC20",
    cryptoTxHash: "0x8f3a2c9e1b7d4f60a5c8e2d9b1f4a7c3e6d9b2f5a8c1e4d7b0a3f6c9e2d5b8a1",
    daysAgo: 0,
  },
  {
    amount: 4900,
    currency: "USD",
    status: "SUCCEEDED",
    description: "Starter plan — monthly subscription (crypto)",
    method: "CRYPTO",
    cryptoAsset: "BTC",
    cryptoTxHash: "3b1e7a9c5d2f8046b1c4e7a0d3f6b9c2e5a8d1f4b7c0e3a6d9f2b5c8e1a4d7f0",
    daysAgo: 15,
  },
];

export const planConfigs = [
  { plan: "FREE", priceCents: 0, leadSearchLimit: 50, campaignLimit: 1, aiToolLimit: 10, seatsLimit: 1 },
  { plan: "STARTER", priceCents: 4900, leadSearchLimit: 1000, campaignLimit: 5, aiToolLimit: 100, seatsLimit: 3 },
  { plan: "PRO", priceCents: 14900, leadSearchLimit: 10000, campaignLimit: null, aiToolLimit: 500, seatsLimit: 10 },
  { plan: "ENTERPRISE", priceCents: 49900, leadSearchLimit: null, campaignLimit: null, aiToolLimit: null, seatsLimit: null },
];

export const featureFlags = [
  { key: "ai.websiteAnalyzer", label: "AI Website Analyzer", description: "Enable the AI-powered website analysis tool.", enabled: true },
  { key: "ai.emailTranslation", label: "AI Email Translation", description: "Enable the AI-powered email translation tool.", enabled: true },
  { key: "ai.outreachHub", label: "AI Outreach Hub (Enterprise)", description: "Enable the Enterprise integrations hub page.", enabled: true },
  { key: "billing.selfServeUpgrade", label: "Self-serve plan upgrades", description: "Allow users to change their own plan from Settings without contacting support.", enabled: true },
];

export const systemLogs = [
  { level: "INFO", message: "Scheduled campaign dispatch completed", source: "campaign-worker", daysAgo: 0.2 },
  { level: "WARN", message: "Email provider webhook retried after timeout", source: "billing-service", daysAgo: 0.5 },
  { level: "INFO", message: "Nightly lead enrichment job finished", source: "enrichment-worker", daysAgo: 0.8 },
  { level: "INFO", message: "Database backup completed successfully", source: "infra", daysAgo: 1.1 },
  { level: "INFO", message: "AI website analysis generated", feature: "ai.websiteAnalyzer", daysAgo: 2 },
  { level: "INFO", message: "AI email translation generated", feature: "ai.emailTranslation", daysAgo: 2.5 },
  { level: "INFO", message: "AI website analysis generated", feature: "ai.websiteAnalyzer", daysAgo: 3 },
  { level: "INFO", message: "AI email generator used", feature: "ai.emailGenerator", daysAgo: 3.5 },
  { level: "ERROR", message: "Failed to reach OpenAI API — request timed out", source: "ai-tools", daysAgo: 4 },
  { level: "INFO", message: "AI website analysis generated", feature: "ai.websiteAnalyzer", daysAgo: 5 },
];

export const appSettings = [
  { key: "site.name", value: "LeadFlow AI" },
  { key: "site.supportEmail", value: "support@leadflow.ai" },
  { key: "site.maintenanceMode", value: "false" },
  { key: "seo.metaTitle", value: "LeadFlow AI — Find, reach, and close more leads" },
  { key: "seo.metaDescription", value: "AI-powered lead generation, outreach, and CRM in one platform." },
];
