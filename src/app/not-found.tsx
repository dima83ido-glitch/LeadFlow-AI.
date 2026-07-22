import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <Compass className="text-muted-foreground size-7" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight">Page not found</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
      </div>
      <Button render={<Link href="/dashboard" />}>Back to Dashboard</Button>
    </div>
  );
}
