import { ItemsPalette } from "@twoux/ui";

/* The real ItemsPalette with one item: grip, title, description, type and Add. */
export default function Thumbnail() {
	return (
		<div className="w-64" aria-hidden="true">
			<ItemsPalette
				items={[{ id: "tth", title: "Median time to hire", description: "Days to an accepted offer", type: "Key metrics" }]}
				onAdd={() => {}}
			/>
		</div>
	);
}
