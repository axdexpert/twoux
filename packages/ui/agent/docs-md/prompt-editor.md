# Prompt editor with fields

An editor where row fields and team files are removable chips, inputs and outputs are listed with types, and the prompt is tested on a few rows before running on the whole table.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Defining the prompt behind an AI column or a per-row agent.
- When the output must have a type (text, person, link) to land in the table.

## When not to use

- Asking a question once. Use the Message composer (message-composer).
- Repeated tasks with filter inputs. Use the Task builder (task-builder).

## Structure

1. Hint line ({{ for a field, @ for a team file, ⌘K to rewrite)
2. Prompt text with field chips
3. Inputs list with types
4. Output (one field or several) with types
5. Suggest outputs from prompt
6. Test on 3 rows

## Guidelines

- Fields are chips you can remove, not hidden syntax.
- List inputs and outputs with their type.
- Test on a few rows before running on the whole table; show the per-row cost.
- Let the prompt return "Not found" when it is unsure, rather than forcing an answer.
- ⌘K rewrites selected text as a suggestion, not an overwrite.

## Content

- Use plain headings in the prompt ("Your task", "Rules").
- Field names match the column names people see.

## Accessibility

- Each chip's remove button is named ("Remove field listing.title") (SC 4.1.2).
- {{ and @ open a combobox list of fields or files, with arrow keys and Enter (APG combobox).
- Output type is a radiogroup with a label (APG radio).

## Keyboard

| Keys | Action |
|---|---|
| {{ | Add a field from the row |
| @ | Add a team file |
| ⌘K / Ctrl+K | Rewrite the selected text |
| Enter | Insert the highlighted field |
| Esc | Close the field list |

## Examples

### editor

```tsx
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
```

## Related

- AI column
- Task builder
- Templates gallery
- Change review
