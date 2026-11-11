# Generated table columns and enrichment

Add an AI column, test it on three rows, see the cost per row, then run it with progress and Stop. Each cell shows its own state and cites its record.

Kind: pattern · Group: Patterns: AI

**Problem:** Running a prompt across 1,000 rows is expensive and hard to undo, and wrong answers hide among right ones. Without a shared flow, each table runs AI differently and overwrites real data.

**Solution:** Generated columns are separate from real data, carry the origin mark, and run on demand: test on a few rows first, show cost, then run with a progress bar and Stop. Cells fill one by one; failures say why; stale cells are marked out of date.

**Built from:** AI column, Data grid, Prompt editor with fields, AI origin label, Citations and sources, Toast

## How it works

1. Add a column from a short list ("Suggested title", "Risk of closing empty") or describe your own in the prompt editor, with fields from the row as removable chips.
2. Test on 3 rows before anything else; results appear in place for review.
3. Before running on all rows, show the cost per row and in total, and the number of rows.
4. Run fills cells one by one with a visible state (queued, writing, done, failed) and a progress bar with Stop.
5. A failed cell says why ("The listing has no description") with Try again; "Not found" means the model looked and found nothing; a dash means nothing to do.
6. When source data changes, mark the column out of date instead of rewriting it silently.

## When to use

- To add a judgement or summary to many rows at once in the data grid.

## When not to use

- In the list table. Generated columns live only in the data grid.
- To change real fields. A generated column never overwrites real data; applying a suggestion to a real field goes through Propose then apply.

## Guidelines

- Default to testing when a run is expensive or affects many rows.
- Show cost where the decision is made, on the Run button, in credits with the unit stated.
- Each cell cites the record it used and shows when it was written.
- Cells can be corrected one at a time or in bulk.
- Runs keep a history so people can see and undo earlier runs.

## Content

- Run button: "Run on 412 rows · about 412 credits".
- Column header shows the origin mark and the time written: "Likely reason · 2 min ago".

## Accessibility

- Cell states are text ("Writing", "Failed"), not only spinners or colours.

## Do

- Do test on a few rows first.
- Do show cost before running.

## Don't

- Don't auto-run a new column on every row.
- Don't rewrite stale cells silently.

## Related

- Labelling AI output
- Citing sources
- Showing reasoning and progress
- Data export
- AI column
- Prompt editor with fields
