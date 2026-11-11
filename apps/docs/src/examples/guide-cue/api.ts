export const install = "";
export const api = [
	{ component: "GuideCue", props: [
		{ name: "steps", type: "{ target, title, body, side?, align? }[]", description: "One to three steps; more are dropped with a console warning. A step whose target is missing or hidden is skipped, and the count (\"Step 2 of 3\") counts only the steps shown." },
		{ name: "steps[].target", type: "RefObject<HTMLElement> · string · () => HTMLElement | null", description: "The control the step points at: a ref, a CSS selector (prefer a data attribute) or a function. The target gets the focus ring; the page stays usable." },
		{ name: "open · onOpenChange", type: "boolean · (open) => void", description: "Controlled. Set open only from something the person pressed: a setup checklist Start, a Help menu entry, a help panel link or a feature label's Show me. Never on load, on a timer or on hover." },
		{ name: "onFinish", type: "() => void", description: "Done on the last step. Close and Esc end the guide without it." },
		{ name: "label", type: "string", description: "Names the guide in step announcements, e.g. \"Saved views guide, step 2 of 3: Choose a layout\"." },
		{ name: "preview", type: "boolean", description: "Docs and design previews only: shown open without taking focus or scrolling. Never in a product, where the guide opens only from something the person pressed." },
	] },
	{ component: "useGuide", props: [
		{ name: "(steps, { onFinish?, label?, preview? })", type: "hook", description: "Returns { open, finished, start, close, cueProps }. Call start from the button that offers the guide; spread cueProps on GuideCue." },
	] },
	{ component: "isGuideTargetAvailable", props: [
		{ name: "(el)", type: "function", description: "True when the element is in the page, laid out and not hidden. Use it to offer Show me only when the guide can point at something." },
	] },
];
