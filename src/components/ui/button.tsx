import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:not-aria-[haspopup]:scale-[1.015] active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:-translate-y-px hover:bg-primary/85 hover:shadow-[0_12px_30px_-8px_hsl(var(--shadow-color)/0.6),0_0_0_1px_color-mix(in_oklch,var(--primary)_25%,transparent),0_0_20px_-4px_color-mix(in_oklch,var(--primary)_50%,transparent)] dark:hover:shadow-[0_12px_30px_-8px_hsl(var(--shadow-color)/0.6),0_0_0_1px_color-mix(in_oklch,var(--chart-1)_38%,transparent),0_0_22px_-4px_color-mix(in_oklch,var(--chart-3)_45%,transparent),0_0_36px_-8px_color-mix(in_oklch,var(--chart-2)_35%,transparent)]",
        outline:
          "border-border bg-background hover:border-primary/40 hover:bg-muted hover:text-foreground hover:shadow-[0_6px_18px_-10px_hsl(var(--shadow-color)/0.5),0_0_0_1px_color-mix(in_oklch,var(--primary)_20%,transparent),0_0_16px_-6px_color-mix(in_oklch,var(--primary)_40%,transparent)] dark:border-input dark:bg-input/30 dark:hover:border-cyan-300/30 dark:hover:bg-input/50 dark:hover:shadow-[0_6px_18px_-10px_hsl(var(--shadow-color)/0.5),0_0_0_1px_color-mix(in_oklch,var(--chart-1)_32%,transparent),0_0_18px_-4px_color-mix(in_oklch,var(--chart-3)_40%,transparent)] aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] hover:shadow-[0_4px_14px_-8px_hsl(var(--shadow-color)/0.4),0_0_14px_-6px_color-mix(in_oklch,var(--primary)_35%,transparent)] dark:hover:shadow-[0_4px_14px_-8px_hsl(var(--shadow-color)/0.4),0_0_16px_-6px_color-mix(in_oklch,var(--chart-2)_40%,transparent)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_16%,transparent)] dark:hover:bg-muted/50 dark:hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--chart-1)_28%,transparent),0_0_14px_-6px_color-mix(in_oklch,var(--chart-3)_35%,transparent)] aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={nativeButton ?? props.render === undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
