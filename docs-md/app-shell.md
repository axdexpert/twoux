# App shell and sidebar navigation

The frame of every screen: a tinted left sidebar for navigation and an inset white canvas with a top bar for breadcrumb, Ask and search.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- Every signed-in screen uses the same shell, with navigation in the same place and order.
- Products with more than a handful of sections, where a vertical list scales better than a top bar.

## When not to use

- Switching views of the same data, such as Live or Drafts. Use tabs in the page header.
- Moving between records in a list. Use J/K with the Side panel.
- Showing location deeper than two levels. Use the Breadcrumb.

## Structure

1. Sidebar: workspace switcher
2. Sidebar: personal items (Inbox with count, My candidates, Assistant)
3. Sidebar: group headings with items (Hiring: Listings, Pipeline, Reports; Workspace: Settings, Members, Billing)
4. Sidebar footer: setup checklist ("Get set up 3 / 5")
5. Canvas top bar: breadcrumb, Ask ⌘J, Search or run a command ⌘K
6. Canvas: page header and content; side panel docks on the right
7. Optional rail: 48px of icons with names in tooltips and a Collapse sidebar button at the foot

## Guidelines

- Keep the sidebar visible on desktop with text labels on every item. Collapse it to a rail of icons only on workspaces where the content needs the width (trading, editors), with each name in a tooltip, the Collapse sidebar button and ⌘B, and the choice saved per person.
- Two levels at most: group headings and items. Deeper structure becomes tabs on the page.
- Mark the current item with aria-current="page" and a filled background, not colour alone.
- Most used items first, settings last.
- Below 860px the sidebar hides; the top bar gains an inbox button with the same count, so nothing that needs the person disappears.
- The top bar holds global tools only (Ask, search); page actions live in the page header.
- Nav items are at least 24px tall with full-width hit areas, to meet the target size minimum.
- Use frame="flush" for workspaces whose regions sit edge to edge, divided by hairlines instead of gaps and cards; keep the inset canvas everywhere else.

## Content

- Item labels are short nouns that match the page title they open ("Listings" opens "Listings").
- Group headings are short and never include the word "navigation".
- Counts are numbers only and show only when above zero.

## Accessibility

- The sidebar is a nav landmark with a unique label ("Main"); the canvas is main; the side panel is complementary (2.4.1).
- Navigation order and labels are the same on every page (3.2.3).
- Search and the command palette provide a second way to reach pages (2.4.5).
- Each page has a title that names the page and the product (2.4.2).
- Focus is always visible on nav items, including inside the tinted sidebar (2.4.7).

## Keyboard

| Keys | Action |
|---|---|
| G L / G P / G I | Go to Listings, Pipeline or Inbox |
| ⌘K | Search or run a command |
| ⌘J | Open the Assistant |
| Tab | Move through sidebar items in order |
| ⌘B / Ctrl+B | Collapse or expand the sidebar, when the app offers the rail |

## Examples

### workspace

```tsx
import type React from "react";
import { AppShell, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, PageHeader, SidebarItem, SidebarSection } from "@twoux/ui";
import { BarChart3, Briefcase, Inbox, Plus, Settings, MessageSquare, Users } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Hiring workspace", description: "Tinted sidebar with a text label on every item, two levels at most, and the current page marked by fill and aria-current. Below 860px the sidebar moves behind the menu button.", order: 1 };

export default function Example() {
	const [page, setPage] = useState("Listings");
	const item = (label: string, icon: React.ReactNode, count?: number) => <SidebarItem key={label} label={label} icon={icon} count={count} current={page === label} onClick={() => setPage(label)} />;
	return (
		<div className="h-120 w-full overflow-hidden rounded-sm border border-line">
			<AppShell
				sidebar={
					<>
						<div className="px-2 pt-1 text-base font-semibold text-ink">TwoUX Hiring</div>
						<SidebarSection>{[item("Inbox", <Inbox />, 4), item("Assistant", <MessageSquare />)]}</SidebarSection>
						<SidebarSection title="Hiring">{[item("Listings", <Briefcase />), item("Candidates", <Users />), item("Reports", <BarChart3 />)]}</SidebarSection>
						<SidebarSection title="Workspace">{[item("Settings", <Settings />)]}</SidebarSection>
					</>
				}
				topBar={
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem><BreadcrumbLink href="#hiring">Hiring</BreadcrumbLink></BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem><BreadcrumbPage>{page}</BreadcrumbPage></BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				}
			>
				<PageHeader title={page} description="24 listings across 6 teams" actions={<><Button variant="outline">Export</Button><Button shortcut="C"><Plus />New listing</Button></>} />
			</AppShell>
		</div>
	);
}
```

## Related

- Breadcrumb
- Page header
- Inbox (triage)
- Command palette (⌘K)
- Side panel (drawer)
- Setup checklist
- Usage meter
