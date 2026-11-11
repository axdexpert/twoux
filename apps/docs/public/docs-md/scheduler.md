# Scheduler

Interviews, shifts or bookings on a day, week or month grid, with people or rooms as resources. Click a free time to add, click an event to open it, and drag, use the keyboard or the event menu to move it. Below 768px it becomes an agenda list.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- Booking and arranging time-bound records where free time matters, such as interviews across several interviewers, shifts or room bookings.
- Seeing who is busy when, side by side, before choosing a time.

## When not to use

- For a list of upcoming items with no need to see free time; use a Grouped list or List table with Timestamps.
- For a record's history of changes; use Timeline.
- For picking one date in a form; use a date field.
- For editing recurring series; the Scheduler shows events the app has already expanded and has no recurrence editor.

## Structure

1. Toolbar: Today, Previous, Next, period heading, time zone, Day / Week / Month
2. Resource legend: stripe and name
3. Time gutter, 24-hour, with a labelled now line
4. Column headers: days, or resources in day view
5. All-day row
6. 30-minute slots
7. Event: resource stripe, title, detail, time, resource, status badge, ⋮ menu
8. Month cells with up to three events and +N more
9. Agenda list grouped by day, below 768px

## Guidelines

- Switch Day, Week and Month with the segmented control; they are views of the same data.
- Open an event in the side panel with onSelectEvent, so people keep their place in the schedule.
- Create from a free time with onCreate and a dialog of up to three fields; the time comes from the slot.
- Apply every move at once with a toast offering Undo. Confirm first only if the move contacts someone outside the workspace, such as re-sending a candidate invite.
- Every drag has a keyboard path (Space, arrows, Enter, Esc) and a menu path (the event's ⋮: earlier, later, other day, longer, shorter, another resource).
- Resource colour is a left stripe from the series colours; text stays ink and the resource is always named.
- Keep day and week views to working hours (dayStart, dayEnd) and use workWeek when weekends are never booked.
- Below 768px the grid becomes an agenda grouped by day, so the schedule reflows to 320px without sideways scrolling.
- Loading shows skeleton rows inside the frame; an error says what failed with Try again; an empty period says so and stays clickable.

## Content

- Times are 24-hour with an en dash: 09:30–10:15. Weeks start on Monday. Day headings read Thursday 12 November.
- Write the time zone once in the toolbar: Times in GMT. Details in the side panel use Timestamp in absolute format.
- Name the noun in the empty message: No interviews this week. Choose a free time to add one.
- Status is a word in a Badge (Confirmed, Tentative), never a colour alone.

## Accessibility

- 2.1.1 Keyboard: the grid is one tab stop with roving focus; arrows walk free times and events in time order, and Enter opens or adds.
- 2.5.7 Dragging Movements: moving and resizing also work with Space and arrows, and from the event menu with single clicks.
- 4.1.3 Status Messages: pick-up, each step, drop and cancel are announced in a polite live region.
- Month view follows the APG calendar grid: arrows by day and week, Enter lists the day's events.
- 1.4.1 Use of Color: resources and status are written in words; colour repeats them.
- 1.4.10 Reflow: the agenda replaces the grid below 768px.
- 2.1.4 Character Key Shortcuts: T, J, K, D, W and M stop when single-key shortcuts are turned off; keys inside the focused grid are not affected.

## Keyboard

| Keys | Action |
|---|---|
| T | Go to today |
| J K | Next or previous day, week or month |
| D W M | Day, week or month view |
| ↑ ↓ | Previous or next free time or event in the column |
| ← → | Same time in the previous or next column |
| Home End | First or last time in the column |
| Page up Page down | Previous or next period |
| Enter | Open the event, or add one at the free time |
| Space | Pick up the event to move it |
| ↑ ↓ ← → (moving) | Move by one slot, or to the next day or interviewer |
| ⇧↑ ⇧↓ (moving) | Make it shorter or longer |
| Enter Space (moving) | Drop it here |
| Esc | Cancel the move and put it back |
| ⇧F10 | Open the event menu |

## Examples

### interviews

```tsx
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
```

### states

```tsx
import { SegmentedControl, Segment, Scheduler, type SchedulerView } from "@twoux/ui";
import { useState } from "react";
import { INTERVIEWERS, INTERVIEWS, NOW, STATUS_VARIANT } from "./data";

export const meta = {
	title: "Agenda, loading, empty and error",
	description: "Below 768px the grid becomes this agenda, grouped by day, so the schedule reflows to 320px; it is also the list view for screen reader users who prefer one. Loading keeps the frame with skeleton rows, an error says what failed with Try again, and an empty week says so.",
	order: 2,
};

type Demo = "agenda" | "loading" | "error" | "empty";

export default function Example() {
	const [demo, setDemo] = useState<Demo>("agenda");
	const [view, setView] = useState<SchedulerView>("week");
	const [date, setDate] = useState(NOW);
	return (
		<div className="grid w-full max-w-md gap-3">
			<SegmentedControl value={demo} onValueChange={(v) => setDemo(v as Demo)} size="sm" aria-label="State" className="justify-self-start">
				<Segment value="agenda">Agenda</Segment><Segment value="loading">Loading</Segment><Segment value="error">Error</Segment><Segment value="empty">Empty</Segment>
			</SegmentedControl>
			<Scheduler
				aria-label="Interviews"
				noun="interviews"
				resourceTitle="Interviewer"
				events={demo === "empty" ? [] : INTERVIEWS}
				resources={INTERVIEWERS}
				view={view}
				onViewChange={setView}
				date={date}
				onDateChange={setDate}
				now={NOW}
				workWeek
				layout="agenda"
				status={demo === "loading" ? "loading" : demo === "error" ? "error" : "ready"}
				onRetry={() => setDemo("agenda")}
				statusVariant={STATUS_VARIANT}
				onSelectEvent={() => {}}
				onMove={() => {}}
			/>
		</div>
	);
}
```

## Related

- Side panel (drawer)
- Segmented control
- Grouped list
- List table
- Dropdown menu
- Confirmation dialog
