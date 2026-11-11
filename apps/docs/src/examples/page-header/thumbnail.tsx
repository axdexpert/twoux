import { Button, Kbd, Tabs, TabsList, TabsTrigger } from "@twoux/ui";
import { Download, Ellipsis, Plus } from "lucide-react";

/* The working part of PageHeader, with its classes: the actions (more menu, a secondary, the one primary rightmost
   with its shortcut) over the view tabs. The 20px title is left out so the preview doesn't outweigh its neighbours.
   The Kbd is placed the way Button's shortcut prop places it, so the gallery doesn't register a live shortcut. */
export default function Thumbnail() {
	return (
		<header className="grid w-64 gap-3 rounded-sm border border-line bg-surface px-4 pt-3" aria-hidden="true">
			<div className="flex items-center justify-end gap-2">
				<Button variant="ghost" size="icon-sm" tabIndex={-1} aria-label="More actions"><Ellipsis /></Button>
				<Button variant="outline" size="icon-sm" tabIndex={-1} aria-label="Export"><Download /></Button>
				<Button size="sm" tabIndex={-1}><Plus />New listing<Kbd className="-mr-1">C</Kbd></Button>
			</div>
			<Tabs value="all">
				<TabsList aria-label="Views">
					<TabsTrigger value="all" count={24} tabIndex={-1}>All</TabsTrigger>
					<TabsTrigger value="live" count={14} tabIndex={-1}>Live</TabsTrigger>
					<TabsTrigger value="drafts" count={3} tabIndex={-1}>Drafts</TabsTrigger>
				</TabsList>
			</Tabs>
		</header>
	);
}
