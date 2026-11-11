import { PaneLayout, type PaneLayoutValue, toast, usePaneSize } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Resize and rearrange panes", description: "Three panes in two columns. Drag a splitter or use its arrow keys to resize; drag a pane's grip, or press Space on it and use the arrow keys, to move it; or use Move, Wider and Taller in the pane's menu. Each pane reports its own size.", order: 1 };

const DEFAULT: PaneLayoutValue = [
	{ id: "left", size: 2, panes: [{ id: "list", size: 1 }] },
	{ id: "right", size: 3, panes: [{ id: "detail", size: 2 }, { id: "log", size: 1 }] },
];

function Size() {
	const { width, height } = usePaneSize();
	return <p className="p-3 text-sm text-ink-2 tabular">{width} × {height} px</p>;
}

export default function Example() {
	const [layout, setLayout] = useState(DEFAULT);
	return (
		<div className="h-96 w-full overflow-hidden rounded-sm border border-line">
			<PaneLayout
				aria-label="Example workspace"
				stackBelow={480}
				value={layout}
				onValueChange={setLayout}
				onReset={() => { const before = layout; setLayout(DEFAULT); toast.success("Layout reset", { action: { label: "Undo", onClick: () => setLayout(before) } }); }}
				panes={{
					list: { title: "Requests", children: <Size /> },
					detail: { title: "Request detail", children: <Size /> },
					log: { title: "Activity", children: <Size /> },
				}}
			/>
		</div>
	);
}
