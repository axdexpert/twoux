export const install = "";
export const api = [
	{ component: "BulletChart", props: [
		{ name: "rows", type: "{ id, label, value, target, bands }[]", description: "One row per measure. bands are the upper edges of the qualitative ranges, ascending." },
		{ name: "bandLabels", type: "string[]", default: '["Poor", "Satisfactory", "Good"]', description: "Names of the bands, worst first. Bands are neutral grey steps, darkest for the worst." },
		{ name: "format", type: "(n) => string", description: "Value, target and scale format." },
	] },
];
