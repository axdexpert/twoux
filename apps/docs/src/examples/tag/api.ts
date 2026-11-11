export const install = "";
export const api = [
	{
		"component": "Tag",
		"props": [
			{
				"name": "children",
				"type": "string",
				"description": "The category. Truncates with the full text on hover."
			},
			{
				"name": "color",
				"type": "CSS colour",
				"description": "Only when the colour means something, such as a team."
			},
			{
				"name": "onRemove",
				"type": "() => void",
				"description": "Adds the remove button."
			}
		]
	},
	{
		"component": "TagList",
		"props": [
			{
				"name": "tags · max",
				"type": "string[] · number",
				"description": "Up to three, then +N with the rest in a tooltip."
			}
		]
	}
];
