import { Button, RadioField, RadioGroup } from "@twoux/ui";
import { X } from "lucide-react";

/* TableSettings in its side panel, copied from the component: the title bar with the table's name and Close, and
   the duplicate-rows rule as real radios. Headings, hints, other sections and the Save footer are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="flex w-60 flex-col rounded-sm border border-line bg-surface" aria-hidden="true">
			<div className="flex h-11 shrink-0 items-center gap-1 border-b border-line pr-2 pl-4">
				<div className="flex min-w-0 flex-1 items-baseline gap-2"><span className="truncate text-md font-semibold text-ink">Table settings</span><span className="truncate text-sm text-ink-3">People</span></div>
				<Button variant="ghost" size="icon-sm" tabIndex={-1}><X /></Button>
			</div>
			<div className="grid gap-3 px-4 py-2">
				<RadioGroup value="keep-oldest" aria-label="Duplicate rows" className="gap-2">
					<RadioField id="ts-thumb-oldest" value="keep-oldest" label="Keep the oldest row" />
					<RadioField id="ts-thumb-newest" value="keep-newest" label="Keep the newest row" />
				</RadioGroup>
			</div>
		</div>
	);
}
