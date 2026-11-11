# Pane layout

A workspace that fills the screen with columns of panes people resize with splitters and rearrange by dragging, for tool pages such as trading screens and editors where everything has to stay in view.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- Tool pages where people watch and act on several regions at once and need them all in view, such as a trading screen.
- Letting people give more room to the region they work in and put regions where they expect them.

## When not to use

- List, record and dashboard pages. Use the app shell with one side panel, or a Configurable dashboard for movable items.
- Content people read top to bottom. Let the page scroll instead.

## Structure

1. Columns of panes, edge to edge, divided by 1px splitters
2. Pane header: grip, title or a view switch, one action, ⋯ menu
3. Pane body that scrolls on its own
4. Splitter: 1px line with an 8px grab area, primary on hover and focus
5. Drop line in primary where a dragged pane will land
6. Collapsed: header only, or a 36px strip with the name when the whole column is collapsed

## Guidelines

- Fit the viewport: panes scroll inside, and charts and lists size themselves to their pane with usePaneSize.
- Every drag has a keyboard path and a menu path: Move up, down, left, right and Wider, Narrower, Taller, Shorter.
- Splitters follow the window splitter pattern: role separator, a value from 0 to 100, arrow keys, Home and End.
- Save the layout per person, and offer Reset layout with Undo, never a confirmation.
- One action at most in a pane header; switch views with a segmented control in place of the title.
- Below the stack width, panes stack in one column and the page scrolls.
- Let people collapse a pane they don't need right now; it keeps its header so it is one click from coming back.
- Put a pane's own options, such as Show as table, at the top of its ⋯ menu rather than as more header buttons.
- Put a strip of at most six key figures above the panes, the ones people check first, and keep the panes for detail.
- Keep secondary detail behind a request: an expandable row, a tooltip or the pane's ⋯ menu (Show as table, View all), so the panes show what people watch.
- Keep panes people use all the time, such as filters, as panes rather than drawers, so they never hide the controls they hold.

## Content

- Name every pane with a noun people use for that region: Markets, Order book, Place order.

## Accessibility

- 2.5.7 Dragging movements: moving and resizing work from the pane's menu with single clicks.
- Each pane is a section named by its title; each move and resize is announced.
- 1.4.10 Reflow: below the stack width the panes stack and nothing scrolls sideways.

## Keyboard

| Keys | Action |
|---|---|
| ← → (column splitter), ↑ ↓ (pane splitter) | Resize by 16px; with Shift, 64px |
| Home End | Smallest or largest size |
| Space or Enter on a grip | Pick up or drop the pane |
| ← → ↑ ↓ while picked up | Move the pane to another column or position |
| Esc while picked up | Put the pane back |

## Examples

### workspace

```tsx
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
```

## Related

- App shell and sidebar navigation
- Side panel (drawer)
- Board and board item
