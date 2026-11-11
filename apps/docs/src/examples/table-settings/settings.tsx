import { Button, TableSettings, type TableSettingsValue } from "@twoux/ui";
import { Settings } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Settings for the People table", description: "Change a setting and close the panel: it asks before discarding. Close without changes and it doesn't ask. Each duplicate rule says what happens to existing rows and credits.", order: 1 };

export default function Example() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<TableSettingsValue>({ duplicates: "keep-oldest", matchOn: "email", deleteEmptyRows: false, template: { shared: false, audience: "workspace" } });
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}><Settings />Table settings</Button>
			<TableSettings
				open={open}
				onOpenChange={setOpen}
				mode="overlay"
				value={value}
				onSave={async (v) => { await new Promise((r) => setTimeout(r, 400)); setValue(v); }}
				columns={[{ id: "email", label: "Work email" }, { id: "name", label: "Name" }]}
				tableName="People"
				workspaceName="TwoUX"
				templateLink="https://app.example.com/t/people"
			/>
		</>
	);
}
