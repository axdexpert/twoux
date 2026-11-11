# Button

Starts an action on the current page, such as saving, exporting or opening a menu.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To start an action on the current page: New listing, Export, Save view.
- To open a menu or popover of more actions, with a chevron on the right.
- For the one step most people take next in a view, using the primary style.
- As an icon-only ghost button for frequent, well-known row actions where space is tight.

## When not to use

- To go to another page or URL. Use a link (button-link style) instead.
- To switch between views of the same data. Use the Segmented control.
- To turn a setting on or off. Use a Switch, not a button whose label flips.
- For a long set of secondary actions on one object. Group them in a Dropdown menu.

## Structure

1. Container
2. Icon (optional)
3. Label
4. Shortcut hint (optional)
5. Chevron (menu buttons only)

## Guidelines

- Seven variants, using shadcn names: default (the primary), outline (white with a light border), secondary (grey fill), ghost (no fill until hover), warning (risky but reversible, a TwoUX addition), destructive (red, inside a confirmation) and link. Pick by importance in the view, not by looks.
- Only one primary button per view. In a dialog or side panel with its own task, that container may have its own primary.
- Four sizes: 24px inside rows, 28px in toolbars and filter bars, 32px by default, 36px only for the single action of an empty state or sign-in page. Icon-only buttons are square at the same height.
- States: default, hover, focus (2px primary ring with a 2px white gap), pressed, disabled (45% opacity), loading.
- Avoid disabled buttons in forms. Keep Publish pressable and show what is missing through validation.
- When a button must be disabled, give the reason in a tooltip or nearby text.
- While an action runs, use loading: the spinner replaces the leading icon, the button ignores clicks and stays focusable, so it cannot be pressed twice and keyboard users keep their place.

## Content

- Start with a verb and say what happens: Publish listing, Export 2 rows, Close listings.
- Sentence case, no full stop, no articles: Save view, not Save The View.
- Two to four words. Add the object for destructive actions: Delete listing, not Delete.
- Add an ellipsis when the action needs more input before it runs: Extend to a date…
- Never OK or Yes in a dialog. Name both outcomes: Close listings and Keep open.

## Accessibility

- Use a native button element. Enter and Space activate it.
- Icon-only buttons need an aria-label naming the action, plus a tooltip showing the same words.
- The accessible name must contain the visible label so voice users can say what they see.
- Focus ring and secondary border need at least 3:1 against the background; label text at least 4.5:1, white on primary included.
- The 28px small button meets the 24px minimum target. Do not shrink icon buttons below 24px.
- Menu buttons set aria-haspopup and aria-expanded.

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space | Activate the focused button |
| Shortcut shown on the button | Run the action from anywhere in the view |

## Examples

### disabled

```tsx
import { Button } from "@twoux/ui";

export const meta = {
	title: "Disabled",
	description: "Prefer leaving the button enabled and explaining what is missing when pressed. Disable only when the reason is visible next to it.",
	order: 6,
};

export default function Example() {
	return (
		<div className="flex flex-col items-start gap-1.5">
			<Button variant="default" disabled>
				Run task
			</Button>
			<span className="text-sm text-bad">Choose who gets the titles before you run this.</span>
		</div>
	);
}
```

### icon-only

```tsx
import { Button } from "@twoux/ui";
import { MoreHorizontal, Pencil, X } from "lucide-react";

export const meta = {
	title: "Icon only",
	description: "For well-known actions in dense places. The aria-label names the action and its target, not the icon, and a tooltip shows the same words.",
	order: 7,
};

export default function Example() {
	return (
		<div className="flex items-center gap-4">
			<Button variant="ghost" size="icon-xs" aria-label="Edit Junior Product Designer" title="Edit"><Pencil /></Button>
			<Button variant="ghost" size="icon-sm" aria-label="More actions for this listing" title="More actions"><MoreHorizontal /></Button>
			<Button variant="ghost" size="icon" aria-label="Close details" title="Close (Esc)"><X /></Button>
		</div>
	);
}
```

### icons

```tsx
import { Button } from "@twoux/ui";
import { ChevronDown, ExternalLink, Plus } from "lucide-react";

export const meta = {
	title: "With icons",
	description: "An icon before the label clarifies the action. An icon after it says what happens next: a chevron opens a menu, an arrow leaves the app.",
	order: 4,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button variant="default"><Plus />New listing</Button>
			<Button variant="outline">Status<ChevronDown /></Button>
			<Button variant="ghost">View public page<ExternalLink /></Button>
		</div>
	);
}
```

### loading

```tsx
import { Button } from "@twoux/ui";
import { useState } from "react";

export const meta = {
	title: "Loading",
	description: "While an action runs, the button shows a spinner and ignores clicks but stays focusable, so keyboard users keep their place. Press it to try.",
	order: 6,
};

export default function Example() {
	const [busy, setBusy] = useState(false);
	return (
		<div className="flex items-center gap-2">
			<Button variant="default" loading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1800); }}>
				{busy ? "Publishing…" : "Publish listing"}
			</Button>
			<Button variant="outline" size="sm" loading>Saving…</Button>
		</div>
	);
}
```

### matrix

```tsx
import { Button } from "@twoux/ui";

export const meta = { title: "All sizes and variants", description: "Every combination, for checking alignment. Rows share a baseline at each size.", order: 9 };

const variants = ["default", "outline", "secondary", "ghost", "warning", "destructive"] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;

export default function Example() {
	return (
		<div className="grid grid-cols-[auto_repeat(6,auto)] items-center gap-x-3 gap-y-3">
			<span />
			{variants.map((v) => (
				<span key={v} className="text-sm text-ink-3">{v}</span>
			))}
			{sizes.map((s) => (
				<div key={s} className="contents">
					<span className="font-mono text-sm text-ink-3">{s}</span>
					{variants.map((v) => (
						<Button key={v} size={s} variant={v}>Button</Button>
					))}
				</div>
			))}
		</div>
	);
}
```

### primary

```tsx
import { Button } from "@twoux/ui";
import { Plus } from "lucide-react";

export const meta = {
	title: "One primary action per view",
	description: "The main action of the page is the only indigo button. Everything else is secondary or ghost.",
	order: 1,
};

export default function Example() {
	return (
		<div className="flex items-center gap-2">
			<Button variant="outline">Export</Button>
			<Button variant="default" shortcut="C"><Plus />
				New listing
			</Button>
		</div>
	);
}
```

### shortcut

```tsx
import { Button } from "@twoux/ui";
import { Clock, Copy } from "lucide-react";

export const meta = {
	title: "With keyboard shortcut",
	description: "Every frequent action shows its key, so people learn it by using it. The key is also in the tooltip for screen readers.",
	order: 4,
};

export default function Example() {
	return (
		<div className="flex items-center gap-1 rounded-sm bg-surface p-1 shadow-pop">
			<Button variant="ghost" size="sm" shortcut="T" title="Extend 30 days (T)"><Clock />
				Extend 30 days
			</Button>
			<Button variant="ghost" size="sm" shortcut="D" title="Duplicate (D)"><Copy />
				Duplicate
			</Button>
		</div>
	);
}
```

### sizes

```tsx
import { Button } from "@twoux/ui";
import { Download } from "lucide-react";

export const meta = {
	title: "Sizes",
	description: "Four compact sizes. 32px is the default. 28px in toolbars and filter bars, 24px inside table rows, 36px only for the single action of an empty state or sign-in page.",
	order: 3,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button size="xs" variant="outline"><Download />Export</Button>
			<Button size="sm" variant="outline"><Download />Export</Button>
			<Button variant="outline"><Download />Export</Button>
			<Button size="lg" variant="outline"><Download />Export</Button>
		</div>
	);
}
```

### variants

```tsx
import { Button } from "@twoux/ui";

export const meta = {
	title: "Variants",
	description: "Primary for the one main action, secondary for supporting actions, tertiary in toolbars and rows, warning for risky but reversible actions, destructive only inside a confirmation, link for navigation.",
	order: 2,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button variant="default">Publish listing</Button>
			<Button variant="outline">Save draft</Button>
			<Button variant="ghost">Cancel</Button>
			<Button variant="warning">Close early</Button>
			<Button variant="destructive">Delete listing</Button>
			<Button variant="link">View all listings</Button>
		</div>
	);
}
```

## Related

- Keyboard shortcut hint
- Dropdown menu
- Tooltip
- Form validation
