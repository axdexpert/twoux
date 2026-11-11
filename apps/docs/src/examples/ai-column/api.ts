export const install = "";
export const api = [
	{
		"component": "AiColumnHeader · AiCell",
		"props": [
			{
				"name": "name · written · onRefresh",
				"type": "string",
				"description": "Marked once in the header, with when it was written."
			},
			{
				"name": "cell",
				"type": "writing | done | failed | queued",
				"description": "Done cells cite their record; failed cells say why and offer Try again."
			}
		]
	}
];
