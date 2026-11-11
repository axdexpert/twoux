export const install = "";
export const api = [
	{ component: "MapChart", props: [
		{ name: "topology · object", type: "TopoJSON · string", description: "Your own TopoJSON, such as world-atlas/countries-110m.json, and the object to draw (\"countries\"). Nothing is bundled in @twoux/ui." },
		{ name: "values", type: "{ id, value, label? }[]", description: "Shade regions: one value per feature id (world-atlas uses ISO 3166-1 numeric codes, e.g. \"826\"). Use a rate or a per-head figure, not a raw count. Regions without a value are hatched and labelled No data." },
		{ name: "markers", type: "{ id, label, lon, lat, value }[]", description: "Instead of values: circles at points, area proportional to value. Use for raw counts and amounts. One encoding per map." },
		{ name: "projection", type: "\"equal-earth\" · \"mercator\" · \"albers-uk\" · () => GeoProjection", description: "Equal Earth by default for the world; the map fits its width and takes the height it needs. A fixed height fits inside it." },
		{ name: "exclude", type: "string[]", description: "Feature ids to leave out of the drawing and the fit, e.g. [\"010\"] for Antarctica." },
		{ name: "thresholds", type: "[n, n, n, n]", description: "Four class breaks for the five colour steps. Default: equal, rounded steps from 0 to the highest value (mapThresholds)." },
		{ name: "format · valueLabel · share", type: "(n) => string · string · boolean", description: "How values read, what they are called in the details, and whether share of total shows. Turn share off for rates and averages." },
		{ name: "onSelect · selectLabel · filterField", type: "(region) => void · string · string", description: "Drill-down: Enter or a click pins the details, which then offer one button (\"Filter page\") and say what it applies (\"Country is France\")." },
		{ name: "aria-label", type: "string", description: "What the map shows and when. The accessible name adds the top three regions and how many have no data." },
	] },
	{ component: "mapTable", props: [
		{ name: "(values, { format?, share?, first?, valueLabel? })", type: "function", description: "Table view: region, value and share, highest first. Includes values with no shape on the map." },
	] },
];
