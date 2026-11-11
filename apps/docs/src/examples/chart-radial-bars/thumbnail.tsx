import { RadialBars } from "@twoux/ui";

/* The real RadialBars with three rings, each a share of its own limit, and the values in words. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<RadialBars size={96} aria-label="Example" items={[
				{ id: "seats", label: "Seats", value: 38, limit: 50 },
				{ id: "credits", label: "Credits", value: 13, limit: 20 },
				{ id: "storage", label: "Storage", value: 38, limit: 100 },
			]} />
		</div>
	);
}
