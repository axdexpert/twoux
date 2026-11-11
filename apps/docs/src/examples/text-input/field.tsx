import { TextField } from "@twoux/ui";

export const meta = { title: "With label and hint", description: "Every input has a visible label. The hint says what good input looks like. TextField links label, hint and error to the input for screen readers.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-80 gap-4">
			<TextField label="Job title" hint="Shown on the listing and in search results." required defaultValue="Junior Product Designer" />
			<TextField label="Hiring manager" optional placeholder="Search people" />
		</div>
	);
}
