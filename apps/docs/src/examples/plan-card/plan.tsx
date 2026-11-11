import { PlanCard, toast } from "@twoux/ui";

export const meta = { title: "A plan with a risky step", description: "Steps can be removed. The step that emails applicants is marked, so Approve and Cancel carry equal weight. Nothing runs until you approve.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-xl">
			<PlanCard
				title="Close three expired listings and tell applicants"
				from="Weekly listing check, 3 listings past their closing date"
				steps={[
					{ id: "1", title: "Find listings past their closing date", detail: "Filter: Closes is before today · 3 listings" },
					{ id: "2", title: "Close the 3 listings", detail: "Hides them from the careers page", risk: "irreversible" },
					{ id: "3", title: "Email 14 applicants that the role has closed", detail: "Uses the template Role closed", risk: "external" },
					{ id: "4", title: "Post a summary to #hiring" },
				]}
				onApprove={(kept) => toast.success(`Approved ${kept.length} steps`)}
				onCancel={() => toast("Plan cancelled. Nothing ran.")}
			/>
		</div>
	);
}
