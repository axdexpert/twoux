import { Skeleton } from "@twoux/ui";

/* The table-rows example in small: the header stays live, rows keep their 36px height, bars vary in width. */
const WIDTHS = ["w-32", "w-40"];

export default function Thumbnail() {
	return (
		<div className="w-64 overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<div className="flex h-9 items-center gap-3 border-b border-line bg-surface-2 px-3 text-sm font-medium text-ink-2">
				<span className="w-4" />
				<span className="flex-1">Listing</span>
				<span>Applicants</span>
			</div>
			{WIDTHS.map((w) => (
				<div key={w} className="flex h-9 items-center gap-3 border-b border-line px-3 last:border-b-0">
					<Skeleton className="size-3.5" />
					<Skeleton className={`h-2.5 ${w}`} />
					<Skeleton className="ml-auto h-2.5 w-6" />
				</div>
			))}
		</div>
	);
}
