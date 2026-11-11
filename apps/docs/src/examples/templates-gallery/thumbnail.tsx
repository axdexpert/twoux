/* TemplatesGallery's dialog body, copied from the component: the category list with the current one selected, and a
   template card saying what it does and which tools it uses. The header and search are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 grid-cols-[72px_1fr] overflow-hidden rounded-md border border-line bg-surface shadow-pop" aria-hidden="true">
			<nav className="grid content-start gap-0.5 border-r border-line p-2">
				{["All", "Listings"].map((c, i) => <span key={c} className={`rounded-xs px-2 py-1.5 text-left text-base ${i === 0 ? "bg-selected font-medium text-ink" : "text-ink-2"}`}>{c}</span>)}
			</nav>
			<div className="grid content-start p-2">
				<span className="grid content-start gap-1 rounded-sm border border-line p-3 text-left">
					<span className="text-base font-medium text-ink">Listings at risk</span>
					<span className="text-sm text-ink-2">Proposes extensions.</span>
					<span className="text-xs text-ink-3">Uses Listings</span>
				</span>
			</div>
		</div>
	);
}
