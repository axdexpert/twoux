export const install = "";
export const api = [
	{ component: "Treemap", props: [
		{ name: "items", type: "{ id, label, value, group? }[]", description: "Area by value, squarified. Without groups every tile is c1; with up to eight groups each group takes its slot colour and a legend." },
		{ name: "max", type: "number", default: "12", description: "Tiles past this fold into a grey Other." },
		{ name: "height · format", type: "number · (n) => string", description: "Names print only where they fit, shares where there is room; values are in the tooltip and table." },
	] },
];
