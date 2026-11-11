import { AlertCircle, X } from "lucide-react";

/* Three addresses, one not valid, and the summary under the field. Drawn in place so the gallery card is static. */
export default function Thumbnail() {
	const tag = "inline-flex h-5.5 items-center gap-1 rounded-xs border px-1.5 text-sm text-ink";
	return (
		<div className="grid w-64 gap-1.5" aria-hidden="true">
			<span className="text-base font-medium text-ink">Email addresses</span>
			<div className="flex flex-wrap items-center gap-1 rounded-sm border border-input bg-background p-1 shadow-xs">
				<span className={`${tag} border-line-strong bg-surface`}>anna@acme.co.uk<X className="size-3 text-ink-3" /></span>
				<span className={`${tag} border-bad-line bg-bad-bg`}><AlertCircle className="size-3 text-bad" />chris@acme<X className="size-3 text-ink-3" /></span>
				<span className={`${tag} border-line-strong bg-surface`}>ben@acme.co.uk<X className="size-3 text-ink-3" /></span>
			</div>
			<span className="flex items-center gap-1.5 text-sm text-bad"><AlertCircle className="size-3.5" />1 address isn't valid. Fix or remove it.</span>
		</div>
	);
}
