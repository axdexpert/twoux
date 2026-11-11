export const install = "";
export const api = [
	{ component: "RadioGroup", props: [
		{ name: "value / defaultValue", type: "string", description: "Selected value. Always set a default." },
		{ name: "onValueChange", type: "(value: string) => void", description: "Called on selection." },
	] },
	{ component: "RadioField", props: [
		{ name: "id, value, label", type: "string", description: "Required." },
		{ name: "hint", type: "string", description: "Optional consequence under the label." },
	] },
];
