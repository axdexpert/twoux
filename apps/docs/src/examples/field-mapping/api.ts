export const install = "";
export const api = [
	{
		component: "FieldMapping",
		props: [
			{ name: "targets", type: "{ id, label, kind, required?, options? }[]", description: "kind: text, number, date, email, url or select. Values are checked against it." },
			{ name: "sources", type: "{ id, label, samples }[]", description: "Up to 20 sample values per column, used for the first value shown and the mismatch warnings." },
			{ name: "value · onChange", type: "Record<targetId, sourceId | null>", description: "Start from autoMapFields(targets, sources, aliases)." },
			{ name: "extra · onExtraChange", type: "Record<sourceId, \"skip\" | \"create\">", description: "Shows Other columns with Don't import or Create column. Omit both to hide it." },
			{ name: "errors", type: "Record<targetId, string>", description: "Set after a failed submit, e.g. a required field with no column." },
			{ name: "targetHeading · sourceHeading", type: "string", description: "Column headings; default Field in the table, Column in the file." },
		],
	},
	{ component: "autoMapFields · checkFieldValue · parseCsv", props: [{ name: "helpers", type: "functions", description: "Pair by name ignoring case and punctuation; name the problem with a value (\"Invalid email\"); parse RFC 4180 CSV." }] },
];
