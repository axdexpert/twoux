# Usage meter

Credits or seats used against a limit, when it resets, and what used them. An upgrade link appears only near the limit.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Showing consumption against a plan limit, such as credits or seats.
- A measured value within a known range.

## When not to use

- Progress of a task. Use a progress indicator (nng-progress).
- A permanent plan promotion. Upgrade is not an always-visible bright button.

## Structure

1. Name of the unit and "used of limit"
2. Meter bar
3. Warning from 80% (what stops at the limit)
4. Resets date
5. What used them link
6. Add more link (only near the limit)

## Guidelines

- Say "13.2k of 20k credits": used, limit and unit.
- Say when it resets, for example "Resets 1 Dec".
- Link "What used them" to a breakdown, so people can reduce usage.
- From 80% used, warn and say what stops at the limit: "Agents pause until 1 Dec".
- Show the upgrade link only near the limit. Never a permanent bright button.
- Use role="meter" with min, max and now values, and a name.
- Never use colour alone: the warning has an icon and words as well as the amber bar.

## Content

- "86% used. Agents pause until 1 Dec."
- Link: "Add more", not "Upgrade now".

## Accessibility

- role="meter" with aria-valuemin, aria-valuemax, aria-valuenow and an accessible name (APG meter, SC 4.1.2).
- Warning is text with an icon, so it does not depend on colour (SC 1.4.1).
- The bar meets 3:1 against its track (SC 1.4.11).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to What used them and Add more |
| Enter | Open the breakdown or the upgrade options |

## Examples

### states

```tsx
import { toast, UsageMeter } from "@twoux/ui";

export const meta = { title: "Plenty, close, and at the limit", description: "The upgrade link appears from 80% used, and the warning says what stops. Colour is never the only signal.", order: 1 };

export default function Example() {
	const common = { unit: "credits", limit: 20000, resets: "1 Dec", atLimit: "Agents pause until 1 Dec", onDetails: () => toast("Opens the usage breakdown"), onUpgrade: () => toast("Opens the plans") };
	return (
		<div className="grid w-full max-w-xs gap-6">
			<UsageMeter {...common} used={8400} />
			<UsageMeter {...common} used={17200} />
			<UsageMeter {...common} used={20000} />
		</div>
	);
}
```

## Related

- Stat card with comparison
- Banner (inline alert)
- Empty state
- Status badge
