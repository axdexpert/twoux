export const install = "";
export const api = [
	{ component: "RadialLines", props: [
		{ name: "periods", type: "string[]", description: "Labels for one full cycle: hours of the day, days of the week or months. The first sits at 12 o'clock; the rest run clockwise." },
		{ name: "series", type: "{ id, label, data: (number | null)[] }[]", description: "One to three series, one value per period. null is drawn as a gap, never as zero." },
		{ name: "periodLabel", type: "string", description: "Name of one period, such as Hour, for the tooltip, summary and table. Default Period." },
		{ name: "format · maxSize", type: "(n) => string · number", description: "Value format, and the largest diameter (default 320px). The chart shrinks to its container." },
		{ name: "aria-label", type: "string", description: "Name of the chart. The accessible name adds each series' highest and lowest period and any gaps." },
	] },
	{ component: "radialLinesTable", props: [
		{ name: "(periods, series, format?, periodLabel?)", type: "function", description: "Table view: one row per period, one column per series, No data for gaps." },
	] },
];
