export const install = "";
export const api = [
	{
		"component": "ItemsPalette",
		"props": [
			{
				"name": "items",
				"type": "{ id, title, description, type }[]",
				"description": "Only items not on the board. No live data: title, one line, type."
			},
			{
				"name": "onAdd",
				"type": "(id) => void",
				"description": "Add puts the item at the end of the board in its default size."
			}
		]
	},
	{
		"component": "Board",
		"props": [
			{
				"name": "onAddFromPalette",
				"type": "(id, index) => void",
				"description": "Called when a palette item is dropped onto the board."
			}
		]
	}
];
