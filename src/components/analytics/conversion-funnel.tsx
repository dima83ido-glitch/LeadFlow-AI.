import { mockConversionFunnel } from "@/lib/mock/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConversionFunnel() {
  const max = mockConversionFunnel[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockConversionFunnel.map((stage) => {
          const width = Math.max(8, Math.round((stage.count / max) * 100));
          return (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-muted-foreground">{stage.count.toLocaleString()}</span>
              </div>
              <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
