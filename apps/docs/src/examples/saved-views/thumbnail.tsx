import { SavedViews } from "@twoux/ui";

/* The real SavedViews: views as tabs with live counts, and Save view. */
export default function Thumbnail() {
	return (
		<div className="w-64" aria-hidden="true">
			<SavedViews
				views={[{ id: "all", name: "All", count: 24 }, { id: "open", name: "Open", count: 14 }]}
				value="open"
				onValueChange={() => {}}
				onSaveAs={() => {}}
			/>
		</div>
	);
}
