import { TextField } from "@twoux/ui";

export const meta = { title: "States", description: "Error replaces the hint and says how to fix it. Disabled fields keep their value readable.", order: 3 };

export default function Example() {
	return (
		<div className="grid w-80 gap-4">
			<TextField label="Salary" prefix="£" defaultValue="18,000" required error="Enter at least £23,400, the UK minimum for a full-time role." />
			<TextField label="Listing ID" defaultValue="LST-1041" disabled />
		</div>
	);
}
