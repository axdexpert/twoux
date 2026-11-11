export const install = "";
export const api = [
	{
		"component": "AgentPermissions",
		"props": [
			{
				"name": "items",
				"type": "{ id, group, action, covers, level, neverAllow? }[]",
				"description": "Off, Ask first or Allow. neverAllow for decisions about people."
			},
			{
				"name": "onChange",
				"type": "(id, level) => void",
				"description": "Save per workspace and show who changed it."
			}
		]
	}
];
