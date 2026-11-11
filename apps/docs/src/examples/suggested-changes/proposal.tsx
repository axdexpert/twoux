import { SuggestedChanges, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "A proposal you apply", description: "Each change ticked by default with before and after. Apply counts what it will change; ⌘↵ applies. Undo follows.", order: 1 };

export default function Example() {
	const [k, setK] = useState(0);
	return (
		<div className="w-full max-w-lg">
			<SuggestedChanges
				key={k}
				changes={[
					{ id: "1", label: "Rename Frontend Engineer", detail: "LST-1041", before: "Frontend Engineer", after: "Frontend Engineer (React)" },
					{ id: "2", label: "Add salary range", detail: "LST-1041", after: "£48,000 to £56,000" },
					{ id: "3", label: "Extend closing date by 30 days", detail: "LST-1041", before: "21 Nov", after: "21 Dec" },
				]}
				onApply={(ids) => { toast.success(`Applied ${ids.length} changes`, { action: { label: "Undo", onClick: () => setK((x) => x + 1) } }); setK((x) => x + 1); }}
				onDismiss={() => toast("Dismissed")}
				onEdit={() => toast("Opened for editing")}
			/>
		</div>
	);
}
