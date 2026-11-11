import { Check } from "lucide-react";

/* WhyChoice beside the choice it explains, with its popover open, copied from the component: the Why? link, then
   the deciding factors. The popover title, the options that lost and Change this or Keep it are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-60 gap-1" aria-hidden="true">
			<span className="flex items-baseline gap-2 text-base text-ink">Thursday 14:00<span className="text-sm font-medium text-primary-ink underline">Why?</span></span>
			<div className="grid gap-2.5 rounded-md border border-line bg-popover p-3 text-base text-popover-foreground shadow-pop">
				<ul className="grid gap-1 text-ink-2">
					<li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-ok" />Everyone invited is free</li>
					<li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-ok" />Room 2 is booked</li>
				</ul>
			</div>
		</div>
	);
}
