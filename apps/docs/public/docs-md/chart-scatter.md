# Scatter chart

One dot per record placed by two measures, such as each live listing by advertised salary and applications, for spotting relationships and outliers.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- When the question is whether two measures move together across records: salary and applications per listing, or days open and applications.
- When outliers matter: a listing with a high salary and few applications is worth opening.

## When not to use

- For change over time. Use the Line chart card.
- For fewer than about ten records. Use a Breakdown table; a scatter of five dots shows no pattern.
- To compare candidates. Plotting people by scores invites ranking them; candidate decisions stay with the hiring team and are never made from a chart.
- To encode a third measure as dot size. Use a second scatter or a table instead.

## Structure

1. Title and subtitle
2. Plot: x-axis and y-axis, each with a title and unit
3. Dots, one per record (up to three groups by colour and shape)
4. Optional threshold lines with text labels
5. Legend when there are two or more groups
6. Details popover: the record's name and both values, with a link to it

## Guidelines

- Each axis has a title with its unit; axes may start above zero if the axis says so, because position, not length, carries the value.
- Use at most three groups, coloured with categorical colours 1 to 3 and each with its own marker shape (circle, square, triangle), since any dot can touch any other.
- Keep dots small (6px) with a 1px surface-colour outline so overlapping dots stay visible.
- Selecting a dot opens the details popover with the listing's name, both values and a link to the record.
- Do not draw a trend line unless the team asked for one and its method is named in the footer.

## Content

- Title names both measures: "Salary and applications by listing". Subtitle gives the scope: "Live listings, last 30 days".
- Axis titles are short with units: "Salary (£k)", "Applications".
- Popover reads as key and value pairs: "Junior Product Designer, Leeds", "Salary £32k", "Applications 46".

## Accessibility

- Description: "Scatter chart showing salary and applications for 38 live listings, last 30 days." The Table view lists every record with both values.
- Groups differ by marker shape as well as colour.
- Arrow keys move from dot to dot in x order and open each popover; a pinned popover stays until Esc.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the plot, then the legend |
| ← → | Move to the previous or next dot along the x-axis |
| Enter | Pin the popover and reach its link |
| Esc | Close the popover |

## Examples

### salary-applicants

```tsx
import { ChartFrame, ScatterChart } from "@twoux/ui";

export const meta = { title: "Salary against applicants", description: "One dot per listing, up to three teams, each with its own colour and shape. Arrow keys move along the x axis; Enter pins the details with a link to the listing.", order: 1 };

const P = [
	["Junior Product Designer", 30, 38, "Design"], ["Senior Product Designer", 58, 37, "Design"], ["Content Designer", 42, 21, "Design"],
	["Frontend Engineer", 52, 112, "Engineering"], ["Backend Engineer", 60, 64, "Engineering"], ["QA Engineer", 40, 47, "Engineering"], ["Platform Engineer", 68, 29, "Engineering"],
	["Data Analyst", 41, 64, "Data"], ["Analytics Engineer", 55, 33, "Data"], ["Data Scientist", 62, 41, "Data"],
] as const;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Salary and applicants" description="Open listings, salary from in £000s">
			<ScatterChart aria-label="Salary against applicants by team" xTitle="Salary from (£000s)" yTitle="Applicants" points={P.map(([label, x, y, group], i) => ({ id: String(i), label, x, y, group, href: "#listing" }))} />
		</ChartFrame>
	);
}
```

## Related

- Line chart card
- Breakdown table
- Data visualisation colours
- Chart drill-down
- Data visualisation
