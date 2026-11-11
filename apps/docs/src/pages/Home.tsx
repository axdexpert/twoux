import { useMeta } from "../components/meta";
import { Code } from "@twoux/ui";
import { BookMarked, Bot, CheckCircle2, Component, FileCode, LayoutDashboard, MessageSquare, Moon, Tag, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { H2, LinkCard, NumberMarker, OnThisPage } from "../components/docs";
import { EXAMPLE_APPS, docs } from "../content";
import { Meta, PageHeader } from "./ComponentPage";
import { PROMPT_BRAND, PROMPT_SETUP, Terminal } from "./ForAgents";

/* Get started: the install steps come first, so people can set TwoUX up without leaving the page.
   Orientation (where to go next, the five rules) follows the steps. */

const INSTALL = `npm install @twoux/ui
npx twoux init`;

const GLOBALS_CSS = `@import "tailwindcss";
@import "@twoux/ui/styles.css";
@import "./twoux-theme.css"; /* after npx twoux theme */
@source "../node_modules/@twoux/ui/src";`;

const THEME_JSON = `{
  "primary": "#356AFF",
  "radius": { "xs": 4, "sm": 6, "md": 8 },
  "font": "Inter"
}`;

const THEME_CMD = `npx twoux theme`;

const LAYOUT_TSX = `import { THEME_SCRIPT, ThemeSwitcher, Toaster } from "@twoux/ui";

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <header><ThemeSwitcher /></header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}`;

const PAGE_TSX = `import { Button, toast } from "@twoux/ui";

export default function Page() {
  return (
    <Button shortcut="C" onClick={() => toast.success("Listing created")}>
      Create listing
    </Button>
  );
}`;

const CHECK = `npx twoux check`;

const RULES = [
	"Look for a pattern first. If one covers the flow, follow its steps.",
	"Use the component the docs name for the job, and read its “When not to use”.",
	"Import from @twoux/ui. Never restyle or rebuild a primitive locally.",
	"Use tokens only. No raw colours, pixel sizes or arbitrary Tailwind values; twoux check blocks them.",
	"If nothing fits, use the closest component and ask for the addition. Don't ship a one-off.",
];

const prose = "text-docs text-ink-prose";
const link = "font-medium text-ink underline underline-offset-4";

const TOC = [
	{ id: "agent", label: "Quick start with your agent" },
	{ id: "install", label: "Install" },
	{ id: "styles", label: "Add the styles" },
	{ id: "brand", label: "Set your brand" },
	{ id: "themes", label: "Light and dark" },
	{ id: "first", label: "Add your first component" },
	{ id: "check", label: "Check before you finish" },
	{ id: "next", label: "Next steps" },
	{ id: "rules", label: "Rules for everyone" },
];

export function Home() {
	useMeta("Get started · TwoUX docs", "Install TwoUX, set your brand in one theme file, and give your coding agent the rules it follows for every UI change.");

	const NEXT = [
		{ icon: Component, title: "Find a component for a job", text: "Every component by the job it does, with live examples and when not to use it.", href: "/components" },
		{ icon: Workflow, title: "Follow a pattern for a flow", text: "Filtering, bulk actions, undo, record detail: which components, in what order.", href: "/patterns" },
		{ icon: LayoutDashboard, title: "See complete example apps", text: `${EXAMPLE_APPS.length} full screens built only from TwoUX, live at any width.`, href: "/examples" },
		{ icon: Bot, title: "Connect your agent over MCP", text: "find_component, get_doc, get_rules and check as tools, plus everything twoux init writes.", href: "/for-agents#mcp" },
	];

	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
				<PageHeader
					title="Get started"
					summary="Add TwoUX to a React app, give it your brand, and let your coding agent follow the same rules for every UI change."
					meta={
						<>
							<Meta icon={Tag}>Version 0.1</Meta>
							<Meta icon={Moon}>Light and dark</Meta>
							<Meta icon={CheckCircle2}>WCAG 2.2 AA</Meta>
						</>
					}
				/>
				<article>
					<H2 id="agent" className="mt-0">Quick start with your agent</H2>
					<p className={prose}>Paste these into Claude Code, Cursor, Codex or Copilot. The agent runs every step below for you.</p>
					<div className="mt-5 grid gap-3">
						<Terminal title="Set up TwoUX" icon={<MessageSquare />} code={PROMPT_SETUP} wrap />
						<Terminal title="Give it your brand" icon={<MessageSquare />} code={PROMPT_BRAND} wrap />
					</div>

					<H2 id="install">Install</H2>
					<p className={prose}>Needs React 19 and Tailwind CSS 4. <Code>twoux init</Code> adds the agent rules, skills, MCP server and a theme file, and never overwrites what is already there.</p>
					<div className="mt-4"><Terminal code={INSTALL} /></div>
					<p className="mt-3 text-docs-sm text-ink-2">Not published to npm yet. The package name and commands are final.</p>

					<H2 id="styles">Add the styles</H2>
					<p className={prose}>Import TwoUX after Tailwind in your global stylesheet. <Code>@source</Code> lets Tailwind see the classes TwoUX's components use.</p>
					<div className="mt-4"><Terminal title="globals.css" icon={<FileCode />} code={GLOBALS_CSS} /></div>

					<H2 id="brand">Set your brand</H2>
					<p className={prose}>Brand colour, corners and font live in one file. The generator turns the colour into a full range and refuses any that fails WCAG contrast. Skip this step to keep the default look.</p>
					<div className="mt-4 grid gap-3">
						<Terminal title="twoux.theme.json" icon={<FileCode />} code={THEME_JSON} />
						<Terminal code={THEME_CMD} />
					</div>
					<p className={`mt-3 ${prose}`}>Every field is described in <Link to="/foundation/colours" className={link}>Colours</Link>.</p>

					<H2 id="themes">Light and dark</H2>
					<p className={prose}>Light is the default. <Code>THEME_SCRIPT</Code> in the head applies the saved choice before the page paints, so it never flashes. <Code>ThemeSwitcher</Code> offers Light, Dark and Match system; put it in the header or account menu. <Code>Toaster</Code> shows toasts.</p>
					<div className="mt-4"><Terminal title="app/layout.tsx" icon={<FileCode />} code={LAYOUT_TSX} /></div>

					<H2 id="first">Add your first component</H2>
					<p className={prose}>Import components from <Code>@twoux/ui</Code>. Names and props match shadcn's; TwoUX adds a few, such as <Code>shortcut</Code> on Button.</p>
					<div className="mt-4"><Terminal title="app/page.tsx" icon={<FileCode />} code={PAGE_TSX} /></div>

					<H2 id="check">Check before you finish</H2>
					<p className={prose}>Fails raw colours, one-off sizes, local copies of components and restyled controls. It exits 1, so it can gate CI.</p>
					<div className="mt-4"><Terminal code={CHECK} /></div>

					<H2 id="next">Next steps</H2>
					<ul className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
						{NEXT.map((c) => <li key={c.title}><LinkCard {...c} /></li>)}
					</ul>

					<H2 id="rules">Rules for everyone</H2>
					<p className={`mb-4 ${prose}`}>People and agents follow the same five rules. The full set lives in <Link to="/for-agents" className={link}>For AI agents</Link>.</p>
					<ol className="grid gap-3">
						{RULES.map((r, i) => (
							<li key={r} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-docs text-ink">
								<NumberMarker n={i + 1} />
								<span>{r}</span>
							</li>
						))}
					</ol>
				</article>
			</div>
			<OnThisPage items={TOC} />
		</div>
	);
}
