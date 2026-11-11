export const install = "";
export const api = [
	{ component: "RankedList", props: [
		{ name: "items", type: "{ id, label, value, change?, spark?, href?, icon?, colorIndex? }[]", description: "Ranked rows. colorIndex ties a row's dot to its series in the chart beside it; it defaults to the row position." },
		{ name: "format · formatChange", type: "(n) => string", description: "Value and change formats. Change shows arrow and sign, and reads out up or down." },
		{ name: "upIs", type: '"good" | "bad" | "neutral"', default: '"good"', description: "Colours the change green or red only when the direction means good or bad; neutral keeps it grey." },
		{ name: "dots", type: "boolean", default: "true", description: "Series dot on each row, for a list that is a chart's legend." },
		{ name: "onSelect · activeId · onActiveChange", type: "(item) => void · string · (id) => void", description: "Rows with href are links, with onSelect are buttons. activeId highlights the series under the chart's crosshair." },
	] },
	{ component: "ChangeValue", props: [
		{ name: "value · format · upIs", type: "number · (n) => string · good | bad | neutral", description: "Arrow, sign and colour for a change, with the word up or down for screen readers." },
	] },
];
