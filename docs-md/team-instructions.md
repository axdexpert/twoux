# Team instructions and files

Shared instructions and files set once for the workspace, visible and editable, and named in the assistant's empty state and citations when used.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Rules the assistant should always follow for the team, such as UK English or never contacting candidates without asking.
- Reference files such as salary bands or hiring policy that answers should cite.

## When not to use

- Personal preferences for one person. Use writing style in the Message composer (message-composer).
- Rules that grant or block actions. Use Agent permissions (agent-permissions).

## Structure

1. Instructions card (text, Edit, set by and scope)
2. Files card (file list, Add a file)
3. Privacy note

## Guidelines

- Shared context is visible and editable, not hidden in a system prompt.
- Show who set it and that it applies to everyone in the workspace.
- The empty state says it is in use ("Using team instructions and 3 files").
- Answers cite the file when they rely on it.
- Keep conversations private unless shared.

## Content

- Instructions are short imperatives in plain English.
- Scope line: "Set by Rahul S. · applies to everyone in TwoUX".

## Accessibility

- Edit and Add a file are icon buttons with names (SC 4.1.2).
- Card headings label each section (SC 2.4.6, 1.3.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to Edit or Add a file |
| Enter | Edit instructions or add a file |

## Examples

### instructions

```tsx
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
```

## Related

- Assistant side panel
- Citations and sources
- Connected tools
