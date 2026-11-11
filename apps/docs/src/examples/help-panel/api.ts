export const install = "";
export const api = [
	{
		"component": "HelpPanel",
		"props": [
			{
				"name": "topic",
				"type": "{ id, title, body, links? }",
				"description": "Two to five short paragraphs; up to three Learn more links."
			},
			{
				"name": "open · onOpenChange · footer",
				"type": "…",
				"description": "Opens in the right-hand slot; footer for a FeedbackPrompt."
			}
		]
	},
	{
		"component": "InfoLink",
		"props": [
			{
				"name": "topic · onOpen",
				"type": "string",
				"description": "Small Info link next to a heading or label."
			}
		]
	}
];
