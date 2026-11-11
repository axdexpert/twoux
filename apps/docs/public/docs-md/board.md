# Board and board item

A dashboard grid of self-contained items, such as charts, stats and lists, that people can reorder, resize and remove to build the overview they need.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- For an overview page people tailor to their own job, such as a hiring lead choosing which pipeline charts to watch.
- When each item stands alone and can be read without the others.

## When not to use

- For a fixed report everyone reads the same way. Lay it out with a plain grid; rearranging adds work without benefit.
- For a list of records. Use the List table.

## Structure

1. Board: a grid of up to 4 columns that stacks on narrow screens
2. Board item: drag handle, title and optional description, settings menu
3. Item content (padded by default)
4. Item footer (optional), such as a link to the full report
5. Empty slot: what shows when no items are on the board

## Guidelines

- Each item does one job: one chart, one stat, one short list. Its title names what it shows.
- Put the most important item first: the first row is what people see before they scroll.
- Every drag has two alternatives: the keyboard (pick up with Enter or Space, move with arrows, drop with Enter, Esc to cancel) and the item menu (Move earlier, Move later, Wider, Narrower).
- Announce every pick-up, move, resize, drop and removal to screen readers.
- Show an empty state with a way to add the first item when the board has none.
- Save the layout per person, so a change on one screen doesn't move someone else's dashboard.
- Add items opens the items palette in the side panel. Removed items return to the palette, so Remove and Add undo each other.
- Offer Reset to default layout in the page's more menu, applied at once with Undo in a toast.
- Save the layout on the server as each change happens, per person and per column count (4, 2 and 1), and restore it on reload and on other devices.
- The board has 4 columns on wide screens, 2 on tablet widths and 1 on phones; items span 1 to 4 columns and keep their order when stacking.
- When the board has no items, its empty state offers Add items and Reset to default layout.
- While dragging, show a drop preview of the item's size. Items swap where there is room and push others along where there is not; dropping outside the board returns the item to where it was.
- Moving an item keeps its size and its own settings. Heights snap to fixed row steps; the default height fits the default content.
- Show every stage of a drag. Ready: the grip darkens on hover and focus, with a grab cursor and a tooltip saying how to move it. Dragging: a lifted copy follows the pointer, the board tints to show where drops are allowed, and a dashed slot shows exactly where the item will land.
- Other items glide to make room (180ms, off with reduced motion) instead of jumping. On drop, a short highlight settles on the moved item and the new position is announced. Esc cancels and puts it back.
- Work out the landing slot against where items were when the drag started, so the slot doesn't jump as items move aside.

## Content

- Item titles are nouns for what is shown: “Applications this month”, not “Chart 1”.
- The menu says what will happen to the item: “Move earlier”, “Wider”, “Remove from dashboard”.

## Accessibility

- The drag handle is a button named “Move <title>”, with a description of the keys.
- Dragging is never the only way to move or resize (2.5.7 Dragging Movements).
- Moves and resizes are announced in a live region (4.1.3 Status Messages).
- Each item is an article labelled by its title, so screen reader users can jump between items.
- Every board item region has an accessible name, and the board offers a keyboard way to jump between items.
- Use a grab cursor on handles and a grabbing cursor while dragging, in addition to the handle icon.

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space (handle) | Pick up the item, or drop it |
| Arrow keys | Move the picked-up item one place |
| Esc | Cancel and put the item back |
| Tab | Reach the handle, the item's controls and its settings menu |

## Examples

### hiring-overview

```tsx
import { Board, BoardItem, type BoardItemData, Button, DropdownMenuItem, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, toast } from "@twoux/ui";
import { LayoutDashboard } from "lucide-react";
import type React from "react";
import { useState } from "react";

export const meta = { title: "Hiring overview", description: "Drag an item by its handle, or focus the handle and press Enter, then the arrow keys. The ⋯ menu moves and resizes without dragging. Every change is announced.", order: 1 };

const DEFAULT: BoardItemData[] = [
	{ id: "apps", title: "Applications this month", columnSpan: 1 },
	{ id: "open", title: "Open listings", columnSpan: 1 },
	{ id: "tth", title: "Median time to hire", columnSpan: 2 },
	{ id: "stages", title: "Pipeline by stage", columnSpan: 2 },
	{ id: "closing", title: "Closing this week", columnSpan: 2 },
];

const STAGES = [["Applied", 412], ["Screen", 126], ["Interview", 48], ["Offer", 9]] as const;

// Colour says whether a change is good, not which way it went.
function Stat({ value, change, note, tone = "neutral" }: { value: string; change: string; note: string; tone?: "good" | "neutral" }) {
	return (
		<div className="grid gap-0.5">
			<span className="tabular text-2xl font-semibold text-ink">{value}</span>
			<span className="text-sm text-ink-2"><span className={tone === "good" ? "font-medium text-ok" : "font-medium text-ink"}>{change}</span> {note}</span>
		</div>
	);
}

function content(id: string) {
	if (id === "apps") return <Stat value="595" change="↑ 12%" note="vs October" tone="good" />;
	if (id === "open") return <Stat value="14" change="↓ 2" note="vs last week" />;
	if (id === "tth") return <Stat value="23 days" change="↓ 4 days" note="vs last quarter" tone="good" />;
	if (id === "stages")
		return (
			<ul className="grid gap-1.5">
				{STAGES.map(([s, n]) => (
					<li key={s} className="grid grid-cols-[72px_1fr_40px] items-center gap-2 text-sm">
						<span className="text-ink-2">{s}</span>
						<span className="h-2 overflow-hidden rounded-xs bg-hover" aria-hidden="true">
							<span className="block h-full w-(--w) rounded-xs bg-primary" style={{ "--w": `${(n / 412) * 100}%` } as React.CSSProperties} />
						</span>
						<span className="tabular text-right text-ink">{n}</span>
					</li>
				))}
			</ul>
		);
	return (
		<ul className="grid gap-1 text-sm">
			{[["Frontend Engineer", "Fri 21 Nov"], ["Customer Success Lead", "Sun 23 Nov"]].map(([r, d]) => (
				<li key={r} className="flex justify-between gap-2"><span className="truncate text-ink">{r}</span><span className="tabular shrink-0 text-ink-3">{d}</span></li>
			))}
		</ul>
	);
}

export default function Example() {
	const [items, setItems] = useState(DEFAULT);
	return (
		<Board
			className="w-full"
			aria-label="Hiring overview"
			items={items}
			onItemsChange={setItems}
			empty={
				<Empty className="min-h-48">
					<EmptyHeader>
						<EmptyMedia variant="icon"><LayoutDashboard /></EmptyMedia>
						<EmptyTitle>No items on this dashboard</EmptyTitle>
						<EmptyDescription>Add the charts and lists you want to watch.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent><Button variant="outline" size="sm" onClick={() => setItems(DEFAULT)}>Restore default items</Button></EmptyContent>
				</Empty>
			}
			renderItem={(it) => (
				<BoardItem
					id={it.id}
					header={it.title}
					footer={it.id === "stages" ? <a href="#pipeline" className="font-medium text-primary-ink hover:underline">Open pipeline report</a> : undefined}
					settings={<DropdownMenuItem onSelect={() => toast(`Opened ${it.title}`)}>View details</DropdownMenuItem>}
				>
					{content(it.id)}
				</BoardItem>
			)}
		/>
	);
}
```

## Related

- Line chart card
- Stat card with comparison
- Empty state
