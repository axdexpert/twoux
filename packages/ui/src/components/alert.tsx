/**
 * Generated from shadcn/ui new-york-v4 "alert" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Compact banner: 8px corners, 14px icon, room for one action on the right
 *  - Information is neutral grey, not blue: colour is kept for problems
 *  - Errors: soft red fill and edge, dark text; adds warning
 *  - Only errors interrupt a screen reader (role alert); information and warnings are polite (role status)
 *  - Title wraps instead of being cut to one line
 *  - Adds AlertAction: Dismiss (ghost) then one action, on the right
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr_auto] items-start gap-y-0.5 rounded-sm border px-3 py-2.5 text-base has-[>svg]:grid-cols-[calc(var(--spacing)*3.5)_1fr_auto] has-[>svg]:gap-x-2.5 [&>svg]:size-3.5 [&>svg]:translate-y-[3px] [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "border-line bg-surface-2 text-ink [&>svg]:text-ink-2",
        destructive:
          "border-bad-line bg-bad-bg text-ink *:data-[slot=alert-description]:text-ink-2 [&>svg]:text-bad",
        warning: "border-warn-line bg-warn-bg text-ink *:data-[slot=alert-description]:text-ink-2 [&>svg]:text-warn",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role={variant === "destructive" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 min-h-5 font-medium",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-base text-ink-2",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("col-start-3 row-span-2 row-start-1 -my-1 flex items-center gap-1 self-center pl-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
