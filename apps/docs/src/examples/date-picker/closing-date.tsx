import { DatePicker, fromIsoDate } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Closing date", description: "Type the date, or press Alt+↓ or the calendar button. Weekends and past dates can't be chosen, and the calendar says why.", order: 1 };

const today = new Date();
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Example() {
	const [value, setValue] = useState<string | null>(null);
	return (
		<div className="w-72">
			<DatePicker
				label="Closing date"
				value={value}
				onValueChange={setValue}
				min={iso(today)}
				isDateUnavailable={(d) => [0, 6].includes(fromIsoDate(d).getDay())}
				unavailableReason="Closing dates must be on a weekday."
				hint="The last day applications are accepted. dd/mm/yyyy"
				required
			/>
		</div>
	);
}
