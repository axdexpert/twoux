# Inline editing and validation

Edit values where they are shown, check each field when the person leaves it, and summarise every problem on submit.

Kind: pattern · Group: Patterns: general

**Problem:** Errors that appear while typing feel like nagging, and errors that only appear after submit are hard to find. Each form in a product tends to validate at a different moment.

**Solution:** Validate a field when the person leaves it. In the data grid, Enter edits, Enter saves and Esc cancels, and invalid values stay in edit. On submit, a summary counts the problems and moves focus to the first.

**Built from:** Data grid, Text input, Form validation, Banner (inline alert), Side panel (drawer), Toast

## How it works

1. Show which values are editable: an edit affordance on hover in the side panel, cell focus in the data grid.
2. Enter starts editing; Enter saves and Esc cancels.
3. Check the value when the person leaves the field, never on the first keystroke.
4. If invalid, keep the cell or field in edit with a red outline, an icon and a message under it that says how to fix it.
5. Once the person is fixing an error, re-check on each keystroke so the message clears as soon as the value is valid.
6. On submit of a longer form, show a summary at the top that counts the problems and links to each, and move focus to the first field in error.

## When to use

- For values people change often, one at a time, such as a listing's closing date or owner.
- Across many rows in the data grid, where the same property is edited on many records.

## When not to use

- For creating a record or changing several dependent fields at once. Use a form in the side panel or a full page.
- In the list table. Only the data grid supports cell editing.

## Guidelines

- Read and edit states use the same type size and weight so text does not jump.
- In a filtered or sorted table, keep an edited row in place until the person refreshes, so it does not vanish under their cursor.
- Keep the submit button enabled on longer forms; pressing it runs validation and shows the summary.
- Mark required fields. If most fields are required, mark the optional ones instead.
- Server errors that belong to a field appear on that field; errors that belong to no field appear in a banner above the form actions.
- The error summary is in addition to field messages, never instead of them.
- Show requirements before anyone gets them wrong: constraint text under the field ("3 to 80 characters") and a format example. An error should never be the first time people see a rule.
- Warnings are not errors: a field warning ("Salary is below the range for similar roles") is shown in amber text and does not block saving.
- After submit, stay on the form until the server answers, with a spinner in the Save button. Never redirect first and lose the input.
- If a slow submit must leave the page, the result message links back to the form with the values and errors restored.
- A server error that belongs to a field, such as "A listing with this reference already exists", goes on that field, not in the banner.

## Content

- Required message: "[Field] is required", for example "Closing date is required".
- Say what is wrong and how to fix it in one sentence: "Salary must be a number, like 32000".
- Summary heading: "2 problems to fix", each a link to its field.
- Format errors start with Enter: "Enter a valid email address, like name@example.co.uk".
- Length errors give the count: "Job title has too many characters. 92 of 80." Counters read "Character count: 12/80".
- Don't use a generic top message such as "Fix the errors on this page"; the summary lists each problem.

## Accessibility

- Errors are text, not just a red border; colour is a second cue.
- Link each message to its field with aria-describedby and set aria-invalid on the field.
- On submit, move focus to the first field in error.
- In the grid, Enter or F2 enters edit, Esc restores grid navigation and may undo the edit.
- Placeholders are examples only; labels and constraint text carry the instructions, because placeholder text disappears and often fails contrast.

## Do

- Do validate on blur and clear the error as soon as it is fixed.
- Do keep save and cancel visible while editing.

## Don't

- Don't show errors on fields the person hasn't reached yet.
- Don't rely on a top summary alone.
- Don't report a failed save in a toast; keep the field in error with Retry.

## Related

- Empty, loading and error states
- Undo and destructive actions
- Record detail: side panel, overlay or full page
- Form validation
- Data grid
