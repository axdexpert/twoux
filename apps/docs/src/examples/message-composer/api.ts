export const install = "";
export const api = [
	{
		"component": "MessageComposer",
		"props": [
			{
				"name": "chips · onRemoveChip",
				"type": "{ id, label }[]",
				"description": "Selection and filters as context; removing one narrows what is read."
			},
			{
				"name": "mentions · tasks",
				"type": "…",
				"description": "@ for listings and / for saved tasks, with a typeahead list."
			},
			{
				"name": "onSend · busy · onStop",
				"type": "(text, mode) => void",
				"description": "Enter sends; Shift+Enter adds a line; Stop while answering."
			},
			{
				"name": "plusMenu",
				"type": "DropdownMenu items",
				"description": "Inserts, toggles, writing style, connected tools."
			}
		]
	}
];
