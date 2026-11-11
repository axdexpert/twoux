import { Button } from "@twoux/ui";

export const meta = {
	title: "Disabled",
	description: "Prefer leaving the button enabled and explaining what is missing when pressed. Disable only when the reason is visible next to it.",
	order: 6,
};

export default function Example() {
	return (
		<div className="flex flex-col items-start gap-1.5">
			<Button variant="default" disabled>
				Run task
			</Button>
			<span className="text-sm text-bad">Choose who gets the titles before you run this.</span>
		</div>
	);
}
