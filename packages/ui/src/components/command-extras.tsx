/** TwoUX additions to shadcn Command: one-line secondary text and a key-hint footer. */
import type * as React from "react"
import { cn } from "../lib/cn"

export function CommandItemMeta({ className, ...props }: React.ComponentProps<"span">) {
	return <span className={cn("min-w-0 truncate text-ink-3", className)} {...props} />
}

export function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex h-9 items-center gap-4 border-t border-line px-3 text-sm text-ink-3", className)} {...props} />
}
