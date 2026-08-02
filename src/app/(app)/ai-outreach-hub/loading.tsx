import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsSkeleton } from "@/components/shared/page-skeleton";

export default function AiOutreachHubLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>
      <StatCardsSkeleton />
    </div>
  );
}
