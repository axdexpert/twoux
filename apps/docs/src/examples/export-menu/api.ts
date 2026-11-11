export const install = "";
export const api = [
	{ component: "ExportMenu", props: [
		{ name: "onlyVisible · onOnlyVisibleChange", type: "boolean", description: "Toggles without closing the menu." },
		{ name: "includeAi · onIncludeAiChange", type: "boolean", description: "Pass only when the table has AI columns; otherwise the option is hidden." },
		{ name: "formats", type: '("CSV" | "JSON")[]', default: '["CSV", "JSON"]', description: "Most used first." },
		{ name: "onDownload · onCopy", type: "(format) => void", description: "Confirm with a toast that names the file or row count." },
	] },
];
