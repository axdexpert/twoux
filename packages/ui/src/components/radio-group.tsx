/**
 * Generated from shadcn/ui new-york-v4 "radio-group" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Edge at 3.59:1 (WCAG 1.4.11)
 *  - Invisible 26px hit area (WCAG 2.5.8)
 *  - Compact rows
 *  - The dot scales in instead of appearing
 */
"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { CircleIcon } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-1.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative aspect-square size-4 shrink-0 after:absolute after:-inset-1.25 after:rounded-full rounded-full border border-control text-primary shadow-xs transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:not-focus-visible:border-destructive-edge",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex animate-in items-center justify-center zoom-in-50 fade-in-0 duration-150"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
