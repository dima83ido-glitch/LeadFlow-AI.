import { INTEGRATIONS } from "@/lib/integrations";
import { IntegrationCard } from "@/components/ai-outreach/integration-card";

export function OutreachHubView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {INTEGRATIONS.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
}
