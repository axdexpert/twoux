/**
 * Generated from shadcn/ui new-york-v4 "card" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Compact card: 16px padding and gaps, light edge, 6px corners, the resting card shadow
 *  - Title 14px semibold, description in readable grey
 *  - Optional level makes the title a heading, for cards that hold a page section
 *  - Adds CardFooter band: a tinted strip across the bottom for a secondary line (as in Clerk's “Already have an account?”)
 */
import * as React from "react"
import { cn } from "../lib/cn"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-4 overflow-hidden rounded-sm border border-line bg-card py-4 text-card-foreground shadow-card",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, level, ...props }: React.ComponentProps<"div"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return (
    <div
      role={level ? "heading" : undefined}
      aria-level={level}
      data-slot="card-title"
      className={cn("text-md font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-base text-ink-2", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, band = false, ...props }: React.ComponentProps<"div"> & { band?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      data-band={band || undefined}
      className={cn("flex items-center px-4 [.border-t]:pt-4", band && "-mb-4 justify-center border-t border-line bg-surface-2 py-3 text-base text-ink-2 [.border-t]:pt-3", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
