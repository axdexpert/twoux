import { Segment, SegmentedControl } from "@twoux/ui";

/* AgentPermissions' Change list, built from its own markup with the real SegmentedControl. The Read group and the
   "covers" line are left out to fit. */
const ROWS = [
	{ action: "Edit", level: "ask" },
	{ action: "Email", level: "off" },
];

export default function Thumbnail() {
	return (
		<ul className="w-64 divide-y divide-line rounded-sm border border-line bg-surface" aria-hidden="true">
			{ROWS.map((p) => (
				<li key={p.action} className="flex items-center gap-3 px-3 py-2.5">
					<span className="min-w-0 flex-1 truncate text-base font-medium text-ink">{p.action}</span>
					<SegmentedControl value={p.level} onValueChange={() => {}} size="sm" aria-label={`${p.action}: access level`}>
						<Segment tabIndex={-1} value="off">Off</Segment>
						<Segment tabIndex={-1} value="ask">Ask first</Segment>
						<Segment tabIndex={-1} value="allow">Allow</Segment>
					</SegmentedControl>
				</li>
			))}
		</ul>
	);
}
