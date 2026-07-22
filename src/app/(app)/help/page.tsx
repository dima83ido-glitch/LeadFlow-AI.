import type { Metadata } from "next";
import { BookOpen, LifeBuoy, MessageCircle, Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Help" };

const faqs = [
  {
    question: "How do I find new leads?",
    answer:
      "Go to Search Leads, set filters like country, industry, or keywords, then click Search Leads to see matching companies.",
  },
  {
    question: "How does the AI email generator work?",
    answer:
      "Open AI Tools → Email Generator, pick a lead, and choose a tone. LeadFlow AI drafts a personalized email you can edit before sending.",
  },
  {
    question: "Can I invite teammates to my workspace?",
    answer: "Yes, from Settings → Workspace you can invite teammates and manage their roles.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "Go to Settings → Subscription or Billing and choose a lower plan, or contact support to cancel.",
  },
  {
    question: "Where can I see my API keys?",
    answer: "API keys live under Settings → API Keys, where you can create and revoke keys for integrations.",
  },
];

const resources = [
  { icon: BookOpen, title: "Documentation", description: "Guides for every feature in LeadFlow AI." },
  { icon: MessageCircle, title: "Community", description: "Ask questions and share workflows with other users." },
  { icon: LifeBuoy, title: "Contact Support", description: "Reach our team for account or billing help." },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Help Center" description="Find answers or get in touch with our team." />

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input placeholder="Search help articles..." className="h-11 pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title} className="hover:border-primary/40 cursor-pointer transition-colors">
            <CardContent className="space-y-2">
              <resource.icon className="text-primary size-5" />
              <p className="text-sm font-medium">{resource.title}</p>
              <p className="text-muted-foreground text-xs">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently asked questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
