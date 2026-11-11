import { AiOrigin } from "@twoux/ui";

/* The real AiOrigin above the content it labels, as on the component page. */
export default function Thumbnail() {
	return (
		<div className="w-60 rounded-sm border border-line bg-surface p-3" aria-hidden="true">
			<AiOrigin from="the job description" />
			<p className="mt-1.5 text-base text-ink">Junior designer; Figma required; hybrid in Leeds.</p>
		</div>
	);
}
