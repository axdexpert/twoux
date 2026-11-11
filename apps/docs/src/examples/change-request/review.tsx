import { ChangeRequest, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Review a change to a prompt", description: "The reason, the diff and the test results in one card. Two cases that passed before now fail, so the footer says so. Reject asks for a reason.", order: 1 };

export default function Example() {
	const [state, setState] = useState<"open" | "approved" | "rejected">("open");
	const [by, setBy] = useState<string>();
	return (
		<div className="w-full max-w-2xl">
			<ChangeRequest
				title="Reply in the applicant's language"
				from="14 conversations this week"
				reason="Applicants wrote in Welsh in 6 of 14 conversations and the assistant replied in English. This adds a line telling it to reply in the language the applicant used."
				files={[
					{
						path: "prompts/applicant-reply.md",
						lines: [
							{ type: "ctx", text: "You answer applicants for Harbour Recruitment." },
							{ type: "del", text: "Always reply in English." },
							{ type: "add", text: "Reply in the language the applicant wrote in." },
							{ type: "add", text: "If you are unsure of the language, reply in English." },
							{ type: "ctx", text: "Never promise an interview date." },
						],
					},
					{ path: "prompts/shortlist-summary.md", lines: [{ type: "add", text: "Summaries stay in English for the hiring team." }] },
				]}
				simulation={{
					suite: "Golden set, 240 conversations",
					cases: [
						{ name: "Applicant asks about the closing date, in Welsh", status: "fixed" },
						{ name: "Applicant asks about visa support, in Polish", status: "fixed" },
						{ name: "Applicant mixes English and Welsh", status: "new-fail", detail: "Replied in Welsh only. Passed before this change." },
						{ name: "Applicant writes only 'hi'", status: "new-fail", detail: "Replied in Welsh. Passed before this change." },
						{ name: "Applicant asks for a call back", status: "fail", detail: "Still promises a date." },
						{ name: "Applicant withdraws", status: "pass" },
						{ name: "Applicant asks about pay", status: "pass" },
					]}}
				state={state}
				decidedBy={by}
				onApprove={() => { setState("approved"); setBy("Approved by Imogen Hart · 10:42"); toast.success("Approved. The change is live."); }}
				onReject={(why) => { setState("rejected"); setBy("Rejected by Imogen Hart · 10:42"); toast("Rejected", { description: why }); }}
			/>
		</div>
	);
}
