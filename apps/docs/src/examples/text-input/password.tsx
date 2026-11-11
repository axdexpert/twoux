import { InputGroupButton, TextField } from "@twoux/ui";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Password with live feedback", description: "Type to see the message switch from what is missing to a green confirmation. The show and hide button names its action for screen readers. Pattern from Clerk.", order: 4 };

export default function Example() {
	const [value, setValue] = useState("correct-horse-42");
	const [show, setShow] = useState(false);
	const ok = value.length >= 8;
	return (
		<div className="w-80">
			<TextField
				label="Password"
				type={show ? "text" : "password"}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				error={value && !ok ? "Use 8 or more characters." : undefined}
				success={ok ? "Your password meets the requirements." : undefined}
				suffix={
					<InputGroupButton size="icon-xs" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
						{show ? <EyeOff /> : <Eye />}
					</InputGroupButton>
				}
			/>
		</div>
	);
}
