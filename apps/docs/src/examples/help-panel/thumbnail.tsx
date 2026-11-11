import { Button } from "@twoux/ui";
import { X } from "lucide-react";

/* HelpPanel drawn in place (the real one is a SidePanel in the page's right-hand slot): the header bar with the topic
   title and Close, then the start of the topic. Learn more links and the feedback prompt are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="flex w-64 flex-col overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<div className="flex h-11 shrink-0 items-center gap-1 border-b border-line pr-2 pl-4">
				<span className="min-w-0 flex-1 truncate text-md font-semibold text-ink">Salary range</span>
				<Button variant="ghost" size="icon-sm" tabIndex={-1}><X /></Button>
			</div>
			<p className="px-4 pt-4 pb-4 text-base text-ink-2">Listings with a salary range get more applicants.</p>
		</div>
	);
}
