import { Button, Stepper } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Publish a listing", description: "Done steps show a check and can be revisited. Later steps stay faded and locked until the one before is finished.", order: 1 };

const STEPS = [
	{ title: "Add the role", description: "Title, team and location" },
	{ title: "Set salary", description: "Band and benefits" },
	{ title: "Screening questions", description: "Up to 5 questions" },
	{ title: "Review and publish" },
];

export default function Example() {
	const [current, setCurrent] = useState(1);
	return (
		<div className="grid w-full max-w-lg grid-cols-[200px_1fr] gap-8 max-sm:grid-cols-1">
			<Stepper steps={STEPS} current={current} onStepSelect={setCurrent} aria-label="Publish a listing" />
			<div className="grid content-start gap-3">
				<span className="text-md font-semibold text-ink">{STEPS[Math.min(current, STEPS.length - 1)].title}</span>
				<span className="text-base text-ink-2">Step {Math.min(current + 1, STEPS.length)} of {STEPS.length}</span>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Back</Button>
					<Button size="sm" disabled={current >= STEPS.length} onClick={() => setCurrent((c) => c + 1)}>{current >= STEPS.length - 1 ? "Publish" : "Continue"}</Button>
				</div>
			</div>
		</div>
	);
}
