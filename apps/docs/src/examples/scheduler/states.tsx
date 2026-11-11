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
