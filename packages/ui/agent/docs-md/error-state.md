# Error state (failed to load)

Shown in place of a region that failed to load: what failed, that nothing was lost, and Try again.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- A table, list, chart or panel could not fetch its data.
- Only one region fails while the rest of the page works; the error stays inside that region.
- The person lacks permission to see a region's data.

## When not to use

- An action failed (save, extend, close). Show a Banner near the action and keep the person's input.
- Field validation. Use the inline field error and the form error strip (Banner).
- Nothing matched the filters. That is an Empty state, not an error.

## Structure

1. Region header kept ("Listings")
2. Icon tile in the error colour
3. Title: what failed ("Couldn't load listings")
4. Description: why if known, and what is kept
5. Try again button (secondary) with its shortcut R
6. Optional: expandable technical details

## Guidelines

- Replace only the failed region, at the same size, so the header, filters and other regions stay usable.
- Keep the person's filters, sort and selection; say so in the message.
- Offer one action, Try again, which re-runs the same request.
- Retrying swaps back to the Loading skeleton, then to data or the error again.
- Put raw error codes in an expandable details section, never in the main message.

## Content

- Title says what failed in plain words: "Couldn't load listings".
- Description says why if known and what is safe: "The server didn't respond. Your filters are kept."
- Take ownership; never imply the person caused it.
- No apologies, jokes or exclamation marks. Do not promise that a team has been told unless that is true.

## Accessibility

- The error is identified in text, not only by the red icon (3.3.1, 1.4.1).
- Announce the failure once through a live region; do not move focus unless the person triggered the load (4.1.3).
- After Try again succeeds, keep focus on a stable element such as the region header, not on the removed button (2.4.3).

## Keyboard

| Keys | Action |
|---|---|
| R | Try again (single-key shortcut, can be turned off) |
| Tab / Enter | Reach and activate Try again |

## Examples

### table

```tsx
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Skeleton } from "@twoux/ui";
import { CircleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const meta = { title: "Table failed to load", description: "Only the table is replaced; the header stays. Try again (or R) swaps back to the skeleton, then to the data or the error. Technical details stay folded away.", order: 1 };

export default function Example() {
	const [loading, setLoading] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const retry = useCallback(() => {
		setLoading(true);
		setTimeout(() => setLoading(false), 1200);
	}, []);

	// R retries while focus is inside this region and not in a text field
	useEffect(() => {
		const el = ref.current;
		const onKey = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey && !loading && !(e.target as HTMLElement).closest("input, textarea")) retry();
		};
		el?.addEventListener("keydown", onKey);
		return () => el?.removeEventListener("keydown", onKey);
	}, [loading, retry]);

	return (
		<div ref={ref} className="grid w-full max-w-xl gap-2">
			<span className="text-base font-medium text-ink">Listings</span>
			{loading ? (
				<div className="grid min-h-56 content-start gap-0 overflow-hidden rounded-sm border border-line" aria-busy="true" aria-label="Loading listings">
					{["w-40", "w-52", "w-36", "w-48", "w-44", "w-32"].map((w) => (
						<div key={w} className="flex h-9 items-center gap-3 border-b border-line px-3 last:border-b-0">
							<Skeleton className={`h-2.5 ${w}`} />
							<Skeleton className="ml-auto h-2.5 w-6" />
						</div>
					))}
				</div>
			) : (
				<Empty className="min-h-56 border-solid border-line">
					<EmptyHeader>
						<EmptyMedia variant="error"><CircleAlert /></EmptyMedia>
						<EmptyTitle>Couldn't load listings</EmptyTitle>
						<EmptyDescription>The server took too long to reply. Your filters are kept.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" size="sm" shortcut="R" onClick={retry}>Try again</Button>
						<details className="text-sm text-ink-3">
							<summary className="cursor-pointer rounded-xs hover:text-ink-2">Technical details</summary>
							<code className="mt-1 block font-mono">504 Gateway Timeout · GET /listings · req 7f3a91</code>
						</details>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}
```

## Related

- Loading skeleton
- Empty state
- Banner (inline alert)
- Toast
