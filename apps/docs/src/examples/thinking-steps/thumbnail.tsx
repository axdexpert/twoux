import { Check, ChevronRight } from "lucide-react";

/* ThinkingSteps once done and opened, copied from the component: the summary line, then the steps it took. */
export default function Thumbnail() {
	return (
		<div className="grid w-56 gap-1.5" aria-hidden="true">
			<span className="inline-flex w-fit items-center gap-1.5 rounded-xs text-sm text-ink-2">
				<Check className="size-3.5 text-ok" />Thought for 2.1s · 3 steps
				<ChevronRight className="size-3.5 rotate-90 text-ink-3" />
			</span>
			<ol className="ml-1.5 grid gap-1.5 border-l border-line pl-3.5">
				<li className="grid text-sm"><span className="font-medium text-ink">Reading 24 listings</span><span className="text-ink-2">Open and closing soon</span></li>
				<li className="grid text-sm"><span className="font-medium text-ink">Checking salary bands</span></li>
				<li className="grid text-sm"><span className="font-medium text-ink">Writing the answer</span></li>
			</ol>
		</div>
	);
}
