import { FilterBar, FilterPill, GuideCue, SavedViews, Segment, SegmentedControl, SetupChecklist, toast, useGuide, type GuideStep, type SetupItem } from "@twoux/ui";
import { useMemo, useRef, useState } from "react";

export const meta = {
	title: "Show me from the setup checklist",
	description: "A three-step guide over the real toolbar, shown open here as a preview. In a product it opens only from Start on “Create your first saved view”; Esc or Close ends it and Start brings it back.",
	order: 1,
};

const LISTINGS = [
	{ status: "Open", location: "London" },
	{ status: "Open", location: "Leeds" },
	{ status: "Open", location: "Remote" },
	{ status: "Closing soon", location: "London" },
	{ status: "Closing soon", location: "Manchester" },
	{ status: "Draft", location: "Leeds" },
	{ status: "Closed", location: "London" },
	{ status: "Closed", location: "Remote" },
];
const STATUS = ["Open", "Closing soon", "Draft", "Closed"].map((v) => ({ value: v, label: v, count: LISTINGS.filter((l) => l.status === v).length }));
const LOCATION = ["London", "Leeds", "Manchester", "Remote"].map((v) => ({ value: v, label: v, count: LISTINGS.filter((l) => l.location === v).length }));

export default function Example() {
	const root = useRef<HTMLElement>(null);
	const filtersRef = useRef<HTMLDivElement>(null);
	const layoutRef = useRef<HTMLDivElement>(null);
	const [views, setViews] = useState([{ id: "all", name: "All listings", count: LISTINGS.length }]);
	const [view, setView] = useState("all");
	const [status, setStatus] = useState<string[]>([]);
	const [location, setLocation] = useState<string[]>([]);
	const [layout, setLayout] = useState("table");
	const [savedOne, setSavedOne] = useState(false);

	const shown = LISTINGS.filter((l) => (status.length === 0 || status.includes(l.status)) && (location.length === 0 || location.includes(l.location))).length;

	const steps: GuideStep[] = useMemo(() => [
		{ target: filtersRef, title: "Filter the list", body: "Pick a status or a location. The count updates as you tick, and the filters stay when you save." },
		{ target: layoutRef, title: "Choose a layout", body: "Table suits scanning many listings; Board groups them by status. The view remembers which you chose.", align: "end" },
		{
			// A function target: the Save view button inside SavedViews. If it isn't on screen, this step is skipped.
			target: () => root.current?.querySelector<HTMLElement>("[data-slot='saved-views'] [aria-haspopup='dialog']"),
			title: "Save it as a view",
			body: "Save view keeps these filters and the layout under a name, so you and your team return to them in one click.",
			align: "end",
		},
	], []);

	// Shown open here so you can see the cue straight away. In a product, never pass `preview`: the guide opens only from Start.
	const guide = useGuide(steps, { label: "Saved views guide", preview: true });

	const items: SetupItem[] = [
		{ id: "slack", label: "Connect Slack", done: true },
		{ id: "view", label: "Create your first saved view", done: savedOne, onStart: guide.start },
		{ id: "invite", label: "Invite a teammate", done: false },
	];

	return (
		<div className="flex w-full flex-wrap items-start gap-4">
			<SetupChecklist items={items} className="w-full max-w-64" />
			<section ref={root} aria-label="Listings" className="grid min-w-0 flex-1 basis-80 gap-3 rounded-sm border border-line bg-surface p-3">
				<SavedViews
					views={views}
					value={view}
					onValueChange={setView}
					dirty={status.length + location.length > 0 && view === "all"}
					onSaveAs={(name) => {
						const id = name.toLowerCase().replace(/\W+/g, "-");
						setViews((v) => [...v, { id, name, count: shown }]);
						setView(id);
						setSavedOne(true);
						toast.success(`Saved “${name}”`);
					}}
				/>
				<div className="flex flex-wrap items-center gap-2">
					<div ref={filtersRef} className="min-w-0 rounded-sm">
						<FilterBar>
							<FilterPill field="Status" options={STATUS} selected={status} onChange={setStatus} />
							<FilterPill field="Location" options={LOCATION} selected={location} onChange={setLocation} />
						</FilterBar>
					</div>
					<span className="flex-1" />
					<div ref={layoutRef} className="rounded-sm">
						<SegmentedControl value={layout} onValueChange={setLayout} size="sm" aria-label="Layout">
							<Segment value="table">Table</Segment>
							<Segment value="board">Board</Segment>
						</SegmentedControl>
					</div>
				</div>
				<p className="tabular text-sm text-ink-2" aria-live="polite">{shown} of {LISTINGS.length} listings</p>
			</section>
			<GuideCue {...guide.cueProps} />
		</div>
	);
}
