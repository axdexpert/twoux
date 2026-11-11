export const install = "";
export const api = [
	{
		"component": "UsageMeter",
		"props": [
			{ "name": "used · limit · unit", "type": "number · number · string", "description": "Shown as \"13.2k of 20k\" under the unit name, and as role=\"meter\" with min, max and now values." },
			{ "name": "resets", "type": "string", "description": "For example \"1 Dec\"." },
			{ "name": "atLimit", "type": "string", "description": "What stops at the limit. Shown from 80% used, after the percentage." },
			{ "name": "onDetails", "type": "() => void", "description": "Shows What used them, which opens the breakdown." },
			{ "name": "onUpgrade", "type": "() => void", "description": "Shows Add more, only from 80% used. Never a permanent button." }
		]
	}
];
