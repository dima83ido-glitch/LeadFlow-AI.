import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/page-skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>
      <TableSkeleton />
    </div>
  );
}
