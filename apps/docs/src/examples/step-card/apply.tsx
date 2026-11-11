import { Button, StepCard } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Applying, step by step", description: "Each change shows pending, then done. A failed step says why and keeps the others. The counter reads progress without counting icons.", order: 1 };

export default function Example() {
	const [n, setN] = useState(0);
	useEffect(() => { if (n < 3) { const t = setTimeout(() => setN((x) => x + 1), 700); return () => clearTimeout(t); } }, [n]);
	const state = (i: number) => (i >= n ? "pending" : i === 2 ? "failed" : "done") as "pending" | "done" | "failed";
	return (
		<div className="grid w-full max-w-md gap-2">
			<StepCard title="Extending 3 listings" steps={[{ label: "Frontend Engineer closes 21 Dec", state: state(0) }, { label: "Data Analyst closes 12 Jan", state: state(1) }, { label: "QA Engineer", state: state(2), reason: n > 2 ? "Already closed. Reopen it first." : undefined }]} />
			<Button variant="outline" size="sm" className="justify-self-start" onClick={() => setN(0)}>Replay</Button>
		</div>
	);
}
