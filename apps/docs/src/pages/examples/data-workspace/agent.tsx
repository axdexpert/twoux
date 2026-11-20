import { AssistantMessage, FollowUps, type ProposedChange, type SheetRow, type SheetValue, Starters, StepCard, SuggestedChanges, UserMessage, toast } from "@twoux/ui";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { gbp, isClosed } from "./data";

/** The example's "today": the same date Days since counts from. */
const TODAY = "2026-11-06";
const STEP_MS = 550;

const Q = {
	fix: "Fix the rows where Work email failed",
	push: "Push back Proposal deals closing by 20 Nov",
	big: "Which deals over £50k close in November?",
	missing: "Show the rows that still have no work email",
} as const;
type Intent = keyof typeof Q | "other";

/** What the assistant can answer, in the order starters show them: two that change the table, one that checks it. */
const STARTERS = [Q.fix, Q.push, Q.big];
const FOLLOW_UPS: Record<Intent, string[]> = {
	fix: [Q.missing, Q.push],
	push: [Q.big, Q.fix],
	big: [Q.push, Q.missing],
	missing: [Q.fix, Q.big],
	other: [Q.fix, Q.big],
};

export type CellWrite = { rowId: string; col: string; value: SheetValue };
type Edit = { rowId: string; col: string; before: SheetValue; after: SheetValue };
type Proposal = ProposedChange & { edits: Edit[]; rerun?: string; step: string };
type Step = { label: string; state: "pending" | "done" | "failed" };
type Turn = { id: number; q: string; intent: Intent; body: ReactNode; proposals?: Proposal[]; status: "answer" | "proposed" | "applying" | "applied" | "dismissed" | "undone"; steps?: Step[] };

const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const s = (v: unknown) => String(v ?? "");
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Reads the People sheet and answers; anything that would change a row comes back as Suggested changes, never as an edit. */
function answer(q: string, rows: SheetRow[]): Omit<Turn, "id" | "q"> {
	const intent = (Object.entries(Q).find(([, v]) => v === q)?.[0] ?? "other") as Intent;
	const emailState = (r: SheetRow) => r.computed?.email?.state;

	if (intent === "fix") {
		const failed = rows.filter((r) => emailState(r) === "failed");
		const notFound = rows.filter((r) => emailState(r) === "not-found");
		const noTitle = rows.filter((r) => r.computed?.summary?.state === "failed");
		const proposals: Proposal[] = failed.flatMap((r) => {
			const peers = rows.filter((x) => x.id !== r.id && x.values.company === r.values.company && s(x.values.domain));
			const domain = s(peers[0]?.values.domain);
			if (s(r.values.domain) || !domain) return [];
			return [{ id: r.id, label: `Add company domain for ${s(r.values.name)}`, detail: `Same domain as the other ${plural(peers.length, "person", "people")} at ${s(r.values.company)}. Work email then runs again for 0.5 credits.`, after: domain, edits: [{ rowId: r.id, col: "domain", before: r.values.domain ?? "", after: domain }], rerun: r.id, step: `${s(r.values.name)}: added ${domain}, Work email queued` }];
		});
		const body = (
			<>
				<p>{failed.length ? `Work email failed on ${plural(failed.length, "row")} because the company domain is empty.` : "Work email hasn't failed on any row."}{proposals.length ? " Other people at the same company have one, so I can fill it in." : ""}</p>
				{(notFound.length > 0 || noTitle.length > 0) && (
					<p>
						I can't fix {notFound.length + noTitle.length === 1 ? "this one" : "these"}:{" "}
						{notFound.map((r) => `HubSpot has no contact for ${s(r.values.name)}, so check the address by hand.`).join(" ")}{" "}
						{noTitle.map((r) => `${s(r.values.name)} has no job title, so Summarise role failed. Add the title, then run the cell again.`).join(" ")}
					</p>
				)}
			</>
		);
		return { intent, body, proposals, status: proposals.length ? "proposed" : "answer" };
	}

	if (intent === "push") {
		const due = rows.filter((r) => r.values.stage === "Proposal" && s(r.values.closes) >= TODAY && s(r.values.closes) <= "2026-11-20");
		const proposals: Proposal[] = due.map((r) => {
			const after = addDays(s(r.values.closes), 30);
			return { id: r.id, label: `Move close date for ${s(r.values.name)}`, detail: `${s(r.values.company)} · ${gbp(Number(r.values.deal ?? 0))} · ${s(r.values.owner)}`, before: day(s(r.values.closes)), after: day(after), edits: [{ rowId: r.id, col: "closes", before: r.values.closes, after }], step: `${s(r.values.name)}: closes ${day(after)}` };
		});
		const body = <p>{due.length ? `${plural(due.length, "deal")} still at Proposal ${due.length === 1 ? "closes" : "close"} by 20 Nov. Here they are with each close date moved 30 days later. Stage and probability stay the same.` : "No deals at Proposal close by 20 Nov."}</p>;
		return { intent, body, proposals, status: proposals.length ? "proposed" : "answer" };
	}

	if (intent === "big") {
		const big = rows.filter((r) => Number(r.values.deal ?? 0) >= 50000 && !isClosed(r.values.stage) && s(r.values.closes).startsWith("2026-11")).sort((a, b) => s(a.values.closes).localeCompare(s(b.values.closes)));
		const total = big.reduce((n, r) => n + Number(r.values.deal ?? 0), 0);
		const body = big.length ? (
			<>
				<p>{plural(big.length, "open deal")} over £50k {big.length === 1 ? "closes" : "close"} in November, {gbp(total)} in total:</p>
				<ul className="list-disc pl-5">{big.map((r) => <li key={r.id}>{s(r.values.name)}, {s(r.values.company)}: {gbp(Number(r.values.deal))}, {s(r.values.stage)}, closes {day(s(r.values.closes))}</li>)}</ul>
			</>
		) : <p>No open deals over £50k close in November.</p>;
		return { intent, body, status: "answer" };
	}

	if (intent === "missing") {
		const gaps = rows.filter((r) => emailState(r) === "failed" || emailState(r) === "not-found");
		const body = gaps.length ? (
			<>
				<p>{plural(gaps.length, "row")} still {gaps.length === 1 ? "has" : "have"} no work email:</p>
				<ul className="list-disc pl-5">{gaps.map((r) => <li key={r.id}>{s(r.values.name)}: {emailState(r) === "not-found" ? "not found in HubSpot" : "no company domain"}</li>)}</ul>
			</>
		) : <p>Every finished row has a work email.</p>;
		return { intent, body, status: "answer" };
	}

	return { intent, body: <p>This example answers the suggested questions only. In a real table I'd read the {plural(rows.length, "row")} in view.</p>, status: "answer" };
}

/** The Ask panel's thread for the data workspace: starters, answers, Suggested changes that write to the grid, and Undo. */
export function useTableAgent({ rows, write, rerun }: { rows: SheetRow[]; write: (cells: CellWrite[]) => void; rerun: (rowIds: string[], col: string) => void }) {
	const [turns, setTurns] = useState<Turn[]>([]);
	const [hideStarters, setHideStarters] = useState(false);
	const timers = useRef<number[]>([]);
	useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

	const patch = (id: number, p: Partial<Turn> | ((t: Turn) => Partial<Turn>)) => setTurns((ts) => ts.map((t) => (t.id === id ? { ...t, ...(typeof p === "function" ? p(t) : p) } : t)));
	const send = (q: string) => setTurns((ts) => [...ts, { id: Date.now(), q, ...answer(q, rows) }]);

	const undo = (id: number, chosen: Proposal[]) => {
		write(chosen.flatMap((c) => c.edits.map((e) => ({ rowId: e.rowId, col: e.col, value: e.before }))));
		const again = chosen.flatMap((c) => (c.rerun ? [c.rerun] : []));
		if (again.length) rerun(again, "email");
		patch(id, { status: "undone" });
		toast("Changes undone", { description: "The table is back as it was." });
	};

	const apply = (turn: Turn, ids: string[]) => {
		const chosen = (turn.proposals ?? []).filter((p) => ids.includes(p.id));
		patch(turn.id, { status: "applying", steps: chosen.map((c) => ({ label: c.step, state: "pending" })) });
		chosen.forEach((c, i) => {
			timers.current.push(window.setTimeout(() => {
				write(c.edits.map((e) => ({ rowId: e.rowId, col: e.col, value: e.after })));
				if (c.rerun) rerun([c.rerun], "email");
				const last = i === chosen.length - 1;
				patch(turn.id, (t) => ({ status: last ? "applied" : t.status, steps: t.steps?.map((st, k) => (k === i ? { ...st, state: "done" } : st)) }));
				if (last) toast.success(`${plural(chosen.length, "change")} applied`, { action: { label: "Undo", onClick: () => undo(turn.id, chosen) } });
			}, STEP_MS * (i + 1)));
		});
	};

	const thread = (
		<>
			{turns.length === 0 && !hideStarters && <Starters items={STARTERS} onPick={send} onHide={() => setHideStarters(true)} />}
			{turns.map((t, i) => {
				const settled = t.status !== "proposed" && t.status !== "applying";
				const followUps = i === turns.length - 1 && settled ? FOLLOW_UPS[t.intent].filter((q) => !turns.some((x) => x.q === q)) : [];
				return (
					<div key={t.id} className="grid gap-5">
						<UserMessage>{t.q}</UserMessage>
						<AssistantMessage from="the People sheet" followUps={followUps.length ? <FollowUps items={followUps} onPick={send} /> : undefined}>
							{t.body}
							{t.status === "proposed" && t.proposals && <SuggestedChanges changes={t.proposals} onApply={(ids) => apply(t, ids)} onDismiss={() => patch(t.id, { status: "dismissed" })} />}
							{t.steps && <StepCard title="Applying changes" steps={t.steps} />}
							{t.status === "dismissed" && <p className="text-sm text-ink-3">Dismissed. Nothing changed.</p>}
							{t.status === "undone" && <p className="text-sm text-ink-3">Undone. The table is back as it was.</p>}
						</AssistantMessage>
					</div>
				);
			})}
		</>
	);

	return { thread, send };
}
