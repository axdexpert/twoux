export const install = "";
export const api = [
	{
		"component": "SidePanel",
		"props": [
			{
				"name": "open · onOpenChange · label",
				"type": "boolean · string",
				"description": "label names the panel for screen readers. Esc closes and focus returns to the row."
			},
			{
				"name": "mode",
				"type": "\"push\" | \"overlay\"",
				"description": "Push by default on list pages; overlay on narrow pages or wide content. Let people switch with ⇧P."
			},
			{
				"name": "title · meta · position · onPrevious · onNext · onOpenFull · footer",
				"type": "…",
				"description": "Control bar with 3 of 9 and J/K; title and status; pinned footer with the record's main action."
			},
			{
				"name": "resizable · width · onWidthChange",
				"type": "boolean · number · (px) => void",
				"default": "true · 440",
				"description": "Push mode: 440px by default, from 360px to half the canvas. Drag the left edge, use its arrow keys (Shift for 64px), Home or End, or double-click to reset; the Panel width menu gives Narrow, Default and Wide in one click. Save the width per person with onWidthChange."
			}
		]
	}
];
