import { Segment, SegmentedControl } from "@twoux/ui";
import { List, Rows3 } from "lucide-react";
import { useState } from "react";
export const meta = {"title": "Views of the same data", "description": "Two or three options, one always selected. Switches how the same list is shown; it never navigates.", "order": 1};

export default function Example() {
	const [v, setV] = useState("active");
	const [d, setD] = useState("list");
	return (
		<div className="flex flex-wrap items-center gap-4">
			<SegmentedControl aria-label="Listings to show" value={v} onValueChange={setV}>
				<Segment value="all">All</Segment>
				<Segment value="active">Active</Segment>
				<Segment value="closed">Closed</Segment>
			</SegmentedControl>
			<SegmentedControl aria-label="Layout" size="sm" value={d} onValueChange={setD}>
				<Segment value="list" aria-label="List"><List /></Segment>
				<Segment value="board" aria-label="Board"><Rows3 /></Segment>
			</SegmentedControl>
		</div>
	);
}
