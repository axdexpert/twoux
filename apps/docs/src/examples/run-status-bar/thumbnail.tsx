import { Button } from "@twoux/ui";
import { Loader2, Square } from "lucide-react";

/* RunStatusBar while running, as the slim bar under a sheet, built with its classes: the spinner, row count, meter
   and Stop, in the component's order. The "Running …" label, credits and Auto-run are left out to fit; the spinner is still. */
export default function Thumbnail() {
	return (
		<div className="flex w-64 items-center gap-x-3 rounded-sm border border-line bg-surface px-3 py-1.5 text-sm whitespace-nowrap" aria-hidden="true">
			<div className="flex min-w-0 flex-1 items-center gap-x-2">
				<Loader2 className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
				<span className="tabular text-ink-2">620 of 1,000</span>
				<span className="h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-hover"><span className="block h-full w-3/5 rounded-full bg-primary" /></span>
			</div>
			<Button variant="outline" size="sm" tabIndex={-1}><Square />Stop</Button>
		</div>
	);
}
