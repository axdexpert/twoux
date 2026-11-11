import { Button, ThinkingSteps } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Say what it is doing", description: "The current step in words with a running timer, never only an animation. When the answer starts, it collapses to a summary you can open.", order: 1 };

const STEPS = [{ title: "Reading 24 listings", detail: "Open and closing soon" }, { title: "Comparing applicants with last quarter" }, { title: "Checking salary bands", detail: "Against the 2026 bands file" }, { title: "Writing the answer" }];

export default function Example() {
	const [n, setN] = useState(1);
	const [t, setT] = useState(0);
	const done = n > STEPS.length;
	useEffect(() => {
		if (done) return;
		const i = setInterval(() => setT((x) => x + 0.1), 100);
		const s = setTimeout(() => setN((x) => x + 1), 700);
		return () => { clearInterval(i); clearTimeout(s); };
	}, [n, done]);
	return (
		<div className="grid w-full max-w-md gap-3">
			<ThinkingSteps done={done} seconds={t} steps={STEPS.slice(0, Math.min(n, STEPS.length))} />
			<Button variant="outline" size="sm" className="justify-self-start" onClick={() => { setN(1); setT(0); }}>Replay</Button>
		</div>
	);
}
