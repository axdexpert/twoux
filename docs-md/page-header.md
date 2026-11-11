# Page header

The page title on the left and its actions on the right, with exactly one primary action per view.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- At the top of every page in the canvas, to name the page and hold actions that affect the whole page.
- When a page has a main next step, such as creating a listing.

## When not to use

- Actions on selected rows. Use the bulk action bar.
- Actions on one record shown in the side panel. Use the panel's footer.
- Global tools such as search or Ask. Those live in the top bar of the App shell.

## Structure

1. Title (h1)
2. Actions, right-aligned: secondary actions ("Export ⇧E") then the one primary action ("New listing C")
3. Optional: view tabs below (All 24, Live 14, Drafts 3, Closed 7)

## Guidelines

- One primary button per view; every other action is secondary or in a menu.
- The primary action sits rightmost, nearest the content edge, with secondary actions to its left.
- Each button shows its shortcut (C, ⇧E) so people learn it by using it.
- Three actions at most in the header; more go into a menu.
- Title and actions wrap to two lines on narrow widths rather than truncating.
- View tabs (segmented counts) sit under the title and filter the same data; they are not navigation.

## Content

- Title is a short noun in sentence case that matches the sidebar item: "Listings".
- Action labels start with a verb and name the object: "New listing", "Export".
- Tab labels are one or two words with a count.

## Accessibility

- The title is the page's only h1 and matches the document title (2.4.2, 2.4.6).
- Shortcut hints are part of the button's accessible description, not its name, so voice users can say the label (4.1.2).
- Buttons are at least 24px tall (28 to 32px in TwoUX) (2.5.8).
- After navigation, focus can be moved to the title so screen reader users start at the page (2.4.3).

## Keyboard

| Keys | Action |
|---|---|
| C | Primary create action (New listing) |
| ⇧E | Export |
| Tab | Move from title area to actions, left to right |

## Examples

### listings

```tsx
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
```

## Related

- App shell and sidebar navigation
- Breadcrumb
- Command palette (⌘K)
- Shortcut sheet (?)
