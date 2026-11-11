export const install = "";
export const api = [
	{
		"component": "ChangeRequest",
		"props": [
			{
				"name": "title · reason · from",
				"type": "string",
				"description": "What the change does, why in one or two sentences, and what it is based on."
			},
			{
				"name": "files · simulation",
				"type": "DiffFile[] · { suite, cases }",
				"description": "The diff and the regression results, shown in the same card."
			},
			{
				"name": "state · decidedBy",
				"type": "\"open\" | \"approved\" | \"rejected\" · string",
				"default": "\"open\"",
				"description": "After a decision the card keeps a resolved line with who and when."
			},
			{
				"name": "onApprove · onReject(reason)",
				"type": "…",
				"description": "Reject asks for a reason first and will not send an empty one."
			}
		]
	},
	{
		"component": "DiffView",
		"props": [
			{
				"name": "files",
				"type": "{ path, lines: { type: \"add\" | \"del\" | \"ctx\", text }[], note? }[]",
				"description": "+ and − markers and hidden words carry the change, never colour alone."
			},
			{
				"name": "defaultOpen",
				"type": "string",
				"description": "Path of the file to show open. The first file by default."
			}
		]
	},
	{
		"component": "SimulationResults",
		"props": [
			{
				"name": "cases · suite",
				"type": "{ name, status: \"pass\" | \"fail\" | \"new-fail\" | \"fixed\", detail? }[] · string",
				"description": "Failures first. A case that passed before and fails now is Newly failing."
			}
		]
	}
];
