# Run status bar

The bottom bar of a sheet: Table up to date, or how far the run is with a meter, the credits spent so far and Stop; run history; and Auto-run with its cost per row.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- At the bottom of a sheet with computed columns, so people always see what is running and what it costs.

## When not to use

- For credits against a monthly limit. Use the Usage meter.
- For one agent run with steps. Use Agent run.

## Structure

1. Status: icon, words, rows done of total, percentage and meter
2. Credits so far
3. Errors link
4. Stop while running, or Run remaining with its cost
5. Auto-run switch with the cost per row
6. History popover

## Guidelines

- Stop is always available while anything runs, and stopping keeps the finished cells.
- Show progress as rows and a percentage, with a meter, never a bare spinner.
- State the credits spent so far while running, and the cost of Run remaining before it starts.
- Auto-run states its cost per row next to the switch, before anyone turns it on.
- History lists each run with rows, credits, outcome and when.

## Content

- Running: "1,240 of 2,000 rows · 62%". Stopped: "Stopped at 62%". Done: "Table up to date".
- Costs use the unit: "≈ 1.5 credits / row".

## Accessibility

- The progress is a progressbar with its value; the status line is a live region.
- Errors are words with an icon, not a red dot.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Reach Stop, Auto-run and History |

## Examples

### running

```tsx
import { RunStatusBar, Timestamp } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "A run with cost and Stop", description: "Progress, credits so far and Stop while running. Stop keeps finished rows; Run remaining states its cost first. Auto-run shows its cost per row before it is turned on.", order: 1 };

const TOTAL = 2000;

export default function Example() {
	const [done, setDone] = useState(1240);
	const [running, setRunning] = useState(true);
	const [autoRun, setAutoRun] = useState(false);
	useEffect(() => {
		if (!running) return;
		const t = window.setInterval(() => setDone((d) => { const n = Math.min(TOTAL, d + 20); if (n === TOTAL) setRunning(false); return n; }), 300);
		return () => window.clearInterval(t);
	}, [running]);
	return (
		<RunStatusBar
			className="w-full rounded-sm border border-line"
			running={running}
			label="Work email"
			done={done}
			total={TOTAL}
			errors={3}
			creditsUsed={done * 0.5}
			costPerRow={0.5}
			onStop={() => setRunning(false)}
			onRunRemaining={() => setRunning(true)}
			autoRun={autoRun}
			onAutoRunChange={setAutoRun}
			history={[{ id: "1", label: "Work email · test on 10 rows", rows: 10, credits: 5, outcome: "Done", when: <Timestamp value={new Date(Date.now() - 3600_000)} /> }]}
		/>
	);
}
```

## Related

- Sheet grid
- Usage meter
- Agent run timeline
