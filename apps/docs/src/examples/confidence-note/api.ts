export const install = "";
export const api = [
	{
		"component": "ConfidenceNote",
		"props": [
			{
				"name": "cause",
				"type": "string",
				"description": "What made the agent unsure, in words. Shown after \"Not sure:\". Never a percentage."
			},
			{
				"name": "children",
				"type": "ReactNode",
				"description": "The safer option or what to check."
			},
			{
				"name": "action",
				"type": "ReactNode",
				"description": "Optional buttons, for example Check the source."
			}
		]
	}
];
