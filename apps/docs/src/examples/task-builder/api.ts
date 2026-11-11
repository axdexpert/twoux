export const install = "";
export const api = [
	{
		"component": "TaskBuilder",
		"props": [
			{
				"name": "parts",
				"type": "(string | { id, placeholder, options, required? })[]",
				"description": "The sentence with its slots."
			},
			{
				"name": "value · onChange · onRun · onSave · onSchedule",
				"type": "…",
				"description": "Run (⌘↵) is blocked while a required slot is empty; the message names it."
			}
		]
	}
];
