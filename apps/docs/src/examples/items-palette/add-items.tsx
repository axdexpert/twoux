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
