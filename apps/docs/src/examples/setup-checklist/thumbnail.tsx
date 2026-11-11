import { SetupChecklist } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<div className="w-52" aria-hidden="true">
			<SetupChecklist items={[{ id: "a", label: "Connect Slack", done: true }, { id: "b", label: "Invite a teammate", done: false }]} />
		</div>
	);
}
