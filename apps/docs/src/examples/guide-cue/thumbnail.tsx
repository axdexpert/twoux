import { Button, Segment, SegmentedControl } from "@twoux/ui";
import { X } from "lucide-react";

/* GuideCue drawn in place (the real one is a Popover anchored to its target): the Layout control carries the focus
   ring, and the cue sits under it with the title, body, "Step 2 of 3", Back and Next, using PopoverContent's classes. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 justify-items-end gap-2" aria-hidden="true">
			<div className="rounded-sm outline-2 outline-offset-2 outline-ring">
				<SegmentedControl value="table" onValueChange={() => {}} size="sm" aria-label="Layout">
					<Segment value="table" tabIndex={-1}>Table</Segment>
					<Segment value="board" tabIndex={-1}>Board</Segment>
				</SegmentedControl>
			</div>
			<div className="grid w-60 gap-2 rounded-md border border-line bg-popover p-3 text-base shadow-pop">
				<div className="flex items-start gap-2">
					<span className="min-w-0 flex-1 pt-0.5 font-semibold text-ink">Choose a layout</span>
					<Button variant="ghost" size="icon-xs" tabIndex={-1} className="-mt-0.5 -mr-1 text-ink-3"><X /></Button>
				</div>
				<p className="text-ink-2">Table suits scanning; Board groups by status.</p>
				<div className="flex items-center gap-2 pt-1">
					<span className="tabular flex-1 text-sm text-ink-2">Step 2 of 3</span>
					<Button variant="outline" size="sm" tabIndex={-1}>Back</Button>
					<Button size="sm" tabIndex={-1}>Next</Button>
				</div>
			</div>
		</div>
	);
}
