import { AmbientBackground } from "@/components/layout/ambient-background";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { PageTransition } from "@/components/layout/page-transition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AmbientBackground />
      <MarketingNavbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <MarketingFooter />
    </div>
  );
}
