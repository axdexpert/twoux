# Tooltip

Shows a short, non-essential label or hint on hover or focus, such as an icon button's name and its shortcut.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To name an icon-only button: More, Add to Interviewing.
- To show the shortcut for a control: Search listings /.
- To show the full text of a truncated value, or the exact date behind a relative date.
- To give a short reason why a control is disabled.

## When not to use

- For anything needed to finish the task, such as format rules. Use hint text under the field.
- For links, buttons or more than a sentence. Use a popover.
- On labelled buttons, repeating the label.
- On status badges or other non-interactive elements.

## Structure

1. Dark container (6px radius)
2. Text
3. Shortcut hint (optional)

## Guidelines

- Dark ink background, white 12px medium text, 5 x 8px padding, 6px radius.
- Appears after a short delay (about 500ms) on hover or keyboard focus, so it does not flicker.
- Stays while the pointer is over the trigger or the tooltip, until Esc or blur.
- Placed so it never covers the thing it describes, and flips to stay on screen.
- One line; never truncated.

## Content

- A few words, no full stop: Search listings.
- For icon buttons, name the action in one or two words.
- Use the same words as the accessible name.

## Accessibility

- role="tooltip", referenced by the trigger's aria-describedby. Focus stays on the trigger.
- Esc dismisses it without moving focus; the pointer can move onto it; it does not time out.
- A tooltip does not give an icon button its name; the button also needs aria-label.
- Only on focusable triggers, so keyboard users see it too.
- Shortcuts in tooltips are hidden from assistive technology; list them in the shortcut sheet as well.

## Keyboard

| Keys | Action |
|---|---|
| Tab to trigger | Show the tooltip |
| Esc | Hide the tooltip |

## Examples

### icon-buttons

```tsx
import { Button, Kbd, Tooltip, TooltipContent, TooltipTrigger } from "@twoux/ui";
import { Bell, Pencil, X } from "lucide-react";

export const meta = { title: "Name an icon button", description: "Hover or Tab to a button. The tooltip repeats the accessible name and its shortcut. It never holds information found nowhere else.", order: 1 };

export default function Example() {
	return (
		<div className="flex items-center gap-2">
			<Tooltip>
				<TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Edit listing"><Pencil /></Button></TooltipTrigger>
				<TooltipContent>Edit listing <Kbd>E</Kbd></TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Inbox"><Bell /></Button></TooltipTrigger>
				<TooltipContent>Inbox</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Close details"><X /></Button></TooltipTrigger>
				<TooltipContent side="bottom">Close details <Kbd>Esc</Kbd></TooltipContent>
			</Tooltip>
		</div>
	);
}
```

## Related

- Button
- Keyboard shortcut hint
- Popover rules
