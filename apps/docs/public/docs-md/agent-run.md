# Agent run timeline

The steps of an agent run with state in shape and colour, the filter each step used, a highlighted waiting step and Stop always visible.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Watching or reviewing an agent run, scheduled or started from a task.
- When a run is waiting for approval, to show what it needs.

## When not to use

- A single answer. Use Thinking and steps (thinking-steps).
- Applying a proposal you just approved. Use the Step card (step-card).
- Listing everything that needs you across runs. Use the Inbox (inbox).

## Structure

1. Header (task name, status badge, Stop)
2. Step rows (state icon, title, detail, action)
3. Footer (started by, when, schedule)

## Guidelines

- Every step has a state: done, running, waiting for you, skipped, failed.
- Steps that pick rows show the filter used and open it as a view.
- A waiting step is highlighted and holds its action (Review).
- Stop is always visible and in the same place.
- Skipped steps say why and link to the setting.
- Record who started it, when and on what schedule, and keep the log.
- In parallel steps, a failed step shows its own error and Retry on its row while the rest keep running; the run isn't shown as blocked.
- Failed and stopped steps are never counted as done; the counts add up to the steps shown.

## Content

- Step titles say what happened in past tense with counts ("Found 2 live listings under 3%").
- Badge text is a state, not a mood: "Needs you", "Done", "Failed".

## Accessibility

- States combine an icon shape, colour and text (SC 1.4.1, 1.4.11).
- Use a list with each step as a list item so the order is exposed (SC 1.3.1).
- Announce new steps and a change to "Needs you" as status messages (SC 4.1.3).
- Running runs are auto-updating content in parallel with the page; Stop meets SC 2.2.2.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through step actions |
| Enter | Open the step's view or Review |
| Enter on Stop | Stop the run |

## Examples

### run

```tsx
import { AgentRun, Button } from "@twoux/ui";

export const meta = { title: "One run, step by step", description: "Every step has a state in shape and words. A step that picked rows names its filter; the waiting step is highlighted and holds its action.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-xl">
			<AgentRun
				task="Weekly listing check"
				status="Needs you"
				meta="Started by Priya Shah · Monday 09:00 · Every Monday"
				steps={[
					{ title: "Found listings closing within 7 days", detail: "Filter: Closes is in the next 7 days · 3 listings", state: "done", action: <Button variant="ghost" size="xs">Open as view</Button> },
					{ title: "Compared applicants with similar listings", state: "done" },
					{ title: "Proposed extending 2 listings by 30 days", detail: "Waiting for your review", state: "waiting", action: <Button size="xs">Review</Button> },
					{ title: "Post a summary to #hiring", state: "skipped", detail: "Skipped until the review is done" },
				]}
			/>
		</div>
	);
}
```

## Related

- Agent permissions
- Task builder
- Step card
- Inbox (triage)
- Plan preview
- Change review
