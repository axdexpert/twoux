# Combobox

Pick one or several values from a long list by typing a few letters, and add a missing one without leaving the form: a location, skills, an owner.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- One value from eight or more options, such as a location from 40 offices.
- Several values from eight or more options, such as skills from a long list (multiple).
- Options the server searches, such as people in a large company (filter={null} with onSearch).
- When a missing option can be created on the spot: Create "Leeds office".

## When not to use

- Up to seven options. Show them all as Radio buttons (radio) or Checkboxes (checkbox).
- Free values with no list, such as email addresses. Use Tag input (tag-input).
- Narrowing a list or a table. Use Filter pills (filter-bar).
- Running commands or jumping anywhere. Use the Command palette (command-palette).

## Structure

1. Label
2. Trigger: the value, or chosen values as tags then +N more
3. Popover: search field
4. Options, grouped (optional), with a check for chosen ones and secondary text
5. Status: searching, no match, or failed with Try again
6. Create "…" (optional)
7. Footer for several: count, limit and Clear

## Guidelines

- Matching ignores case and accents and looks at the label and the secondary text.
- With several values, chosen options are listed first when the list opens and keep their place while people tick, so rows don't jump.
- For server search, results replace the list in one go. "Searching…" shows only if the wait passes one second.
- If options fail to load, say so inside the list with Try again; the rest of the form keeps working.
- Offer Create only when nothing matches exactly. A name-only record is created and selected at once; anything more opens an overlay side panel and is selected when saved.
- Up to three chosen values show as tags in the trigger, then +N more. The footer states the count and any limit.
- A required combobox shows its error under the field on submit; the submit button is never disabled.

## Content

- The placeholder names the action and the thing: Choose a location. The search field says Search locations.
- No match names the text: No locations match "lee".
- Create repeats the text in quotes: Create "Leeds office".

## Accessibility

- The search field is a combobox controlling a listbox; options are named and the highlighted one is announced with aria-activedescendant.
- The trigger is named by the label and the value: "Location, Leeds" or "Skills, 3 selected".
- Result counts and the searching state are announced politely.
- Each tag's remove button is named "Remove Python" and has a 24px target.

## Keyboard

| Keys | Action |
|---|---|
| Enter, Space or ↓ (trigger) | Open the list |
| A letter (trigger) | Open the list with that letter in the search |
| ↑ ↓ | Move through options |
| Enter | Choose the option; with several values it ticks and the list stays open |
| Esc | Close without changing the value; focus returns to the trigger |
| Backspace (trigger) | Move to the last chosen tag; Backspace again removes it |

## Examples

### location

```tsx
import { Combobox, type ComboboxOption } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "One value, with Create", description: "Type a few letters. When an office isn't listed, Create adds it and selects it in one step.", order: 1 };

const START: ComboboxOption[] = [
	["Aberdeen", "Scotland"], ["Belfast", "Northern Ireland"], ["Birmingham", "England"], ["Bristol", "England"], ["Cardiff", "Wales"], ["Edinburgh", "Scotland"],
	["Glasgow", "Scotland"], ["Leeds", "England"], ["Liverpool", "England"], ["London", "England"], ["Manchester", "England"], ["Newcastle", "England"], ["Swansea", "Wales"],
].map(([label, description]) => ({ value: label.toLowerCase(), label, description, group: description }));

export default function Example() {
	const [options, setOptions] = useState(START);
	const [value, setValue] = useState<string | null>("leeds");
	return (
		<div className="w-72">
			<Combobox
				label="Location"
				noun={{ one: "office", many: "offices" }}
				options={options}
				value={value}
				onValueChange={setValue}
				onCreate={(text) => {
					const made = { value: text.toLowerCase(), label: text, description: "New office" };
					setOptions((o) => [...o, made]);
					return made;
				}}
				required
			/>
		</div>
	);
}
```

### server-search

```tsx
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
```

### skills

```tsx
import { Combobox } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Several values", description: "Ticking keeps the list open. Up to three skills show in the field, then +N more; the footer counts them against the limit.", order: 2 };

const SKILLS = ["Airflow", "AWS", "Azure", "dbt", "Docker", "Excel", "Figma", "GCP", "Go", "Java", "Kotlin", "Kubernetes", "Looker", "Power BI", "Python", "R", "React", "Rust", "Scala", "Snowflake", "Spark", "SQL", "Tableau", "Terraform", "TypeScript"].map((s) => ({ value: s, label: s }));

export default function Example() {
	const [value, setValue] = useState<string[]>(["Python", "SQL", "dbt", "Airflow"]);
	return (
		<div className="w-80">
			<Combobox multiple label="Skills" noun={{ one: "skill", many: "skills" }} options={SKILLS} value={value} onValueChange={setValue} max={8} hint="Shown on the listing and used to match candidates." />
		</div>
	);
}
```

## Related

- Checkbox
- Radio
- Tag input
- Choosing a selection control
- Creating a record: dialog, single page or steps
