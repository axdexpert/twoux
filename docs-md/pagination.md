# Pagination and counts

The footer that says which rows are showing and how many exist ("1–100 of 1,262"), with previous and next controls and the selection count.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- A collection is too large for one page or one view.
- Lists over 20 items, with pagination at the bottom.
- People need to know where they are and return to a section, which pagination supports better than endless scroll.

## When not to use

- Collections under five items.
- Steps in a flow. Use buttons or a progress control.
- When the total cannot be known, do not invent one; use an open-ended count such as "100+".

## Structure

1. Range and total ("Showing 1–9 of 24")
2. Selection count when rows are selected
3. Previous page
4. Page numbers or compact "1 of 3"
5. Next page

## Guidelines

- Show the range and the total. When rows are selected, put the selected count first.
- Use the compact "1 of 3" form where a row of page numbers does not fit, and offer jump to page past about 9 pages.
- Previous is inactive on the first page and Next on the last.
- Show pagination even when everything fits on one page, so the layout does not shift.
- Changing page clears the selection; say so in the selection count.

## Content

- Show the current range and the total together, for example "1–100 of 1,262", with an en dash and thousands separators.
- Name controls by destination, "Previous page", "Page 6", not "left".
- Do not show a count while the table is loading.

## Accessibility

- Wrap page links in a nav landmark with an aria-label, and mark the current page with aria-current="page".
- Give previous, next and page buttons labels; set them explicitly for non-English interfaces.
- 4.1.3 Status Messages: the range and selection count update as status text, "2 of 24 selected".
- After a page change, move focus and scroll to the top of the new content.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Reach the pagination controls |
| Enter / Space | Go to the previous, next or chosen page |

## Examples

### footer

```tsx
import { Checkbox, TablePagination } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Table footer", description: "Range and total always show, even on one page. With rows selected, the count comes first. Previous is off on the first page, Next on the last.", order: 1 };

export default function Example() {
	const [page, setPage] = useState(0);
	const [selectSome, setSelectSome] = useState(true);
	return (
		<div className="grid w-full max-w-xl gap-3">
			<label className="flex items-center gap-2 text-base text-ink-2">
				<Checkbox checked={selectSome} onCheckedChange={(v) => setSelectSome(v === true)} />
				Show with 2 rows selected
			</label>
			<div className="overflow-hidden rounded-sm border border-line bg-surface">
				<div className="grid h-24 place-items-center text-base text-ink-3">Page {page + 1} of the listings table</div>
				<TablePagination page={page} pageCount={14} pageSize={100} total={1262} selected={selectSome ? 2 : 0} noun="listings" onPageChange={setPage} />
			</div>
		</div>
	);
}
```

## Related

- List table
- Data grid
- Columns menu
- Bulk action bar
