import { Input, ProviderLogo } from "@twoux/ui";
import { PenLine, Search } from "lucide-react";

/* ActionCatalogue's list view, built from its own markup: search, then actions with icon, name and cost
   per row. Descriptions and the category tabs are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 content-start gap-2" aria-hidden="true">
			<div className="relative">
				<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" aria-hidden="true" />
				<Input tabIndex={-1} readOnly placeholder="Search actions" aria-label="Search actions" className="pl-8" />
			</div>
			<ul className="grid">
				<li className="flex w-full items-center gap-3 rounded-sm px-2 py-1 text-left">
					<ProviderLogo provider="hubspot" size="md" />
					<span className="min-w-0 flex-1 truncate text-base font-medium text-ink">Work email</span>
					<span className="tabular shrink-0 text-sm text-ink-3">≈ 0.5 credits / row</span>
				</li>
				<li className="flex w-full items-center gap-3 rounded-sm px-2 py-1 text-left">
					<span className="grid size-7 shrink-0 place-items-center rounded-xs border border-line bg-surface-2 text-ink-2 [&_svg]:size-3.5"><PenLine /></span>
					<span className="min-w-0 flex-1 truncate text-base font-medium text-ink">Summarise</span>
					<span className="tabular shrink-0 text-sm text-ink-3">≈ 1 credit / row</span>
				</li>
			</ul>
		</div>
	);
}
