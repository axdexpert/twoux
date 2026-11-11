# Undo and destructive actions

Decide between Undo after the fact and a confirmation before it, using one test: can the action be reversed, and who else does it reach?

Kind: pattern · Group: Patterns: general

**Problem:** Confirming everything trains people to click Yes without reading; confirming nothing loses data. Teams pick differently on every screen.

**Solution:** Reversible actions run at once and offer Undo in a toast and with ⌘Z. Irreversible actions, or ones that reach people outside the workspace, confirm in a dialog that states the consequence, with the safe option focused.

**Built from:** Toast, Confirmation dialog, Bulk action bar, Button, Keyboard shortcut hint

## How it works

1. Ask: can TwoUX reverse this fully? Extending, renaming, archiving and moving can be reversed; deleting, emailing candidates and closing a listing that has notified applicants cannot.
2. Reversible: run it, then show a toast such as "2 listings extended" with Undo. ⌘Z undoes the last action too.
3. Irreversible: open a confirmation dialog titled with the action and count, stating what happens and what is kept.
4. Buttons name the outcome: the safe option ("Keep open") and the action ("Close listings"). Focus starts on the safe option.
5. For severe actions that also remove related records, such as deleting a workspace, ask the person to type the name.

## When to use

- Undo: for every reversible change made by a person or applied by the assistant.
- Dialog: for deletion, sending to people outside the workspace, and actions that cascade.

## When not to use

- Don't confirm routine reversible actions; offer Undo instead.
- Don't use a toast as the only record of something important; important outcomes also appear in the record's activity.

## Guidelines

- Scale friction to severity: none for low-risk, one dialog for high-risk, typed confirmation only for the rarest, most damaging actions.
- The dialog body names the items, the consequence and what stays: "The 140 people who already applied stay in your pipeline."
- Undo stays reachable after the toast goes: ⌘Z and the record's activity both reverse the last action.
- An Undo toast stays while hovered or focused and does not close while the person is reading it.
- The action button uses the danger style and sits to the right of the safe option, never on its own.

## Content

- Dialog title is a question with the count: "Close 2 listings?"
- Never "Are you sure?", "Yes" or "OK". Use outcome labels.
- Toast: past tense plus Undo: "Listing archived. Undo".

## Accessibility

- Confirmation dialogs use role alertdialog with aria-labelledby and aria-describedby.
- Focus moves to the least destructive button, Tab is trapped, Esc cancels and focus returns to the trigger.
- Toasts are announced as status messages; Undo also has a keyboard path (⌘Z) because toast actions are hard to reach with a keyboard.

## Do

- Do offer Undo after every reversible change, including bulk and assistant changes.
- Do state the consequence in the dialog body.

## Don't

- Don't focus the destructive button by default.

## Related

- Selection and bulk actions
- Propose, then apply
- Notifications: inbox, bell, toast or email digest
- Toast
- Confirmation dialog
