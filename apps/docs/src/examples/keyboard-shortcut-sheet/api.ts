export const install = "";
export const api = [
	{
		"component": "ShortcutSheet",
		"props": [
			{
				"name": "groups",
				"type": "{ title, items: { keys, action }[] }[]",
				"description": "A handful per task group."
			},
			{
				"name": "singleKeys · onSingleKeysChange",
				"type": "boolean",
				"description": "Wire to ShortcutsProvider enabled, so the switch really turns them off."
			}
		]
	}
];
