import { InputGroup, InputGroupAddon, InputGroupInput, Kbd, TextField } from "@twoux/ui";
import { Search } from "lucide-react";

export const meta = { title: "Prefix and suffix", description: "Units, currency and icons sit inside the field so the value reads as one thing. Built on shadcn's InputGroup.", order: 2 };

export default function Example() {
	return (
		<div className="grid w-80 gap-4">
			<TextField label="Salary" prefix="£" suffix="per year" defaultValue="32,000" inputMode="numeric" />
			<InputGroup>
				<InputGroupAddon><Search /></InputGroupAddon>
				<InputGroupInput aria-label="Search listings" placeholder="Search listings" />
				<InputGroupAddon align="inline-end"><Kbd>/</Kbd></InputGroupAddon>
			</InputGroup>
		</div>
	);
}
