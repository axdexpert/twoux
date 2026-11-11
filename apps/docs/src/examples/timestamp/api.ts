export const install = "";
export const api = [
	{
		"component": "Timestamp",
		"props": [
			{
				"name": "value",
				"type": "Date | string",
				"description": "Rendered in <time> with the ISO value."
			},
			{
				"name": "format · short",
				"type": "\"relative\" | \"absolute\" | \"date\" | \"time\" · boolean",
				"description": "time shows the time of day to the second (15:52:56) for live feeds such as trades, full date in the tooltip. Relative in lists (full date and zone in the tooltip); absolute for moments; date for a day with no time. A value such as 2026-12-07 is always a calendar day: 7 December 2026, or today, tomorrow and in 3 days when relative, with no time or zone. Short abbreviates (7 Dec 2026, 3d ago) in compact cells."
			},
			{
				"name": "by",
				"type": "ReactNode",
				"description": "Who did it, with “via Assistant” when applied from a proposal."
			}
		]
	}
];
