import { Checkbox } from "@twoux/ui";

export const meta = { title: "States", description: "Unchecked, checked, indeterminate (some children selected) and disabled. The box is 16px; its row is 24px so it is easy to hit.", order: 1 };

export default function Example() {
	return (
		<div className="flex items-center gap-6">
			<Checkbox aria-label="Unchecked" />
			<Checkbox aria-label="Checked" defaultChecked />
			<Checkbox aria-label="Some selected" checked="indeterminate" />
			<Checkbox aria-label="Disabled" disabled />
			<Checkbox aria-label="Disabled and checked" disabled defaultChecked />
		</div>
	);
}
