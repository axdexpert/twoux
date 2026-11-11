# Propose, then apply

The assistant never edits on its own: it lists suggested changes with checkboxes, the person applies them in one step, each change shows its progress, and Undo reverses all of it.

Kind: pattern · Group: Patterns: AI

**Problem:** When AI edits records directly, people can't see what changed or trust it with real data. When every feature invents its own approval flow, nobody knows whether clicking a suggestion has already changed something.

**Solution:** Changes arrive as a Suggested changes card: one row per change with what changes, an Edit and a Dismiss. Apply N changes (⌘↵) turns the card into a step card that ticks off each change as the table updates. A toast offers Undo.

**Built from:** Suggested changes, Step card, Assistant side panel, Toast, Agent permissions, AI origin label

## How it works

1. The answer ends with "Suggested changes · 2", each a row with a checkbox, the change and its effect ("New closing date 6 Dec").
2. "Nothing changes until you apply" sits next to the buttons: Dismiss, Edit, Apply 2 changes ⌘↵.
3. The person unticks, edits or dismisses individual changes without regenerating the whole proposal.
4. Apply turns the card into a step card: each change gets a spinner then a tick, with a counter "1 / 2". The table updates row by row.
5. When done, a toast confirms ("2 changes applied") with Undo; ⌘Z also works.
6. If a change fails, its step says why and offers Retry; the others stay applied.

## When to use

- Whenever the assistant or an agent would change records: rename, extend, close, reassign.

## When not to use

- For answers that change nothing; just answer.
- For actions the person set to Allow in agent permissions; those run and are logged, with Undo where possible.
- For changes that reach people outside the workspace, such as emailing candidates. Those also need explicit approval of the message itself (see Agents acting on your behalf).

## Guidelines

- A proposal shows the consequence of each change before it runs, including whether it can be undone.
- Approve is never pre-selected or auto-focused for risky changes.
- If applying needs to deviate from the proposal, stop and explain rather than change something else.
- The proposal is the same component everywhere: assistant answers, agent runs and the Inbox.

## Content

- Each change is a verb and object with its effect: "Extend Operations Coordinator by 30 days. New closing date 6 Dec."
- Apply button says the count: "Apply 2 changes".

## Accessibility

- Step progress and completion are announced as status messages.
- Apply has a keyboard shortcut (⌘↵) and focus does not jump to it automatically.

## Do

- Do let people untick individual changes.
- Do offer Undo after applying.

## Don't

- Don't apply anything from inside the answer text.
- Don't regenerate the whole proposal to fix one change.

## Related

- Undo and destructive actions
- Agents acting on your behalf
- Showing reasoning and progress
- Suggested changes
- Step card
