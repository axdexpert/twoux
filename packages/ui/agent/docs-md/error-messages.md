# Error messages

Put every error where it happened, at the smallest scope that contains it, and say what went wrong and what to do next in plain words.

Kind: pattern · Group: Patterns: general

**Problem:** Errors shown far from their cause, raw API text, and messages that blame the person or promise help that never comes all erode trust. When one chart fails and the whole page goes blank, people lose work they could have kept doing.

**Solution:** Match the place to the scope: a field error under the field, a form error in a banner above the form actions, a failed region in an error state that replaces only that region, a failed page in a page-level error state. Every message has a cause if known and a next step.

**Built from:** Form validation, Banner (inline alert), Error state (failed to load), Toast, Text input, Code block

## How it works

1. Find the smallest scope that contains the failure: one field, one form, one region (a chart card, the side panel, a table), or the whole page.
2. Field: message under the field. Form or server error with no field: banner above the form's buttons. Region: error state in place of that region only. Page: error state in place of the page content.
3. For an action that failed after the person left the screen, such as an export or a bulk close, put a banner on the page they are on and an Inbox item; never a toast that fades.
4. Write the message: what happened, why if known, what to do now. Add Try again when retrying could work.
5. Put technical detail (request ID, error code) in a collapsed Details section the person can copy into a support request.

## When to use

- Any time something failed and the person needs to know: a value is invalid, a save failed, data didn't load, an action was refused.
- Unexpected crashes in one part of the page: wrap each region in an error boundary so the rest stays usable.
- When an action partly worked, such as a bulk close where some listings were already closed by someone else.

## When not to use

- For warnings or advice, such as a salary below the advertised range for similar roles. Use a warning banner or field warning; errors mean something must be fixed now.
- For a list that loaded fine and is empty. Use the empty state.
- For a reversible action that worked. Use a toast.

## Guidelines

- Use the built-in error state of a component (a combobox that failed to load options, a chart that failed to fetch) before inventing a new one.
- Errors never auto-dismiss. A failed save stays visible until it succeeds or the person dismisses it.
- Keep what the person entered. A failed submit leaves every field filled and stays on the page until the result is known.
- Show the count when it helps: "3 of 12 listings couldn't be closed", with a link that filters to those three.
- Never claim the team has been told unless errors really are reported automatically.
- Report unexpected errors to the error tracker with the request ID shown in Details, so a support request can be matched.

## Content

- Pattern: what happened, then what to do. "Couldn't save the closing date. Check your connection and try again."
- Don't blame: "Enter a closing date after today", not "You entered an invalid date".
- Plain words over codes: "This listing was changed by Tom Reid while you were editing" rather than "409 Conflict".
- No "Oops", no jokes, no exclamation marks, no "sorry" in every message.

## Accessibility

- Errors are text and an icon, never colour alone.
- Field errors link to their field with aria-describedby and set aria-invalid.
- A banner that appears after submit moves focus to itself, or to the first field in error; a region error is announced as a status without stealing focus.
- Suggest the fix when it is known (3.3.3).

## Do

- Do keep the failure inside the region that failed.
- Do offer Try again when a retry could work.
- Do keep the person's input after any failure.

## Don't

- Don't show raw API or stack trace text as the main message.
- Don't report a failure in a toast that disappears after 6 seconds.
- Don't use red error styling for a warning.

## Related

- Inline editing and validation
- Empty, loading and error states
- Notifications: inbox, bell, toast or email digest
- Banner (inline alert)
- Error state (failed to load)
- Form validation
