# Disabled and read-only states

Show an action as unavailable only when the person can do something about it, say why in one sentence, and show values they can't change as read-only rather than greyed out.

Kind: pattern · Group: Patterns: general

**Problem:** A greyed-out button with no explanation leaves people guessing whether it is broken, waiting for something, or forbidden. Greyed-out fields are hard to read, and a disabled Save button hides which field is the problem.

**Solution:** Pick one of three treatments. Hide what this person can never use. Disable, with a one-sentence reason, what they could use once something changes. Make read-only what they need to see but not change. Submit buttons are never disabled.

**Built from:** Button, Dropdown menu, Tooltip, Bulk action bar, Text input, Radio, Banner (inline alert)

## How it works

1. Ask whether this person could ever use the control. If their role never can, such as a Viewer and Billing settings, hide it.
2. If they could once something changes (select rows, publish the listing, ask the owner), show it as unavailable and give the reason.
3. Put a short reason in a tooltip on the button, menu item, tab or option. Put a longer reason, or one with a next step, in text or a banner beside the control.
4. For values that are shown but not editable, such as a listing's ID or a field locked by the job board feed, use the read-only state: normal text colour, no input border, still selectable and copyable.
5. On a review step where nothing is editable, show plain text values instead of read-only inputs.

## When to use

- Disabled: Close listing in the bulk bar while one of the selected listings is still a draft.
- Disabled: Publish on a listing whose owner is someone else and the person is an Editor without publish rights.
- Read-only: the salary band on a listing approved by finance, shown in the edit form so people know what will be published.

## When not to use

- On a form's submit button. Keep it enabled and let pressing it show what is missing (see Inline editing and validation).
- For actions this person's role can never have. Hide them; a wall of disabled items is noise.
- To stop a reversible action that is merely risky. Let it run and offer Undo.

## Guidelines

- Use aria-disabled, not the HTML disabled attribute, on any control that carries a reason, so it stays focusable and keyboard users can reach the reason.
- A disabled control keeps its place and size; it does not jump or vanish when the state changes.
- Reasons are plain text only. No links or buttons inside a tooltip reason; if the next step needs a link, use a banner or helper text.
- Only give a reason when the label and context don't already make it obvious. An unavailable Delete with nothing selected needs none.
- Read-only fields are still part of the form's data and its tab order, so screen reader users hear the value.
- Unavailable is never shown by colour alone: the control also loses its hover state and announces as unavailable.

## Content

- Permission reason: "Only the listing owner can publish. Ask Priya Shah to publish it."
- Waiting on something: "Available when the listing is Live." or "Available when you select a listing."
- System limit: "Unavailable while the job board feed is syncing." Say what is happening, not "Error".
- One sentence for the reason, an optional second for the next step. No "please", no exclamation marks.

## Accessibility

- Unavailable controls use aria-disabled="true", stay in the tab order, and ignore activation; the tooltip reason is linked with aria-describedby.
- Disabled text is exempt from contrast minimums, but TwoUX keeps it at 3:1 so it can still be read.
- Read-only inputs use the readonly attribute (or aria-readonly in a grid), never aria-disabled.
- Tooltip reasons appear on focus as well as hover and can be dismissed with Esc.

## Do

- Do say what makes the action available.
- Do hide controls a role can never use.
- Do show locked values as readable text, not faded inputs.

## Don't

- Don't disable a form's submit button to signal missing fields.
- Don't put links or buttons inside a disabled reason tooltip.
- Don't use the native disabled attribute on a control that has a reason; keyboard users can't reach the tooltip.

## Related

- Inline editing and validation
- Page actions and row actions
- Selection and bulk actions
- Tooltip
- Button
- Form validation
