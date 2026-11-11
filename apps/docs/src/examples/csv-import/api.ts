export const install = "";
export const api = [
	{
		component: "CsvImport",
		props: [
			{ name: "open · onOpenChange", type: "boolean · (open) => void", description: "A two-step dialog. It resets each time it opens." },
			{ name: "targets", type: "MappingTarget[]", description: "The table's fields, passed to FieldMapping." },
			{ name: "tableName", type: "string", description: "Used in the title: Import a CSV file into People." },
			{ name: "sample", type: "{ name, text }", description: "Offers Use the sample file, so people can try the flow without a file." },
			{ name: "aliases", type: "Record<targetId, string[]>", description: "Other names a field goes by, for automatic mapping." },
			{ name: "onImport", type: "({ rows, created, skipped, problems }) => void", description: "Rows keyed by target id; created columns keyed by their source name. Date fields arrive as ISO 8601 (2026-11-02), read day first from 02/11/2026. problems lists each field and problem (missing or invalid), how many rows had it and whether they were skipped or imported with the cell empty, so the page can say what happened. Show a toast with Undo." },
		],
	},
];
