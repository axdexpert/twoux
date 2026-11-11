# Date picker

Enter a calendar date, or a range of dates, by typing it or choosing it on a calendar: a closing date, a start date, a reporting period.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- For a date people set on a record: closing date, start date, contract end.
- For a period that narrows a list or a chart: applications in the last 30 days, a quarter for a report.
- When people need to see the weekday or the week around a date, such as booking around weekends.

## When not to use

- For a date people know by heart and never browse to, such as a date of birth. Use a Text input (text-input) with the hint dd/mm/yyyy.
- For booking or moving events in time. Use the Scheduler (scheduler).
- For a chart's fixed period options such as Daily or Weekly. Use a Segmented control (segmented-control).
- To show a date. Use Timestamp (timestamp).

## Structure

1. Label
2. Field: the date as dd/mm/yyyy (From and To for a range)
3. Calendar button ("Choose date")
4. Popover: preset periods (range, optional), month heading, previous and next month, grid starting on Monday
5. Footer: why some dates are unavailable (optional)
6. Hint or error under the field

## Guidelines

- Typing is the main path: the field accepts 12/03/2026, 12/3/26, 12 Mar 2026 and 2026-03-12, and rewrites the value as 12/03/2026 when people leave it, so they see how it was read.
- The calendar is the second path: the button at the end of the field, or Alt+↓ in the field. It opens on the value's month, otherwise today's.
- Values are ISO calendar dates ("2026-03-12"), never a Date at midnight UTC, so they match Timestamp and don't land on the day before west of London.
- Weeks start on Monday and month and weekday names are UK English.
- Say why dates are unavailable in the footer, such as "Closing dates must be on a weekday." Unavailable days are skipped by the arrow keys.
- A range shows two months side by side from 768px, one below. The first pick sets the start, the second the end; days between are filled as people point or move.
- Preset periods (Last 7 days, Last 30 days, This month…) apply at once. In a filter they are stored by name, so a saved view still means "last 30 days" next month. In a filter bar use DateFilterPill, which reads as a sentence like other filter pills: Applied is in Last 30 days.
- Check the value when people leave the field and on submit; show the error under the field, never in a toast.

## Content

- The hint is the format: dd/mm/yyyy. Add a reason only when it helps: "The last day applications are accepted."
- Errors say what to do: "Enter the closing date as dd/mm/yyyy, such as 12/03/2026.", "Choose a date on or after 7 December 2026.", "The end date is before the start date. Change one of them."
- Preset names say the period: Last 7 days, This month, Last quarter.

## Accessibility

- The popover is a dialog named "Choose date". The grid's day buttons have full names: "Thursday 12 March 2026", with "Today" and "selected" added.
- The month heading is a polite live region, so changing month is read out.
- Focus moves to the selected day, or today, when the calendar opens, and back to the field when it closes.
- Today has a ring and the selected day a fill, and both are named, so neither relies on colour alone.
- Day cells are 32px, above the 24px minimum target.

## Keyboard

| Keys | Action |
|---|---|
| Alt+↓ | Open the calendar from the field |
| Enter (in the field) | Read the typed date |
| ← → ↑ ↓ | Previous or next day; same day in the previous or next week |
| Home / End | Start or end of the week |
| Page Up / Page Down | Previous or next month (Shift for the year) |
| Enter or Space | Choose the focused day |
| Esc | Close the calendar without changing the value; focus returns to the field |

## Examples

### closing-date

```tsx
import { DatePicker, fromIsoDate } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Closing date", description: "Type the date, or press Alt+↓ or the calendar button. Weekends and past dates can't be chosen, and the calendar says why.", order: 1 };

const today = new Date();
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Example() {
	const [value, setValue] = useState<string | null>(null);
	return (
		<div className="w-72">
			<DatePicker
				label="Closing date"
				value={value}
				onValueChange={setValue}
				min={iso(today)}
				isDateUnavailable={(d) => [0, 6].includes(fromIsoDate(d).getDay())}
				unavailableReason="Closing dates must be on a weekday."
				hint="The last day applications are accepted. dd/mm/yyyy"
				required
			/>
		</div>
	);
}
```

### filter-pill

```tsx
import { DateFilterPill, type DateRangeValue, FilterBar, FilterPill, FilterSummary, dateFilterToValues, describeDateFilter } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "In a filter bar", description: "DateFilterPill sits beside FilterPill and reads as a sentence. Presets and calendar ranges apply at once; typed dates apply on Enter. The value is stored as URL-safe strings.", order: 3 };

const STAGES = [{ value: "screen", label: "Screen", count: 42 }, { value: "interview", label: "Interview", count: 18 }, { value: "offer", label: "Offer", count: 4 }];

export default function Example() {
	const [stages, setStages] = useState(["interview"]);
	const [applied, setApplied] = useState<DateRangeValue>({ preset: "last-30-days" });
	const [closing, setClosing] = useState<DateRangeValue>({});
	const d = describeDateFilter(applied);
	return (
		<div className="grid max-w-full gap-3">
			<FilterBar>
				<FilterPill field="Stage" options={STAGES} selected={stages} onChange={setStages} onRemove={() => setStages([])} />
				<DateFilterPill field="Applied" value={applied} onChange={setApplied} onRemove={() => setApplied({})} />
				<DateFilterPill field="Closing date" value={closing} onChange={setClosing} presets={[]} />
			</FilterBar>
			<FilterSummary shown={12} total={64} noun="candidates" onClear={() => { setStages([]); setApplied({}); setClosing({}); }} />
			<p className="text-sm text-ink-3">
				URL: <code className="tabular">?applied={dateFilterToValues(applied).join(",") || "—"}</code>
				{d && <> · Applied {d.operator} {d.spoken}</>}
			</p>
		</div>
	);
}
```

### range-presets

```tsx
import { DateRangePicker, type DateRangeValue, resolveDateRange, formatDateLong } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Range with presets", description: "Pick a preset or two dates. A preset is kept by name, so a saved view still means last 30 days next month.", order: 2 };

export default function Example() {
	const [value, setValue] = useState<DateRangeValue>({ preset: "last-30-days" });
	const { from, to } = resolveDateRange(value);
	return (
		<div className="grid w-80 gap-3">
			<DateRangePicker label="Applied" value={value} onValueChange={setValue} presets maxDays={366} />
			<p className="text-sm text-ink-2">
				{from && to ? <>Showing applications from {formatDateLong(from)} to {formatDateLong(to)}.</> : "Choose a period."}
			</p>
		</div>
	);
}
```

### states

```tsx
import { DatePicker } from "@twoux/ui";

export const meta = { title: "States", description: "The error says what to do. Read-only keeps the date selectable and drops the calendar.", order: 4 };

const noop = () => {};

export default function Example() {
	return (
		<div className="grid w-72 gap-4">
			<DatePicker label="Start date" value={null} onValueChange={noop} required error="Enter a start date." />
			<DatePicker label="Contract end" value="2027-03-31" onValueChange={noop} readOnly />
			<DatePicker label="Probation review" value="2026-12-07" onValueChange={noop} disabled />
		</div>
	);
}
```

## Related

- Text input
- Timestamp
- Filter pills and filter bar
- Scheduler
- Form validation
