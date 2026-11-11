export const install = "";
export const api = [
	{
		"component": "FeedbackPrompt",
		"props": [
			{
				"name": "question · description",
				"type": "string",
				"description": "Default “Was this helpful?”."
			},
			{
				"name": "onVote",
				"type": "(vote) => Promise",
				"description": "Reject to show the failed state with Try again."
			},
			{
				"name": "onFollowUp",
				"type": "(text, vote) => Promise",
				"description": "Optional comment after voting, 500 characters, with the privacy line."
			}
		]
	}
];
