import { TaskBuilder } from "@twoux/ui";

/* The real TaskBuilder: a sentence with one set slot and one dashed, empty slot, then Run. */
const noop = () => {};

export default function Thumbnail() {
	return (
		<div className="w-64">
			<TaskBuilder
				value={{ when: "Mondays" }}
				onChange={noop}
				onRun={noop}
				parts={[{ id: "when", placeholder: "When", options: [], required: true }, ", summarise", { id: "which", placeholder: "what", options: [], required: true }]}
			/>
		</div>
	);
}
