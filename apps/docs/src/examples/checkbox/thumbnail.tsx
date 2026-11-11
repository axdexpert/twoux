import { CheckboxField } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<div className="grid gap-1.5">
			<CheckboxField id="th-a" label="Show salary" defaultChecked />
			<CheckboxField id="th-b" label="Accept CVs by email" />
		</div>
	);
}
