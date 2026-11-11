# Items palette

A searchable list, in a side panel beside a configurable dashboard, of the items a person can add, each with a title, a short description, its type and an Add to dashboard button.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- With a configurable dashboard, to add items that are not on the board yet.
- As the place removed items return to, so people can add them back.
- When new item types ship, so people find them without a layout being changed for them.

## When not to use

- On a static dashboard. There is nothing to add.
- To pick records or templates. Use the command palette or the templates gallery.
- To change what an item on the board shows. Use Preferences in that item's menu.

## Structure

1. Panel header: "Add items", item count and close
2. Search field that filters by title and description
3. Palette item: drag handle, title, one-line description, type tag (Chart, List, Key metrics), Add to dashboard button
4. Zero results: message with Clear search
5. Empty palette: "All items are on your dashboard"

## Guidelines

- List only items that are not on the board. When one is added it leaves the palette; when it is removed it comes back.
- Palette items describe; they do not preview. No live numbers, charts or menus, only title, description and type.
- Every palette item has an Add to dashboard button as well as its drag handle. The button adds the item at the end of the board in its default size. Keyboard users add with the button, then place the item with the board's own keyboard move; there is no separate keyboard drag from the palette.
- While dragging, the palette item takes the shape of its default size on the board and shows a drop preview.
- Add search once there are more than about ten items, and show a zero results message with Clear search.
- The panel pushes the board, stays open while people add several items, and closes with Esc or Add items again.

## Content

- Descriptions say what the item answers: "Applications per week for the last 12 weeks, compared with the previous period."
- Type tags use one word or two: Chart, List, Key metrics, Links, Alerts.
- Zero results: "No items match \"cost\"." with Clear search.

## Accessibility

- The panel is a complementary region labelled "Add items"; focus moves to its search field when it opens and returns to Add items when it closes.
- Add to dashboard is named with the item: "Add Applications this week to dashboard".
- After an add, announce "Applications this week added to the end of the dashboard" and keep focus in the palette on the next item.
- Dragging from the palette is never required; the button covers the same result with a single action.

## Keyboard

| Keys | Action |
|---|---|
| Tab / Shift+Tab | Move between search, palette items and their Add buttons |
| Enter (Add button) | Add the item to the end of the board |
| Esc | Cancel a pick-up, or close the panel |
| Then, on the board | Use the new item's handle (Enter, arrows, Enter) or its menu to move it |

## Examples

### add-items

```tsx
import { Board, BoardItem, type BoardItemData, Button, ItemsPalette, type PaletteItem, SidePanel, StatCompare, toast } from "@twoux/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Add items to a dashboard", description: "The palette lists only what isn't on the board. Add puts an item at the end in its default size; drag drops it where you let go. Removing an item returns it to the palette.", order: 1 };

const CATALOGUE: PaletteItem[] = [
	{ id: "apps", title: "Applications this month", description: "Total applications and change against last month", type: "Key metrics" },
	{ id: "tth", title: "Median time to hire", description: "Days from opening a listing to an accepted offer", type: "Key metrics" },
	{ id: "accept", title: "Offer acceptance", description: "Share of offers accepted this quarter", type: "Key metrics" },
	{ id: "closing", title: "Closing this week", description: "Listings that close in the next 7 days", type: "List" },
];
const VALUES: Record<string, [string, string, string, boolean]> = { apps: ["595", "+12%", "October", true], tth: ["23 days", "-4 days", "last quarter", true], accept: ["71%", "-6 pts", "last quarter", false] };

export default function Example() {
	const [items, setItems] = useState<BoardItemData[]>([{ id: "apps", title: "Applications this month" }]);
	const [open, setOpen] = useState(true);
	const palette = CATALOGUE.filter((c) => !items.some((i) => i.id === c.id));
	const add = (id: string, at = items.length) => {
		const c = CATALOGUE.find((x) => x.id === id);
		if (!c) return;
		setItems((x) => { const n = [...x]; n.splice(at, 0, { id, title: c.title }); return n; });
		toast.success(`Added ${c.title}`);
	};
	return (
		<div className="flex h-104 w-full overflow-hidden rounded-sm border border-line bg-bg">
			<div className="min-w-0 flex-1 overflow-auto p-3">
				<div className="mb-2 flex justify-end"><Button variant="outline" size="sm" onClick={() => setOpen(true)}><Plus />Add items</Button></div>
				<Board
					items={items}
					onItemsChange={setItems}
					onAddFromPalette={add}
					empty={<p className="rounded-sm border border-dashed border-line-strong p-8 text-center text-base text-ink-2">Drag an item here, or use Add.</p>}
					renderItem={(it) => (
						<BoardItem id={it.id} header={it.title}>
							{VALUES[it.id] ? <StatCompare label="" value={VALUES[it.id][0]} change={VALUES[it.id][1]} period={VALUES[it.id][2]} good={VALUES[it.id][3]} /> : <p className="text-sm text-ink-2">Frontend Engineer · Fri 21 Nov</p>}
						</BoardItem>
					)}
				/>
			</div>
			<SidePanel open={open} onOpenChange={setOpen} label="Add items" title="Add items" meta={`${palette.length} available`}>
				<ItemsPalette items={palette} onAdd={(id) => add(id)} />
			</SidePanel>
		</div>
	);
}
```

## Related

- Board and board item
- Configurable dashboard
- Dashboard items
- Side panel (drawer)
