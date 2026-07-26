import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/workspace";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AiAssistantTrigger } from "@/components/ai-assistant/ai-assistant-trigger";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CommandPalette } from "@/components/layout/command-palette";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { ViewAsMenu } from "@/components/admin/view-as-menu";

export async function Topbar({ isAdmin, canUseAiAssistant }: { isAdmin: boolean; canUseAiAssistant: boolean }) {
  const session = await requireSession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { image: true },
  });

  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-2">
        {isAdmin && <ViewAsMenu />}
        <CommandPalette />
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationsPopover />
        {canUseAiAssistant && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <AiAssistantTrigger />
          </>
        )}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <UserMenu avatarUrl={user?.image ?? null} />
      </div>
    </header>
  );
}
