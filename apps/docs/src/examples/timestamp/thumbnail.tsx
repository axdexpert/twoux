/* Timestamp as it reads in a list, copied from the component: relative time with who caused it, and the tooltip
   it opens on hover or focus with the full date and zone. The tooltip uses TooltipContent's classes and arrow. */
export default function Thumbnail() {
	return (
		<div className="grid justify-items-start gap-2" aria-hidden="true">
			<span data-slot="tooltip-content" className="relative w-fit rounded-sm bg-foreground px-2 py-1 text-sm text-background">
				8 November 2026 at 11:00 GMT
				<span className="absolute -bottom-1 left-6 size-2.5 rotate-45 rounded-xs bg-foreground" />
			</span>
			<span className="text-base text-ink-2">
				<time className="tabular rounded-xs">3 hours ago</time>
				<span> by <span className="font-medium text-primary-ink">Priya Shah</span></span>
			</span>
		</div>
	);
}
