export const install = "";
export const api = [
	{
		"component": "WhyChoice",
		"props": [
			{
				"name": "choice",
				"type": "string",
				"description": "What was chosen. Titles the popover (\"Why Thursday at 14:00\") and names the control for screen readers."
			},
			{
				"name": "factors",
				"type": "string[]",
				"description": "The deciding factors, most important first."
			},
			{
				"name": "alternatives",
				"type": "{ name, why }[]",
				"description": "Options that lost and why."
			},
			{
				"name": "dropped",
				"type": "string",
				"description": "A requirement that could not be met."
			},
			{
				"name": "onChange · onKeep",
				"type": "() => void",
				"description": "Change this and Keep it. Both close the popover."
			}
		]
	}
];
