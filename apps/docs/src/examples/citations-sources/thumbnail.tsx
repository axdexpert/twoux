import { Citation, SourcesList } from "@twoux/ui";

/* The real Citation at the end of a claim, and the real SourcesList with the record it points to, shown selected. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-2">
			<p className="text-base text-ink">Frontend Engineer closes this week with 6 applicants <Citation id="LST-1041" active />.</p>
			<SourcesList active="LST-1041" sources={[{ id: "LST-1041", title: "Frontend Engineer", detail: "6 applicants · closes 21 Nov" }]} />
		</div>
	);
}
