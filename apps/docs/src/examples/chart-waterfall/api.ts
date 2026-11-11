export const install = "";
export const api = [
	{ component: "Waterfall", props: [
		{ name: "steps", type: "{ id, label, value?, total? }[]", description: "Changes in order. A total step draws from zero to its value, or to the running total when value is left out." },
		{ name: "labels", type: "{ increase, decrease, total }", default: '"Increase" · "Decrease" · "Total"', description: "Legend and tooltip names. Increases are c1, decreases c2, totals neutral grey: never green and red." },
		{ name: "format · height", type: "(n) => string · number", description: "Value labels carry + or − and print only where they fit; the tooltip and table always have them." },
	] },
	{ component: "waterfallTable", props: [
		{ name: "(steps, format?)", type: "function", description: "Table view: step, change, running total." },
	] },
];
