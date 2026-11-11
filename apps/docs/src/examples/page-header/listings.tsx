import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, PageHeader, Tabs, TabsList, TabsTrigger } from "@twoux/ui";
import { Download, Ellipsis, Plus } from "lucide-react";

export const meta = { title: "Title, actions and view tabs", description: "The one primary action sits rightmost with its shortcut; secondary actions to its left; anything beyond three goes in a menu. Title and actions wrap rather than truncate.", order: 1 };

export default function Example() {
	return (
		<div className="w-full rounded-sm border border-line bg-surface">
			<PageHeader
				title="Listings"
				description="24 listings across 6 teams"
				actions={
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="More actions"><Ellipsis /></Button></DropdownMenuTrigger>
							<DropdownMenuContent align="end"><DropdownMenuItem>Import from CSV</DropdownMenuItem><DropdownMenuItem>Archive closed listings</DropdownMenuItem></DropdownMenuContent>
						</DropdownMenu>
						<Button variant="outline" shortcut="⇧E"><Download />Export</Button>
						<Button shortcut="C"><Plus />New listing</Button>
					</>
				}
				tabs={
					<Tabs defaultValue="all">
						<TabsList aria-label="Views"><TabsTrigger value="all" count={24}>All</TabsTrigger><TabsTrigger value="live" count={14}>Live</TabsTrigger><TabsTrigger value="drafts" count={3}>Drafts</TabsTrigger><TabsTrigger value="closed" count={7}>Closed</TabsTrigger></TabsList>
					</Tabs>
				}
			/>
		</div>
	);
}
