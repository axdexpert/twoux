export const install = "";
export const api = [
	{ component: "GroupedList", props: [{ name: "children", type: "ListGroup[]", description: "The bordered list. Give it an aria-label." }] },
	{ component: "ListGroup", props: [
		{ name: "title · count", type: "string · number", description: "Count beside every group name." },
		{ name: "action", type: "ReactNode", description: "Optional ghost xs button for the whole group." },
		{ name: "defaultOpen", type: "boolean", default: "true", description: "Collapse long groups by default." },
		{ name: "children", type: "<li>[]", description: "Rows with the same grid in every group so columns line up." },
	] },
];
