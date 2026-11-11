export const install = "";
export const api = [
	{
		component: "RunStatusBar",
		props: [
			{ name: "running · done · total", type: "boolean · number · number", description: "Running shows progress and Stop; stopped with rows left shows Run remaining; finished shows Table up to date." },
			{ name: "errors", type: "number", description: "Failed cells, shown in words with an icon. onShowErrors makes it a link." },
			{ name: "creditsUsed · costPerRow", type: "number · number", description: "Credits spent so far; cost per row of every computed column together, used for Run remaining and Auto-run." },
			{ name: "label", type: "string", description: "What is running: \"Summarise role and Work email\"." },
			{ name: "onStop · onRunRemaining", type: "() => void", description: "Stop is always shown while running and never asks first." },
			{ name: "autoRun · onAutoRunChange", type: "boolean · (on) => void", description: "Runs computed columns on new rows. The cost per row is stated next to the switch." },
			{ name: "history", type: "{ id, label, rows, credits, outcome, errors?, when }[]", description: "Opens from History. Pass a Timestamp as when." },
		],
	},
];
