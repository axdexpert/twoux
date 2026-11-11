import { Button, Checkbox } from "@twoux/ui";

/* SuggestedChanges' change row and footer, copied from the component: a ticked change with before and after, and
   Apply counting what it will change. The header and the footer note are left out to fit. */
export default function Thumbnail() {
	return (
		<section className="grid w-64 rounded-md border border-line bg-surface shadow-card" aria-hidden="true">
			<div className="flex items-start gap-2.5 px-3 py-2.5">
				<Checkbox checked tabIndex={-1} className="mt-0.5" />
				<span className="grid min-w-0 gap-0.5">
					<span className="text-base font-medium text-ink">Extend closing date</span>
					<span className="text-sm">
						<del className="mr-1.5 rounded-xs bg-bad-bg px-1 text-bad decoration-bad/60">21 Nov</del>
						<ins className="rounded-xs bg-ok-bg px-1 text-ok no-underline">21 Dec</ins>
					</span>
				</span>
			</div>
			<footer className="flex items-center justify-end gap-2 border-t border-line px-3 py-2">
				<Button variant="ghost" size="sm" tabIndex={-1}>Dismiss</Button>
				<Button size="sm" tabIndex={-1}>Apply 1 change</Button>
			</footer>
		</section>
	);
}
