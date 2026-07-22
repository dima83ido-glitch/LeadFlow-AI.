import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/page-skeleton";

export default function CampaignsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <TableSkeleton />
    </div>
  );
}
