import { Button, Kbd } from "@twoux/ui";
import { Check, Download } from "lucide-react";

/* ExportMenu open, drawn in place (the real DropdownMenuContent portals to the page) with the menu's own classes:
   heading with its shortcut, then options, downloads and copies, each group under a label. Compact in the gallery
   (heading and options only); with `anatomy`, the trigger and every group show and each part carries
   data-anatomy="n", its number in the anatomy list, so the component page can place matching numbers. */
const content = "grid rounded-md border bg-popover p-1 text-popover-foreground shadow-md";
const label = "px-2 py-1.5 text-base font-medium";
const item = "flex items-center gap-2 rounded-xs px-2 py-1.5 text-base";
const sep = "-mx-1 my-1 h-px bg-border";

function Heading() {
	return (
		<span className={`${label} flex items-center justify-between gap-3 text-ink`}>
			Export
			<Kbd>⇧E</Kbd>
		</span>
	);
}

function Checked({ children }: { children: string }) {
	return (
		<span className={`${item} relative pr-8`}>
			{children}
			<span className="absolute right-2 flex size-3.5 items-center justify-center"><Check className="size-4 text-muted-foreground" aria-hidden="true" /></span>
		</span>
	);
}

export default function Thumbnail({ anatomy = false }: { anatomy?: boolean }) {
	if (!anatomy) {
		return (
			<div className={`${content} w-56`} aria-hidden="true">
				<Heading />
				<span className={sep} />
				<span className={label}>Options</span>
				<Checked>Only visible columns</Checked>
			</div>
		);
	}
	return (
		<div className="grid w-56 justify-items-end gap-1.5" aria-hidden="true">
			<span data-anatomy="1"><Button variant="outline" size="sm" tabIndex={-1}><Download />Export</Button></span>
			<div className={`${content} w-full`}>
				<span data-anatomy="2" className="grid"><Heading /></span>
				<span className={sep} />
				<div data-anatomy="3" className="grid">
					<span className={label}>Options</span>
					<Checked>Only visible columns</Checked>
					<span className={`${item} pr-8`}>Include AI columns</span>
				</div>
				<span className={sep} />
				<div data-anatomy="4" className="grid">
					<span className={label}>Download</span>
					<span className={`${item} bg-accent text-accent-foreground`}>Download CSV</span>
					<span className={item}>Download JSON</span>
				</div>
				<span className={sep} />
				<div data-anatomy="5" className="grid">
					<span className={label}>Copy</span>
					<span className={item}>Copy as CSV</span>
					<span className={item}>Copy as JSON</span>
				</div>
			</div>
		</div>
	);
}
