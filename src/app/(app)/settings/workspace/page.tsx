import type { Metadata } from "next";

import { WorkspaceView } from "@/components/settings/workspace-view";

export const metadata: Metadata = { title: "Workspace" };

export default function WorkspaceSettingsPage() {
  return <WorkspaceView />;
}
