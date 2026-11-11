export const install = "";
export const api = [
	{ component: "PriceChart", props: [
		{ name: "x · data", type: "string[] · (number | null)[]", description: "Time labels for the whole session; data is null for gaps and for slots not traded yet, so the day's length stays visible." },
		{ name: "baseline", type: '"auto" | "zero" | "range"', default: '"auto"', description: "auto starts at zero unless the range is narrow. When it does not start at zero, a note under the axis says so." },
		{ name: "reference", type: "{ value, label }", description: "Dashed grey reference, such as the previous close. The tooltip gives the change against it." },
		{ name: "live", type: "boolean", description: "Pulses the last point while the market is open; still under reduced motion." },
		{ name: "format · valueLabel · height", type: "(n) => string · string · number", description: "Value format, the tooltip's name for the value, plot height." },
	] },
];
