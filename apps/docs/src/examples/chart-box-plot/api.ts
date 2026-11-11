export const install = "";
export const api = [
	{ component: "BoxPlot", props: [
		{ name: "groups", type: "{ id, label, values? , stats? }[]", description: "Raw values, or precomputed { min, q1, median, q3, max, outliers }. All groups share one axis." },
		{ name: "xTitle · format", type: "string · (n) => string", description: "What the axis measures, with its unit." },
	] },
	{ component: "boxStats · boxTable", props: [
		{ name: "boxStats(values)", type: "function", description: "Median, quartiles, whiskers at 1.5 × IQR and the outliers beyond them." },
		{ name: "boxTable(groups, format?, first?)", type: "function", description: "Table view: whiskers, quartiles, median and outliers per group." },
	] },
];
