import { ArtifactCard, Button, toast } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "A draft the assistant made", description: "One card per output, with type and size, the origin label and two actions. While it is being written, the card says so; the draft reaches the record only through Suggest for record.", order: 1 };

export default function Example() {
	const [writing, setWriting] = useState(true);
	useEffect(() => { const t = setTimeout(() => setWriting(false), 1400); return () => clearTimeout(t); }, []);
	return (
		<div className="w-full max-w-lg">
			<ArtifactCard
				title="Job description"
				meta="Document · 312 words"
				from="LST-1044 and the hiring handbook"
				writing={writing}
				actions={<><Button variant="outline" size="xs" onClick={() => toast("Proposed for LST-1044")}>Suggest for record</Button><Button variant="ghost" size="xs">Open</Button></>}
				preview={<p>Customer Success Lead, Bristol (hybrid). £45,000 to £52,000. You'll look after 40 hiring teams, help them get value from TwoUX in their first 90 days…</p>}
			/>
		</div>
	);
}
