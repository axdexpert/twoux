/**
 * Generated from shadcn/ui new-york-v4 "badge" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Status badges are small soft pills, square-ish to read as labels, not buttons
 *  - Soft tones: the word carries the meaning, colour repeats it (WCAG 1.4.1)
 *  - Adds dot: a leading dot for scanning long columns
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden h-5 rounded-xs border border-transparent px-1.5 text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:not-focus-visible:border-destructive-edge [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary-soft text-primary-ink",
        success: "border-ok-line bg-ok-bg text-ok",
        warning: "border-warn-line bg-warn-bg text-warn",
        secondary: "border-neutral-line bg-neutral-bg text-neutral",
        destructive: "border-bad-line bg-bad-bg text-bad",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
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
  asChild = false,
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; dot?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && !asChild && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
