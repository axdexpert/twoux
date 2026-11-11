# Creating a record: dialog, single page or steps

Pick the creation surface by how much people must decide: a small dialog for a name or two, one page for most records, steps only for long or high-stakes set-ups. Fill everything else with visible defaults.

Kind: pattern · Group: Patterns: general

**Problem:** Each team builds creation differently: a wizard for a three-field listing, a modal stacked on a modal for a new location, forms that ask for things the product could have guessed. People abandon long forms and get lost in short wizards.

**Solution:** Count the decisions people must make, not the fields that exist. Ask only for what has no good default; put the rest under Additional settings with the default showing. Use a dialog for up to three short fields, one page for most records, and the Stepper only when steps depend on each other, settings can't be changed after creation, or the result reaches people outside the workspace.

**Built from:** Page header, Breadcrumb, Card, Text input, Combobox, Date picker, Form validation, Stepper, Side panel (drawer), Button, Toast, Confirmation dialog

## How it works

1. List every field, then sort it: required with no good default, expected by at least 8 in 10 people (such as salary on a listing), and everything else. Only the first two groups go in the main section.
2. Choose the surface. A dialog for one to three short fields, such as a new saved view or a new tag. A single page for most records, such as Create listing. The Stepper for long or dependent set-ups, such as Publish listing to job boards. When fields appear based on earlier answers, count the longest version of the form.
3. Show defaults as real values in the fields: Closing date 6 December 2026 (30 days), Hiring manager: you. Values TwoUX decides later say so in the hint: "Reference number is assigned when you save."
4. Put the remaining fields in a collapsed Additional settings section at the end, each with its default filled in.
5. The primary button stays enabled. On submit, validate, show the error summary and move focus to the first problem.
6. On success, open the new record (side panel or page, as Record detail says) and show a toast such as "Listing created".

## When to use

- Dialog: one to three short fields that can all be changed later, with nothing to look up elsewhere.
- Single page: most records, from a draft listing to a new candidate with CV upload, up to about 15 main fields or 5 groups.
- Stepper: more than about 15 main fields or 5 groups, later steps that change with earlier answers, settings that cannot be changed after creation, or one group complex enough to need its own page, such as application questions with their own rules.
- If length, complexity and recovery still leave it open, use frequency: one page for records people create often, steps for set-ups done rarely.

## When not to use

- Don't use steps to make a short form feel lighter. Three steps of two fields each is slower than one page.
- Don't use this for changing one value on an existing record. Use inline editing.
- Don't create records the assistant suggested without the person applying the proposal. Use Propose, then apply.

## Guidelines

- Order the main fields the way the list shows them. The field order on Create listing becomes the default column order in the Listings table.
- Defaults must match what TwoUX will actually save. If the hint says "Closes after 30 days", the listing closes after 30 days.
- Never ask for something the workspace already knows. Prefill the team, office address and hiring manager from the person and workspace.
- When a field needs something that does not exist yet, such as a new location, offer "Create Leeds office" inside the select for a name only, or open an overlay side panel for more. When it is saved, select it in the field and return focus there.
- Never stack a dialog on a dialog, and never run a Stepper inside a side panel or dialog.
- Leaving with unsaved input asks "Discard new listing?" with Keep editing focused. Leaving an untouched form closes without asking.
- Stepper flows: three to five steps, seven at most, one page per step, a Review step at the end with Edit links back to each step, in the same order as the steps.
- In a Stepper, check each step when people press Next and keep them on it until it passes. The Review step checks everything again and links each problem to the step that holds it.

## Content

- Page title and button use the same verb and object: page "Create listing", button "Create listing". Cancel is "Cancel".
- Section headings are nouns: "Role", "Location and pay", "Additional settings". Not "Enter role details".
- Hints say what happens if the field is left as it is: "If you leave this blank, the listing stays open until you close it."
- Mark optional fields "(optional)"; don't mark required ones.

## Accessibility

- One h1 per page (the page title); each section is an h2 in a labelled group.
- Additional settings is a disclosure button with aria-expanded. When it opens, focus stays on the button.
- The Stepper names the current step in text ("Step 2 of 4: Application questions") and moves focus to the step heading on Next and Back.
- When a sub-create side panel closes, focus returns to the field that opened it.

## Do

- Do let people create with one press of Create when the defaults are right.
- Do show every default in the field or hint, never hidden behind a setting.
- Do keep the Review step free of editing; it links back to steps instead.

## Don't

- Don't disable Create until the form is valid. Validate on submit and say what is missing.
- Don't add a sidebar item for a create page; it opens from the page header of the list.
- Don't open a dialog to create something from inside another dialog.

## Related

- Editing a record: inline, section or whole page
- Deleting records
- Inline editing and validation
- Record detail: side panel, overlay or full page
- Stepper
- Form validation
- Page header
