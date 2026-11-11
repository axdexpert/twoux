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
