# Guide cue

A short guide of one to three popovers that point at the real controls for a task, opened only when the person asks to be shown.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Showing where the parts of a task live after the person chose it, from a setup checklist Start, a Help menu entry, a help panel link or a feature label's Show me.
- A task spread over two or three controls in a dense toolbar, such as filter, change the layout, then save a view.

## When not to use

- On page load, first login, a timer or hover. TwoUX has no push tours; use a setup checklist (setup-checklist) and let people start the guide.
- Announcing a feature. Use a feature label (feature-label) and its popover; offer Show me inside it only if the feature spans several controls.
- Explaining a field or concept. Use contextual help (help-system) and the help panel (help-panel).
- More than three steps, or steps that depend on what was entered. Use a help article, or a stepper (stepper) for the task itself.
- Explaining an icon-only button. Use a tooltip (tooltip).

## Structure

1. Target highlight (the focus ring round the real control)
2. Popover anchored to the target
3. Heading (what the person does here)
4. Body (one or two sentences)
5. Step count as text ("Step 2 of 3")
6. Back, then Next or Done (the one primary in the cue)
7. Close ("Close guide", Esc)

## Guidelines

- Open the guide only from something the person pressed, and return focus there when it closes.
- Keep it to one to three steps, each on a real control people will use for the task.
- Point at elements by ref or a data attribute. A step whose target is missing or hidden is skipped, and the count counts only the steps shown; with no targets the guide does not open.
- Leave the page usable: no dimmed overlay or spotlight. Clicking the page keeps the cue open so people can try the control.
- Show one guide cue at a time, and close any other popover first.
- Offer Show me only where the guide can point at something; check with isGuideTargetAvailable.

## Content

- Heading names what the person does, sentence case: "Filter the list", "Save it as a view". Not "Step 1" or "Welcome".
- Body is one or two sentences on what the control does for them.
- Progress is text: "Step 2 of 3". Buttons are Back, Next and Done; the close button is named "Close guide".

## Accessibility

- The cue is a non-modal dialog: role="dialog", aria-modal="false", named by its heading and described by its body (SC 4.1.2).
- Focus moves to the heading on open and returns to the control that started the guide on close (SC 2.4.3).
- Each step change is announced in a polite live region: "Saved views guide, step 2 of 3: Choose a layout" (SC 4.1.3).
- It never opens unrequested (SC 2.2.4). Nothing pulses; the popover's entrance stops under reduced motion (SC 2.3.3).
- The highlight uses the focus colour, 3:1 or more against the page, and the cue sits beside the target so it never covers it (SC 1.4.11, 2.4.11).

## Keyboard

| Keys | Action |
|---|---|
| Enter or Space | Press Next, Back, Done or Close |
| Tab, Shift+Tab | Move between the cue's buttons and on to the page; focus is not trapped |
| Esc | Close the guide and return focus to what started it |

## Examples

### saved-view-guide

```tsx
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
```

## Related

- Setup checklist
- feature-label
- Help panel
- Contextual help
- Announcing new and beta features
- Onboarding to an empty workspace
- Popover rules
