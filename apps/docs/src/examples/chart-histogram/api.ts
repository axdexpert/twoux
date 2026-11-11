export const install = "";
export const api = [
	{ component: "Histogram", props: [
		{ name: "bins", type: "{ from, to, count }[]", description: "Equal-width bins, from binValues() or your own. Columns touch with a 2px gap; the y axis is the count." },
		{ name: "xTitle · countLabel", type: "string", description: "What the x axis measures, with its unit, and the plural noun for what is counted." },
		{ name: "marker", type: "{ value, label }", description: "A dashed reference such as the median." },
		{ name: "format · height", type: "(n) => string · number", description: "Formats bin edges." },
	] },
	{ component: "binValues · histogramTable", props: [
		{ name: "binValues(values, { bins?, binWidth?, start? })", type: "function", description: "Counts raw values into round bins." },
		{ name: "histogramTable(bins, format?, first?)", type: "function", description: "Table view: range and count." },
	] },
];
