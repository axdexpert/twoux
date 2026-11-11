# Timestamp

One component for every date and time in the product: relative or absolute display, the exact value on hover and focus, and an optional "by" source.

Kind: component · Group: Content · Status: built, import from @twoux/ui

## When to use

- Every time a date or time appears: table columns, side panel details, activity, Inbox items, "Last updated" after a refresh.
- format="relative" for recent past events in lists; format="absolute" for details and deadlines; format="iso" for code and exports.
- source="Priya Shah" when it matters who made the change, such as Last edited on a listing.

## When not to use

- For date entry. Use a date input.
- For durations, such as "Time to hire: 18 days"; that is a number with a unit, not a timestamp.
- For a date with no time that is a property of the record, such as a start date. Show it as an absolute date.

## Structure

1. Optional label, when not given by a column header or key: "Last edited"
2. Value: relative ("3 hours ago") or absolute ("6 November 2026, 14:32 GMT")
3. Optional source: "by Priya Shah", linked to the profile, with "via Assistant" when applied from a proposal
4. Tooltip with the absolute value on hover and focus

## Guidelines

- Renders a <time> element with the ISO 8601 value in datetime.
- Relative values tick over once a minute; they never animate or announce.
- Time zone is the viewer's own and is always shown on absolute values.
- In compact table cells, `short` shows "3h ago" or "20 Nov"; the tooltip and accessible name keep the full form.
- Future deadlines use absolute dates, optionally followed by relative time in muted text.
- Give deadlines, start dates and due dates as a date with no time (2026-12-07). They show as 7 December 2026, with no time or zone, and fall on the same day in every time zone.

## Content

- Relative: "Just now", "5 minutes ago", "3 hours ago", "2 days ago", "In 3 days".
- Absolute: day, month in full, year, 24-hour time, zone: "6 November 2026, 14:32 GMT".
- Source: "Edited 6 hours ago by Priya Shah".

## Accessibility

- The accessible description carries the absolute value, so screen reader users don't need the tooltip.
- The tooltip appears on focus of the cell or link that contains the timestamp, without adding a separate tab stop.
- Never put a ticking relative time in a live region.

## Keyboard

| Keys | Action |
|---|---|
| Tab or arrows (to the containing cell or link) | Show the absolute time tooltip |
| Esc | Hide the tooltip |
| Tab (to a source link) | Move to the person's profile link |

## Examples

### times

```tsx
import { Timestamp } from "@twoux/ui";

export const meta = { title: "Relative, short and absolute", description: "Relative in lists, with the full date and time zone on hover or focus. Short units in compact cells. Deadlines are always absolute.", order: 1 };

const ago = (m: number) => new Date(Date.now() - m * 60000);

export default function Example() {
	return (
		<dl className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-base">
			<dt className="text-ink-2">Last edited</dt><dd><Timestamp value={ago(180)} by={<a href="#priya" className="font-medium text-primary-ink hover:underline">Priya Shah</a>} /></dd>
			<dt className="text-ink-2">In a table cell</dt><dd><Timestamp value={ago(60 * 26)} short /></dd>
			<dt className="text-ink-2">Closing date</dt><dd><Timestamp value="2026-12-04T17:00:00Z" format="absolute" /></dd>
			<dt className="text-ink-2">Applied via Assistant</dt><dd><Timestamp value={ago(12)} by={<span>Tom Becker via Assistant</span>} /></dd>
		</dl>
	);
}
```

## Related

- Timestamps
- List table
- Side panel (drawer)
- Tooltip
- Unsaved changes
