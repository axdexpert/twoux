import { Badge } from "@twoux/ui";

/* ConversationHistory's two sections, built with its classes: a scheduled task waiting on you, then a recent
   conversation with a new answer. The search field is left out to fit. */
const row = "flex w-full items-center gap-2 rounded-xs px-2 py-1.5";
const heading = "px-2 text-sm font-medium text-ink-3";

export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-3" aria-hidden="true">
			<div className="grid gap-0.5">
				<span className={heading}>Scheduled tasks</span>
				<span className={row}>
					<span className="min-w-0 flex-1 truncate text-base text-ink">Weekly check</span>
					<Badge variant="warning" dot>Needs you</Badge>
					<span className="tabular shrink-0 text-sm text-ink-3">Mon</span>
				</span>
			</div>
			<div className="grid gap-0.5">
				<span className={heading}>Recent</span>
				<span className={row}>
					<span className="size-1.5 shrink-0 rounded-full bg-primary" />
					<span className="min-w-0 flex-1 truncate text-base text-ink">Why are these closing early?</span>
					<span className="tabular shrink-0 text-sm text-ink-3">Today</span>
				</span>
			</div>
		</div>
	);
}
