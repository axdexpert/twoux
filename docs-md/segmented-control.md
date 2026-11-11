# Segmented control

Switches between two or three views or settings of the same content, such as All, Active and Backlog.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To switch how the same data is shown or filtered: All / Active / Backlog, Chart / Table.
- For a view setting that always has a value: Rows per page 25 / 50 / 100, Daily / Weekly.
- When there are two or three short options and room to show them.

## When not to use

- For separate sections of a record. Use Tabs.
- For more than three options. Use a Dropdown menu or select.
- For an on/off setting. Use Switch.
- For choices inside a form that is saved later. Use Radio.

## Structure

1. Group label (often visually hidden)
2. Track
3. Segment buttons
4. Selected segment (white, raised)

## Guidelines

- Track is grey with a 2px inset; segments are 24px high, 12px medium text; selected segment is white with a hairline shadow.
- The change applies immediately, like a switch.
- Equal weight for all segments; one is always selected.
- Deactivate at most one segment, and give the reason in a tooltip.

## Content

- One word per segment where possible.
- Sentence case, parallel words: All, Active, Backlog.
- Icon-only segments need alternative text naming the view.

## Accessibility

- TwoUX renders it as a group of toggle buttons: role="group" with aria-label, each button with aria-pressed.
- Every segment label stays the same when pressed; state comes from aria-pressed.
- Segments are 24px high, exactly the WCAG 2.5.8 minimum; do not make them smaller.
- The selected segment differs by fill and shadow, with 3:1 against the track.
- Visible focus ring on each segment.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to each segment |
| Enter / Space | Select the focused segment |

## Examples

### views

```tsx
import { Segment, SegmentedControl } from "@twoux/ui";
import { List, Rows3 } from "lucide-react";
import { useState } from "react";
export const meta = {"title": "Views of the same data", "description": "Two or three options, one always selected. Switches how the same list is shown; it never navigates.", "order": 1};

export default function Example() {
	const [v, setV] = useState("active");
	const [d, setD] = useState("list");
	return (
		<div className="flex flex-wrap items-center gap-4">
			<SegmentedControl aria-label="Listings to show" value={v} onValueChange={setV}>
				<Segment value="all">All</Segment>
				<Segment value="active">Active</Segment>
				<Segment value="closed">Closed</Segment>
			</SegmentedControl>
			<SegmentedControl aria-label="Layout" size="sm" value={d} onValueChange={setD}>
				<Segment value="list" aria-label="List"><List /></Segment>
				<Segment value="board" aria-label="Board"><Rows3 /></Segment>
			</SegmentedControl>
		</div>
	);
}
```

## Related

- Tabs (underline)
- Radio
- Switch
