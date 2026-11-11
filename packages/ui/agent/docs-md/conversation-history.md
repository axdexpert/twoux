# Previous conversations

A searchable list opened from the clock in the panel bar: scheduled tasks first, then recent conversations, with a dot for a new answer and "Needs you" for one waiting.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Returning to an earlier answer or a run waiting for you.
- Finding conversations by their title, named from the first question.

## When not to use

- Handling everything that needs you across the product. Use the Inbox (inbox).
- Auditing agent actions. Use the Agent run timeline (agent-run) log.

## Structure

1. Search field
2. Scheduled tasks
3. Recent conversations (title, status dot or Needs you badge, date)

## Guidelines

- Name conversations from the first question so they are findable.
- Mark a new answer with a dot and a waiting run with "Needs you".
- Selecting a past conversation lets people continue it or start from it.
- Offer deletion and keep history private by default.
- Title each conversation from its first question or a short summary, never "New conversation".
- Group by Today, Yesterday, Previous 7 days, then month; show local time with the full date and time on hover.
- Delete has Undo. Conversations are never removed automatically without notice; the retention period is stated at the top of the list.
- History is the person's record of conversations; what the assistant keeps between conversations lives in Team instructions, where it can be seen and edited.

## Content

- Dates are short and relative where recent ("Yesterday", "Mon", "2 Nov").

## Accessibility

- The search field filters the list; announce the result count (SC 4.1.3).
- The new-answer dot has a text equivalent ("New answer") (SC 1.4.1, 1.3.1).
- Esc closes the history and returns focus to the clock button (SC 2.4.3).

## Keyboard

| Keys | Action |
|---|---|
| Esc | Close the list |
| Tab / Shift+Tab | Move through conversations |
| Enter | Open a conversation |

## Examples

### history

```tsx
import { ConversationHistory, toast } from "@twoux/ui";

export const meta = { title: "Find past conversations", description: "Named from the first question, scheduled tasks first, a dot for a new answer and Needs you for a waiting run.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-md rounded-sm border border-line bg-surface p-3">
			<ConversationHistory
				scheduled={[{ id: "s1", title: "Weekly listing check", date: "Mon", status: "needs-you" }]}
				recent={[{ id: "r1", title: "Why are these closing with few applicants?", date: "Today", status: "new" }, { id: "r2", title: "Compare Design applicants with last quarter", date: "Tue" }, { id: "r3", title: "Draft a shorter description for LST-1044", date: "3 Nov" }]}
				onOpen={(id) => toast(`Opened ${id}`)}
			/>
		</div>
	);
}
```

## Related

- Assistant side panel
- Inbox (triage)
- Agent run timeline
