import { Treemap } from "@twoux/ui";

/* The real Treemap: tiles sized by value, coloured by group, names on the tiles big enough, and the group legend. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<Treemap
				aria-label="Example"
				height={84}
				items={[
					{ id: "vm", label: "Compute", value: 48, group: "Compute" },
					{ id: "k8s", label: "Kubernetes", value: 31, group: "Compute" },
					{ id: "pg", label: "Postgres", value: 20, group: "Data" },
					{ id: "obj", label: "Storage", value: 19, group: "Storage" },
					{ id: "wh", label: "Warehouse", value: 15, group: "Data" },
					{ id: "blk", label: "Block", value: 12, group: "Storage" },
				]}
			/>
		</div>
	);
}
