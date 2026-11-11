import { FilterPanel } from "@twoux/ui";

/* The real FilterPanel: header with the active count and Clear all, then one open section with a set value. */
export default function Thumbnail() {
	return (
		<FilterPanel
			className="w-60 rounded-sm border border-line bg-surface"
			value={{ stage: ["applied"] }}
			onChange={() => {}}
			sections={[{ id: "stage", title: "Stage", defaultOpen: true, options: [{ value: "applied", label: "Applied", count: 2 }] }]}
		/>
	);
}
