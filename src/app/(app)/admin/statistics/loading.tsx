import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsSkeleton } from "@/components/shared/page-skeleton";

export default function StatisticsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <StatCardsSkeleton />
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
