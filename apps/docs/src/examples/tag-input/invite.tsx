import { TagInput } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Invite by email", description: "Type or paste addresses. Duplicates are reported, invalid ones stay marked with the reason. Try pasting: ben@acme.co.uk; anna@acme.co.uk; chris@acme", order: 1 };

const isEmail = (v: string) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? undefined : "Not an email address.");

export default function Example() {
	const [value, setValue] = useState<string[]>(["anna@acme.co.uk"]);
	return (
		<div className="w-96 max-w-full">
			<TagInput label="Email addresses" noun={{ one: "address", many: "addresses" }} value={value} onValueChange={setValue} validateValue={isEmail} max={10} name="invite" required />
		</div>
	);
}
