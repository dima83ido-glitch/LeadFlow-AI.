import { getEffectivePlan } from "@/lib/view-as";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { ViewAsBanner } from "@/components/admin/view-as-banner";
import { AiAssistantPanel } from "@/components/ai-assistant/ai-assistant-panel";
import { AiAssistantProvider } from "@/components/ai-assistant/ai-assistant-provider";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { PageTransition } from "@/components/layout/page-transition";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const effectivePlan = await getEffectivePlan();
  // "Highest plan" = last entry in PLAN_ORDER (ENTERPRISE); admins always qualify.
  const canUseAiAssistant = effectivePlan.isAdmin || effectivePlan.plan === "ENTERPRISE";

  const shell = (
    <>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        {effectivePlan.isOverride && <ViewAsBanner plan={effectivePlan.plan} />}
        <Topbar isAdmin={effectivePlan.isAdmin && !effectivePlan.isOverride} canUseAiAssistant={canUseAiAssistant} />
        <main className="relative flex flex-1 flex-col gap-6 p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </SidebarInset>
      {canUseAiAssistant && <AiAssistantPanel />}
    </>
  );

  return (
    <OnboardingProvider>
      <AmbientBackground />
      <SidebarProvider>
        {canUseAiAssistant ? <AiAssistantProvider>{shell}</AiAssistantProvider> : shell}
      </SidebarProvider>
    </OnboardingProvider>
  );
}
