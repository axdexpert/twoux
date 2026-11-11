export const install = "";
export const api = [
	{
		"component": "FilterPanel",
		"props": [
			{
				"name": "sections",
				"type": "{ id, title, options: { value, label, count? }[], defaultOpen? }[]",
				"description": "Most used sections open, the rest collapsed. Counts reflect the other filters."
			},
			{
				"name": "value · onChange",
				"type": "Record<string, string[]>",
				"description": "Ticks apply at once. Clear all and a clear per section are built in."
			}
		]
	}
];
