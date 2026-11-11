import { ChartFrame, shareTable, Treemap } from "@twoux/ui";

export const meta = { title: "Cloud spend by service", description: "Fifteen services in three groups: the twelfth tile onwards fold into Other. Names show only on tiles big enough to hold them.", order: 1 };

const ITEMS = [
	{ id: "vm", label: "Virtual machines", value: 48_200, group: "Compute" },
	{ id: "k8s", label: "Kubernetes", value: 31_400, group: "Compute" },
	{ id: "fn", label: "Functions", value: 6_900, group: "Compute" },
	{ id: "gpu", label: "GPU instances", value: 22_800, group: "Compute" },
	{ id: "obj", label: "Object storage", value: 18_600, group: "Storage" },
	{ id: "block", label: "Block storage", value: 12_100, group: "Storage" },
	{ id: "backup", label: "Backups", value: 5_400, group: "Storage" },
	{ id: "pg", label: "Postgres", value: 19_700, group: "Data" },
	{ id: "wh", label: "Warehouse", value: 15_300, group: "Data" },
	{ id: "cache", label: "Cache", value: 4_200, group: "Data" },
	{ id: "stream", label: "Streaming", value: 3_900, group: "Data" },
	{ id: "search", label: "Search", value: 2_800, group: "Data" },
	{ id: "dns", label: "DNS", value: 600, group: "Compute" },
	{ id: "logs", label: "Log archive", value: 1_100, group: "Storage" },
	{ id: "etl", label: "ETL jobs", value: 900, group: "Data" },
];
const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Cloud spend by service" description="October 2026, all projects" table={shareTable(ITEMS, gbp, "Service")} height={260}>
			<Treemap items={ITEMS} format={gbp} aria-label="Cloud spend by service, October 2026" />
		</ChartFrame>
	);
}
