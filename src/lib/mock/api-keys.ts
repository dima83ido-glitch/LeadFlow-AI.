import type { ApiKeyItem } from "@/types/admin";

export const mockApiKeys: ApiKeyItem[] = [
  {
    id: "key_1",
    name: "Production integration",
    keyPrefix: "sk_live_••••7f2a",
    createdAt: "2026-05-12T00:00:00Z",
    lastUsedAt: "2026-07-19T08:30:00Z",
  },
  {
    id: "key_2",
    name: "Zapier",
    keyPrefix: "sk_live_••••9c1d",
    createdAt: "2026-06-01T00:00:00Z",
    lastUsedAt: "2026-07-17T14:00:00Z",
  },
  {
    id: "key_3",
    name: "Local development",
    keyPrefix: "sk_test_••••3b8e",
    createdAt: "2026-06-20T00:00:00Z",
  },
];

export function generateFakeApiKey() {
  const segment = () => Math.random().toString(36).slice(2, 10);
  return `sk_live_${segment()}${segment()}`;
}
