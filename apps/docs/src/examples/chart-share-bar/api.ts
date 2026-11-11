export const install = "";
export const api = [
	{ component: "ShareBar", props: [
		{ name: "parts", type: "{ id, label, value }[]", description: "One whole. Colours follow the order you pass (c1, c2…); a part at zero draws nothing." },
		{ name: "max", type: "number", default: "6", description: "Parts past this fold into a grey Other, smallest first." },
		{ name: "variant", type: '"thin" | "tall"', default: '"thin"', description: "Thin: 8px bar, share in the legend above. Tall: 28px, share printed in each block that fits, names in the legend." },
		{ name: "showValue · format", type: "boolean · (n) => string", description: "Print each amount beside its share in the legend (thin only)." },
		{ name: "aria-label", type: "string", description: "Start of the generated summary, which lists every part, share and amount." },
	] },
	{ component: "shareTable", props: [
		{ name: "(parts, format?, first?)", type: "function", description: "Table view for ChartFrame: part, value, share." },
	] },
];
