export const install = "";
export const api = [
	{
		"component": "PlanCard",
		"props": [
			{
				"name": "title · from",
				"type": "string",
				"description": "Outcome as a title; what the plan is based on, for the origin label."
			},
			{
				"name": "steps",
				"type": "{ id, title, detail?, risk?: \"external\" | \"irreversible\" }[]",
				"description": "Steps people can remove and put back. A risk adds an icon and words."
			},
			{
				"name": "onApprove(steps) · onCancel",
				"type": "…",
				"description": "Approve gets the steps that are left. With any risky step, Approve and Cancel are both outline buttons."
			}
		]
	},
	{
		"component": "PlanChange",
		"props": [
			{
				"name": "what · why",
				"type": "string",
				"description": "What changed, then why. Announced as a status message; never reroute silently."
			}
		]
	}
];
