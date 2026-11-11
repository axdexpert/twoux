import { Badge } from "@twoux/ui";

export const meta = {
	title: "In a table",
	description: "One badge per row, in its own column, left aligned so the words line up.",
	order: 3,
};

const rows = [
	["Junior Product Designer", "success", "Live", "86"],
	["Graduate Data Analyst", "warning", "Expires in 3 days", "54"],
	["Marketing Assistant", "secondary", "Draft", "0"],
	["Customer Success Associate", "destructive", "Closed early", "19"],
] as const;

export default function Example() {
	return (
		<table className="w-full max-w-xl border-collapse overflow-hidden rounded-sm border border-line-strong bg-surface text-left">
			<thead>
				<tr className="h-8 bg-surface-2 text-sm text-ink-2">
					<th className="px-3 font-medium">Role</th>
					<th className="px-3 font-medium">Status</th>
					<th className="px-3 text-right font-medium">Applies</th>
				</tr>
			</thead>
			<tbody>
				{rows.map(([role, variant, label, applies]) => (
					<tr key={role} className="h-row border-t border-line">
						<td className="px-3 font-medium">{role}</td>
						<td className="px-3"><Badge variant={variant}>{label}</Badge></td>
						<td className="tabular px-3 text-right">{applies}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
