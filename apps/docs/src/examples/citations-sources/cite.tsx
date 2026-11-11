import { Citation, SourcesList } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Every claim names its record", description: "Citations are record IDs at the end of the claim. Selecting one highlights the source; on a list page it would focus the row.", order: 1 };

const SRC = [{ id: "LST-1041", title: "Frontend Engineer", detail: "6 applicants · closes 21 Nov" }, { id: "LST-1044", title: "Customer Success Lead", detail: "3 applicants · closes 23 Nov" }];

export default function Example() {
	const [a, setA] = useState<string>();
	return (
		<div className="grid w-full max-w-2xl grid-cols-[1fr_240px] gap-4 max-md:grid-cols-1">
			<p className="text-base text-ink">Two listings close this week with fewer than 10 applicants: Frontend Engineer <Citation id="LST-1041" active={a === "LST-1041"} onOpen={setA} /> and Customer Success Lead <Citation id="LST-1044" active={a === "LST-1044"} onOpen={setA} />.</p>
			<SourcesList sources={SRC} active={a} onSelect={setA} />
		</div>
	);
}
