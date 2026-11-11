// Builds TwoUX components from pristine shadcn/ui source.
//   in:  packages/ui/src/shadcn/<name>.tsx   (untouched upstream copies, new-york-v4)
//   out: packages/ui/src/components/<name>.tsx (generated, do not edit by hand)
// Every difference from shadcn is listed below, with its reason. Run: pnpm tailor
import { readFileSync, writeFileSync } from "node:fs";

const SRC = new URL("../packages/ui/src/shadcn/", import.meta.url);
const OUT = new URL("../packages/ui/src/components/", import.meta.url);

/* ---------- changes applied to every file ---------- */
const COMMON = [
	["Import paths point at TwoUX", (s) => s.replace(/from "cn"/g, 'from "../lib/cn"').replace(/@\/registry\/new-york-v4\/ui\//g, "./")],
	["dark: classes removed: the dark theme comes from the role tokens (light-dark()), so components need no dark variants", (s) => s.replace(/\s+dark:[^\s"'`]+/g, "")],
	[
		"Type mapped to TwoUX's compact scale (shadcn text-xs/sm/base = 12/14/16px → TwoUX text-sm/base/md = 12/13/14px)",
		(s) => s.replace(/\btext-xs\b/g, "§S").replace(/\btext-sm\b/g, "§B").replace(/\btext-base\b/g, "§M").replace(/§S/g, "text-sm").replace(/§B/g, "text-base").replace(/§M/g, "text-md"),
	],
	["Arbitrary radii replaced with tokens", (s) => s.replace(/rounded-\[4px\]/g, "rounded-xs").replace(/rounded-\[2px\]/g, "rounded-xs")],
	[
		"Every state change eases (colour, background, border and ring, 120ms ease-out); shadcn only animates colour and ring, so borders snapped",
		(s) => s.replace(/transition-\[color,box-shadow\]|transition-shadow\b/g, "transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out)"),
	],
	["Menu and palette items fade their highlight in and out (120ms) instead of snapping", (s) => s.replace(/outline-hidden select-none/g, "outline-hidden select-none transition-colors duration-(--duration-fast) ease-(--ease-out)")],
	["Invalid fields get a softer red edge; the message carries the error", (s) => s.replace(/aria-invalid:border-destructive\b/g, "aria-invalid:border-destructive-edge").replace(/(\[aria-invalid=true\]\]:)border-destructive\b/g, "$1border-destructive-edge")],
	[
		"While someone types into an invalid field it shows the normal focus edge, not red: the message below still names the error",
		(s) =>
			s
				.replace(/aria-invalid:border-destructive-edge aria-invalid:ring-destructive\/20/g, "aria-invalid:not-focus-visible:border-destructive-edge")
				.replace(/has-\[\[data-slot\]\[aria-invalid=true\]\]:border-destructive-edge has-\[\[data-slot\]\[aria-invalid=true\]\]:ring-destructive\/20/g, "has-[[data-slot][aria-invalid=true]:not(:focus-visible)]:border-destructive-edge"),
	],
	[
		"Overlays: TwoUX's scrim, which works in light and dark. shadcn's own motion (timing, easing, 95% zoom) is kept as it is",
		(s) => s.replace(/bg-black\/50/g, "bg-scrim"),
	],
	["Dialogs: 16px corners, the soft edge, TwoUX's floating shadow and 20px padding", (s) => s.replace(/rounded-lg border bg-background p-6 shadow-lg/g, "rounded-xl border border-line bg-background p-5 shadow-pop")],
];

/* ---------- applied last, after the per-component changes ---------- */
const SHIFT = { xs: "xs", sm: "xs", md: "sm", lg: "md", xl: "md", "2xl": "md" };
const POST = [
	[
		"Tighter corners: 6px (sm) for buttons, fields and cards, 4px (xs) for what sits inside them, 8px (md) for popovers, menus and dialogs. Every shadcn radius moves one step down",
		(s) => s.replace(/rounded-\[calc\(var\(--radius\)-5px\)\]/g, "rounded-xs").replace(/\brounded(-[tblrse]{1,2})?-(xs|sm|md|lg|xl|2xl)\b/g, (_, side = "", size) => `rounded${side}-${SHIFT[size]}`),
	],
	[
		"Corners follow the role, not shadcn's class: menus and the command palette are overlays (8px); empty-state frames and media tiles are cards (6px)",
		(s) =>
			s
				.replace(/overflow-y-auto rounded-sm border bg-popover p-1/g, "overflow-y-auto rounded-md border bg-popover p-1")
				.replace(/overflow-hidden rounded-sm border bg-popover p-1/g, "overflow-hidden rounded-md border bg-popover p-1")
				.replace("flex h-full w-full flex-col overflow-hidden rounded-sm bg-popover", "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover")
				.replace("justify-center gap-4 rounded-md border border-dashed", "justify-center gap-4 rounded-sm border border-dashed")
				.replace("items-center justify-center rounded-md bg-muted sm:group-data-[size=", "items-center justify-center rounded-sm bg-muted sm:group-data-[size="),
	],
];

/* ---------- per-component tailoring: [why, from, to] ---------- */
const R = (why, from, to) => ({ why, from, to });
const FILES = {
	button: [
		R("Compact heights: 32px default, 28px sm, 24px xs, 36px lg", "h-9 px-4 py-2 has-[>svg]:px-3", "h-8 px-3 has-[>svg]:px-2.5"),
		R("", 'sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"', 'sm: "h-7 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2"'),
		R("", 'lg: "h-10 rounded-md px-6 has-[>svg]:px-4"', 'lg: "h-9 rounded-md px-4 has-[>svg]:px-3"'),
		R("", 'icon: "size-9"', 'icon: "size-8"'),
		R("", '"icon-sm": "size-8"', '"icon-sm": "size-7"'),
		R("", '"icon-lg": "size-10"', '"icon-lg": "size-9"'),
		R("Primary gets a hairline shadow so it sits on grey and white alike", "default: \"bg-primary text-primary-foreground hover:bg-primary/90\"", 'default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover"'),
		R("Outline uses the light input edge and darkens it on hover", "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground", "border border-input bg-background shadow-xs hover:border-input-hover hover:bg-accent hover:text-accent-foreground"),
		R("Adds warning: risky but reversible actions (from Geist)", 'link: "text-primary underline-offset-4 hover:underline",', 'link: "text-primary-ink underline-offset-4 hover:underline",\n        warning: "border border-warn-line bg-warn-bg text-warn hover:border-warn",'),
		R("Icons 14px beside 13px text, so they support the label instead of outweighing it", "[&_svg:not([class*='size-'])]:size-4\"", "[&_svg:not([class*='size-'])]:size-3.5\""),
		R("Button corners come from theme.json (radius.button: a px value or \"pill\"), so buttons can be rounder than fields without touching the component", /rounded-md/g, "rounded-(--radius-button)"),
		R("Tactile press", "whitespace-nowrap transition-all outline-none", "whitespace-nowrap transition-all outline-none active:scale-98"),
		R(
			"Adds loading (spinner, aria-busy, stays focusable) and shortcut (Kbd after the label)",
			`  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}`,
			`  asChild = false,
  loading = false,
  shortcut,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Spinner, aria-busy, ignores clicks, stays focusable. */
    loading?: boolean
    /** Key shown after the label, e.g. "C" or "⌘↵". */
    shortcut?: string
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const iconOnly = String(size).startsWith("icon")

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => (loading ? e.preventDefault() : onClick?.(e))}
      {...props}
    >
      {asChild ? children : (
        <>
          {loading && <Spinner />}
          {children}
          {shortcut && !iconOnly && size !== "xs" && <Kbd className="-mr-1">{shortcut}</Kbd>}
        </>
      )}
    </Comp>
  )
}`,
		),
		R("The shortcut works, not just shows: inside ShortcutsProvider, typing it presses the button (single keys obey the off setting, WCAG 2.1.4)", 'import { cn } from "../lib/cn"', 'import { cn } from "../lib/cn"\nimport { useShortcut } from "../lib/shortcuts"'),
		R("", "  onClick,\n  ...props\n}", "  onClick,\n  ref,\n  ...props\n}"),
		R("", '  const iconOnly = String(size).startsWith("icon")\n', '  const iconOnly = String(size).startsWith("icon")\n  const own = React.useRef<HTMLButtonElement>(null)\n  useShortcut(shortcut, own, loading || !!props.disabled)\n  const setRef = (el: HTMLButtonElement | null) => {\n    own.current = el\n    if (typeof ref === "function") ref(el)\n    else if (ref) ref.current = el\n  }\n'),
		R("", '    <Comp\n      data-slot="button"\n      data-variant={variant}', '    <Comp\n      ref={setRef}\n      data-slot="button"\n      data-variant={variant}'),
		R("", 'import { Slot } from "radix-ui"', 'import { Slot } from "radix-ui"\nimport { Kbd } from "./kbd"\nimport { Spinner } from "./spinner"'),
	],
	badge: [
		R("Status badges are small soft pills, square-ish to read as labels, not buttons", "rounded-full border border-transparent px-2 py-0.5", "h-5 rounded-xs border border-transparent px-1.5"),
		R("Soft tones: the word carries the meaning, colour repeats it (WCAG 1.4.1)", 'default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90"', 'default: "border-primary/30 bg-primary-soft text-primary-ink",\n        success: "border-ok-line bg-ok-bg text-ok",\n        warning: "border-warn-line bg-warn-bg text-warn"'),
		R("", 'secondary:\n          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"', 'secondary: "border-neutral-line bg-neutral-bg text-neutral"'),
		R("", /destructive:\n\s+"bg-destructive text-white[^"]*"/, 'destructive: "border-bad-line bg-bad-bg text-bad"'),
		R(
			"Adds dot: a leading dot for scanning long columns",
			`  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {`,
			`  asChild = false,
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; dot?: boolean }) {`,
		),
		R("", "      {...props}\n    />\n  )\n}\n\nexport { Badge", '      {...props}\n    >\n      {dot && !asChild && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}\n      {children}\n    </Comp>\n  )\n}\n\nexport { Badge'),
	],
	kbd: [R("Inside a primary or destructive button, the key sits on a darker tint so white text keeps 4.5:1", '"[[data-slot=tooltip-content]_&]:bg-background/20', '"[[data-slot=button][data-variant=default]_&]:bg-black/20 [[data-slot=button][data-variant=default]_&]:text-primary-foreground [[data-slot=button][data-variant=destructive]_&]:bg-black/20 [[data-slot=button][data-variant=destructive]_&]:text-white",\n        "[[data-slot=tooltip-content]_&]:bg-background/20')],
	checkbox: [
		R("Edge at 3.59:1: nothing else identifies a checkbox (WCAG 1.4.11)", "border border-input shadow-xs", "border border-control shadow-xs"),
		R("Invisible 26px hit area (WCAG 2.5.8)", '"peer size-4 shrink-0', '"peer relative size-4 shrink-0 after:absolute after:-inset-1.25 after:rounded-sm'),
		R("The tick scales in instead of appearing", '"grid place-content-center text-current transition-none"', '"grid place-content-center text-current animate-in zoom-in-50 fade-in-0 duration-150"'),
		R("Indeterminate (some rows selected) shows an indigo box with a minus, not a tick on an empty box", 'import { CheckIcon } from "lucide-react"', 'import { CheckIcon, MinusIcon } from "lucide-react"'),
		R("", "data-[state=checked]:border-primary", "data-[state=checked]:border-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"),
		R("", '<CheckIcon className="size-3.5" />', '<CheckIcon className="size-3.5 text-current group-data-[state=indeterminate]/checkbox:hidden" />\n        <MinusIcon className="hidden size-3.5 text-current group-data-[state=indeterminate]/checkbox:block" />'),
		R("", '"peer relative size-4 shrink-0', '"group/checkbox peer relative size-4 shrink-0'),
	],
	"radio-group": [
		R("Edge at 3.59:1 (WCAG 1.4.11)", "border border-input text-primary", "border border-control text-primary"),
		R("Invisible 26px hit area (WCAG 2.5.8)", '"aspect-square size-4 shrink-0', '"relative aspect-square size-4 shrink-0 after:absolute after:-inset-1.25 after:rounded-full'),
		R("Compact rows", '"grid gap-3"', '"grid gap-1.5"'),
		R("The dot scales in instead of appearing", 'className="relative flex items-center justify-center"', 'className="relative flex animate-in items-center justify-center zoom-in-50 fade-in-0 duration-150"'),
	],
	switch: [
		R("Thumb glides with TwoUX's ease-out", "ring-0 transition-transform", "ring-0 transition-transform duration-(--duration-base) ease-(--ease-out)"),
		R("Off track at 3.59:1 so the switch is visible when off (WCAG 1.4.11)", "data-[state=unchecked]:bg-input", "data-[state=unchecked]:bg-control"),
		R("Invisible hit area: 28px around the 16px track (WCAG 2.5.8)", '"peer group/switch inline-flex', '"peer group/switch relative inline-flex after:absolute after:-inset-1.5 after:rounded-full'),
		R("Sized to its label: a 16×28 track by default (14×24 small), no taller than the 15px text beside it, with 2px of track around the thumb", "data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6", "px-px data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3.5 data-[size=sm]:w-6"),
		R("", "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3", "group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2.5"),
		R("Thumb travels the full track at each size", "data-[state=checked]:translate-x-[calc(100%-2px)]", "group-data-[size=default]/switch:data-[state=checked]:translate-x-3 group-data-[size=sm]/switch:data-[state=checked]:translate-x-2.5"),
	],
	tabs: [
		R("Inactive tabs use secondary text (9:1), not 60% ink, which is 4.46:1 on the tab rail", "text-foreground/60", "text-ink-2"),
		R("TwoUX's default is the underline (line) style for page sections", 'defaultVariants: {\n      variant: "default",\n    },\n  }\n)\n\nfunction TabsList', 'defaultVariants: {\n      variant: "line",\n    },\n  }\n)\n\nfunction TabsList'),
		R("", 'function TabsList({\n  className,\n  variant = "default",', 'function TabsList({\n  className,\n  variant = "line",'),
		R("Line tabs span the width with a divider underneath", 'line: "gap-1 bg-transparent"', 'line: "h-9 w-full justify-start gap-5 rounded-none border-b border-line bg-transparent p-0"'),
		R("Line tabs: no padding, indigo text and underline when active", '"after:absolute after:bg-foreground', '"group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:px-0 group-data-[variant=line]/tabs-list:data-[state=active]:text-primary-ink group-data-[variant=line]/tabs-list:after:bottom-[-1px] group-data-[variant=line]/tabs-list:after:bg-primary",\n        "after:absolute after:bg-foreground'),
		R(
			"Adds count after the label; it pops when it changes",
			"function TabsTrigger({\n  className,\n  ...props\n}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {",
			"function TabsTrigger({\n  className,\n  count,\n  children,\n  ...props\n}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { count?: number }) {",
		),
		R("", '        className\n      )}\n      {...props}\n    />\n  )\n}\n\nfunction TabsContent', '        className\n      )}\n      {...props}\n    >\n      {children}\n      {count !== undefined && <Count value={count} className="text-sm font-normal text-ink-3" />}\n    </TabsPrimitive.Trigger>\n  )\n}\n\nfunction TabsContent'),
		R("One indicator slides to the active tab (underline or pill) instead of jumping; vertical tabs keep per-tab styling", 'import { Tabs as TabsPrimitive } from "radix-ui"', 'import { Tabs as TabsPrimitive } from "radix-ui"\nimport { Count } from "./motion"\nimport { ActiveIndicator } from "../lib/active-indicator"'),
		R("", '      className={cn(tabsListVariants({ variant }), className)}\n      {...props}\n    />', '      className={cn(tabsListVariants({ variant }), "relative", className)}\n      {...props}\n    >\n      <ActiveIndicator\n        selector="[data-state=active]"\n        fit={variant === "line" ? "x" : "box"}\n        className={cn(\n          "group-data-[orientation=vertical]/tabs:hidden",\n          variant === "line" ? "bottom-[-1px] h-0.5 rounded-full bg-primary" : "rounded-md bg-background shadow-sm"\n        )}\n      />\n      {props.children}\n    </TabsPrimitive.List>'),
		R("", "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm", "group-data-[orientation=vertical]/tabs:group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm"),
		R("", '"data-[state=active]:bg-background', '"group-data-[orientation=vertical]/tabs:data-[state=active]:bg-background'),
		R("", "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", "group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100"),
	],
	toggle: [
		R("Compact heights", 'default: "h-9 min-w-9 px-2"', 'default: "h-8 min-w-8 px-2"'),
		R("", 'sm: "h-8 min-w-8 px-1.5"', 'sm: "h-7 min-w-7 px-1.5"'),
		R("", 'lg: "h-10 min-w-10 px-2.5"', 'lg: "h-9 min-w-9 px-2.5"'),
		R("On reads as chosen, not hovered: indigo tint and text, which stay while the pointer is over it", "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground", "data-[state=on]:bg-primary-soft data-[state=on]:text-primary-ink data-[state=on]:hover:bg-primary-soft data-[state=on]:hover:text-primary-ink"),
		R("Icons 14px, in proportion with 13px text", "[&_svg:not([class*='size-'])]:size-4", "[&_svg:not([class*='size-'])]:size-3.5"),
		R("Outline: light edge that darkens on hover, indigo edge when on", "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground", "border border-input bg-transparent shadow-xs hover:border-input-hover hover:bg-accent hover:text-accent-foreground data-[state=on]:border-primary/30 data-[state=on]:hover:border-primary/50"),
	],
	"toggle-group": [],
	tooltip: [
		R("Short delay so moving across a toolbar does not flash labels", "delayDuration = 0,", "delayDuration = 300,"),
		R("Keeps a gap from the trigger and stays inside the window", "sideOffset = 0,", "sideOffset = 4,\n  collisionPadding = 8,"),
		R("", "sideOffset={sideOffset}", "sideOffset={sideOffset}\n        collisionPadding={collisionPadding}"),
		R("Compact padding", "px-3 py-1.5", "px-2 py-1"),
	],
	input: [
		R("Compact 32px, light edge that darkens on hover", "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-xs", "h-8 w-full min-w-0 rounded-md border border-input bg-background px-2.5 py-1 text-base shadow-xs hover:border-input-hover"),
		R("One size on every screen", " md:text-base", ""),
	],
	"input-group": [
		R("Compact 32px", '"h-9 min-w-0 has-[>textarea]:h-auto"', '"h-8 min-w-0 has-[>textarea]:h-auto"'),
		R("Light edge darkens on hover", "border border-input shadow-xs", "border border-input bg-background shadow-xs hover:border-input-hover"),
	],
	textarea: [R("", " md:text-base", "")],
	label: [],
	separator: [],
	field: [
		R("TwoUX spacing between fields is tighter (compact density)", "flex w-full flex-col gap-7", "flex w-full flex-col gap-5"),
		R("An invalid field keeps its label and value in normal text; only the edge and the message turn red (less alarming, still clear)", "group/field flex w-full gap-3 data-[invalid=true]:text-destructive", "group/field flex w-full gap-3"),
	],
	"dropdown-menu": [R("Shortcut slot holds keys; no letter-spacing so Kbd groups read cleanly", '"ml-auto text-sm tracking-widest text-muted-foreground"', '"ml-auto flex items-center gap-0.5 text-sm text-muted-foreground"'), R("Icons stay smaller than the 13px label and muted", "[&_svg:not([class*='size-'])]:size-4", "[&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground"), R("Check and radio marks sit at the end of the item, so every label in a menu starts at the same edge", "py-1.5 pr-2 pl-8", "py-1.5 pr-8 pl-2"), R("", "absolute left-2 flex size-3.5", "absolute right-2 flex size-3.5"), R("Group headings are smaller and muted, so they read as headings, not as items people can choose", "px-2 py-1.5 text-base font-medium data-[inset]:pl-8", "px-2 pt-2 pb-1 text-sm font-medium text-ink-3 data-[inset]:pl-8")],
	dialog: [],
	breadcrumb: [
		R("One line in the top bar: never wraps; the current page truncates last and reads darker", '"flex flex-wrap items-center gap-1.5 text-base break-words text-muted-foreground sm:gap-2.5"', '"flex min-w-0 flex-nowrap items-center gap-1.5 text-base text-ink-2"'),
		R("", 'className={cn("inline-flex items-center gap-1.5", className)}', 'className={cn("inline-flex min-w-0 items-center gap-1.5", className)}'),
		R("", 'className={cn("transition-colors hover:text-foreground", className)}', 'className={cn("rounded-xs whitespace-nowrap transition-colors duration-(--duration-fast) hover:text-ink", className)}'),
		R("", 'className={cn("font-normal text-foreground", className)}', 'className={cn("truncate font-medium text-ink", className)}'),
		R("Separator chevrons are small and muted", 'className={cn("[&>svg]:size-3.5", className)}', 'className={cn("text-ink-3 [&>svg]:size-3", className)}'),
		R("", 'className={cn("flex size-9 items-center justify-center", className)}', 'className={cn("flex size-6 items-center justify-center", className)}'),
	],
	avatar: [
		R("22px by default (18px small, 32px large); initials 11px semibold in white on a per-person colour", "relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6", "relative flex size-5.5 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-8 data-[size=sm]:size-4.5"),
		R("", '"flex size-full items-center justify-center rounded-full bg-muted text-base text-muted-foreground group-data-[size=sm]/avatar:text-sm"', '"flex size-full items-center justify-center rounded-full bg-(--avatar,var(--color-neutral-600)) text-xs font-semibold text-white group-data-[size=lg]/avatar:text-sm"'),
		R("Stacks overlap by 6px with a 2px white ring", "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background", "group/avatar-group flex -space-x-1.5 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-surface"),
		R("", "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-base text-muted-foreground ring-2 ring-background", "relative flex size-5.5 shrink-0 items-center justify-center rounded-full bg-hover text-xs font-medium text-ink-2 ring-2 ring-surface"),
	],
	sheet: [
		R("Panels are 440px on the right (full width on phones), slide with TwoUX's motion, and float with the overlay shadow", "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out", "fixed z-50 flex flex-col gap-0 bg-background shadow-pop transition ease-in-out"),
		R("", "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm", "inset-y-0 right-0 h-full w-full border-l border-line data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-10 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-10 sm:max-w-110"),
		R("", "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm", "inset-y-0 left-0 h-full w-3/4 border-r border-line data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-10 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-10 sm:max-w-64"),
		R("", 'className={cn("font-semibold text-foreground", className)}', 'className={cn("text-md font-semibold text-foreground", className)}'),
		R("", 'className={cn("text-base text-muted-foreground", className)}', 'className={cn("text-base text-ink-2", className)}'),
		R("Motion from shadcn's Base UI sheet: a 40px slide with a fade, 200ms ease-in-out both ways (the full-width 500ms slide felt heavy)", "data-[state=closed]:duration-300", "data-[state=closed]:duration-200"),
		R("", "data-[state=open]:duration-500", "data-[state=open]:duration-200"),
		R("", "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top", "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-10 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-10"),
		R("", "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-10 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-10"),
	],
	popover: [
		R("Floats like every overlay: 8px corners, light edge, the floating shadow, 12px padding", "rounded-md border bg-popover p-4 text-popover-foreground shadow-md", "rounded-lg border border-line bg-popover p-3 text-popover-foreground shadow-pop"),
		R("Never cut off: keeps 8px from the viewport edge and flips when there is no room", '  sideOffset = 4,\n  ...props\n}: React.ComponentProps<typeof PopoverPrimitive.Content>) {', '  sideOffset = 4,\n  collisionPadding = 8,\n  ...props\n}: React.ComponentProps<typeof PopoverPrimitive.Content>) {'),
		R("", "        sideOffset={sideOffset}\n", "        sideOffset={sideOffset}\n        collisionPadding={collisionPadding}\n"),
	],
	collapsible: [],
	"button-group": [
		R("", 'import { cva, type VariantProps } from "class-variance-authority"', 'import * as React from "react"\nimport { cva, type VariantProps } from "class-variance-authority"'),
		R("Text segment on the quiet surface with the light edge, 12px padding and 14px icons, in proportion with compact buttons", "flex items-center gap-2 rounded-md border bg-muted px-4 text-base font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", "flex items-center gap-2 rounded-md border border-line bg-surface-2 px-3 text-base font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5"),
		R("The divider between two filled buttons uses the primary-on-primary edge, so a split primary button reads as one control with two parts", "relative m-0! self-stretch bg-input data-[orientation=vertical]:h-auto", "relative m-0! self-stretch bg-input data-[orientation=vertical]:h-auto in-data-[variant=default]:bg-primary-foreground/30"),
	],
	select: [
		R("Compact heights (32px, 28px small), field edge with hover, white fill, 14px chevron", "data-[size=default]:h-9 data-[size=sm]:h-8", "data-[size=default]:h-8 data-[size=sm]:h-7"),
		R("", "rounded-md border border-input bg-transparent px-3 py-2", "rounded-md border border-input bg-background px-2.5 py-1.5 hover:border-input-hover"),
		R("", "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground\",\n        className\n      )}\n      {...props}\n    >\n      {children}", "[&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground\",\n        className\n      )}\n      {...props}\n    >\n      {children}"),
		R("The list floats: 8px corners, light edge, floating shadow", "overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md", "overflow-x-hidden overflow-y-auto rounded-lg border border-line bg-popover text-popover-foreground shadow-pop"),
	],
	table: [
		R("Adds containerClassName, so a table can scroll inside a fixed height and keep its header sticky", 'function Table({ className, ...props }: React.ComponentProps<"table">) {', 'function Table({ className, containerClassName, size = "default", ...props }: React.ComponentProps<"table"> & { containerClassName?: string; size?: "default" | "dense" }) {'),
		R("Adds size=\"dense\": 28px rows and header with 8px padding, the same 13px text, for spreadsheet-like data (inventories, ledgers, imports, mapping). Not a density setting", 'className={cn("w-full caption-bottom text-base", className)}', 'data-size={size}\n        className={cn("group/table w-full caption-bottom text-base", className)}'),
		R("", 'className="relative w-full overflow-x-auto"', 'className={cn("relative w-full overflow-x-auto", containerClassName)}'),
		R("Sticky header on the quiet surface, with the light divider", 'className={cn("[&_tr]:border-b", className)}', 'className={cn("sticky top-0 z-10 bg-surface-2 [&_tr]:border-b [&_tr]:border-line", className)}'),
		R("Rows: light divider, hover fill, indigo tint when selected, an indigo edge on the keyboard-focused row", '"border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted"', '"border-b border-line transition-colors duration-(--duration-fast) ease-(--ease-out) outline-none hover:bg-hover has-aria-expanded:bg-hover data-[state=selected]:bg-primary-soft data-[focused=true]:shadow-[inset_2px_0_0_var(--color-primary)]"'),
		R("Rows and header use the row tokens (36px, or 28px dense), 12px side padding and 2px top and bottom, so a 28px control in a cell keeps the row at 36px; header labels 12px medium grey, in sentence case", '"h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground', '"h-row px-3 text-left align-middle text-sm font-medium whitespace-nowrap text-ink-2 group-data-[size=dense]/table:h-row-dense group-data-[size=dense]/table:px-2 data-pinned:sticky data-pinned:left-[var(--pin,0px)] data-pinned:z-20 data-pinned:bg-surface-2 data-[pinned=last]:border-r data-[pinned=last]:border-line'),
		R("Frozen columns: data-pinned on a head and its cells keeps them in view when the table scrolls sideways, at left var(--pin); data-pinned=\"last\" draws the edge", '"p-2 align-middle whitespace-nowrap', '"h-row px-3 py-hair align-middle whitespace-nowrap group-data-[size=dense]/table:h-row-dense group-data-[size=dense]/table:px-2 group-data-[size=dense]/table:py-0 data-pinned:sticky data-pinned:left-[var(--pin,0px)] data-pinned:z-1 data-pinned:bg-surface data-[pinned=last]:border-r data-[pinned=last]:border-line in-[tr:hover]:data-pinned:bg-hover in-data-[state=selected]:data-pinned:bg-primary-soft'),
		R("", '"border-t bg-muted/50 font-medium', '"border-t border-line bg-surface-2 font-medium'),
	],
	card: [
		R("Compact card: 16px padding and gaps, light edge, 6px corners, the resting card shadow", '"flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm"', '"flex flex-col gap-4 overflow-hidden rounded-md border border-line bg-card py-4 text-card-foreground shadow-card"'),
		R("", "items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", "items-start gap-1 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4"),
		R("Title 14px semibold, description in readable grey", 'className={cn("leading-none font-semibold", className)}', 'className={cn("text-md font-semibold", className)}'),
		R("Optional level makes the title a heading, for cards that hold a page section", 'function CardTitle({ className, ...props }: React.ComponentProps<"div">) {\n  return (\n    <div\n      data-slot="card-title"', 'function CardTitle({ className, level, ...props }: React.ComponentProps<"div"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {\n  return (\n    <div\n      role={level ? "heading" : undefined}\n      aria-level={level}\n      data-slot="card-title"'),
		R("", 'className={cn("text-base text-muted-foreground", className)}', 'className={cn("text-base text-ink-2", className)}'),
		R("", 'className={cn("px-6", className)}', 'className={cn("px-4", className)}'),
		R(
			"Adds CardFooter band: a tinted strip across the bottom for a secondary line (as in Clerk's “Already have an account?”)",
			'function CardFooter({ className, ...props }: React.ComponentProps<"div">) {\n  return (\n    <div\n      data-slot="card-footer"\n      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}',
			'function CardFooter({ className, band = false, ...props }: React.ComponentProps<"div"> & { band?: boolean }) {\n  return (\n    <div\n      data-slot="card-footer"\n      data-band={band || undefined}\n      className={cn("flex items-center px-4 [.border-t]:pt-4", band && "-mb-4 justify-center border-t border-line bg-surface-2 py-3 text-base text-ink-2 [.border-t]:pt-3", className)}',
		),
	],
	alert: [
		R("Compact banner: 8px corners, 14px icon, room for one action on the right", "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-base has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current", "relative grid w-full grid-cols-[0_1fr_auto] items-start gap-y-0.5 rounded-md border px-3 py-2.5 text-base has-[>svg]:grid-cols-[calc(var(--spacing)*3.5)_1fr_auto] has-[>svg]:gap-x-2.5 [&>svg]:size-3.5 [&>svg]:translate-y-[3px] [&>svg]:text-current"),
		R("Information is neutral grey, not blue: colour is kept for problems", 'default: "bg-card text-card-foreground"', 'default: "border-line bg-surface-2 text-ink [&>svg]:text-ink-2"'),
		R("Errors: soft red fill and edge, dark text; adds warning", '"bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"', '"border-bad-line bg-bad-bg text-ink *:data-[slot=alert-description]:text-ink-2 [&>svg]:text-bad",\n        warning: "border-warn-line bg-warn-bg text-ink *:data-[slot=alert-description]:text-ink-2 [&>svg]:text-warn"'),
		R("Only errors interrupt a screen reader (role alert); information and warnings are polite (role status)", '      role="alert"\n      className={cn(alertVariants({ variant }), className)}', '      role={variant === "destructive" ? "alert" : "status"}\n      className={cn(alertVariants({ variant }), className)}'),
		R("Title wraps instead of being cut to one line", '"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight"', '"col-start-2 min-h-5 font-medium"'),
		R("", '"col-start-2 grid justify-items-start gap-1 text-base text-muted-foreground [&_p]:leading-relaxed"', '"col-start-2 grid justify-items-start gap-1 text-base text-ink-2"'),
		R("Adds AlertAction: Dismiss (ghost) then one action, on the right", "export { Alert, AlertTitle, AlertDescription }", 'function AlertAction({ className, ...props }: React.ComponentProps<"div">) {\n  return (\n    <div\n      data-slot="alert-action"\n      className={cn("col-start-3 row-span-2 row-start-1 -my-1 flex items-center gap-1 self-center pl-2", className)}\n      {...props}\n    />\n  )\n}\n\nexport { Alert, AlertTitle, AlertDescription, AlertAction }'),
	],
	"alert-dialog": [
		R("Confirmations are 420px wide at most", "data-[size=default]:sm:max-w-lg", "data-[size=default]:sm:max-w-[420px]"),
		R("Body text readable at 6:1, not the muted grey", 'className={cn("text-base text-muted-foreground", className)}', 'className={cn("text-base text-ink-2", className)}'),
		R("Smaller media tile", "mb-2 inline-flex size-16 items-center justify-center rounded-md bg-muted", "mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-muted"),
		R("", "*:[svg:not([class*='size-'])]:size-8", "*:[svg:not([class*='size-'])]:size-5"),
	],
	skeleton: [R("Shimmer at 1.4s instead of a pulse, on TwoUX's hover grey; stops with reduced motion", '"animate-pulse rounded-md bg-accent"', '"animate-shimmer rounded-xs bg-linear-to-r from-hover via-surface-2 to-hover bg-size-[200%_100%]"')],
	empty: [
		R("Dashed container sized to the region it replaces, compact spacing", '"flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12"', '"flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line-strong p-6 text-center text-balance md:p-10"'),
		R("", '"flex max-w-sm flex-col items-center gap-2 text-center"', '"flex max-w-sm flex-col items-center gap-1 text-center"'),
		R("32px neutral icon tile, no illustration; adds the error tile for the error state", `icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",`, `icon: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-ink-2 [&_svg:not([class*='size-'])]:size-4",\n        error: "flex size-8 shrink-0 items-center justify-center rounded-md bg-bad-bg text-bad [&_svg:not([class*='size-'])]:size-4",`),
		R("", 'className={cn("text-lg font-medium tracking-tight", className)}', 'className={cn("text-md font-semibold", className)}'),
		R("The title is a real heading for screen readers (level 2 by default, set level to fit the page)", 'function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {\n  return (\n    <div\n      data-slot="empty-title"', 'function EmptyTitle({ className, level = 2, ...props }: React.ComponentProps<"div"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {\n  return (\n    <div\n      role="heading"\n      aria-level={level}\n      data-slot="empty-title"'),
		R("Description at most 36 characters wide, readable grey", '"text-base/relaxed text-muted-foreground', '"max-w-[36ch] text-base text-ink-2'),
		R("", '"flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-base text-balance"', '"flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-base text-balance"'),
	],
	sonner: [
		R("Theme from TwoUX's <html data-theme> (light by default), not next-themes", 'import { useTheme } from "next-themes"\n', 'import { useTheme } from "./theme"\n'),
		R("", '  const { theme = "system" } = useTheme()\n\n', '  const { resolved } = useTheme()\n\n'),
		R("", 'theme={theme as ToasterProps["theme"]}', 'theme={resolved}'),
		R("Status icons 14px in their status colour", '<CircleCheckIcon className="size-4" />', '<CircleCheckIcon className="size-3.5 text-ok" />'),
		R("", '<InfoIcon className="size-4" />', '<InfoIcon className="size-3.5 text-ink-2" />'),
		R("", '<TriangleAlertIcon className="size-4" />', '<TriangleAlertIcon className="size-3.5 text-warn" />'),
		R("", '<OctagonXIcon className="size-4" />', '<OctagonXIcon className="size-3.5 text-bad" />'),
		R("", '<Loader2Icon className="size-4 animate-spin" />', '<Loader2Icon className="size-3.5 animate-spin text-ink-3" />'),
		R("TwoUX defaults: bottom right, 16px from the edges, one at a time, 6 seconds, 340px wide; Undo is a quiet text button", '      {...props}\n    />', '      position="bottom-right"\n      offset={{ bottom: clearance, right: 16 }}\n      visibleToasts={1}\n      duration={6000}\n      toastOptions={{\n        classNames: {\n          toast: "gap-2! px-3! py-2.5! text-base! shadow-pop! border-line!",\n          title: "font-medium!",\n          description: "text-ink-2!",\n          actionButton: "h-6! rounded-sm! bg-transparent! px-2! text-base! font-medium! text-primary-ink! hover:bg-hover!",\n        },\n      }}\n      {...props}\n    />'),
		R("", '"--border-radius": "var(--radius)",', '"--border-radius": "var(--radius-md)",\n          "--width": "340px",'),
		R("Solid surface: shadcn points at --popover and --border, which TwoUX names --color-popover and --color-line, so the toast was see-through", '"--normal-bg": "var(--popover)",\n          "--normal-text": "var(--popover-foreground)",\n          "--normal-border": "var(--border)",', '"--normal-bg": "var(--color-surface)",\n          "--normal-text": "var(--color-ink)",\n          "--normal-border": "var(--color-line)",'),
		R(
			"Anti-collision: the toast rises above the focused element and anything marked data-toast-avoid (such as a sticky footer), so it never hides them (WCAG 2.4.11)",
			"const Toaster = ({ ...props }: ToasterProps) => {\n",
			`/** TwoUX: bottom offset that keeps toasts clear of the focused element and of [data-toast-avoid] elements. */
function useToastClearance(base = 16, width = 340, height = 96) {
  const [clearance, setClearance] = React.useState(base)
  React.useEffect(() => {
    let frame = 0
    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const zoneTop = vh - base - height
      const zoneLeft = vw - base - width
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-toast-avoid]"))
      const active = document.activeElement as HTMLElement | null
      if (active && active !== document.body && !active.closest("[data-sonner-toaster]")) targets.push(active)
      let next = base
      for (const el of targets) {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height || r.top < vh * 0.4) continue
        if (r.bottom > zoneTop && r.top < vh && r.right > zoneLeft) next = Math.max(next, Math.round(vh - r.top + 8))
      }
      setClearance(next)
    }
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    measure()
    document.addEventListener("focusin", update)
    document.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    const mo = new MutationObserver(update)
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-toast-avoid"] })
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("focusin", update)
      document.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
      mo.disconnect()
    }
  }, [base, width, height])
  return clearance
}

const Toaster = ({ ...props }: ToasterProps) => {
  const clearance = useToastClearance()
`,
		),
		R("", '"use client"\n', '"use client"\n\nimport * as React from "react"\n'),
	],
	calendar: [
		R("UK English by default: en-GB month and weekday names, weeks start on Monday", 'import { Button, buttonVariants } from "./button"', 'import { enGB } from "react-day-picker/locale"\n\nimport { Button, buttonVariants } from "./button"'),
		R("", "  showOutsideDays = true,\n", "  showOutsideDays = true,\n  locale = enGB,\n  weekStartsOn = 1,\n  labels,\n"),
		R("", "    <DayPicker\n      showOutsideDays={showOutsideDays}\n", "    <DayPicker\n      showOutsideDays={showOutsideDays}\n      locale={locale}\n      weekStartsOn={weekStartsOn}\n"),
		R("", 'date.toLocaleString("default", { month: "short" })', 'date.toLocaleString("en-GB", { month: "short" })'),
		R("Month buttons named in plain words: Previous month, Next month", "        ...formatters,\n      }}\n", "        ...formatters,\n      }}\n      labels={{\n        labelPrevious: () => \"Previous month\",\n        labelNext: () => \"Next month\",\n        ...labels,\n      }}\n"),
		R("Weekday and week-number labels on TwoUX's 12px muted text, not an arbitrary 0.8rem", '"flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none"', '"flex-1 rounded-md text-sm font-normal text-ink-3 select-none"'),
		R("", '"text-[0.8rem] text-muted-foreground select-none"', '"text-sm text-ink-3 select-none"'),
		R("Today gets a ring, not a fill, so it never looks selected; the day's name also says Today", '"rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none"', '"rounded-md font-semibold text-ink [&:not([data-selected=true])_button]:ring-1 [&:not([data-selected=true])_button]:ring-control [&:not([data-selected=true])_button]:ring-inset data-[selected=true]:rounded-none"'),
		R("Days inside a range use the selection fill, as selected rows do", '"rounded-l-md bg-accent"', '"rounded-l-md bg-selected"'),
		R("", '"rounded-r-md bg-accent"', '"rounded-r-md bg-selected"'),
		R("", "data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground", "data-[range-middle=true]:bg-selected data-[range-middle=true]:text-ink"),
		R(
			"Parts kept between renders: shadcn creates Root, Chevron and WeekNumber afresh each render, so any state change remounted the grid and a click that started on one day button ended on a new one and was lost",
			/(  return \(\n    <DayPicker[\s\S]*?)      components=\{\{\n([\s\S]*?        \.\.\.components,\n)      \}\}\n/,
			"  const parts = React.useMemo(\n    (): React.ComponentProps<typeof DayPicker>[\"components\"] => ({\n$2    }),\n    [components]\n  )\n\n$1      components={parts}\n",
		),
	],
	command: [
		R("Icons stay smaller than the label and muted", "[&_svg:not([class*='size-'])]:size-4", "[&_svg:not([class*='size-'])]:size-3.5"),
		R("", '<SearchIcon className="size-4 shrink-0 opacity-50" />', '<SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />'),
		R("Group labels in sentence case, quiet", "[&_[cmdk-group-heading]]:text-sm", "[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:text-ink-3"),
		R(
			"Dialog keeps compact rows and 14px icons; shadcn enlarges them to 20px with 12px padding",
			'<Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">',
			'<Command {...commandProps} className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group]]:px-1.5 [&_[cmdk-input]]:h-12 [&_[cmdk-input]]:text-md">',
		),
		R("Shortcut slot holds words as well as keys: no letter-spacing, icons align", '"ml-auto text-sm tracking-widest text-muted-foreground"', '"ml-auto flex items-center gap-1 text-sm text-muted-foreground"'),
		R("Adds commandProps (shouldFilter, loop…) passed to the inner Command", "  showCloseButton = true,\n  ...props\n}: React.ComponentProps<typeof Dialog> & {\n  title?: string", "  showCloseButton = false,\n  commandProps,\n  ...props\n}: React.ComponentProps<typeof Dialog> & {\n  commandProps?: React.ComponentProps<typeof CommandPrimitive>\n  title?: string"),
		R("Opens near the top like a search, with the floating shadow; Esc closes it so no close button", 'className={cn("overflow-hidden p-0", className)}', 'className={cn("top-24 translate-y-0 overflow-hidden border-line p-0 shadow-pop sm:max-w-xl", className)}'),
	],
};

let report = "# How TwoUX differs from shadcn/ui\n\nGenerated by `scripts/tailor-shadcn.mjs`. Each component starts from the untouched shadcn source in `packages/ui/src/shadcn/`.\n\n## Every component\n\n" + [...COMMON, ...POST].map(([w]) => `- ${w}`).join("\n") + "\n";
const problems = [];
for (const [name, edits] of Object.entries(FILES)) {
	let s = readFileSync(new URL(`${name}.tsx`, SRC), "utf8");
	for (const [, fn] of COMMON) s = fn(s);
	const whys = [];
	for (const e of edits) {
		const before = s;
		s = typeof e.from === "string" ? s.split(e.from).join(e.to) : s.replace(e.from, e.to);
		if (s === before) problems.push(`${name}: no match for ${String(e.from).slice(0, 70)}`);
		if (e.why) whys.push(e.why);
	}
	for (const [, fn] of POST) s = fn(s);
	const header = `/**\n * Generated from shadcn/ui new-york-v4 "${name}" by scripts/tailor-shadcn.mjs. Do not edit by hand.\n * TwoUX changes:${whys.length ? whys.map((w) => `\n *  - ${w}`).join("") : " shared changes only (imports, role tokens for light and dark, type scale)."}\n */\n`;
	writeFileSync(new URL(`${name}.tsx`, OUT), header + s);
	report += `\n## ${name}\n\n${whys.length ? whys.map((w) => `- ${w}`).join("\n") : "- Shared changes only"}\n`;
}
writeFileSync(new URL("../packages/ui/SHADCN-DIFF.md", import.meta.url), report);
console.log(`Tailored ${Object.keys(FILES).length} components.`);
if (problems.length) {
	console.log(`PROBLEMS (an upstream change may have broken a tailoring rule):\n${problems.join("\n")}`);
	process.exit(1);
}
