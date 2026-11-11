export const install = "";
export const api = [
	{
		"component": "PersonAvatar",
		"props": [
			{
				"name": "name · src · size",
				"type": "string · \"sm\" | \"default\" | \"lg\"",
				"description": "Initials on the person's fixed colour; photo when there is one."
			}
		]
	},
	{
		"component": "AvatarStack",
		"props": [
			{
				"name": "people · max · label",
				"type": "…",
				"description": "Three, then +N naming the rest."
			}
		]
	}
];
