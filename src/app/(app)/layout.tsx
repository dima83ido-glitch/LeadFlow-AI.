import { getEffectivePlan } from "@/lib/view-as";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { ViewAsBanner } from "@/components/admin/view-as-banner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const effectivePlan = await getEffectivePlan();

  return (
    <OnboardingProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {effectivePlan.isOverride && <ViewAsBanner plan={effectivePlan.plan} />}
          <Topbar isAdmin={effectivePlan.isAdmin && !effectivePlan.isOverride} />
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </OnboardingProvider>
  );
}
