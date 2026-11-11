import { Segment, SegmentedControl } from "@twoux/ui";
export default function Thumbnail() {
	return (
		<SegmentedControl aria-label="View" value="b" onValueChange={() => {}}>
			<Segment value="a">All</Segment><Segment value="b">Active</Segment><Segment value="c">Closed</Segment>
		</SegmentedControl>
	);
}
