# Loading skeleton

Grey placeholder rows that keep the table or panel's shape while data loads.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- First load of a table, list or panel whose layout is known.
- Loads that take roughly 1 to 10 seconds.
- Several parts of a view load at once and each can fill in as it arrives.

## When not to use

- Loads under 1 second. Show nothing and render the data.
- A single action in progress, such as Apply or Run. Use the button's inline spinner.
- Work over 10 seconds or with known progress, such as an agent run. Use a progress indicator with a count ("2 / 5").
- Popovers, menus, toasts or dialogs, whose content should already be loaded.

## Structure

1. Region header kept ("Loading listings…")
2. Skeleton rows at the real row height (36px)
3. Bars per column: checkbox, title, secondary, right-aligned figure
4. Shimmer animation (off with reduced motion)

## Guidelines

- Match the real layout: same row height, same column positions, varied bar widths so it reads as text, numbers on the right.
- Keep the header, filters and page actions live; only the data region shows the skeleton.
- Replace the skeleton as soon as data arrives, section by section where possible.
- Never combine a skeleton with a spinner in the same region.
- Shimmer runs at 1.4 s per cycle and stops when prefers-reduced-motion is set.
- If loading fails, swap to the Error state in the same space.

## Content

- The region header says what is loading, short, without articles: "Loading listings…".
- No other text inside the skeleton; it holds space, it does not explain.
- Never rely on a bare "Loading…" message alone for longer waits; the skeleton shows where the data will appear, and long runs show a count.

## Accessibility

- Mark the region aria-busy while loading and give it a label ("Loading listings"); skeleton bars are hidden from assistive technology.
- Do not announce every load; announce only the result, such as the row count, through a polite live region (4.1.3).
- Shimmer shown next to usable content must stop within 5 seconds or be pausable; TwoUX's reduced-motion setting stops it (2.2.2, 2.3.3).

## Keyboard

| Keys | Action |
|---|---|
| None | No keyboard interaction; filters and page actions stay usable while it loads |

## Examples

### table

```tsx
import { Skeleton } from "@twoux/ui";

export const meta = { title: "Table rows", description: "Rows keep the real 36px height and column positions. Bars vary in width so they read as text; the figure sits on the right. The header stays live.", order: 1 };

const WIDTHS = ["w-40", "w-52", "w-36", "w-48", "w-44"];

export default function Example() {
	return (
		<div className="w-full max-w-xl overflow-hidden rounded-sm border border-line bg-surface" aria-busy="true" aria-label="Loading listings">
			<div className="grid h-9 grid-cols-[16px_1fr_96px_64px] items-center gap-3 border-b border-line bg-surface-2 px-3 text-sm font-medium text-ink-2">
				<span />
				<span>Listing</span>
				<span>Location</span>
				<span className="text-right">Applicants</span>
			</div>
			{WIDTHS.map((w, i) => (
				<div key={w + i} className="grid h-9 grid-cols-[16px_1fr_96px_64px] items-center gap-3 border-b border-line px-3 last:border-b-0">
					<Skeleton className="size-3.5" />
					<Skeleton className={`h-2.5 ${w}`} />
					<Skeleton className="h-2.5 w-16" />
					<Skeleton className="ml-auto h-2.5 w-6" />
				</div>
			))}
		</div>
	);
}
```

## Related

- Empty state
- Error state (failed to load)
- Side panel (drawer)
