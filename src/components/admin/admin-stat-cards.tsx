import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";

import { mockAdminSubscriptions, mockAdminUsers } from "@/lib/mock/admin";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function AdminStatCards() {
  const totalUsers = mockAdminUsers.length;
  const activeUsers = mockAdminUsers.filter((u) => u.status === "ACTIVE").length;
  const mrr = mockAdminSubscriptions.reduce((sum, sub) => sum + sub.mrr, 0);
  const activeSubs = mockAdminSubscriptions.filter((s) => s.status === "ACTIVE").length;

  const stats = [
    { label: "Total Users", value: totalUsers.toString(), icon: Users },
    { label: "Active Users", value: activeUsers.toString(), icon: Activity },
    { label: "Monthly Recurring Revenue", value: formatCurrency(mrr), icon: TrendingUp },
    { label: "Active Subscriptions", value: activeSubs.toString(), icon: CreditCard },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
            </div>
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
              <stat.icon className="text-muted-foreground size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
