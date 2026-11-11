export const install = "";
export const api = [
	{ component: "ChartFrame", props: [
		{ name: "level", type: "2 | 3 | 4", default: "3", description: "Heading level of the title. Use 2 when the item sits straight under the page's h1, as on a dashboard." },
		{ name: "title · description · actions", type: "string · ReactNode", description: "Title says what is measured; actions hold the period control." },
		{ name: "status · onRetry · onClearFilter", type: '"ready" | "loading" | "empty" | "no-match" | "error"', default: '"ready"', description: "Every chart has all five states. Errors offer Try again; no-match offers Clear filters." },
		{ name: "legend · table", type: "ChartLegend · chartTable(...)", description: "Legend for 2+ series. table adds a toggle that shows the same data as a table." },
		{ name: "titleHidden · view · onViewChange", type: 'boolean · "chart" | "table"', description: "For a chart inside a pane: keep the title for screen readers only and switch chart and table from the pane's menu. With all three and no actions, the frame draws no header." },
		{ name: "frame", type: '"card" | "flush"', default: '"card", or "flush" inside AppShell frame="flush"', description: "\"flush\" drops the border, shadow and padding, for a chart that fills a region of a workspace. Inside a flush shell it is the default." },
	] },
	{ component: "CartesianChart", props: [
		{ name: "kind", type: '"line" | "area" | "bar" | "mixed"', description: "One y axis only. Mixed: bars and lines in the same unit." },
		{ name: "x · series", type: "string[] · { id, label, data, type? }[]", description: "Colours follow series order (c1, c2…), never rank. Nine or more series: fold into Other." },
		{ name: "stacked · hidden · threshold", type: "boolean · string[] · { value, label }", description: "Stack area or bars from zero; hidden keeps colours fixed; threshold draws a dashed grey reference." },
		{ name: "aria-label", type: "string", description: "Becomes the start of a generated text summary. Arrow keys move between points." },
	] },
];
