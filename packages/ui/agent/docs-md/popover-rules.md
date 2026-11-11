# Popover rules

Shared behaviour for every floating layer (menus, filters, snooze, selectors): one open at a time and never cut off.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- For short supporting content or a small set of controls tied to a trigger: filter values, snooze times, column choices.
- When the person must stay in context and the page behind stays usable.

## When not to use

- For long reading or a multi-step task. Use a dialog or side panel.
- For a one-line label. Use Tooltip.
- Inside another popover. Open a submenu (one level) or a dialog instead.
- For required fields that would be lost on outside click. Use a dialog.

## Structure

1. Trigger (aria-expanded)
2. Floating panel (10px radius, shadow)
3. Header (when dismissible)
4. Body
5. Footer actions (optional)

## Guidelines

- Only one popover is open at a time; opening a menu, filter, snooze or selector closes any other.
- Popovers open on a user action, never on page load.
- Placement flips and shifts to stay inside the panel and the screen, 8px from the edge. Nothing is ever cut off.
- Open 4 to 6px from the trigger, aligned to its start edge.
- Close on outside click, Esc, or when focus leaves; return focus to the trigger.
- Only the body scrolls, never sideways.

## Content

- Header in sentence case, one short line, when the popover can be dismissed.
- No help articles or Learn more links inside; keep help at page level.
- Footer buttons follow Button wording: Cancel and Apply.

## Accessibility

- Triggers set aria-expanded (and aria-haspopup for menus). Enter or Space opens.
- Give the panel a role (menu or dialog) and a label.
- Esc closes and focus returns to the trigger.
- The popover must not hide the focused element.
- At 320px width it fits without sideways scrolling.

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space | Open or close from the trigger |
| Esc | Close and return focus to the trigger |
| Tab | Move through controls inside; leaving closes it |

## Examples

### one-at-a-time

```tsx
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, FilterBar, FilterPill } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "One at a time, never cut off", description: "Open the Status filter, then the menu: the first closes. Each opens 4px from its trigger, flips and shifts to stay 8px inside the screen, and Esc returns focus to the trigger.", order: 1 };

const OPTIONS = ["Open", "Closing soon", "Draft", "Closed"].map((v) => ({ value: v, label: v }));

export default function Example() {
	const [status, setStatus] = useState<string[]>([]);
	return (
		<div className="flex w-full items-center justify-between gap-3">
			<FilterBar><FilterPill field="Status" options={OPTIONS} selected={status} onChange={setStatus} /></FilterBar>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="outline" size="sm">Actions</Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end"><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
```

## Related

- Dropdown menu
- Tooltip
- Button
