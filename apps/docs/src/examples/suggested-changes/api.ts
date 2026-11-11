export const install = "";
export const api = [
	{
		"component": "SuggestedChanges",
		"props": [
			{
				"name": "changes",
				"type": "{ id, label, detail?, before?, after? }[]",
				"description": "Ticked by default, with before and after."
			},
			{
				"name": "onApply · onDismiss · onEdit",
				"type": "…",
				"description": "Apply counts what it changes; ⌘↵ applies. Show a toast with Undo after."
			}
		]
	}
];
