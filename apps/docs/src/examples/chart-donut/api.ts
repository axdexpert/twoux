export const install = "";
export const api = [
	{ component: "DonutChart", props: [
		{ name: "segments", type: "{ id, label, value }[]", description: "Two to five parts of one whole. Labels show count and share." },
		{ name: "total · totalLabel", type: "number · string", description: "The centre figure, defaults to the sum." },
	] },
];
