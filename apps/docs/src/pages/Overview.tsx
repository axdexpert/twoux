import { useMeta } from "../components/meta";
import { Button, Code, useTheme } from "@twoux/ui";
import { Accessibility, Activity, ArrowRight, ArrowUpRight, Bot, CandlestickChart, Component, Contact, Gauge, LayoutDashboard, Library, Rocket, ShieldCheck, Speech, Table2, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import jobsFile from "../../../../packages/ui/registry/jobs.json";
import { H2, LinkCard, OnThisPage } from "../components/docs";
import { type StackMark, StackMarkIcon } from "../components/stack-marks";
import { EXAMPLE_APPS, docs, isBuilt } from "../content";
import { PageHeader } from "./ComponentPage";
import { Terminal } from "./ForAgents";

/* Overview: the site's front door. It says what TwoUX is, shows one decision it makes, and hands people
   on to the place they want to go. Install steps live on Get started. */

const FIND = `$ npx twoux find "delete a candidate"

Erase a candidate's data on request
  Use: Deleting records
  How: confirmation dialog with role alertdialog, the name in bold,
       what is erased and what stays, buttons Keep candidate
       and Delete permanently.
  Not this: Toast

Delete a duplicate candidate record
  Use: Deleting records
  How: Move to Deleted at once with toast "Candidate deleted. Undo"
       and ⌘Z; no dialog.
  Not this: Confirmation dialog`;

/* Libraries show their own monochrome mark; standards get a plain icon, since the W3C logo needs permission. */
const BUILT_ON: { label: string; mark?: StackMark; icon?: typeof Accessibility }[] = [
	{ label: "shadcn/ui", mark: "shadcn" },
	{ label: "Radix", mark: "radix" },
	{ label: "React 19", mark: "react" },
	{ label: "Tailwind CSS v4", mark: "tailwind" },
	{ label: "WCAG 2.2 AA", icon: Accessibility },
	{ label: "WAI-ARIA", icon: Speech },
];

/* Icons for the example apps, by id (the same ones the sidebar uses). */
const APP_ICONS: Record<string, typeof Bot> = { workflows: Workflow, agents: Bot, trading: CandlestickChart, "data-workspace": Table2, operations: Activity, crm: Contact, onboarding: Rocket, hiring: LayoutDashboard };

const prose = "text-docs text-ink-prose";
const link = "inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4";

const TOC = [
	{ id: "gap", label: "Components are not decisions" },
	{ id: "different", label: "What makes it different" },
	{ id: "fit", label: "Built for complexity, ready for any app" },
	{ id: "start", label: "Take it from here" },
];

export function Overview() {
	useMeta(
		"TwoUX: Engineering-first design system for complex apps",
		"TwoUX makes UI and UX decisions explicit for engineers and AI agents, and enforces quality before inconsistent experiences reach production.",
	);
	const components = docs.filter((d) => d.kind === "component" && isBuilt(d.id)).length;
	const patterns = docs.filter((d) => d.kind === "pattern").length;
	const jobs = jobsFile.jobs.length;
	const { resolved } = useTheme();

	const STATS = [
		{ value: components, label: "components" },
		{ value: jobs, label: "UI decisions" },
		{ value: patterns, label: "patterns" },
		{ value: EXAMPLE_APPS.length, label: "example apps" },
	];

	const DIFFERENT = [
		{
			icon: Bot,
			title: "Agent Experience on both sides",
			text: "Your coding agent reads the same rules your engineers do: AGENTS.md, llms.txt, an MCP server and skills to build, audit and propose. Inside your product, the people supervising agents get plans, approvals, run timelines and permissions.",
			to: "/for-agents",
			cta: "For AI agents",
		},
		{
			icon: Library,
			title: "Answers, not a parts list",
			text: `${jobs} everyday UI decisions, such as how to confirm a delete or show a status, each answered with one component and what to use instead. ${patterns} patterns walk through whole flows, from filtering to propose-then-apply, step by step and with the reason for each rule.`,
			to: "/patterns",
			cta: "Browse patterns",
		},
		{
			icon: Gauge,
			title: "Complex, never complicated",
			text: "Dense tables, spreadsheet grids, charts and agent interfaces: compact, keyboard-first, in light and dark, with interactions, states and motion already decided.",
			to: "/components",
			cta: "See all components",
		},
		{
			icon: ShieldCheck,
			title: "Guardrails over guidelines",
			text: "A lint that fails raw colours and local copies, a hook that stops agents editing the system, a browser audit for contrast and focus, and a theme file that refuses colours that fail WCAG.",
			to: "/foundation",
			cta: "Read the foundation",
		},
	];

	const START = [
		{ icon: Rocket, title: "Install and set your brand", text: "Add TwoUX to a React app and give it your colour, corners and font, by hand or through your agent.", href: "/get-started" },
		{ icon: Component, title: "Find a component for a job", text: "Every component by the job it does, with live examples and when not to use it.", href: "/components" },
		{ icon: Workflow, title: "Follow a pattern for a flow", text: "Filtering, bulk actions, undo, record detail: which components, in what order.", href: "/patterns" },
		{ icon: LayoutDashboard, title: "Open a complete example app", text: `${EXAMPLE_APPS.length} full screens built only from TwoUX, from a trading desk to a hiring pipeline.`, href: "/examples" },
	];

	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
				<img
					src={resolved === "dark" ? "/brand/banner-dark.png" : "/brand/banner.png"}
					width={2400}
					height={1260}
					alt="The TwoUX wordmark surrounded by TwoUX components: keyboard settings, a stat card, a twoux find command, status badges, a list table with two rows selected, the assistant composer and a suggested-changes proposal."
					className="mb-10 h-auto w-full rounded-md border border-line shadow-card"
				/>
				<PageHeader
					title="TwoUX: Engineering-first design system for complex apps"
					titleClassName="text-docs-hero"
					summary="TwoUX makes UI and UX decisions explicit for engineers and AI agents, and enforces quality before inconsistent experiences reach production."
				>
					<div className="mt-6 flex flex-wrap gap-2">
						<Button asChild><Link to="/get-started">Get started<ArrowRight /></Link></Button>
						<Button asChild variant="outline"><Link to="/examples">See example apps</Link></Button>
					</div>
				</PageHeader>

				<dl className="grid grid-cols-4 border-y border-line max-md:grid-cols-2">
					{STATS.map((s, i) => (
						<div key={s.label} className={`flex flex-col items-center px-4 py-5 text-center ${i > 0 ? "md:border-l md:border-line" : ""} max-md:even:border-l max-md:even:border-line max-md:nth-[-n+2]:border-b max-md:nth-[-n+2]:border-line`}>
							<dt className="text-docs-sm text-ink-2">{s.label}</dt>
							<dd className="order-first font-display text-docs-title font-semibold tabular-nums text-ink">{s.value}</dd>
						</div>
					))}
				</dl>

				<div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-docs-sm">
					<span className="text-ink-3">Built on</span>
					<ul className="contents">
						{BUILT_ON.map(({ label, mark, icon: Icon }) => (
							<li key={label} className="flex items-center gap-1.5 font-medium text-ink">
								{mark ? <StackMarkIcon mark={mark} className="size-3.5 text-ink-2" /> : Icon && <Icon className="size-3.5 text-ink-2" aria-hidden="true" />}
								{label}
							</li>
						))}
					</ul>
				</div>

				<article className="mt-14">
					<H2 id="gap">Components are not decisions</H2>
					<p className={prose}>
						More and more UI is built by coding agents, often with no designer in the loop and no Figma file to check against. A design system hands the agent a
						dialog, a toast and a button, but not which one this moment needs. So it guesses, and next week, on another screen, it guesses differently.
					</p>
					<p className={`mt-4 ${prose}`}>
						TwoUX writes the decision down. Ask it how to delete a candidate and the answer depends on what is at stake: a duplicate goes at once with Undo, while erasing
						someone's data stops to confirm and says what stays.
					</p>
					<div className="mt-5"><Terminal title="Terminal" code={FIND} /></div>
					<p className={`mt-4 ${prose}`}>
						The same answer reaches an engineer reading these docs and an agent calling <Code>find_component</Code> over MCP, so a screen built on Monday and one built
						on Friday behave alike.
					</p>

					<H2 id="different">What makes it different</H2>
					<ul className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
						{DIFFERENT.map(({ icon: Icon, ...d }) => (
							<li key={d.title} className="flex flex-col rounded-md border border-line bg-surface p-5 shadow-card">
								<span className="grid size-9 place-items-center rounded-sm bg-primary-soft">
									<Icon className="size-4.5 text-primary-ink" aria-hidden="true" />
								</span>
								<h3 className="mt-4 text-docs-h3 font-semibold text-ink">{d.title}</h3>
								<p className="mt-2 flex-1 text-docs-sm text-ink-prose">{d.text}</p>
								<Link to={d.to} className={`mt-4 text-docs-sm ${link}`}>{d.cta}<ArrowRight className="size-3.5" aria-hidden="true" /></Link>
							</li>
						))}
					</ul>

					<H2 id="fit">Built for complexity, ready for any app</H2>
					<p className={prose}>
						Complexity is in the decisions, not the screen. Any product with records to manage, choices to confirm, states to show or agents to supervise has UI
						decisions to get right, and TwoUX gives each one a component and a reason. That holds for a settings page as much as a trading desk, at five
						screens or five hundred.
					</p>
					<p className={`mt-4 ${prose}`}>
						These {EXAMPLE_APPS.length} apps share one set of components and one set of rules. Yours doesn't need to look like any of them; they show how far the same parts go.
					</p>
					<ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 max-md:grid-cols-1">
						{EXAMPLE_APPS.map((a) => {
							const Icon = APP_ICONS[a.id] ?? LayoutDashboard;
							return (
								<li key={a.id}>
									<a href={a.to} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-sm p-2 -mx-2 hover:bg-hover">
										<span className="grid size-8 shrink-0 place-items-center rounded-sm bg-primary-soft">
											<Icon className="size-4 text-primary-ink" aria-hidden="true" />
										</span>
										<span className="min-w-0">
											<span className="flex items-center gap-1 text-docs font-semibold text-ink group-hover:underline group-hover:underline-offset-4">{a.label}<ArrowUpRight className="size-3.5 text-ink-3" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></span>
											<span className="mt-0.5 block text-docs-sm text-ink-prose">{a.description}</span>
										</span>
									</a>
								</li>
							);
						})}
					</ul>
					<p className={`mt-5 ${prose}`}>If your product asks people to make decisions, TwoUX fits.</p>

					<H2 id="start">Take it from here</H2>
					<ul className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
						{START.map((c) => <li key={c.title}><LinkCard {...c} /></li>)}
					</ul>
				</article>
			</div>
			<OnThisPage items={TOC} />
		</div>
	);
}
