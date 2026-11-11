import { Check, ChevronDown, Search } from "lucide-react";

/* The open combobox drawn in place: trigger, search, two matches with the chosen one ticked, then Create. */
export default function Thumbnail() {
	return (
		<div className="grid w-60 gap-1" aria-hidden="true">
			<div className="flex h-8 items-center justify-between rounded-sm border border-ring bg-background px-2.5 text-base text-ink ring-3 ring-ring/50">
				Leeds <ChevronDown className="size-3.5 text-ink-3" />
			</div>
			<div className="overflow-hidden rounded-md border border-line bg-popover text-base shadow-pop">
				<div className="flex h-9 items-center gap-2 border-b border-line px-3 text-ink"><Search className="size-3.5 text-ink-3" />le</div>
				<div className="grid p-1">
					<span className="flex items-center gap-2 rounded-xs bg-accent px-2 py-1.5">Leeds<span className="flex-1 text-right text-sm text-ink-3">England</span><Check className="size-3.5 text-ink-2" /></span>
					<span className="flex items-center gap-2 px-2 py-1.5">Newcastle<span className="flex-1 text-right text-sm text-ink-3">England</span><span className="size-3.5" /></span>
					<span className="px-2 py-1.5 text-ink-2">Create "le"</span>
				</div>
			</div>
		</div>
	);
}
