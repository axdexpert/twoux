export const install = "";
export const api = [
	{
		"component": "PromptEditor",
		"props": [
			{
				"name": "segments · onRemoveField",
				"type": "(string | { field })[]",
				"description": "Fields are chips you can remove."
			},
			{
				"name": "inputs · outputs",
				"type": "{ name, type }[]",
				"description": "Listed with their types."
			},
			{
				"name": "onTest · testing · results",
				"type": "…",
				"description": "Test on 3 rows before the whole table."
			}
		]
	}
];
