export const install = "";
export const api = [
	{ component: "StatCompare", props: [
		{ name: "label · value · change · period", type: "string", description: "Change against a named period: “+12% vs October”." },
		{ name: "good", type: "boolean", description: "Whether the change is good. Colour and screen reader text follow it, not the arrow." },
		{ name: "spark", type: "number[]", description: "Optional trend line." },
	] },
];
