import { AnswerActions, AssistantMessage, AssistantPanel, Button, Citation, FollowUps, MessageComposer, StepCard, SuggestedChanges, Table, TableBody, TableCell, TableRow, ThinkingSteps, UserMessage, toast } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Ask, propose, apply", description: "The assistant reads the selection, thinks in visible steps, answers with the figure first and record IDs, and proposes changes. Nothing changes until you apply; the step card shows progress and Undo follows.", order: 1 };

type Stage = "idle" | "thinking" | "answered" | "applying" | "applied";

export default function Example() {
	const [open, setOpen] = useState(true);
	const [stage, setStage] = useState<Stage>("idle");
	const [t, setT] = useState(0);
	const [steps, setSteps] = useState<("pending" | "done")[]>(["pending", "pending"]);
	useEffect(() => {
		if (stage !== "thinking") return;
		const i = setInterval(() => setT((x) => x + 0.1), 100);
		const d = setTimeout(() => setStage("answered"), 1800);
		return () => { clearInterval(i); clearTimeout(d); };
	}, [stage]);
	useEffect(() => {
		if (stage !== "applying") return;
		const a = setTimeout(() => setSteps(["done", "pending"]), 600);
		const b = setTimeout(() => { setSteps(["done", "done"]); setStage("applied"); toast.success("Extended 2 listings by 30 days", { action: { label: "Undo", onClick: () => setStage("answered") } }); }, 1200);
		return () => { clearTimeout(a); clearTimeout(b); };
	}, [stage]);
	return (
		<div className="flex h-140 w-full overflow-hidden rounded-sm border border-line bg-surface">
			<div className="grid min-w-0 flex-1 content-start gap-2 p-4">
				<span className="text-base text-ink-2">2 listings selected</span>
				{!open && <Button variant="outline" size="sm" shortcut="⌘J" className="justify-self-start" onClick={() => setOpen(true)}>Ask the assistant</Button>}
			</div>
			<AssistantPanel caveat="Reads listings and applications, not emails. Check closing dates before you extend a listing."
				open={open}
				onOpenChange={setOpen}
				title="Why are these closing with few applicants?"
				onOpenPage={() => {}}
				composer={<MessageComposer noun={{ one: "listing", many: "listings" }} chips={[{ id: "sel", label: "2 selected listings" }, { id: "f", label: "Status is Closing soon" }]} busy={stage === "thinking"} onStop={() => setStage("idle")} onSend={() => { setT(0); setStage("thinking"); }} />}
			>
				{stage === "idle" ? (
					<p className="text-base text-ink-2">Ask about the 2 selected listings, for example “Why are these closing with few applicants?”</p>
				) : (
					<>
						<UserMessage>Why are these closing with few applicants?</UserMessage>
						<ThinkingSteps done={stage !== "thinking"} seconds={stage === "thinking" ? t : 1.8} steps={[{ title: "Reading 2 listings", detail: "LST-1041, LST-1044" }, { title: "Comparing with 22 similar listings", detail: "Same teams, last 90 days" }, { title: "Checking salary and posting dates" }]} />
						{stage !== "thinking" && (
							<AssistantMessage
								from="2 listings and 22 similar ones"
								actions={<AnswerActions text="Both close in under 5 days with 9 applicants between them." onRegenerate={() => { setT(0); setStage("thinking"); }} onFeedback={() => new Promise((r) => setTimeout(r, 400))} />}
								followUps={<FollowUps items={["Which job boards are they on?", "Draft a shorter job description for LST-1044"]} onPick={() => {}} />}
							>
								<p><strong>9 applicants</strong> between them, against a median of 38 for similar listings.</p>
								<Table aria-label="Applicants"><TableBody><TableRow><TableCell>Frontend Engineer <Citation id="LST-1041" /></TableCell><TableCell className="tabular text-right">6</TableCell></TableRow><TableRow><TableCell>Customer Success Lead <Citation id="LST-1044" /></TableCell><TableCell className="tabular text-right">3</TableCell></TableRow></TableBody></Table>
								<p>Both were posted 9 days ago and close within 5 days. Similar listings stay open 30 days.</p>
							</AssistantMessage>
						)}
						{stage === "answered" && <SuggestedChanges changes={[{ id: "a", label: "Extend Frontend Engineer by 30 days", detail: "LST-1041", before: "Closes 21 Nov", after: "Closes 21 Dec" }, { id: "b", label: "Extend Customer Success Lead by 30 days", detail: "LST-1044", before: "Closes 23 Nov", after: "Closes 23 Dec" }]} onApply={() => { setSteps(["pending", "pending"]); setStage("applying"); }} onDismiss={() => setStage("idle")} />}
						{(stage === "applying" || stage === "applied") && <StepCard title="Extending 2 listings" steps={[{ label: "Frontend Engineer closes 21 Dec", state: steps[0] }, { label: "Customer Success Lead closes 23 Dec", state: steps[1] }]} />}
					</>
				)}
			</AssistantPanel>
		</div>
	);
}
