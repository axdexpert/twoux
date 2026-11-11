export const install = "";
export const api = [
	{
		"component": "ScatterChart",
		"props": [
			{
				"name": "points",
				"type": "{ id, label, x, y, group, href? }[]",
				"description": "Up to three groups, each with its own colour and shape."
			},
			{
				"name": "xTitle · yTitle",
				"type": "string",
				"description": "Each axis title says the unit."
			},
			{
				"name": "formatX · formatY",
				"type": "(n) => string",
				"description": "Value formatting in ticks and details."
			}
		]
	}
];
