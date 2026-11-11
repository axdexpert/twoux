export const install = "";
export const api = [
	{
		"component": "AgentRun",
		"props": [
			{
				"name": "task · status · meta · onStop",
				"type": "…",
				"description": "Header with the status as a word."
			},
			{
				"name": "steps",
				"type": "{ title, detail?, state, action? }[]",
				"description": "done, running, waiting, skipped or failed; the waiting step holds its action."
			}
		]
	}
];
