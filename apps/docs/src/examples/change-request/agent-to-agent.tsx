import { ChangeRequest, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "One agent changes another's procedure", description: "A reviewing agent proposes an edit to the Listing checker's steps. It is reviewed like any change, with the proposing agent named and a staged ramp.", order: 2 };

export default function Example() {
	const [state, setState] = useState<"open" | "approved" | "rejected">("open");
	return (
		<div className="w-full max-w-2xl">
			<ChangeRequest
				title="Listing checker: ask before closing a listing with applicants"
				from="9 listings closed with active applicants last month, found by the Quality reviewer agent"
				reason="The Listing checker closed 3 listings that still had active applicants. This adds a step to ask for approval first. It would start with 10% of runs, then ramp up over a week."
				files={[
					{
						path: "agents/listing-checker/steps.md",
						lines: [
							{ type: "ctx", text: "1. Find listings past their closing date." },
							{ type: "add", text: "2. If a listing has active applicants, ask for approval." },
							{ type: "del", text: "2. Close the listing." },
							{ type: "add", text: "3. Close the listing." },
						],
					},
				]}
				simulation={{
					suite: "Regression set, 60 listings",
					cases: [
						{ name: "Listing with 12 active applicants", status: "fixed" },
						{ name: "Listing with no applicants", status: "pass" },
						{ name: "Listing closed by a person yesterday", status: "pass" },
					],
				}}
				state={state}
				decidedBy={state === "approved" ? "Approved by Imogen Hart · 14:05 · ramping from 10%" : "Rejected by Imogen Hart · 14:05"}
				onApprove={() => { setState("approved"); toast.success("Approved. Starting with 10% of runs."); }}
				onReject={(why) => { setState("rejected"); toast("Rejected", { description: why }); }}
			/>
		</div>
	);
}
