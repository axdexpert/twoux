import { Button, ColumnTypeIcon } from "@twoux/ui";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Lock } from "lucide-react";

/* ColumnsMenu's list, built the way the component builds each row: drag handle, column type icon, name, Move up and
   Move down, then Hide (or a lock on the column that is always shown). The search field, the count with Show all
   and Hide all, and the Columns trigger are left out to fit. */
const COLS = [
	{ label: "Name", type: "text", locked: true },
	{ label: "Company size", type: "number" },
	{ label: "Added", type: "date", hidden: true },
] as const;

export default function Thumbnail() {
	return (
		<ul className="grid w-64 rounded-md border border-line bg-popover p-1 shadow-pop">
			{COLS.map((c, i) => {
				const hidden = "hidden" in c && c.hidden;
				return (
					<li key={c.label} className="flex h-8 items-center gap-1.5 rounded-xs px-1">
						<span className="grid size-6 shrink-0 place-items-center text-ink-3"><GripVertical className="size-3.5" /></span>
						<ColumnTypeIcon type={c.type} />
						<span className={`min-w-0 flex-1 truncate text-base ${hidden ? "text-ink-3" : "text-ink"}`}>{c.label}</span>
						<Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label={`Move ${c.label} up`} disabled={i === 0}><ArrowUp /></Button>
						<Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label={`Move ${c.label} down`} disabled={i === COLS.length - 1}><ArrowDown /></Button>
						{"locked" in c ? (
							<span className="grid size-6 place-items-center text-ink-3"><Lock className="size-3.5" /></span>
						) : (
							<Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label={hidden ? `Show ${c.label}` : `Hide ${c.label}`}>{hidden ? <EyeOff /> : <Eye className="text-ink" />}</Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}
