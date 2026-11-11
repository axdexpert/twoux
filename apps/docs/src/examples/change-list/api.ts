export const install = "";
export const api = [
	{ component: "ChangeList", props: [
		{ name: "level", type: "2 | 3 | 4", default: "3", description: "Heading level of the title. Use 2 when the item sits straight under the page's h1, as on a dashboard." },
		{ name: "title · description", type: "string", description: "The list is its own dashboard item, framed like a chart card." },
		{ name: "items", type: "{ id, name, symbol?, value, unit?, change, spark?, href? }[]", description: "One row per instrument or metric. Rows with href are links to the full record." },
		{ name: "format · formatChange", type: "(n) => string", description: "Value with two decimals and change in percent by default." },
		{ name: "upIs", type: '"good" | "bad" | "neutral"', default: '"good"', description: "Direction colour; arrow and sign always show, so colour is never alone." },
		{ name: "seeAll", type: "{ href, label? }", description: "Footer link to the full list." },
	] },
];
