# Breadcrumb

A short trail in the top bar showing where the page sits in the hierarchy, ending with the current page.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- On pages below the top level, to show the section they belong to ("Hiring > Listings").
- On a record's full page, so the person can go back up to the list ("Hiring > Listings > Junior Product Designer").

## When not to use

- As main navigation. The sidebar is the main navigation; the breadcrumb supplements it.
- Linking to sibling or related pages. Use tabs or the sidebar.
- Showing the path the person took. Breadcrumbs show hierarchy, not history; use the browser's Back.

## Structure

1. Section name (link when it has its own page)
2. Chevron separator (decorative)
3. Current page (not a link, darker text)

## Guidelines

- Sits at the left of the top bar on every page; top-level pages (Inbox, Assistant) show their name only.
- The last item is the current page, styled darker and not a link.
- Names match page titles exactly.
- When space runs out, collapse middle items behind an ellipsis button; the current page always stays visible.
- Keep it on one line; never wrap.

## Content

- Use the page and section names exactly as shown in the sidebar.
- For a record, end with its title; add the ID only when titles can repeat.

## Accessibility

- Wrap it in a nav landmark labelled "Breadcrumb" containing an ordered list (1.3.1).
- The current item has aria-current="page"; when it is not a link this is optional but still set for clarity.
- Separators are decorative and hidden from assistive technology.
- Breadcrumbs help meet 2.4.8 Location by showing where the page sits.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through the links in the trail |
| Enter | Follow the focused link |

## Examples

### trail

```tsx
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@twoux/ui";

export const meta = { title: "Where the page sits", description: "Names match page titles. The current page is the last item, darker and not a link. On narrow screens middle items collapse behind the ellipsis; the trail never wraps.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-xl gap-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem><BreadcrumbLink href="#listings">Listings</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbLink href="#l1040">Junior Product Designer</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbPage>Screening questions</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem><BreadcrumbLink href="#settings">Settings</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbPage>Email templates</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
```

## Related

- App shell and sidebar navigation
- Page header
