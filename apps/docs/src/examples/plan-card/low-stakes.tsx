import { PlanCard, PlanChange, toast } from "@twoux/ui";

export const meta = { title: "A plan, then a change to it", description: "With no risky step, Approve is the one primary action. If the plan changes during the run, a PlanChange line says what and why.", order: 2 };

export default function Example() {
	return (
		<div className="grid w-full max-w-xl gap-3">
			<PlanCard
				title="Tidy the Operations Coordinator listing"
				from="Your request, listing LST-1041"
				steps={[
					{ id: "1", title: "Rename the listing", detail: "Operations Coordinator (hybrid)" },
					{ id: "2", title: "Add the salary range", detail: "£32,000 to £36,000" },
					{ id: "3", title: "Extend the closing date by 30 days", detail: "21 Nov to 21 Dec" },
				]}
				onApprove={(kept) => toast.success(`Approved ${kept.length} steps`)}
				onCancel={() => toast("Plan cancelled. Nothing ran.")}
			/>
			<PlanChange what="Skipped the salary step" why="The listing already shows a range." />
		</div>
	);
}
