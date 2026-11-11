import { Kbd } from "@twoux/ui";
import { Copy, Pencil, Trash2 } from "lucide-react";

/* DropdownMenuContent drawn in place (the real one portals to the page), with its classes: icon, label and shortcut
   per item, the destructive item last after a separator. The group label is left out to fit. */
const item = "flex items-center gap-2 rounded-xs px-2 py-1.5 text-base";
const icon = "size-3.5 shrink-0 text-muted-foreground";
const shortcut = "ml-auto flex items-center gap-0.5 text-sm text-muted-foreground";

export default function Thumbnail() {
	return (
		<div className="grid w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md" aria-hidden="true">
			<span className={`${item} bg-accent text-accent-foreground`}><Pencil className={icon} />Edit<span className={shortcut}><Kbd>E</Kbd></span></span>
			<span className={item}><Copy className={icon} />Duplicate<span className={shortcut}><Kbd>D</Kbd></span></span>
			<span className="-mx-1 my-1 h-px bg-border" />
			<span className={`${item} text-destructive`}><Trash2 className="size-3.5 shrink-0 text-destructive" />Delete listing</span>
		</div>
	);
}
