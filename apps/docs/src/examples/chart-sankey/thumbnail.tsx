import { SankeyChart } from "@twoux/ui";

const NODES = [
	{ id: "search", label: "Search" },
	{ id: "direct", label: "Direct" },
	{ id: "pricing", label: "Pricing" },
	{ id: "trial", label: "Trial" },
	{ id: "left", label: "Left" },
];
const LINKS = [
	{ source: "search", target: "pricing", value: 8 },
	{ source: "direct", target: "pricing", value: 4 },
	{ source: "pricing", target: "trial", value: 3 },
	{ source: "pricing", target: "left", value: 9 },
];

/* The real SankeyChart with three columns of nodes and the flows between them. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<SankeyChart nodes={NODES} links={LINKS} height={110} aria-label="Example" />
		</div>
	);
}
