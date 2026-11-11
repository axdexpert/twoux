import { Button } from "@twoux/ui";

/* TeamInstructions' instructions section, copied from the component: heading with Edit, the shared text, and who
   set it. The files section is left out to fit. */
export default function Thumbnail() {
	return (
		<section className="grid w-64 gap-2 rounded-sm border border-line bg-surface p-3" aria-hidden="true">
			<header className="flex items-center gap-2"><h3 className="flex-1 text-base font-semibold text-ink">Instructions</h3><Button variant="ghost" size="sm" tabIndex={-1}>Edit</Button></header>
			<p className="text-base text-ink">Always state the salary range.</p>
			<p className="text-sm text-ink-3">Set by Priya Shah · Applies to everyone</p>
		</section>
	);
}
