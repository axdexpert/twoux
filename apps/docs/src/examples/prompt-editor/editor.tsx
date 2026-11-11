import { PromptEditor } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Prompt with fields as chips", description: "Fields from the row are removable chips, not hidden syntax. Inputs and outputs are listed with their type, and Test on 3 rows comes before running on the whole table.", order: 1 };

export default function Example() {
	const [segs, setSegs] = useState<(string | { field: string })[]>(["List the 3 key requirements in ", { field: "description" }, " for the role ", { field: "role" }, ", in under 12 words."]);
	const [testing, setTesting] = useState(false);
	const [results, setResults] = useState<{ row: string; value: string }[]>();
	return (
		<div className="w-full max-w-xl">
			<PromptEditor
				segments={segs}
				onRemoveField={(i) => setSegs((s) => s.filter((_, j) => j !== i))}
				inputs={[{ name: "description", type: "Long text" }, { name: "role", type: "Text" }]}
				outputs={[{ name: "key_requirements", type: "Text" }]}
				testing={testing}
				results={results}
				onTest={() => { setTesting(true); setTimeout(() => { setTesting(false); setResults([{ row: "LST-1040", value: "Portfolio, Figma, hybrid in Leeds" }, { row: "LST-1041", value: "React, TypeScript, 3+ years" }, { row: "LST-1045", value: "Playwright, CI, test plans" }]); }, 800); }}
			/>
		</div>
	);
}
