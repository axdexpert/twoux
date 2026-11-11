import { cn } from "@twoux/ui";

/* ClarifyingQuestion's card, copied from the component's markup: the counter and question, then the options with
   number keys, the recommended one first and chosen. Other and the Previous, Skip and Next row are left out to fit. */
const OPTIONS = ["Last 90 days", "All of this year"];

export default function Thumbnail() {
	return (
		<section className="grid w-64 gap-2 rounded-md border border-line bg-surface p-3 shadow-card">
			<div className="flex items-baseline gap-2"><span className="tabular text-sm text-ink-3">1 / 2</span><h3 className="text-base font-medium text-ink">Which listings?</h3></div>
			<div className="grid gap-1">
				{OPTIONS.map((title, k) => (
					<span key={title} className={cn("flex items-start gap-2.5 rounded-sm border px-2.5 py-1.5 text-left", k === 0 ? "border-primary bg-primary-soft" : "border-line")}>
						<span className="tabular mt-px grid size-4.5 shrink-0 place-items-center rounded-xs border border-line-strong bg-surface text-xs text-ink-2">{k + 1}</span>
						<span className="truncate text-base text-ink">{title}{k === 0 && <span className="text-ink-3"> (Recommended)</span>}</span>
					</span>
				))}
			</div>
		</section>
	);
}
