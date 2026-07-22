import { formatDistanceToNow } from "date-fns";

import { mockActivity } from "@/lib/mock/notifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-5">
          {mockActivity.map((activity) => (
            <li key={activity.id} className="flex items-start gap-3">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {activity.actorName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-sm">
                  <span className="font-medium">{activity.actorName}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
