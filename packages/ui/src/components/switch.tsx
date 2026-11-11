/**
 * Generated from shadcn/ui new-york-v4 "switch" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Thumb glides with TwoUX's ease-out
 *  - Off track at 3.59:1 so the switch is visible when off (WCAG 1.4.11)
 *  - Invisible hit area: 28px around the 16px track (WCAG 2.5.8)
 *  - Sized to its label: a 16×28 track by default (14×24 small), no taller than the 15px text beside it, with 2px of track around the thumb
 *  - Thumb travels the full track at each size
 */
"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex after:absolute after:-inset-1.5 after:rounded-full shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 px-px data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-control",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform duration-(--duration-base) ease-(--ease-out) group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2.5 group-data-[size=default]/switch:data-[state=checked]:translate-x-3 group-data-[size=sm]/switch:data-[state=checked]:translate-x-2.5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
