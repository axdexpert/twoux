# Change review

The review queue for changes an agent proposes to records, procedures, prompts, tools or another agent: the reason, the diff, and test results, approved or rejected by a person.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- When an agent proposes to change how something works: a procedure, a prompt, a tool, a rule, or another agent's instructions.
- When a change can be tested against a set of known cases (a regression set) before it goes live.
- When many agent changes arrive together and a person has to work through them in order.

## When not to use

- Changes to a few records a person asked for. Use Suggested changes (suggested-changes).
- Plans for work that has not started. Use the Plan preview (plan-card).
- Actions set to Allow in Agent permissions (agent-permissions). Those run and appear in the Activity log with Undo.

## Structure

1. Header (title, status badge, origin label, reason in plain words)
2. Diff view (files changed, +/− counts, unified diff)
3. Simulation results ("228 of 240 pass", failures first, newly failing called out)
4. Footer (note, Reject, Approve change) or the Reject reason field
5. Resolved line (who decided and when)

## Guidelines

- Nothing goes live until a person approves. Say so in the footer.
- State the reason in plain words and what the proposal is based on (the origin label), for example "14 conversations this week".
- Show the diff and the simulation results in the same card, so the person can decide without opening anything else.
- Run the change against a regression set. Failures come first, and a case that passed before and fails now is called out in words ("Newly failing"), with a count in the footer.
- Rejecting needs a reason the agent can learn from. If the box is empty, say why it is needed, next to the field.
- Every decision leaves a resolved line with who decided and when. Changes are logged and attributable to the agent that proposed them and the person who approved.
- A change one agent proposes to another agent's procedures is reviewed in the same way, with the proposing agent named as the origin.
- Group many changes by batch, each batch with a stated rationale. Stage risky ones with a traffic split or a gradual ramp, not all at once.

## Content

- Title the change by what it does: "Reply in the applicant's language", not "Update prompt v14".
- Write the reason as cause and effect: "Applicants wrote in Welsh in 6 of 14 conversations and the assistant replied in English."
- Name failures in words: "2 conversations that passed before now fail." Do not rely on a coloured count.
- Resolved line: "Approved by Imogen Hart · 10:42" or "Rejected by Imogen Hart · 10:42", with the reason kept in the log.

## Accessibility

- Each card is an article labelled with the change title, so people can move through a queue of changes by heading (SC 1.3.1).
- Added and removed lines carry a + or − marker and a hidden word ("Added", "Removed"), not colour alone (SC 1.4.1).
- File rows are disclosure buttons with aria-expanded (SC 4.1.2).
- The Reject reason field has a visible label, and a missing reason is an error shown beside it as text (SC 3.3.1, 3.3.2).
- Approving puts a change live, so the review step, the simulation results and the logged decision satisfy error prevention (SC 3.3.4). The resolved line is a role="status" message (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through file rows, then Reject and Approve change |
| Enter / Space | Open or close a file's diff, or press the focused button |
| Enter (in Reject) | New line in the reason field; Tab to Reject change to send it |

## Examples

### agent-to-agent

```tsx
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
```

### review

```tsx
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
```

## Related

- Suggested changes
- Agent permissions
- Agent run timeline
- Confidence note
- Plan preview
- Prompt editor with fields
