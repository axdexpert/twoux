import { AiOrigin } from "@twoux/ui";

export const meta = { title: "Say what made it, from what", description: "One small mark and plain words, once per group of generated content. No separate AI colour, no gradients.", order: 1 };

export default function Example() {
	return (
		<div className="grid gap-3">
			<AiOrigin from="your workspace data" time="2 min ago" />
			<AiOrigin from="24 listings and the 2026 salary bands" />
			<div className="rounded-sm border border-line bg-surface p-3"><AiOrigin from="the job description" /><p className="mt-1.5 text-base text-ink">Junior designer with a portfolio of 2 or 3 product case studies; Figma required; hybrid in Leeds.</p></div>
		</div>
	);
}
