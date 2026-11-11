import { DatePicker } from "@twoux/ui";

export const meta = { title: "States", description: "The error says what to do. Read-only keeps the date selectable and drops the calendar.", order: 4 };

const noop = () => {};

export default function Example() {
	return (
		<div className="grid w-72 gap-4">
			<DatePicker label="Start date" value={null} onValueChange={noop} required error="Enter a start date." />
			<DatePicker label="Contract end" value="2027-03-31" onValueChange={noop} readOnly />
			<DatePicker label="Probation review" value="2026-12-07" onValueChange={noop} disabled />
		</div>
	);
}
