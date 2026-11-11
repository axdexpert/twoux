# Saved views

Named, reusable combinations of filters, sort order and column choices, also kept in the URL so a link reproduces the view.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People apply the same filter configuration on every visit; saving it reduces memory load and repeat work.
- A team needs shared starting points, such as "Expiring this week".
- Expert users want to customise the interface to their own needs.

## When not to use

- For one-off filtering. Use the TwoUX Filter bar; a URL already preserves the state.
- For display choices only. Use the TwoUX Columns menu, which is saved per person per table.

## Structure

1. View switcher (tabs or select) with live counts
2. Save view (rectangle button, shown when filters are on)
3. Unsaved changes indicator
4. Manage: rename, update, set default, delete

## Guidelines

- A view stores filters, sort order and column choices together.
- Keep filter state in the URL. On arrival, apply the default view unless the URL carries filter parameters.
- Show unsaved changes and let people return to the saved state in one step.
- Confirm before deleting or overwriting a view, naming the view in the dialog.
- Show only the metadata people need to tell views apart, such as name and live count.

## Content

- Name views after what they show, "Expiring this week", not "View 3".
- Use fixed action labels for the lifecycle: "Save view", "Update view", "Delete view", "Set as default".
- Confirmation text says what will change, for example that deleting removes the saved filters and columns.
- Most people will not customise, so ship sensible default views.

## Accessibility

- 4.1.2 Name, Role, Value: the view switcher exposes the current view as selected.
- APG dialog pattern: the delete confirmation traps focus, closes on Escape and returns focus to the trigger.
- 4.1.3 Status Messages: "View saved" is announced without moving focus.

## Keyboard

| Keys | Action |
|---|---|
| Tab, ← → | Move between views |
| Enter | Apply the view |
| Esc | Close the save or manage dialog |

## Examples

### views

```tsx
import { FilterBar, FilterPill, SavedViews, type SavedView, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Views with live counts", description: "A view stores filters, sort and columns together. Change a filter and the view shows Unsaved changes, with Reset and Update one click away. The ⋮ menu renames, sets the default or deletes the current view; deleting offers Undo.", order: 1 };

const OPTIONS = ["Open", "Closing soon", "Draft", "Closed"].map((v) => ({ value: v, label: v }));

export default function Example() {
	const [views, setViews] = useState<SavedView[]>([
		{ id: "all", name: "All listings", count: 24 },
		{ id: "open", name: "Open", count: 14 },
		{ id: "closing", name: "Closing soon", count: 4 },
	]);
	const [saved, setSaved] = useState<Record<string, string[]>>({ all: [], open: ["Open", "Closing soon"], closing: ["Closing soon"] });
	const [defaultId, setDefaultId] = useState("all");
	const [view, setView] = useState("open");
	const [status, setStatus] = useState(saved.open);
	const current = saved[view] ?? [];
	const dirty = status.length !== current.length || status.some((s) => !current.includes(s));
	const open = (id: string) => { setView(id); setStatus(saved[id] ?? []); };
	const nameOf = (id: string) => views.find((v) => v.id === id)?.name ?? "";

	return (
		<div className="grid w-full max-w-2xl gap-3">
			<SavedViews
				views={views}
				value={view}
				onValueChange={open}
				dirty={dirty}
				defaultId={defaultId}
				onReset={() => setStatus(current)}
				onSave={() => {
					const before = current;
					setSaved((s) => ({ ...s, [view]: status }));
					toast.success(`Updated “${nameOf(view)}”`, { action: { label: "Undo", onClick: () => setSaved((s) => ({ ...s, [view]: before })) } });
				}}
				onSaveAs={(name) => {
					const id = `${name.toLowerCase().replace(/\W+/g, "-")}-${views.length}`;
					setSaved((s) => ({ ...s, [id]: status }));
					setViews((v) => [...v, { id, name, count: 6 }]);
					setView(id);
					toast.success(`Saved “${name}”`);
				}}
				onRename={(id, name) => {
					const before = nameOf(id);
					const rename = (to: string) => setViews((v) => v.map((x) => (x.id === id ? { ...x, name: to } : x)));
					rename(name);
					toast.success(`Renamed “${before}” to “${name}”`, { action: { label: "Undo", onClick: () => rename(before) } });
				}}
				onSetDefault={(id) => {
					const before = defaultId;
					setDefaultId(id);
					toast.success(`“${nameOf(id)}” opens by default`, { action: { label: "Undo", onClick: () => setDefaultId(before) } });
				}}
				onDelete={(id) => {
					const index = views.findIndex((v) => v.id === id);
					const removed = views[index];
					const next = views.filter((v) => v.id !== id);
					const wasDefault = id === defaultId;
					setViews(next);
					// Deleting the default hands it to the first view left; the open view moves to the default.
					const fallback = wasDefault ? next[0].id : defaultId;
					if (wasDefault) setDefaultId(fallback);
					open(fallback);
					toast.success(`Deleted “${removed.name}”`, {
						action: {
							label: "Undo",
							onClick: () => {
								setViews((v) => [...v.slice(0, index), removed, ...v.slice(index)]);
								if (wasDefault) setDefaultId(id);
								open(id);
							},
						},
					});
				}}
			/>
			<FilterBar>
				<FilterPill field="Status" options={OPTIONS} selected={status} onChange={setStatus} />
			</FilterBar>
		</div>
	);
}
```

## Related

- Filter pills and filter bar
- Filter panel
- Columns menu
- List table
- Data grid
