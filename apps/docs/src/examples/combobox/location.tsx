import { Combobox, type ComboboxOption } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "One value, with Create", description: "Type a few letters. When an office isn't listed, Create adds it and selects it in one step.", order: 1 };

const START: ComboboxOption[] = [
	["Aberdeen", "Scotland"], ["Belfast", "Northern Ireland"], ["Birmingham", "England"], ["Bristol", "England"], ["Cardiff", "Wales"], ["Edinburgh", "Scotland"],
	["Glasgow", "Scotland"], ["Leeds", "England"], ["Liverpool", "England"], ["London", "England"], ["Manchester", "England"], ["Newcastle", "England"], ["Swansea", "Wales"],
].map(([label, description]) => ({ value: label.toLowerCase(), label, description, group: description }));

export default function Example() {
	const [options, setOptions] = useState(START);
	const [value, setValue] = useState<string | null>("leeds");
	return (
		<div className="w-72">
			<Combobox
				label="Location"
				noun={{ one: "office", many: "offices" }}
				options={options}
				value={value}
				onValueChange={setValue}
				onCreate={(text) => {
					const made = { value: text.toLowerCase(), label: text, description: "New office" };
					setOptions((o) => [...o, made]);
					return made;
				}}
				required
			/>
		</div>
	);
}
