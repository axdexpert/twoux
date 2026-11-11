import { Badge, Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@twoux/ui";
import { SearchX, X } from "lucide-react";
import { useState } from "react";

export const meta = { title: "No results", description: "Filters are too narrow. The empty state replaces the table only; the filters and the count stay, so it is clear the filters caused it. One action: Clear filters.", order: 1 };

export default function Example() {
	const [filtered, setFiltered] = useState(true);
	return (
		<div className="grid w-full max-w-xl gap-2">
			<div className="flex items-center gap-2">
				<span className="text-base font-medium text-ink">Listings</span>
				{filtered && (
					<Badge variant="secondary" className="gap-1">
						Location: Inverness
						<Button variant="ghost" size="icon-xs" aria-label="Remove filter Location: Inverness" onClick={() => setFiltered(false)} className="-mr-1 size-4"><X className="size-3" /></Button>
					</Badge>
				)}
				<span className="ml-auto text-sm text-ink-3 tabular">{filtered ? "0 of 24" : "24 of 24"}</span>
			</div>
			{filtered ? (
				<Empty className="min-h-56">
					<EmptyHeader>
						<EmptyMedia variant="icon"><SearchX /></EmptyMedia>
						<EmptyTitle>No listings match these filters</EmptyTitle>
						<EmptyDescription>Try another location, or clear the filters to see all 24.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" size="sm" onClick={() => setFiltered(false)}>Clear filters</Button>
					</EmptyContent>
				</Empty>
			) : (
				<div className="grid min-h-56 place-items-center rounded-sm border border-line text-base text-ink-2">24 listings</div>
			)}
		</div>
	);
}
