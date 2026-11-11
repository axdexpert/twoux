import { PaneLayout } from "@twoux/ui";

/* The real PaneLayout with three empty panes, to show columns, headers and splitters. */
const LAYOUT = [
	{ id: "a", size: 2, panes: [{ id: "markets", size: 1 }] },
	{ id: "b", size: 3, panes: [{ id: "chart", size: 3 }, { id: "orders", size: 2 }] },
];

export default function Thumbnail() {
	return (
		<div className="h-40 w-64 overflow-hidden rounded-sm border border-line" aria-hidden="true" inert>
			<PaneLayout aria-label="Workspace" value={LAYOUT} onValueChange={() => {}} stackBelow={0} panes={{ markets: { title: "Markets", children: null }, chart: { title: "Chart", children: null }, orders: { title: "Orders", children: null } }} />
		</div>
	);
}
