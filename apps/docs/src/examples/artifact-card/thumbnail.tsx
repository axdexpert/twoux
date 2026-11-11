import { ArtifactCard } from "@twoux/ui";

/* The real ArtifactCard: type and size, and the origin label. The actions and preview are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="w-64" aria-hidden="true">
			<ArtifactCard title="Job description" meta="Document · 312 words" from="LST-1044" />
		</div>
	);
}
