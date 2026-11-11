import { TeamInstructions, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Shared context, visible", description: "Instructions and files the assistant reads for everyone, shown with who set them. Edit in place.", order: 1 };

export default function Example() {
	const [text, setText] = useState("Write in UK English. Always state the salary range. Never comment on age, nationality or gaps in employment.");
	return (
		<div className="w-full max-w-lg">
			<TeamInstructions text={text} setBy="Priya Shah" files={[{ name: "Salary bands 2026.pdf", size: "220 KB" }, { name: "Hiring handbook.docx", size: "1.4 MB" }]} onSave={(t) => { setText(t); toast.success("Instructions saved"); }} onAddFile={() => toast("Choose a file")} />
		</div>
	);
}
