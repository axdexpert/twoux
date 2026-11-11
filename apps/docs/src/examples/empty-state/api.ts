export const install = "";
export const api = [
	{ component: "Empty · EmptyHeader · EmptyMedia · EmptyTitle · EmptyDescription · EmptyContent", props: [
		{ name: "Empty className", type: "string", description: "Size it to the region it replaces (for example min-h-56 for a table)." },
		{ name: "EmptyMedia variant", type: '"default" | "icon" | "error"', default: '"default"', description: '"icon" gives the 32px neutral tile. "error" is for the Error state. No illustrations.' },
		{ name: "EmptyTitle", type: "ReactNode", description: "The state, sentence case, no full stop." },
		{ name: "EmptyContent", type: "ReactNode", description: "One outline button: Clear filters for no results, the create action for no data." },
	] },
];
