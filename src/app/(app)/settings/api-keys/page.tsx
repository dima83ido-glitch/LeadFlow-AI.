import type { Metadata } from "next";

import { ApiKeysView } from "@/components/settings/api-keys-view";

export const metadata: Metadata = { title: "API Keys" };

export default function ApiKeysSettingsPage() {
  return <ApiKeysView />;
}
