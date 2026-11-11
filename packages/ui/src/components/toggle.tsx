/**
 * Generated from shadcn/ui new-york-v4 "toggle" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Compact heights
 *  - On reads as chosen, not hovered: indigo tint and text, which stay while the pointer is over it
 *  - Icons 14px, in proportion with 13px text
 *  - Outline: light edge that darkens on hover, indigo edge when on
 */
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm text-base font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) outline-none hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:not-focus-visible:border-destructive-edge data-[state=on]:bg-primary-soft data-[state=on]:text-primary-ink data-[state=on]:hover:bg-primary-soft data-[state=on]:hover:text-primary-ink [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:border-input-hover hover:bg-accent hover:text-accent-foreground data-[state=on]:border-primary/30 data-[state=on]:hover:border-primary/50",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 px-1.5",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
