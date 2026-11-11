import { Badge, Button, GroupedList, ListGroup } from "@twoux/ui";

export const meta = { title: "Candidates by stage", description: "Each tinted header names the group and counts it. Every row keeps the same layout so columns line up. Headers collapse with Enter or Space.", order: 1 };

const STAGES = [
	{ stage: "Interview", people: [["Priya Shah", "Frontend Engineer", "28 Oct"], ["Sofia Romano", "Junior Product Designer", "20 Oct"]] },
	{ stage: "Screen", people: [["Amara Okafor", "Junior Product Designer", "2 Nov"]] },
	{ stage: "Applied", people: [["Tom Becker", "Frontend Engineer", "4 Nov"], ["Liam Walsh", "Data Analyst", "5 Nov"], ["Hana Kim", "QA Engineer", "5 Nov"]] },
];

export default function Example() {
	return (
		<GroupedList className="w-full max-w-xl" aria-label="Candidates by stage">
			{STAGES.map((g) => (
				<ListGroup key={g.stage} title={g.stage} count={g.people.length} defaultOpen={g.stage !== "Applied"} action={g.stage === "Applied" ? <Button variant="ghost" size="xs">Screen all</Button> : undefined}>
					{g.people.map(([name, role, date]) => (
						<li key={name} className="grid h-9 grid-cols-[1fr_auto_auto] items-center gap-3 px-3 text-base hover:bg-hover">
							<span className="min-w-0 truncate"><span className="font-medium text-ink">{name}</span> <span className="text-ink-3">· {role}</span></span>
							<Badge variant="secondary">{g.stage}</Badge>
							<span className="tabular w-14 text-right text-sm text-ink-3">{date}</span>
						</li>
					))}
				</ListGroup>
			))}
		</GroupedList>
	);
}
