# Unsaved changes

Don't let people lose work by accident: save drafts of long text automatically, and ask before discarding a changed form only when there really are changes.

Kind: pattern · Group: Patterns: general

**Problem:** Someone writing a job description clicks a breadcrumb or closes the tab and loses twenty minutes of work. The opposite failure is a "Discard changes?" dialog that appears when nothing changed, which trains people to click through it.

**Solution:** Track whether a form is dirty. Long text (job descriptions, email templates) saves a draft as people type. A changed form that would be lost by leaving asks once, in TwoUX's confirmation dialog, with Keep editing as the safe default. Browser-level exits use the browser's own prompt.

**Built from:** Confirmation dialog, Side panel (drawer), Button, Text input, Timestamp, Banner (inline alert)

## How it works

1. Track a dirty flag per form: true once a value differs from what was loaded, false again after save or if the person changes it back.
2. For long text, save a draft every few seconds after typing stops and show "Draft saved 10 seconds ago" near the actions. A form whose draft is saved is not at risk, so no prompt is needed.
3. When an in-app action would throw unsaved changes away (Cancel, a breadcrumb, a side navigation link, J or K to the next record, Esc on a panel form), open the confirmation dialog.
4. While the form is dirty, register a beforeunload handler so closing or reloading the tab shows the browser's own prompt; remove it as soon as the form is clean.
5. After the person chooses Discard, carry out the action they started; after Keep editing, return focus to where they were.

## When to use

- Create listing, Edit listing and other multi-field forms with a Save button.
- Forms inside the side panel, where J, K or Esc would move away from the edit.
- Long text such as a job description or an email template, where autosaved drafts replace the prompt.

## When not to use

- Inline edits in the data grid or side panel fields, which save on Enter or blur; there is never an unsaved state to lose.
- When nothing has changed, everything is already saved, or the action opens a new tab.
- When opening or closing a disclosure inside the same form, such as a Show advanced options section.

## Guidelines

- Ask every time there is a risk of loss, whatever the size of the change; consistency means people never have to guess.
- Never offer "Don't ask again" on this dialog; there would be no way to turn it back on.
- Discarding typed work cannot be undone, so this is one of the few places TwoUX confirms instead of offering Undo.
- Mark a dirty form in text near the Save button ("Unsaved changes"), not only with a dot.
- If a save fails, keep the form dirty and its values in place, with the error in a banner above the actions.

## Content

- Dialog title: "Discard changes to this listing?" Body: "Your changes to Junior Product Designer haven't been saved."
- Buttons: "Keep editing" (safe, focused) and "Discard changes" (destructive). Not Yes and No.
- Draft status: "Draft saved 10 seconds ago", or "Saving draft" while it saves.

## Accessibility

- The dialog follows the alert dialog pattern: focus moves to Keep editing, Tab is trapped, Esc means Keep editing.
- Draft saved status updates in a polite live region, at most once per save, so screen readers aren't flooded.
- The browser's own beforeunload prompt is accessible by default; don't try to replace it with custom text.

## Do

- Do save drafts of long text automatically.
- Do ask only when the form is dirty.
- Do make Keep editing the default.

## Don't

- Don't keep the beforeunload handler on a clean form.
- Don't ask when someone opens a section inside the same form.
- Don't add "Don't ask again".

## Related

- Undo and destructive actions
- Inline editing and validation
- Record detail: side panel, overlay or full page
- Confirmation dialog
- Timestamp
