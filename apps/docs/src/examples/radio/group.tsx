import { RadioField, RadioGroup } from "@twoux/ui";
export const meta = {"title": "Radio group", "description": "One choice from a short, visible list. Arrow keys move and select; Tab leaves the group.", "order": 1};

export default function Example() {
	return (
		<fieldset className="grid gap-2">
			<legend className="mb-1 text-sm font-medium text-ink">Contract</legend>
			<RadioGroup defaultValue="full">
				<RadioField id="r-full" value="full" label="Full time" />
				<RadioField id="r-part" value="part" label="Part time" hint="Under 30 hours a week." />
				<RadioField id="r-fixed" value="fixed" label="Fixed term" />
				<RadioField id="r-zero" value="zero" label="Zero hours" disabled />
			</RadioGroup>
		</fieldset>
	);
}
