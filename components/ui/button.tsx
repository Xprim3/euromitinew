import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--rounded-DEFAULT)] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap shadow-(--shadow-euromiti-sm) transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/45 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-(--shadow-euromiti-primary-sm) [a]:hover:bg-primary/90",
        outline:
          "border-border bg-background text-foreground shadow-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-(--shadow-euromiti-secondary-sm) hover:bg-secondary/92 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        accent:
          "bg-accent text-accent-foreground shadow-(--shadow-euromiti-accent-sm) hover:bg-accent/90",
        outlinePrimary:
          "border-primary/45 bg-transparent text-primary shadow-none hover:bg-primary/8",
        outlineAccent:
          "border-accent/55 bg-transparent text-foreground shadow-none hover:bg-accent/12",
        ghost:
          "shadow-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive shadow-none hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "border-transparent bg-transparent text-primary shadow-none underline-offset-4 hover:underline",
      },
      size: {
        /** DESIGN.md — min tap target ~48px */
        default:
          "min-h-12 px-6 py-3 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "min-h-8 rounded-[min(var(--rounded-md),10px)] gap-1 px-2 py-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-10 px-5 py-2.5 text-[0.925rem]",
        lg: "min-h-14 gap-2 px-9 text-base [&_svg:not([class*='size-'])]:size-[1.125rem]",
        icon: "size-12 shrink-0 p-0",
        "icon-xs":
          "size-8 shrink-0 rounded-[var(--rounded-sm)] p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-11 shrink-0 rounded-[min(var(--rounded-md),12px)] p-0 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-14 shrink-0 p-0",
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
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const composedNative =
    render != null ? nativeButton ?? false : nativeButton ?? true

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={composedNative}
      render={render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
