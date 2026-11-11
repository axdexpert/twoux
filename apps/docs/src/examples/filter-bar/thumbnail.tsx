import { Button, FilterBar, FilterMenu, FilterPill, FilterSummary } from "@twoux/ui";
import { ListFilter, Plus } from "lucide-react";

/* The filter UX with real components. Compact in the gallery: FilterRow's parts as they wrap on a narrow screen, the
   applied chip and + first, then the count with Clear. With `anatomy`, the toolbar's filter button shows too and every part carries data-anatomy="n", its
   number in the anatomy list, so the component page can place matching numbers. */
const STATUS = [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }];
const MORE = [{ id: "team", label: "Team", options: [{ value: "design", label: "Design" }], selected: [] }];
const noop = () => {};

export default function Thumbnail({ anatomy = false }: { anatomy?: boolean }) {
	if (!anatomy) {
		return (
			<div className="grid justify-items-start gap-2">
				<FilterBar>
					<FilterPill field="Status" options={STATUS} selected={["open"]} onChange={noop} onRemove={noop} />
					<FilterMenu variant="add" fields={MORE} onChange={noop} />
				</FilterBar>
				<FilterSummary shown={9} total={24} noun="listings" onClear={noop} />
			</div>
		);
	}
	return (
		<div className="w-104 overflow-hidden rounded-sm border border-line bg-surface text-sm" aria-hidden="true">
			<div className="flex h-11 items-center gap-2 border-b border-line px-3">
				<span className="text-base font-medium text-ink">Listings</span>
				<span className="flex-1" />
				<span data-anatomy="1"><Button variant="outline" size="icon-sm" tabIndex={-1}><ListFilter /></Button></span>
			</div>
			<div data-anatomy="2" data-anatomy-pos="end" className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-surface-2 px-3 py-2">
				<span className="flex min-w-0 flex-1 items-center gap-1.5">
					<span data-anatomy="3"><FilterPill field="Status" options={STATUS} selected={["open"]} onChange={noop} onRemove={noop} /></span>
					<span data-anatomy="4"><Button variant="ghost" size="icon-sm" tabIndex={-1}><Plus /></Button></span>
				</span>
				<span className="ml-1 inline-flex items-center gap-1.5 text-sm text-ink-2">
					<span data-anatomy="5" className="tabular">9 of 24 listings</span>
					<span data-anatomy="6"><Button variant="ghost" size="xs" tabIndex={-1}>Clear</Button></span>
				</span>
			</div>
		</div>
	);
}
