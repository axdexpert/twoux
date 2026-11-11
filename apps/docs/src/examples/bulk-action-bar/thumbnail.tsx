import { BulkActionBar } from "@twoux/ui";

/* The real BulkActionBar above a table: one action, then the count and Clear selection. */
export default function Thumbnail() {
	return (
		<div className="w-72 overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<BulkActionBar count={2} onClear={() => {}} actions={[{ label: "Extend", onSelect: () => {} }]} />
			<div className="h-9 border-b border-line" />
			<div className="h-9 bg-primary-soft" />
		</div>
	);
}
