/**
 * Generated from shadcn/ui new-york-v4 "skeleton" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Shimmer at 1.4s instead of a pulse, on TwoUX's hover grey; stops with reduced motion
 */
import { cn } from "../lib/cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-shimmer rounded-xs bg-linear-to-r from-hover via-surface-2 to-hover bg-size-[200%_100%]", className)}
      {...props}
    />
  )
}

export { Skeleton }
