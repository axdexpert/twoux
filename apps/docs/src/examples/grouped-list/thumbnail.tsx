import { Badge, Button, GroupedList, ListGroup } from "@twoux/ui";

/* The real GroupedList: one open group with its row, then a collapsed group with its header action. */
export default function Thumbnail() {
	return (
		<GroupedList className="w-64" aria-label="Candidates by stage">
			<ListGroup title="Screen" count={1}>
				<li className="grid h-9 grid-cols-[1fr_auto_auto] items-center gap-3 px-3 text-base">
					<span className="min-w-0 truncate"><span className="font-medium text-ink">Amara Okafor</span> <span className="text-ink-3">· Designer</span></span>
					<Badge variant="secondary">Screen</Badge>
					<span className="tabular text-right text-sm text-ink-3">2 Nov</span>
				</li>
			</ListGroup>
			<ListGroup title="Applied" count={3} defaultOpen={false} action={<Button variant="ghost" size="xs" tabIndex={-1}>Screen all</Button>}>
				<li />
			</ListGroup>
		</GroupedList>
	);
}
