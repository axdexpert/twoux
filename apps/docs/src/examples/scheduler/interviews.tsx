import {
	Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, RadioField, RadioGroup,
	Scheduler, SidePanel, TextField, Timestamp, formatTimeRange, toast, type SchedulerEvent, type SchedulerSlot, type SchedulerView,
} from "@twoux/ui";
import { useState } from "react";
import { INTERVIEWERS, INTERVIEWS, NOW, STATUS_VARIANT } from "./data";

export const meta = {
	title: "Interview week",
	description: "Three interviewers, one week. Click an interview to open it beside the schedule; click a free time to add one. Drag to move or the bottom edge to change the length; Space, arrows and Enter do the same from the keyboard, and the ⋮ menu offers the same moves. Every move has Undo.",
	order: 1,
};

const TYPES = ["Phone screen", "Technical interview", "Final interview"];
const name = (id?: string) => INTERVIEWERS.find((r) => r.id === id)?.label;

export default function Example() {
	const [events, setEvents] = useState(INTERVIEWS);
	const [view, setView] = useState<SchedulerView>("week");
	const [date, setDate] = useState(NOW);
	const [openId, setOpenId] = useState<string | null>(null);
	const [draft, setDraft] = useState<SchedulerSlot | null>(null);
	const [candidate, setCandidate] = useState("");
	const [type, setType] = useState(TYPES[0]);
	const [interviewer, setInterviewer] = useState("tom");
	const [error, setError] = useState<string | undefined>();
	const open = events.find((e) => e.id === openId) ?? null;

	const move = (ev: SchedulerEvent, to: SchedulerSlot) => {
		const before = events;
		setEvents((list) => list.map((e) => (e.id === ev.id ? { ...e, start: to.start.toISOString(), end: to.end.toISOString(), resourceId: to.resourceId } : e)));
		toast.success(`${ev.title} moved to ${to.start.toLocaleDateString("en-GB", { weekday: "long" })} ${formatTimeRange(to.start, to.end)}`, { action: { label: "Undo", onClick: () => setEvents(before) } });
	};
	const startCreate = (slot: SchedulerSlot) => {
		setDraft(slot); setCandidate(""); setType(TYPES[0]); setInterviewer(slot.resourceId ?? "tom"); setError(undefined);
	};
	const create = (e: React.FormEvent) => {
		e.preventDefault();
		if (!draft) return;
		if (!candidate.trim()) { setError("Enter the candidate's name."); return; }
		const id = `INT-${300 + events.length}`;
		setEvents((list) => [...list, { id, title: type, detail: candidate.trim(), start: draft.start.toISOString(), end: draft.end.toISOString(), resourceId: interviewer, status: "Tentative" }]);
		setDraft(null);
		toast.success(`${type} added for ${candidate.trim()}`, { action: { label: "Undo", onClick: () => setEvents((list) => list.filter((x) => x.id !== id)) } });
	};

	return (
		<div className="flex w-full overflow-hidden rounded-sm">
			<div className="min-w-0 flex-1">
				<Scheduler
					aria-label="Interviews"
					noun="interviews"
					resourceTitle="Interviewer"
					events={events}
					resources={INTERVIEWERS}
					view={view}
					onViewChange={setView}
					date={date}
					onDateChange={setDate}
					now={NOW}
					workWeek
					height={460}
					selectedId={openId ?? undefined}
					statusVariant={STATUS_VARIANT}
					onSelectEvent={(e) => setOpenId(e.id)}
					onCreate={startCreate}
					onMove={move}
				/>
			</div>
			{open && (
				<SidePanel
					open
					onOpenChange={(o) => !o && setOpenId(null)}
					mode="overlay"
					label="Interview details"
					title={open.detail ? `${open.title}, ${open.detail}` : open.title}
					meta={<span className="flex items-center gap-2"><span className="font-mono">{open.id}</span>{open.status && <Badge variant={STATUS_VARIANT(open.status)}>{open.status}</Badge>}</span>}
					footer={<Button size="sm" variant="outline">Edit interview</Button>}
				>
					<dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-base">
						<dt className="text-ink-2">Starts</dt><dd><Timestamp value={open.start} format="absolute" /></dd>
						<dt className="text-ink-2">Ends</dt><dd><Timestamp value={open.end} format="absolute" /></dd>
						<dt className="text-ink-2">Interviewer</dt><dd className="text-ink">{name(open.resourceId) ?? "Not assigned"}</dd>
						<dt className="text-ink-2">Role</dt><dd className="text-ink">Senior Backend Engineer</dd>
					</dl>
				</SidePanel>
			)}
			<Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
				<DialogContent>
					<form onSubmit={create} className="grid gap-4" noValidate>
						<DialogHeader>
							<DialogTitle>Add interview</DialogTitle>
							<DialogDescription>{draft && <Timestamp value={draft.start} format="absolute" />}{draft && `, until ${formatTimeRange(draft.start, draft.end).split("–")[1]}`}</DialogDescription>
						</DialogHeader>
						<TextField label="Candidate" required value={candidate} onChange={(e) => { setCandidate(e.target.value); setError(undefined); }} error={error} autoFocus />
						<fieldset className="grid gap-2">
							<legend className="mb-2 text-base font-medium text-ink">Interview type</legend>
							<RadioGroup value={type} onValueChange={setType}>
								{TYPES.map((t) => <RadioField key={t} id={`type-${t}`} value={t} label={t} />)}
							</RadioGroup>
						</fieldset>
						<fieldset className="grid gap-2">
							<legend className="mb-2 text-base font-medium text-ink">Interviewer</legend>
							<RadioGroup value={interviewer} onValueChange={setInterviewer}>
								{INTERVIEWERS.map((r) => <RadioField key={r.id} id={`who-${r.id}`} value={r.id} label={r.label} />)}
							</RadioGroup>
						</fieldset>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
							<Button type="submit">Add interview</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
