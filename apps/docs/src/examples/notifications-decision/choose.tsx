import { Badge, RadioField, RadioGroup } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Where should this message go?", description: "Answer in order. The first yes decides: toast, banner, Inbox or confirmation dialog. If none apply, log it in the record's Activity and send nothing.", order: 1 };

const Q = [
	{ id: "own", q: "Did the person just do this, here?", yes: "Toast", why: "Confirms their own action and disappears; can carry Undo." },
	{ id: "cond", q: "Is it a condition on the page in view?", yes: "Banner", why: "Stays in context until resolved; at most one action." },
	{ id: "act", q: "Does it need someone to act, now or later?", yes: "Inbox", why: "Persists until done or snoozed, even if they weren't here." },
	{ id: "stop", q: "Must it stop the task before it continues?", yes: "Confirmation dialog", why: "Only when the decision can't be undone." },
];

export default function Example() {
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const first = Q.find((q) => answers[q.id] === "yes");
	const allNo = Q.every((q) => answers[q.id] === "no");
	return (
		<div className="grid w-full max-w-xl gap-3">
			{Q.map((q, i) => (
				<fieldset key={q.id} className="grid gap-1.5 rounded-sm border border-line bg-surface p-3" disabled={i > 0 && answers[Q[i - 1].id] !== "no"}>
					<legend className="sr-only">{q.q}</legend>
					<span className="text-base font-medium text-ink">{i + 1}. {q.q}</span>
					<RadioGroup value={answers[q.id] ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...Object.fromEntries(Object.entries(a).filter(([k]) => Q.findIndex((x) => x.id === k) < i)), [q.id]: v }))} className="flex gap-4">
						<RadioField id={`${q.id}-y`} value="yes" label="Yes" />
						<RadioField id={`${q.id}-n`} value="no" label="No" />
					</RadioGroup>
				</fieldset>
			))}
			<p role="status" className="flex items-center gap-2 text-base text-ink-2">
				{first ? <><Badge>{first.yes}</Badge>{first.why}</> : allNo ? <><Badge variant="secondary">Activity only</Badge>Log it on the record; don't notify anyone.</> : "Answer the questions in order."}
			</p>
		</div>
	);
}
