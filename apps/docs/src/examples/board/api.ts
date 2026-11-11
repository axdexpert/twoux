export const install = "";
export const api = [
	{ component: "Board", props: [
		{ name: "items · onItemsChange", type: "{ id, title, columnSpan? }[]", description: "Order and width (1 to 4 columns). Save per person." },
		{ name: "renderItem", type: "(item) => BoardItem", description: "Return a BoardItem for each item." },
		{ name: "empty", type: "ReactNode", description: "Shown when there are no items: an Empty state with a way to add one." },
		{ name: "aria-label", type: "string", default: '"Dashboard"', description: "Name the board." },
	] },
	{ component: "BoardItem", props: [
		{ name: "level", type: "2 | 3 | 4", default: "3", description: "Heading level of the title. Use 2 when the item sits straight under the page's h1, as on a dashboard." },
		{ name: "id · header · description", type: "string", description: "The header is the item's heading and names its drag handle." },
		{ name: "settings", type: "DropdownMenuItem[]", description: "Extra menu items. Move, Wider, Narrower and Remove are always included." },
		{ name: "footer", type: "ReactNode", description: "Optional, such as a link to the full report." },
		{ name: "disableContentPaddings", type: "boolean", default: "false", description: "For content that runs to the edges, such as a table." },
	] },
];
