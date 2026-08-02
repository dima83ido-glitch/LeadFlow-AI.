import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-primary flex shrink-0 items-center justify-center rounded-md p-1",
        className,
      )}
    >
      <Image
        src="/brand/nexora-mark-square.png"
        alt=""
        width={64}
        height={64}
        className="size-full object-contain"
        priority
      />
    </div>
  );
}
