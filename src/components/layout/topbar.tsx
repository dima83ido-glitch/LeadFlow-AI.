import { getCurrentUserRow } from "@/lib/workspace";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AiAssistantTrigger } from "@/components/ai-assistant/ai-assistant-trigger";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CommandPalette } from "@/components/layout/command-palette";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavControls } from "@/components/layout/nav-controls";
import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { ViewAsMenu } from "@/components/admin/view-as-menu";

export async function Topbar({ isAdmin, canUseAiAssistant }: { isAdmin: boolean; canUseAiAssistant: boolean }) {
  const { user } = await getCurrentUserRow();

  return (
    <header className="bg-background/85 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 px-4 shadow-[0_1px_0_0_var(--border)] backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-4" />
      <NavControls />
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
