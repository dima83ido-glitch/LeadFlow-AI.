import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 flex flex-col gap-4 duration-500 ease-out sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-[-0.025em] text-balance">{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
