import { BulletChart } from "@twoux/ui";

/* The real BulletChart with one measure: actual bar, target tick, grey bands and its legend. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<BulletChart aria-label="Example" format={(n) => `£${n}k`} rows={[{ id: "new", label: "New business", value: 412, target: 450, bands: [300, 400, 500] }]} />
		</div>
	);
}
