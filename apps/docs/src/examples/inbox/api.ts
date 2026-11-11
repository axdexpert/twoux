export const install = "";
export const api = [
	{
		"component": "Inbox",
		"props": [
			{
				"name": "items",
				"type": "{ id, title, source, time, needsYou?, state }[]",
				"description": "Needs you sorts first."
			},
			{
				"name": "onDone · onSnooze",
				"type": "(id, until?) => void",
				"description": "Show a toast with Undo for each."
			},
			{
				"name": "renderDetail",
				"type": "(item) => ReactNode",
				"description": "The item with its actions in place."
			}
		]
	}
];
