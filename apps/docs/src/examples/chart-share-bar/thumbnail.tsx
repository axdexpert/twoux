import { ShareBar } from "@twoux/ui";

/* The real ShareBar: the legend with each share above one thin bar. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<ShareBar
				aria-label="Example"
				parts={[
					{ id: "business", label: "Business", value: 46 },
					{ id: "team", label: "Team", value: 22 },
					{ id: "enterprise", label: "Enterprise", value: 18 },
					{ id: "starter", label: "Starter", value: 8 },
					{ id: "other", label: "Agency", value: 6 },
				]}
			/>
		</div>
	);
}
