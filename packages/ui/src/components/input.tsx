/**
 * Generated from shadcn/ui new-york-v4 "input" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Compact 32px, light edge that darkens on hover
 *  - One size on every screen
 */
import * as React from "react"
import { cn } from "../lib/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-sm border border-input bg-background px-2.5 py-1 text-base shadow-xs hover:border-input-hover transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:not-focus-visible:border-destructive-edge",
        className
      )}
      {...props}
    />
  )
}

export { Input }
