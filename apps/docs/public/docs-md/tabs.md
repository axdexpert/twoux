# Tabs (underline)

Splits one record or page into sections such as Overview, Candidates and Activity, one visible at a time.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To split a record into separate sections people do not need side by side: Overview, Candidates, Activity.
- When each section is substantial and can have its own URL.
- With a count when the number helps people decide to open the tab: Candidates 42.

## When not to use

- To switch between views of the same data, such as All / Active. Use Segmented control.
- For steps in a flow. Use a stepper or separate pages.
- When people must compare content across sections. Show it on one page.
- For app navigation. Use the sidebar.

## Structure

1. Tab list with bottom rule
2. Tab label
3. Count (optional)
4. Active underline (2px primary)
5. Tab panel

## Guidelines

- Single row, 20px gap, 13px medium labels. Active tab gets primary text and a 2px primary underline: two cues, not one.
- Two to seven tabs. Order by use, most used first; the first tab is the default.
- No nested tabs and no disabled tabs; hide a tab that does not apply.
- If tabs overflow on narrow screens, the list scrolls sideways; it never wraps to a second row.
- Put shared headings and actions above the tab list, not inside one panel.

## Content

- One or two words, nouns, sentence case: Activity, not View all activity.
- Labels must not overlap in meaning.
- Counts need screen reader text: 42 candidates, not just 42.

## Accessibility

- role="tablist" with a label, role="tab" with aria-selected and aria-controls, role="tabpanel" labelled by its tab.
- Tab enters the list on the active tab; Left and Right arrows move between tabs; Home and End jump.
- Panels load instantly, so tabs activate on focus (automatic activation).
- The underline indicator has 3:1 against white.
- Tab hit area is the full label height (about 36px), above the 24px minimum.

## Keyboard

| Keys | Action |
|---|---|
| Left / Right | Previous or next tab |
| Home / End | First or last tab |
| Tab | Move from the tab list into the panel |

## Examples

### underline

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@twoux/ui";
export const meta = {"title": "Sections of one record", "description": "Underline tabs split one page into sections. Counts help people decide where to go. Arrow keys switch tabs.", "order": 1};

export default function Example() {
	return (
		<Tabs defaultValue="overview" className="w-full max-w-lg">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="candidates" count={54}>Candidates</TabsTrigger>
				<TabsTrigger value="activity">Activity</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="text-ink-2">Views, applies and the funnel for this listing.</TabsContent>
			<TabsContent value="candidates" className="text-ink-2">54 people applied. 16 are shortlisted.</TabsContent>
			<TabsContent value="activity" className="text-ink-2">Edited by Rahul S. 2 days ago.</TabsContent>
		</Tabs>
	);
}
```

## Related

- Segmented control
- Status badge
