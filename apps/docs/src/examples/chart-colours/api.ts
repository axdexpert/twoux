export const install = "";
export const api = [
	{
		"component": "seriesColor",
		"props": [
			{
				"name": "(index)",
				"type": "number",
				"description": "var(--color-c1) … c8 in fixed order. Use the series' original index so colours never change when others are hidden."
			}
		]
	},
	{
		"component": "Tokens",
		"props": [
			{
				"name": "--color-c1 … c8 · --color-q1 … q5",
				"type": "CSS",
				"description": "bg-c1 or bg-q3 in charts only; product UI uses roles."
			}
		]
	}
];
