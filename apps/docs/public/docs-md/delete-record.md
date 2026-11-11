# Deleting records

Deleting moves records to Deleted with Undo. Only permanent or cascading deletes ask first, and only the rare, severe ones ask people to type the name.

Kind: pattern · Group: Patterns: general

**Problem:** Delete is where TwoUX's Undo-first rule meets real loss. Without a shared ladder, teams either confirm every removal or let a single click erase a candidate's history, and typed confirmations spread to places where they only slow people down.

**Solution:** Four levels, chosen by what is lost and who it affects. Remove a part of a form you are editing at once. Delete a record to Deleted, with Undo. Permanently delete in a confirmation dialog that names what goes and what stays. Ask for the typed name only when the delete is permanent and takes other records with it.

**Built from:** Toast, Confirmation dialog, Bulk action bar, Banner (inline alert), Text input, Button, Keyboard shortcut hint

## How it works

1. Remove a part of a form being edited, such as a screening question or a tag: no confirmation, it goes at once, with Undo where it saves straight away.
2. Delete a record, such as a draft listing or a duplicate candidate: it moves to Deleted, where it can be restored for 30 days. Show "Listing deleted. Undo".
3. Permanently delete, such as emptying Deleted or erasing a candidate on request: a confirmation dialog titled with the action and count, naming what goes and what stays.
4. Permanent and cascading, such as deleting a workspace or a team with live listings: the same dialog, plus a warning banner listing what else goes, and a field where the person types the name.
5. If something must happen first, such as closing a live listing that still has applicants, the dialog says so and links to it. The confirm field and button wait until it is done, and the reason is written in the dialog.

## When to use

- Deleted with Undo: the default for every record people can delete.
- Confirmation dialog: anything that cannot come back, including bulk permanent deletes.
- Typed name: permanent deletes that also remove other records or affect other people's work.

## When not to use

- Don't use delete for ending a process. Closing a listing or rejecting a candidate are their own actions with their own wording.
- Don't ask for a typed name on routine deletes. It slows people down and they learn to type without reading.
- Don't let the assistant delete. It can propose a delete, which the person applies.

## Guidelines

- Choose the level by three questions: can it come back, does it take other records with it, and what would it cost to redo.
- The dialog body names the record in bold and states the result: "Permanently delete Priya Shah? Her application, notes and interview feedback are erased. You can't undo this."
- Say what stays as well as what goes: "Reports keep the anonymised counts."
- Typed confirmation: single record, type its name; bulk, type "delete". Matching ignores case and extra spaces, and paste works.
- Always confirm in a dialog, never a popover or a separate page.
- A bulk delete from the bulk action bar uses the level of its most severe item, and the title carries the count: "Permanently delete 12 candidates?"

## Content

- Use "Remove" for taking something out of a form or list it still exists elsewhere in, and "Delete" for the record itself.
- Dialog title is the action and count as a question: "Delete workspace?", "Permanently delete 3 listings?"
- Buttons name the outcome: "Keep candidate" and "Delete permanently". Never "OK" or "Yes".
- Typed confirmation label: "Type Leeds hiring team to confirm".

## Accessibility

- Delete dialogs use role alertdialog with the title as the label and the consequence as the description.
- Focus starts on the safe button, or on the typed confirmation field when there is one.
- The typed confirmation field has a visible label naming the exact text, not only a placeholder.
- After a delete, focus moves to the next row in the list, or the list heading if none is left, and the toast is announced.

## Do

- Do make Deleted the default and offer Undo.
- Do state prerequisites in the dialog and link to them.
- Do scale friction to severity and nothing more.

## Don't

- Don't write "Are you sure?".
- Don't focus the delete button by default.
- Don't delete a live listing that has applicants in one step; ask people to close it first.

## Related

- Undo and destructive actions
- Selection and bulk actions
- Editing a record: inline, section or whole page
- Confirmation dialog
- Toast
- Bulk action bar
