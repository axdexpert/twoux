export const install = "";
export const api = [
	{ component: "Scheduler", props: [
		{ name: "events", type: "{ id, title, start, end, resourceId?, allDay?, status?, detail? }[]", description: "Dates as Date or ISO strings, shown in local time, 24-hour. status is a word shown in a Badge; detail is the second line, such as the candidate." },
		{ name: "resources", type: "{ id, label }[]", description: "People, rooms or teams. Day view gives each a column; week and month mark them with a seriesColor stripe and always write the name." },
		{ name: "view · onViewChange", type: "\"day\" | \"week\" | \"month\"", description: "Switched with the SegmentedControl in the toolbar, or D, W and M." },
		{ name: "date · onDateChange", type: "Date", description: "Any day in the period shown. Today (T), Previous (K) and Next (J) call onDateChange; Page up and Page down do the same inside the grid." },
		{ name: "onSelectEvent", type: "(event) => void", description: "Click, Enter or Open in the event menu. Open the record in SidePanel." },
		{ name: "onCreate", type: "({ start, end, resourceId? }) => void", description: "A free time was clicked or chosen with Enter. Open a dialog with up to three fields. Omit for a read-only schedule." },
		{ name: "onMove", type: "(event, { start, end, resourceId? }) => void", description: "Drag, keyboard move (Space, arrows, Enter) or the event menu moved or resized an event. Apply it and show a toast with Undo. Omit to turn moving off." },
		{ name: "status · onRetry", type: "\"ready\" | \"loading\" | \"error\" · () => void", description: "Loading shows skeleton rows; error says what failed with Try again. An empty period says so and stays clickable." },
		{ name: "layout", type: "\"auto\" | \"grid\" | \"agenda\"", description: "auto shows the grid from 768px and the agenda list, grouped by day, below it." },
		{ name: "dayStart · dayEnd · slotMinutes · createMinutes", type: "number", description: "Hours shown (8 to 18), slot length (30) and the length of a new event (60)." },
		{ name: "workWeek · now · height · noun · resourceTitle · statusVariant · selectedId · aria-label", type: "various", description: "Monday to Friday only; the time for the now line (defaults to the clock); scroll height; the plural for the empty message; the resource column name; status to Badge variant; the open event; the name of the schedule." },
	] },
	{ component: "schedulerTable", props: [
		{ name: "(events, resources?, resourceTitle?)", type: "function", description: "The same events as a table: date, start, end, event, resource, status. For a Table view or an export." },
	] },
	{ component: "formatTime · formatTimeRange", props: [
		{ name: "(date) · (start, end)", type: "function", description: "24-hour UK time, “09:30”, and “09:30–10:15” with an en dash." },
	] },
];
