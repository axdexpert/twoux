export const install = "";
export const api = [
	{ component: "PaneLayout", props: [
		{ name: "value · onValueChange", type: "{ id, size, panes: { id, size }[] }[] · (next) => void", description: "Columns left to right, each with its panes top to bottom. Sizes are shares of the width (columns) or of the column's height (panes). Save it per person." },
		{ name: "panes", type: "Record<id, { title, header?, actions?, menu?, children }>", description: "What each pane shows. title names the pane; header replaces it visually, such as a segmented control; actions holds one control at most; menu adds DropdownMenuItems at the top of the pane's ⋯ menu, such as Show as table." },
		{ name: "value[].panes[].collapsed", type: "boolean", description: "Collapse and Expand in the pane's menu. A collapsed pane keeps its header; a column whose panes are all collapsed becomes a 36px strip with the pane's name, which expands on click." },
		{ name: "onReset", type: "() => void", description: "Adds Reset layout to every pane's menu. Apply at once and offer Undo in a toast." },
		{ name: "stackBelow", type: "number", default: "900", description: "Container width in pixels below which panes stack in one column and the page scrolls." },
		{ name: "aria-label", type: "string", description: "Names the workspace region, such as Trading workspace." },
	] },
	{ component: "usePaneSize", props: [
		{ name: "()", type: "{ width, height, stacked }", description: "The content box of the pane it is called in, so a chart or list can size itself to the room it has. stacked is true below stackBelow." },
	] },
];
