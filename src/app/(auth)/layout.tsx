import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
          <Sparkles className="size-4.5" />
        </div>
        <span className="text-base font-semibold">LeadFlow AI</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
