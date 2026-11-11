import { Badge, Button } from "@twoux/ui";

/* ChangeRequest, built from its own markup (the real card also holds the origin, reason, file list and test results):
   title and status, the changed lines, and Reject and Approve change. */
export default function Thumbnail() {
	return (
		<article className="grid w-64 gap-1.5 rounded-sm border border-line bg-surface p-2" aria-hidden="true">
			<div className="flex items-center gap-2">
				<h3 className="min-w-0 flex-1 truncate text-base font-semibold text-ink">Reply in their language</h3>
				<Badge variant="warning" dot>Waiting</Badge>
			</div>
			<div className="overflow-hidden rounded-sm border border-line bg-surface-2 font-mono text-sm">
				<div className="flex bg-bad-bg px-2 leading-4.5"><span className="w-3 shrink-0 text-bad">−</span><span className="truncate text-ink-2">Always reply in English.</span></div>
				<div className="flex bg-ok-bg px-2 leading-4.5"><span className="w-3 shrink-0 text-ok">+</span><span className="truncate text-ink">Reply in their language.</span></div>
			</div>
			<footer className="flex items-center justify-end gap-2">
				<Button variant="outline" size="xs" tabIndex={-1}>Reject</Button>
				<Button size="xs" tabIndex={-1}>Approve change</Button>
			</footer>
		</article>
	);
}
