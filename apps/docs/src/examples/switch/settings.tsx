import { SwitchField } from "@twoux/ui";
export const meta = {"title": "Settings that apply at once", "description": "A switch changes something immediately, so there is no Save button. The label says what is on.", "order": 1};

export default function Example() {
	return (
		<div className="grid w-96 gap-4 rounded-sm border border-line bg-surface p-4 shadow-card">
			<SwitchField id="sw-email" label="Email me when someone applies" hint="One email per applicant." defaultChecked />
			<SwitchField id="sw-keys" label="Single-key shortcuts" hint="Turn off if you use a screen reader or voice control." defaultChecked />
			<SwitchField id="sw-digest" label="Weekly summary" disabled />
		</div>
	);
}
