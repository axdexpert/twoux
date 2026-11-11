# Saved tasks and schedules

Turn repeated requests into a task sentence with editable slots, test it once, then save it and optionally run it on a schedule.

Kind: pattern · Group: Patterns: AI

**Problem:** Teams retype the same long prompt every Monday, with slightly different wording each time and different results. Scheduled automation that has never been tested surprises people.

**Solution:** The task builder writes the task as a sentence with slots ("Find [Live listings] with [apply rate under 3%]..."). Slots reuse filter values. An empty slot blocks Run and says which one. Test runs once in the assistant; Save as task adds an optional schedule.

**Built from:** Task builder, Templates gallery, Prompt editor with fields, Agent run timeline, Agent permissions, Previous conversations

## How it works

1. Start from a template, a past answer ("Save as task") or a blank builder.
2. The task is a sentence with slots; slots reuse filter values and record pickers.
3. An empty slot is dashed and blocks Run, with a message naming it: "Choose who gets the titles before you run this."
4. Run once (⌘↵) to test. The result arrives as a normal answer with proposals.
5. Save as task, then optionally add a schedule ("Every Monday") and check the permissions the task will use.
6. Scheduled runs appear first in previous conversations, notify before changing anything, and wait in the Inbox when they need approval.

## When to use

- For tasks repeated with the same structure and different values: weekly reviews, renaming, chasing hiring managers.

## When not to use

- For one-off questions; just ask.

## Guidelines

- Slots are the parts that change; the rest of the sentence is fixed so results are consistent.
- Keep slots few; too many raise effort and reduce quality.
- A task must run successfully once before it can be scheduled.
- Scheduled tasks use the same agent permissions, shown explicitly when the schedule is set; changes default to Ask first.
- Picking a template opens it as a draft task, never runs it.

## Content

- Tasks read as one sentence starting with a verb: "Find ..., then suggest ... and send them to ...".

## Accessibility

- Each slot is a button with its field name and current value, and opens a popover with one field.
- Empty required slots are announced with the error message, not only shown dashed.

## Do

- Do reuse filter values in slots.
- Do test before scheduling.

## Don't

- Don't save free prompts as scheduled tasks.
- Don't let a schedule change records without a notice or approval.

## Related

- Agents acting on your behalf
- Onboarding to an empty workspace
- Propose, then apply
- Task builder
- Templates gallery
