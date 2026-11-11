export const install = "";
export const api = [
	{ component: "SankeyChart", props: [
		{ name: "nodes · links", type: "{ id, label }[] · { source, target, value }[]", description: "Columns come from the links: sources left, then each step right. Two or three columns." },
		{ name: "height · format", type: "number · (n) => string", description: "Labels give name, value and share of the column when columns have room; otherwise names only, with values in the tooltip and table." },
	] },
	{ component: "sankeyTable", props: [
		{ name: "(nodes, links, format?)", type: "function", description: "Table view: from, to, value." },
	] },
];
