/**
 * Generated from shadcn/ui new-york-v4 "button" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Compact heights: 32px default, 28px sm, 24px xs, 36px lg
 *  - Primary gets a hairline shadow so it sits on grey and white alike
 *  - Outline uses the light input edge and darkens it on hover
 *  - Adds warning: risky but reversible actions (from Geist)
 *  - Icons 14px beside 13px text, so they support the label instead of outweighing it
 *  - Button corners come from theme.json (radius.button: a px value or "pill"), so buttons can be rounder than fields without touching the component
 *  - Tactile press
 *  - Adds loading (spinner, aria-busy, stays focusable) and shortcut (Kbd after the label)
 *  - The shortcut works, not just shows: inside ShortcutsProvider, typing it presses the button (single keys obey the off setting, WCAG 2.1.4)
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"
import { useShortcut } from "../lib/shortcuts"
import { Slot } from "radix-ui"
import { Kbd } from "./kbd"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-(--radius-button) text-base font-medium whitespace-nowrap transition-all outline-none active:scale-98 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:not-focus-visible:border-destructive-edge [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-input bg-background shadow-xs hover:border-input-hover hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-ink underline-offset-4 hover:underline",
        warning: "border border-warn-line bg-warn-bg text-warn hover:border-warn",
      },
      size: {
        default: "h-8 px-3 has-[>svg]:px-2.5",
        xs: "h-6 gap-1 rounded-(--radius-button) px-2 text-sm has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 rounded-(--radius-button) px-2.5 has-[>svg]:px-2",
        lg: "h-9 rounded-(--radius-button) px-4 has-[>svg]:px-3",
        icon: "size-8",
        "icon-xs": "size-6 rounded-(--radius-button) [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  shortcut,
  children,
  onClick,
  ref,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Spinner, aria-busy, ignores clicks, stays focusable. */
    loading?: boolean
    /** Key shown after the label, e.g. "C" or "⌘↵". */
    shortcut?: string
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const iconOnly = String(size).startsWith("icon")
  const own = React.useRef<HTMLButtonElement>(null)
  useShortcut(shortcut, own, loading || !!props.disabled)
  const setRef = (el: HTMLButtonElement | null) => {
    own.current = el
    if (typeof ref === "function") ref(el)
    else if (ref) ref.current = el
  }

  return (
    <Comp
      ref={setRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => (loading ? e.preventDefault() : onClick?.(e))}
      {...props}
    >
      {asChild ? children : (
        <>
          {loading && <Spinner />}
          {children}
          {shortcut && !iconOnly && size !== "xs" && <Kbd className="-mr-1">{shortcut}</Kbd>}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
