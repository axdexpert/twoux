export const install = "";
export const api = [
	{
		"component": "ClarifyingQuestion",
		"props": [
			{
				"name": "questions",
				"type": "{ question, options }[]",
				"description": "At most three. The first option is the recommended default."
			},
			{
				"name": "onDone",
				"type": "(answers) => void",
				"description": "Skip keeps the defaults. Number keys choose; Enter continues."
			}
		]
	}
];
