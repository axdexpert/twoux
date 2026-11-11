# Generated drafts and files

Show what the assistant makes (a job description, a CSV, a chart) as a card under the answer. Short things are read and copied in place; long drafts open on the assistant page. Anything that would change a record goes through Suggested changes.

Kind: pattern · Group: Patterns: AI

**Problem:** Hiring teams ask the assistant for things they will use elsewhere: a job description for a new role, a CSV of expiring listings, a chart of applications by week. Pasted into the answer text, these are hard to copy, easy to lose and easy to mistake for saved data.

**Solution:** Each output becomes a generated file card stacked under the answer, with name, type, size and origin label, and its own actions. Short, self-contained output stays inline. Long drafts open beside the conversation on the assistant page. Saving a draft into a listing is a suggested change the person applies.

**Built from:** Generated file card, Assistant side panel, Assistant page, Suggested changes, Code block, AI origin label, Dropdown menu

## How it works

1. When an answer produces something to keep, place it as a card below the answer text, one card per output, never inside a paragraph.
2. Choose inline or open by length and intent: a short snippet, a CSV or a chart image stays inline with Copy or Download; a full job description opens to read and edit.
3. Open shows the draft on the assistant page in the Answer area, with the conversation still beside it.
4. If the draft belongs on a record (the description of LST-1044), the card's main action is "Suggest for LST-1044", which adds it to Suggested changes with before and after.
5. Applying works like every proposal: step card, toast with Undo.

## When to use

- For drafts people will edit or reuse: job descriptions, interview question sets, rejection email drafts for a recruiter to send themselves.
- For files to download: CSV of listings, a chart as PNG.
- For a chart the assistant drew from listings data, shown inline with Download and a data table on Open.

## When not to use

- For a figure or a short table that answers the question. Keep it in the answer.
- For direct edits to a record field. Use Suggested changes.
- For exports of a table view. Use the Export menu on the table.

## Guidelines

- Keep file actions in the card and answer actions in the answer row, so Copy on the card copies the file and Copy under the answer copies the answer.
- Two visible actions at most on a card; the rest go in a More menu.
- Every card carries the origin label and the records it drew on, as the answer does.
- A draft is never saved anywhere until the person downloads, copies or applies it. Say so on the card.
- Drafts about candidates are for a person to review and send. The assistant never sends or decides on its own.

## Content

- Card title is the file name or what it is: "Job description, Junior Product Designer", "expiring-listings.csv".
- Metadata uses standard units and plain types: "CSV · 14 KB · 38 rows".
- Main action verbs: "Open", "Download", "Copy", "Suggest for LST-1044".

## Accessibility

- Each card is a group named by its title; its actions are named with the file, such as "Download expiring-listings.csv".
- Generated charts include a text summary and the data as a table on Open.
- Opening a draft moves focus to its heading; closing returns focus to the card.

## Do

- Do stack each output in its own card under the answer.
- Do route record changes through Suggested changes.
- Do show size and row counts before download.

## Don't

- Don't nest file cards inside answer text.
- Don't put a Save to record button on a draft.
- Don't mix file actions into the answer actions row.

## Related

- Propose, then apply
- Citing sources
- Labelling AI output
- Data export
- Generated file card
