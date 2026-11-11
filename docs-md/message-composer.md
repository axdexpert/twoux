# Message composer

The message box with context chips, a + menu, @ mentions, / saved tasks, typeahead completions and the Quick or Thorough answer mode.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Any free question or instruction to the assistant, in the panel or on the full page.
- When people need to add or narrow context: @ adds a record as a chip, the + menu attaches files and tools.
- When the trade-off between speed and depth matters: Quick reads what is on screen, Thorough also reads candidates and past listings and says what it costs.

## When not to use

- A task that repeats with the same inputs. Use the Task builder (task-builder) with slots.
- A prompt that runs on every row. Use the Prompt editor (prompt-editor), which lists inputs and outputs with types.
- Searching records by name. Use the table filters (filters), not the assistant.

## Structure

1. Context chips (selection, filters, mentions)
2. Text area
3. Typeahead list
4. + menu (Mention a listing, Run a saved task, Attach a file, toggles, Writing style submenu, Connected tools submenu)
5. Answer mode button (Quick or Thorough)
6. Send or Stop button

## Guidelines

- The box stays clean. Everything that changes context or output lives in the + menu, grouped: inserts, toggles, writing style, connected tools.
- @ and / work without opening the menu. @ suggests listings and adds the chosen one as a removable chip; / suggests saved tasks.
- Typeahead suggests whole questions from your own records and saved tasks. What you typed stays regular and the completion is bold. Enter still sends what you typed unless you moved into the list.
- Answer mode is a stable contract: Quick or Thorough, each with one line on what it does and what it costs. The model name is shown but set by an admin.
- Allow attachments at any point, including follow-ups, and cite files when an answer relies on them.
- While running, Send becomes Stop in the same place. People can still draft the next message.
- One symbol per menu: / for saved tasks and actions, @ for records and files. Each also has a button in the composer bar with the same symbol.
- Only one menu is open at a time; group items under labels such as "Saved tasks" and "Actions".
- A hint under the composer says what the symbols do: "/ for tasks, @ to add a record".
- The Quick or Thorough setting stays visible as a chip and carries over to the next message until changed.

## Content

- Placeholder says what to do: "Ask, or type @ for a listing and / for a saved task".
- Menu items are verbs with the shortcut shown: "Mention a listing @", "Run a saved task /".
- Mode descriptions state the trade-off in plain words: "Answers from what's on screen, in seconds" and "Also reads candidates and past listings. About 5 credits."
- Never name controls with branded or vague words such as "Magic" or "Boost".

## Accessibility

- The text area is an editable combobox: aria-autocomplete="list", aria-controls pointing at the suggestions listbox, aria-expanded reflecting whether it is shown, and aria-activedescendant on the highlighted option.
- Down Arrow moves into suggestions, Enter or Tab accepts the highlighted one, Esc closes the list and keeps focus in the box.
- The + and mode buttons are menu buttons (aria-haspopup="menu", aria-expanded). Toggles are menuitemcheckbox and writing styles are menuitemradio with aria-checked.
- The text area has a programmatic label ("Message") even though the label is visually hidden (SC 3.3.2, 4.1.2).
- @ and / only trigger while the text area has focus, so they are not global character key shortcuts (SC 2.1.4).
- Each context chip's remove button names what it removes, for example "Remove 2 listings from context".
- Typing / or @ opens a combobox list; arrows move, Enter inserts, Esc closes and leaves the typed symbol.

## Keyboard

| Keys | Action |
|---|---|
| Enter | Send, or accept the highlighted suggestion |
| Shift+Enter | New line |
| Down / Up arrow | Move through suggestions |
| Tab | Accept the highlighted suggestion |
| Esc | Close suggestions or the open menu |
| @ | Suggest listings to add as context |
| / | Suggest saved tasks |
| Right arrow / Left arrow | Open or close a submenu in the + menu |

## Examples

### composer

```tsx
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, MessageComposer, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Ask with context", description: "The selection and filters arrive as chips; removing one narrows what the assistant reads. Type @ for a listing or / for a saved task. Enter sends, Shift+Enter adds a line.", order: 1 };

export default function Example() {
	const [chips, setChips] = useState([{ id: "sel", label: "3 selected listings" }, { id: "f", label: "Team is Engineering" }]);
	return (
		<div className="w-full max-w-xl">
			<MessageComposer
				noun={{ one: "listing", many: "listings" }}
				chips={chips}
				onRemoveChip={(id) => setChips((c) => c.filter((x) => x.id !== id))}
				mentions={[{ id: "1", label: "FrontendEngineer" }, { id: "2", label: "DataAnalyst" }, { id: "3", label: "QAEngineer" }]}
				tasks={["Weekly-pipeline-summary", "Draft-rejection-reasons"]}
				onSend={(t, m) => toast(`Sent (${m}): ${t}`)}
				plusMenu={<><DropdownMenuLabel>Insert</DropdownMenuLabel><DropdownMenuItem>Mention a listing</DropdownMenuItem><DropdownMenuItem>Run a saved task</DropdownMenuItem><DropdownMenuItem>Attach a file</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuLabel>Connected tools</DropdownMenuLabel><DropdownMenuItem>Calendar</DropdownMenuItem></>}
			/>
		</div>
	);
}
```

## Related

- Assistant side panel
- Assistant page
- Task builder
- Connected tools
- Team instructions and files
