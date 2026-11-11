import { Kbd } from "@twoux/ui";

/* ShortcutSheet's dialog, built with its classes: the title and a group of shortcuts with one Kbd per key.
   The description, the single-key switch and the other groups are left out to fit. */
const ROWS = [
	{ action: "Search or run a command", keys: ["⌘", "K"] },
	{ action: "Next row", keys: ["J"] },
];

export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-2 rounded-md border border-line bg-background p-3 shadow-pop" aria-hidden="true">
			<h3 className="text-base font-semibold text-ink">Keyboard shortcuts</h3>
			<dl className="grid divide-y divide-line">
				{ROWS.map((it) => (
					<div key={it.action} className="flex items-center justify-between gap-3 py-1">
						<dt className="text-base whitespace-nowrap text-ink">{it.action}</dt>
						<dd className="flex shrink-0 items-center gap-1">{it.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</dd>
					</div>
				))}
			</dl>
		</div>
	);
}
