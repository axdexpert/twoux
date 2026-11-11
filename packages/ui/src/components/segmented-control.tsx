/** TwoUX composition on shadcn ToggleGroup (type="single"): 2–3 views of the same data, one always selected. */
import type * as React from "react"
import { ActiveIndicator } from "../lib/active-indicator"
import { cn } from "../lib/cn"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

export function SegmentedControl({ value, onValueChange, size = "md", className, children, "aria-label": label }: { value: string; onValueChange: (v: string) => void; size?: "sm" | "md"; className?: string; children: React.ReactNode; "aria-label": string }) {
	return (
		<ToggleGroup type="single" spacing={0.5} value={value} onValueChange={(v) => v && onValueChange(v)} aria-label={label} data-segsize={size} className={cn("group/seg relative rounded-sm bg-muted p-0.5", className)}>
			{/* One pill slides to the chosen segment instead of jumping */}
			<ActiveIndicator selector="[data-state=on]" className="rounded-xs bg-background shadow-card" />
			{children}
		</ToggleGroup>
	)
}

export function Segment({ className, ...props }: React.ComponentProps<typeof ToggleGroupItem>) {
	return (
		<ToggleGroupItem
			className={cn(
				"relative h-6 min-w-0 rounded-xs px-2 text-sm text-ink-2 transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-transparent hover:text-ink data-[state=on]:bg-transparent data-[state=on]:text-ink data-[state=on]:hover:bg-transparent data-[state=on]:hover:text-ink [&_svg:not([class*='size-'])]:size-3.5",
				"group-data-[segsize=sm]/seg:h-5 group-data-[segsize=sm]/seg:text-xs group-data-[segsize=sm]/seg:after:absolute group-data-[segsize=sm]/seg:after:inset-x-0 group-data-[segsize=sm]/seg:after:-inset-y-0.5",
				className,
			)}
			{...props}
		/>
	)
}
