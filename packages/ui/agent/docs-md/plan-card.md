# Plan preview

The plan an agent shows before a multi-step or costly run: numbered steps people can remove, risky steps marked in words, and nothing running until it is approved.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Before any run with several steps, or one that costs time or money, so people can see it first.
- When a step reaches people outside the workspace (an email, a message to a candidate) or cannot be undone (a close, a delete).
- When the agent was started by a schedule or a request people did not write step by step.

## When not to use

- A single, small change. Use Suggested changes (suggested-changes), which is the review step for one proposal.
- Questions whose answer would change the plan. Ask first with a Clarifying question (clarifying-question); show the plan once the answer is known.
- Work that has already started. Show progress in the Agent run (agent-run) and use PlanChange only if the plan itself changes.

## Structure

1. Header (plan title, origin label with what it is based on)
2. Step rows (number, step, optional detail, risk line, Remove or Put back)
3. Footer (count "3 of 4 steps", note "nothing runs until you approve", Cancel, Approve plan)
4. Plan change line (PlanChange) in the run if the plan changes later

## Guidelines

- Show the plan before any multi-step or costly run. Nothing runs until the person approves, and never on a timeout.
- Each step is a plain action with its detail underneath. People can remove a step, and put it back, before approving.
- Mark steps that reach people outside the workspace or cannot be undone, with an icon and words, not colour alone.
- The footer counts what will run ("3 of 4 steps") and updates as steps are removed. Approve is disabled when no steps are left.
- When any step is high-stakes, Approve and Cancel carry equal weight. This is the one exception to one primary action: both are outline buttons, so neither is nudged.
- If the plan changes mid-run, add a PlanChange line saying what changed and why. Never reroute silently.
- Ask clarifying questions first only if the answer changes the plan. Otherwise show the plan and let people adjust it.

## Content

- Title the plan by its outcome ("Close three expired listings and tell applicants"), not by the agent's method.
- Write steps as actions in the order they happen. Put the consequence in the detail line: "Sends an email to 14 applicants".
- Name the risk in words: "Reaches people outside the workspace" or "Can't be undone". Do not soften it.
- PlanChange reads as what changed, then why: "Plan changed: skipped the email step. The listing has no applicants."

## Accessibility

- The plan is an ordered list, so the number of steps and each position are announced (SC 1.3.1).
- Risk is shown by an icon and a line of text, not colour alone (SC 1.4.1).
- Remove and Put back are real buttons with the step number in their hidden label, and a removed step carries the hidden word "removed" (SC 4.1.2).
- Nothing starts on a timer, so there is no time limit to adjust (SC 2.2.1). Approving is the review step for work that records data (SC 3.3.4).
- PlanChange is a role="status" line, so a plan change is announced without moving focus (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through Remove buttons, then Cancel and Approve plan |
| Enter / Space | Remove or put back the focused step, or press the focused button |

## Examples

### low-stakes

```tsx
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
```

### plan

```tsx
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
```

## Related

- Agent run timeline
- Clarifying question card
- Agent permissions
- Suggested changes
- Step card
