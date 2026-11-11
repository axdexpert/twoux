import { Combobox, type ComboboxOption, matchOption } from "@twoux/ui";
import { useCallback, useState } from "react";

export const meta = { title: "Server search and errors", description: "The app filters as people type. Nothing flickers for quick answers; a failure shows inside the list with Try again. Type \"fail\" to see it.", order: 3 };

const PEOPLE: ComboboxOption[] = ["Amara Okafor", "Ben Hughes", "Chloé Martin", "Dev Patel", "Eilidh Ross", "Femi Adeyemi", "Grace Lin", "Harry Evans", "Isla Byrne", "Jonas Weber"].map((n, i) => ({ value: `u${i}`, label: n, description: ["Talent", "Engineering", "Design", "Finance"][i % 4] }));

export default function Example() {
	const [options, setOptions] = useState<ComboboxOption[]>(PEOPLE);
	const [loading, setLoading] = useState(false);
	const [loadError, setLoadError] = useState<string>();
	const [value, setValue] = useState<string | null>(null);
	const search = useCallback((text: string) => {
		setLoading(true);
		setLoadError(undefined);
		setTimeout(() => {
			setLoading(false);
			if (text.trim().toLowerCase() === "fail") return setLoadError("People didn't load. Check your connection.");
			setOptions(PEOPLE.filter((p) => matchOption(p, text)));
		}, 1400);
	}, []);
	return (
		<div className="w-72">
			<Combobox label="Hiring manager" noun={{ one: "person", many: "people" }} options={options} value={value} onValueChange={setValue} filter={null} onSearch={search} loading={loading} loadError={loadError} onRetry={() => search("")} />
		</div>
	);
}
