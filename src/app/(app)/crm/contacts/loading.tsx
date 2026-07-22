import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/page-skeleton";

export default function ContactsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <TableSkeleton />
    </div>
  );
}
