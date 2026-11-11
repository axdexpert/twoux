export const install = "";
export const api = [
	{ component: "RadialBars", props: [
		{ name: "items", type: "{ id, label, value, limit, unit? }[]", description: "One to four measures, each the share of its own fixed limit. Outermost ring first. Extra items are not drawn." },
		{ name: "format", type: "(n) => string", description: "Formats value and limit in the list, tooltip and summary. Default en-GB numbers." },
		{ name: "size", type: "number", description: "Diameter of the rings, 96 to 160px. Default 128. The list wraps under the rings on narrow screens." },
		{ name: "aria-label", type: "string", description: "Name of the chart. The accessible name adds every value, limit, share and status in words." },
	] },
	{ component: "radialBarsTable", props: [
		{ name: "(items, format?)", type: "function", description: "Table view: measure, used, limit, share of limit." },
	] },
];
