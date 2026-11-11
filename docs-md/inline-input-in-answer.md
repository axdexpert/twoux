# Asking for details inside the answer

When the assistant knows what to do but needs a few values to do it, it asks with a short form card in the thread, prefilled from context. Submitting the form produces a proposal, not a change.

Kind: pattern · Group: Patterns: AI

**Problem:** Some requests need specific values before anything can be prepared: "Draft a new listing like LST-1044 for Manchester" needs a salary band and a closing date. Asking in prose makes people type values in free text, which the assistant then has to parse and may get wrong.

**Solution:** Show an input card in the conversation with only the required fields, at most five, prefilled with what can be inferred and a line saying why the values are needed. Completed cards collapse to a read-only summary with Edit. The result is a Suggested changes card the person applies.

**Built from:** Card, Text input, Form validation, Suggested changes, Clarifying question card, Assistant side panel

## How it works

1. Ask only once the intent is clear. If it isn't, use the clarifying question card first.
2. Show one card per thing being set up, titled after it: "Closing date and salary for the Manchester listing".
3. Prefill from context: location from the request, salary band from the team file, closing date from the usual 30 days. Mark what was prefilled and from where.
4. Steps that depend on each other appear one at a time; independent ones appear together as separate cards that can be done in any order.
5. On Continue, the card collapses to a summary line with Edit, and the assistant prepares the proposal from the values.

## When to use

- When an action needs values with a known shape: dates, locations, salary bands, a choice of listing.
- When the person must check a value the assistant chose before it is used, shown as an editable field with an edit icon.
- When an agent run reaches a step that needs one value from the person, such as which listings to include.

## When not to use

- To find out what the person means. Use the clarifying question card with options.
- For long setup with many fields, such as creating a listing from scratch. Open the listing form instead.
- For decisions about candidates. The assistant does not collect inputs to decide on people.

## Guidelines

- Five fields at most, all required. If a field is optional, leave it out.
- Say why the values are needed in one line above the fields.
- Use the same inputs as the rest of TwoUX: date picker for dates, select for known lists. Validate on Continue like any form.
- Never ask for something the workspace already holds; prefill it instead.
- A card left unanswered doesn't block the thread: the composer stays usable and the card can be dismissed.

## Content

- Card titles name the thing, not the need: "Closing date for LST-1061", not "Information required".
- Prefill note: "From team file Salary bands 2026".
- Collapsed summary: "Manchester · £28,000 to £32,000 · closes 6 Dec" then Edit.

## Accessibility

- When the card appears, announce it and move focus to its heading, not to the first field or Continue.
- The card is not a dialog and doesn't trap focus; the thread and composer stay reachable.
- Each field has a visible label; prefilled values are announced with their source.

## Do

- Do prefill from context and say where values came from.
- Do collapse completed cards to a summary with Edit.
- Do turn the values into a proposal the person applies.

## Don't

- Don't ask for optional fields.
- Don't use a form to clarify intent.
- Don't show several dependent steps at once.

## Related

- Clarifying before acting
- Propose, then apply
- Ask about what's on screen
- Clarifying question card
