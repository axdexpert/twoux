import { Check, Loader2 } from "lucide-react";

/* StepCard's header and step list, copied from the component (its working footer is left out to fit). Static: the
   pending step's spinner does not turn. */
export default function Thumbnail() {
	return (
		<section className="grid w-60 rounded-md border border-line bg-surface shadow-card" aria-hidden="true">
			<header className="flex items-center justify-between border-b border-line px-3 py-2"><h3 className="text-base font-semibold text-ink">Extending 2 listings</h3><span className="tabular text-sm text-ink-3">1 / 2</span></header>
			<ul className="grid gap-1.5 px-3 py-2.5">
				<li className="flex items-start gap-2 text-base"><Check className="mt-0.5 size-3.5 shrink-0 text-ok" /><span className="text-ink">Frontend Engineer</span></li>
				<li className="flex items-start gap-2 text-base"><Loader2 className="mt-0.5 size-3.5 shrink-0 text-ink-3" /><span className="text-ink">Data Analyst</span></li>
			</ul>
		</section>
	);
}
