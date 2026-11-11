/**
 * Generated from shadcn/ui new-york-v4 "empty" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Dashed container sized to the region it replaces, compact spacing
 *  - 32px neutral icon tile, no illustration; adds the error tile for the error state
 *  - The title is a real heading for screen readers (level 2 by default, set level to fit the page)
 *  - Description at most 36 characters wide, readable grey
 */
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-line-strong p-6 text-center text-balance md:p-10",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-1 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-ink-2 [&_svg:not([class*='size-'])]:size-4",
        error: "flex size-8 shrink-0 items-center justify-center rounded-sm bg-bad-bg text-bad [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, level = 2, ...props }: React.ComponentProps<"div"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return (
    <div
      role="heading"
      aria-level={level}
      data-slot="empty-title"
      className={cn("text-md font-semibold", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "max-w-[36ch] text-base text-ink-2 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-base text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
