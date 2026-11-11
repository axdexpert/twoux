import { Skeleton } from "@twoux/ui";

export const meta = { title: "Table rows", description: "Rows keep the real 36px height and column positions. Bars vary in width so they read as text; the figure sits on the right. The header stays live.", order: 1 };

const WIDTHS = ["w-40", "w-52", "w-36", "w-48", "w-44"];

export default function Example() {
	return (
		<div className="w-full max-w-xl overflow-hidden rounded-sm border border-line bg-surface" aria-busy="true" aria-label="Loading listings">
			<div className="grid h-9 grid-cols-[16px_1fr_96px_64px] items-center gap-3 border-b border-line bg-surface-2 px-3 text-sm font-medium text-ink-2">
				<span />
				<span>Listing</span>
				<span>Location</span>
				<span className="text-right">Applicants</span>
			</div>
			{WIDTHS.map((w, i) => (
				<div key={w + i} className="grid h-9 grid-cols-[16px_1fr_96px_64px] items-center gap-3 border-b border-line px-3 last:border-b-0">
					<Skeleton className="size-3.5" />
					<Skeleton className={`h-2.5 ${w}`} />
					<Skeleton className="h-2.5 w-16" />
					<Skeleton className="ml-auto h-2.5 w-6" />
				</div>
			))}
		</div>
	);
}
