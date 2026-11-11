export const install = "";
export const api = [
	{
		"component": "AssistantPanel",
		"props": [
			{
				"name": "open · onOpenChange · mode",
				"type": "boolean · \"push\" | \"overlay\"",
				"description": "Opens in the right-hand slot (⌘J), replacing record detail."
			},
			{
				"name": "title · onOpenPage · composer · caveat",
				"type": "…",
				"description": "Conversation title, Open as full page, the MessageComposer, and the caveat line."
			},
			{
				"name": "children",
				"type": "UserMessage · ThinkingSteps · AssistantMessage · SuggestedChanges · StepCard",
				"description": "The thread, in order."
			}
		]
	}
];
