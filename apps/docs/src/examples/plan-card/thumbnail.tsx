import { Button } from "@twoux/ui";

/* PlanCard built with its classes: numbered steps people can remove, then Cancel and Approve plan. The header with
   its title and origin label, step details and the footer note are left out to fit. */
const STEPS = ["Find expired listings", "Close 3 listings"];

export default function Thumbnail() {
	return (
		<section className="grid w-64 rounded-sm border border-line bg-surface" aria-hidden="true">
			<ol className="grid">
				{STEPS.map((title, i) => (
					<li key={title} className="flex items-center gap-2.5 border-b border-line px-3 py-1 last:border-b-0">
						<span className="tabular w-4 shrink-0 text-sm text-ink-3">{i + 1}</span>
						<span className="min-w-0 flex-1 text-base text-ink">{title}</span>
						<Button variant="ghost" size="xs" tabIndex={-1}>Remove</Button>
					</li>
				))}
			</ol>
			<footer className="flex items-center justify-end gap-2 border-t border-line px-3 py-2">
				<Button variant="outline" size="sm" tabIndex={-1}>Cancel</Button>
				<Button size="sm" tabIndex={-1}>Approve plan</Button>
			</footer>
		</section>
	);
}
