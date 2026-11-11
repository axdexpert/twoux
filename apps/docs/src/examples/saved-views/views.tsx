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
