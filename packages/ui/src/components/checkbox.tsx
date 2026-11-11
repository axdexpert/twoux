/**
 * Generated from shadcn/ui new-york-v4 "checkbox" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Edge at 3.59:1: nothing else identifies a checkbox (WCAG 1.4.11)
 *  - Invisible 26px hit area (WCAG 2.5.8)
 *  - The tick scales in instead of appearing
 *  - Indeterminate (some rows selected) shows an indigo box with a minus, not a tick on an empty box
 */
"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative size-4 shrink-0 after:absolute after:-inset-1.25 after:rounded-xs rounded-xs border border-control shadow-xs transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:not-focus-visible:border-destructive-edge data-[state=checked]:border-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current animate-in zoom-in-50 fade-in-0 duration-150"
      >
        <CheckIcon className="size-3.5 text-current group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="hidden size-3.5 text-current group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
