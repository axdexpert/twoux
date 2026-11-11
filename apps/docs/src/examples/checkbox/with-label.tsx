import { CheckboxField } from "@twoux/ui";

export const meta = { title: "With label and hint", description: "The label is clickable and part of the target. A hint explains the consequence, not the control.", order: 2 };

export default function Example() {
	return (
		<div className="grid gap-3">
			<CheckboxField id="ex-salary" label="Show salary on listing" hint="Listings with a salary get about a third more applies." defaultChecked />
			<CheckboxField id="ex-email" label="Accept CVs by email" />
		</div>
	);
}
