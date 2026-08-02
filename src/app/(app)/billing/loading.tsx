import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/page-skeleton";

export default function BillingLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="space-y-3 rounded-xl border p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      <TableSkeleton rows={4} />
    </div>
  );
}
