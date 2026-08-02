import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! [a]:hover:-translate-y-px [button]:hover:-translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_0_0_color-mix(in_oklch,white_25%,transparent)_inset] [a]:hover:bg-primary/85 [a]:hover:shadow-[0_8px_20px_-8px_hsl(var(--shadow-color)/0.55),0_0_14px_-4px_color-mix(in_oklch,var(--primary)_50%,transparent)] [button]:hover:bg-primary/85 [button]:hover:shadow-[0_8px_20px_-8px_hsl(var(--shadow-color)/0.55),0_0_14px_-4px_color-mix(in_oklch,var(--primary)_50%,transparent)]",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 [a]:hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_20%,transparent)] [button]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20 [button]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:border-primary/40 [a]:hover:bg-muted [a]:hover:text-muted-foreground [a]:hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_18%,transparent)] [button]:hover:border-primary/40 [button]:hover:bg-muted",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
