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
