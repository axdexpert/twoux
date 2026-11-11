import { Button } from "@twoux/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* TablePagination built with its classes and real Buttons: range and total, Previous off on the first page, "1 of 2",
   Next. Drawn rather than rendered so the text can't truncate or wrap at this width. */
export default function Thumbnail() {
	return (
		<nav className="flex h-10 w-64 items-center gap-3 rounded-sm border border-line bg-surface px-3 text-sm whitespace-nowrap text-ink-2" aria-hidden="true">
			<p className="tabular">Showing 1–50 of 96</p>
			<div className="ml-auto flex items-center gap-1">
				<Button variant="ghost" size="icon-sm" disabled tabIndex={-1} aria-label="Previous page"><ChevronLeft /></Button>
				<span className="tabular px-1">1 of 2</span>
				<Button variant="ghost" size="icon-sm" tabIndex={-1} aria-label="Next page"><ChevronRight /></Button>
			</div>
		</nav>
	);
}
