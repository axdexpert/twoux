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
