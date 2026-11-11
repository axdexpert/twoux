import { Calendar } from "@twoux/ui";

/* The calendar grid as it opens under the field: March 2026, 12 March selected. Static, so the gallery doesn't move. */
export default function Thumbnail() {
	return (
		<div className="rounded-md border border-line bg-popover shadow-pop" aria-hidden="true" inert>
			<Calendar mode="single" selected={new Date(2026, 2, 12)} defaultMonth={new Date(2026, 2, 1)} showOutsideDays={false} />
		</div>
	);
}
