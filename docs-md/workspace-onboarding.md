# Onboarding to an empty workspace

A new workspace shows a short setup checklist in the sidebar and empty states that each offer one way in: create, import or start from a template.

Kind: pattern · Group: Patterns: general

**Problem:** A new team lands on empty tables and a blank assistant. Product tours get skipped and forgotten, and each feature invents its own first-run screen.

**Solution:** "Get set up 3 / 5" sits in the sidebar until done or dismissed. Each empty page explains what goes there and offers the fastest way in. Templates open as drafts, never run on their own.

**Built from:** App shell and sidebar navigation, Empty state, Templates gallery, Connected tools, Assistant side panel, Button, Setup checklist, Onboarding step

## How it works

1. Show a setup checklist in the sidebar with a count ("Get set up 3 / 5") and the next step underneath.
2. Each step is an action people need anyway: connect your careers page, invite the team, create a first listing, set team instructions, try a saved task.
3. Steps complete themselves when the thing is done anywhere in the product.
4. Each empty page explains what will appear and offers one primary way in, with import or a template as the second.
5. Templates open as an editable draft that names the tools it uses. Nothing runs until the person chooses Run.
6. The checklist can be dismissed and reopened from Settings.

## When to use

- For a new workspace, and for a feature someone opens for the first time (a blank slate).

## When not to use

- Don't open a product tour or deck of cards on first login; show help when people reach the feature.
- For a list that is empty because of filters. Use the zero results state.

## Guidelines

- Keep the checklist to five steps or fewer, ordered by value to the team.
- Offer starter content (sample listings) only if it is clearly marked and easy to remove; keep a plain empty state for when it is gone.
- Show help in context and on request, not up front.
- The assistant's empty state offers two or three tasks based on what is on screen, not a blank "How can I help?".
- Say early what the assistant can and can't do with the workspace's data.
- Track checklist steps as tasks done or not done, not progress inside a task. A step left halfway still shows as not done.
- Recommend a setting when it helps, but never stop people choosing another one. Warn only when their choice blocks the goal of the step.
- Show steps that can't start yet and say what they need first, such as "Connect your careers page first". Don't hide them.
- Support both people who read first and people who try first: a short line and Learn more on each step, and an action that starts the task straight away.
- Once the checklist is dismissed it stays dismissed on every page until reopened from Settings.

## Content

- Blank slate titles invite the action: "Create your first listing". Body says why in one sentence.
- Checklist steps start with a verb and say the benefit: "Connect your careers page to import roles automatically".

## Accessibility

- The checklist progress is text ("3 of 5 done"), not only a ring.
- Completing a step is announced as a status message.
- Recommendation popovers attached to a step open one at a time, never on their own, and close with Esc.

## Do

- Do show progress through setup.
- Do give every empty page a way in.

## Don't

- Don't block the product behind a setup wizard.
- Don't run a template without the person choosing Run.

## Related

- Empty, loading and error states
- Saved tasks and schedules
- Ask about what's on screen
- Empty state
- Templates gallery
- Onboarding step
- Setup checklist
- Sign in
