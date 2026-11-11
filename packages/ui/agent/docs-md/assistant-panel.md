# Assistant side panel

A side panel, opened with ⌘J, where people ask about the records on screen and get answers grounded in the current selection and filters.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Quick questions about the listings or candidates on screen, where the answer needs the data beside it. ⌘J opens the panel with the current selection and filters already attached.
- When people need to invoke help without leaving the table they are working through. HAX G7 asks for efficient invocation and G8 for efficient dismissal, so the panel opens and closes with one shortcut.
- When an answer may lead to a change. The panel can hold a proposal next to the rows it affects, so the person can compare before applying.

## When not to use

- Long research answers that need room for sources and a records list. Use the Assistant page (assistant-page) instead, which keeps the same conversation.
- Repeated tasks with the same shape every week. Use the Task builder (task-builder) so the inputs are slots, not free text.
- Filling one value per row across a table. Use the AI column (ai-column), which writes into a generated column and cites each row.
- Do not add a floating chat bubble to every page. The panel opens from ⌘J or Ask in the bulk bar, where the context is.

## Structure

1. Panel bar (Assistant, conversation title, Open as a full page, Previous conversations, Share, New, Close)
2. Thread (questions, thinking row, answers)
3. Clarifying question card (docked above the message box when needed)
4. Message box with context chips
5. Caveat line

## Guidelines

- Open in the same side panel as row details, in push mode by default, so the table stays readable. Opening the assistant closes the row detail panel and the other way round.
- Turn the selection and active filters into context chips automatically. Removing a chip narrows what the assistant reads.
- Lead each answer with the figure, then a small table, then the reason. Every claim about a record carries its record ID as a citation.
- Changes never apply from the thread. They arrive as Suggested changes with checkboxes and one Apply button, and nothing changes until the person applies.
- While a response is running, the send button becomes Stop in the same place. Stopping keeps what was written and says it is incomplete.
- Keep the message box pinned and let only the thread scroll. Do not jump the thread to the bottom while someone is reading an older message.
- Show the caveat under the message box at all times: what data it uses and what to check.

## Content

- Call it Assistant. Do not use "AI-powered", "smart" or "magic". Say what it read and what it did.
- Empty state: say what it will use ("Ask about 2 listings. Uses what you have selected and filtered. Nothing changes until you apply it.").
- Caveat copy is specific: "Uses your workspace data only. Check figures before you act on them."
- Answers open with the answer. No greeting, no "Great question", no disclaimer about being an AI before the content.
- Name the conversation from the first question and show it in the panel bar, so it can be found later.

## Accessibility

- Render the panel as an aside with aria-label="Assistant" (complementary landmark). Label it because the row details panel is a second complementary landmark.
- The thread is a log (role="log", implicit aria-live polite) with an accessible name, so new answers are announced without moving focus (SC 4.1.3).
- Do not announce every streamed token. Announce the thinking step titles and the finished answer; Stop satisfies SC 2.2.2 for content that auto-updates in parallel with the table.
- When the panel opens, focus moves to the message box; Esc closes the innermost open layer first (menu, history, then panel) and focus returns to the trigger, as the dialog pattern does (SC 2.4.3).
- The send button changes its accessible name from "Send (Enter)" to "Stop" while running, which the button pattern allows when the label itself changes.
- The panel must not cover the focused row in push mode (SC 2.4.11).

## Keyboard

| Keys | Action |
|---|---|
| ⌘J / Ctrl+J | Open or close the assistant with the current selection as context |
| Enter | Send the message |
| Shift+Enter | New line |
| Esc | Close the open menu, then history, then the panel |
| ⌘↵ | Apply the suggested changes in focus |

## Examples

### flow

```tsx
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
```

## Related

- Assistant page
- Message composer
- Thinking and steps
- Suggested changes
- Citations and sources
- Previous conversations
- Side panel (drawer)
