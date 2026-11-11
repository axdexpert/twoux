import { useMeta } from "../components/meta";
import { Badge, Button, Code, Tag, CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@twoux/ui";
import { Blocks, BookOpen, ExternalLink, FileJson, FileText, Info, ListChecks, MessageSquare, Palette, Plug, ShieldCheck, SquareTerminal } from "lucide-react";
import { Link } from "react-router-dom";
import jobs from "../../../../packages/ui/registry/jobs.json";
import rules from "../../../../packages/ui/registry/rules.json";
import { CopyPage, H2, Inline, LinkCard, NumberMarker, OnThisPage } from "../components/docs";
import { docById, docPath, isBuilt } from "../content";
import { PageHeader } from "./ComponentPage";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** What `twoux init` writes, from packages/ui/bin/init.mjs. */
const INIT_WRITES: [string, string][] = [
	["AGENTS.md", "A TwoUX section pointing to node_modules/@twoux/ui/agent/AGENTS.md."],
	["CLAUDE.md", "Imports the same file, so Claude Code loads it on every task."],
	[".mcp.json", "The TwoUX MCP server for Claude Code. Also .cursor/mcp.json and .vscode/mcp.json when the project already has those folders."],
	[".claude/settings.json", "A guard hook that stops agents editing TwoUX's own files."],
	[".claude/skills/", "Five skills: /twoux-build, /twoux-design, /twoux-write, /twoux-audit and /twoux-propose."],
	["PRODUCT.md", "The TwoUX voice under Brand Commitments, so design skills that read PRODUCT.md, such as Impeccable, write copy the TwoUX way. Created only when such a skill is installed."],
	["twoux.theme.json", "Your brand colour, corners and font, built with twoux theme."],
	["proposals/", "A template for anything TwoUX does not have yet."],
];

/** Prompts people paste into their coding agent. The agent runs the commands below for them. */
export const PROMPT_SETUP = `Set up the TwoUX design system in this project. Install @twoux/ui with this repo's package manager, then run \`npx twoux init\` and read node_modules/@twoux/ui/agent/AGENTS.md. For every UI job, find the component with \`npx twoux find "<job>"\` (or the twoux MCP server's find_component tool) and read its page before writing code. Run \`npx twoux check\` before you finish and fix every error.`;

export const PROMPT_BRAND = `Give this app our brand with TwoUX. Set primary, radius and font in twoux.theme.json to match our brand, run \`npx twoux theme\`, and import ./twoux-theme.css after @twoux/ui/styles.css. If the generator refuses a colour for contrast, use the closest colour it accepts and tell me which.`;

const SETUP_CLAUDE = `# Add the package
npm install @twoux/ui

# CLAUDE.md, the guard hook, five skills, the MCP server and the theme file
npx twoux init

# Which component for a job, and its page
npx twoux find "confirm a permanent delete"
npx twoux docs confirmation-dialog

# Before you finish, and in CI
npx twoux check`;

const SETUP_AGENTS_MD = `# Add the package
npm install @twoux/ui

# AGENTS.md at the repo root, which these agents read on every task
npx twoux init

# Which component for a job, and its page
npx twoux find "confirm a permanent delete"
npx twoux docs confirmation-dialog

# Before you finish, and in CI
npx twoux check`;

const MCP_SERVER = { command: "npx", args: ["-y", "@twoux/ui", "mcp"] };
const MCP_CLIENTS: { id: string; label: string; file?: string; code: string }[] = [
	{ id: "claude", label: "Claude Code", code: "claude mcp add twoux -- npx -y @twoux/ui mcp" },
	{ id: "cursor", label: "Cursor", file: ".cursor/mcp.json", code: JSON.stringify({ mcpServers: { twoux: MCP_SERVER } }, null, 2) },
	{ id: "vscode", label: "VS Code", file: ".vscode/mcp.json", code: JSON.stringify({ servers: { twoux: { type: "stdio", ...MCP_SERVER } } }, null, 2) },
	{ id: "codex", label: "Codex", code: "codex mcp add twoux -- npx -y @twoux/ui mcp" },
];

const MCP_TOOLS: [string, string][] = [
	["find_component", "Which component or pattern fits a job, how to use it and what not to use."],
	["get_doc", "One page as Markdown: when not to use, behaviour, keyboard, API and example code."],
	["list_docs", "Every page id, by kind."],
	["get_rules", "AGENTS.md: every rule and the job table."],
	["check", "Runs twoux check on the files the agent changed."],
];

const RESOURCES: { icon: typeof FileText; title: string; text: string; href: string }[] = [
	{ icon: FileText, title: "AGENTS.md", text: "Every rule and the job table, short enough to load on every task.", href: "/AGENTS.md" },
	{ icon: Blocks, title: "Skills", text: "/twoux-build, /twoux-audit and /twoux-propose: the build, audit and propose steps, ready to run.", href: "/for-agents#init" },
	{ icon: ShieldCheck, title: "Guard hook", text: "Stops agents editing TwoUX's own files, and says what to do instead.", href: "/for-agents#init" },
	{ icon: ListChecks, title: "twoux check", text: "Fails raw colours, one-off sizes, local copies and restyled controls. Exits 1, so it can gate CI.", href: "/for-agents#setup" },
	{ icon: Plug, title: "MCP server", text: "find_component, get_doc, get_rules and check as tools, for agents that speak MCP.", href: "/for-agents#mcp" },
	{ icon: BookOpen, title: "llms.txt", text: "An index of every page, for assistants that read docs from the web.", href: "/llms.txt" },
	{ icon: Palette, title: "Theme file", text: "Brand colour, corners and font in one file. The generator refuses colours that fail contrast.", href: "/foundation/colours" },
];

/** A block from TwoUX's CodeBlock family: header, copy, then the commands, prompt or file. */
export function Terminal({ code, title = "Terminal", icon = <SquareTerminal />, wrap }: { code: string; title?: string; icon?: React.ReactNode; wrap?: boolean }) {
	return (
		<CodeBlock>
			<CodeBlockHeader>
				<CodeBlockTitle icon={icon}>{title}</CodeBlockTitle>
				<CodeBlockActions><CodeBlockCopyButton value={code} /></CodeBlockActions>
			</CodeBlockHeader>
			<CodeBlockContent code={code} wrap={wrap} className="py-3.5" />
		</CodeBlock>
	);
}

export function ForAgents() {
	useMeta("For AI agents · TwoUX", "How TwoUX guides Claude Code, Cursor, Codex and Copilot: AGENTS.md, llms.txt, a job table that maps every job to one component, skills and twoux check.");
	const name = (id: string) => docById[id]?.name ?? id;
	const count = rules.groups.reduce((n, g) => n + g.rules.length, 0);
	const toc = [
		{ id: "why", label: "Why this exists" },
		{ id: "setup", label: "Set up your agent" },
		{ id: "commands", label: "Or run the commands" },
		{ id: "mcp", label: "Connect over MCP" },
		{ id: "resources", label: "What your agent gets" },
		{ id: "before", label: "Before writing UI" },
		...rules.groups.map((g) => ({ id: slug(g.title), label: g.title })),
		{ id: "jobs", label: "Which component for which job" },
		{ id: "files", label: "Files" },
	];
	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
			<PageHeader
				eyebrow="Get started"
				title="For AI agents"
				actions={<CopyPage url="/AGENTS.md" title="AI agents" />}
				summary={`How to connect Claude Code, Cursor, Codex or Copilot to TwoUX, and the rules they follow once connected: ${rules.before.length} steps before writing, ${count} rules, and ${jobs.jobs.length} jobs mapped to one component each. People follow exactly the same rules.`}
			/>
				<article>
					<H2 id="why">Why this exists</H2>
					<p className=" text-docs text-ink-prose">
						LLMs write UI quickly and drift quietly: a new shade of grey here, a hand-rolled dropdown there. TwoUX removes the guesswork. Every rule below, the job table and every component page are generated from the same files as this site, so an agent and a person asking “what do I use to…” get the same answer.
					</p>

					<H2 id="setup">Set up your agent</H2>
					<p className="text-docs text-ink-prose">Paste this into Claude Code, Cursor, Codex or Copilot. The agent installs the package, connects the MCP server and loads the rules, so every agent in the repo works from the same components and checks.</p>
					<div className="mt-5 grid gap-3">
						<Terminal title="Set up TwoUX" icon={<MessageSquare />} code={PROMPT_SETUP} wrap />
						<Terminal title="Give it your brand" icon={<MessageSquare />} code={PROMPT_BRAND} wrap />
					</div>

					<h3 id="commands" className="mt-10 mb-1 scroll-mt-16 text-docs-h3 font-semibold text-ink">Or run the commands</h3>
					<p className="mb-4 text-docs text-ink-prose">The same set-up by hand. Needs React 19. Pick the tool you code with.</p>
					<Tabs defaultValue="claude" className="gap-4">
						<TabsList aria-label="Coding tool">
							<TabsTrigger value="claude">Claude Code</TabsTrigger>
							<TabsTrigger value="agents-md">Cursor, Codex, Copilot</TabsTrigger>
							<TabsTrigger value="chat">Chat assistants</TabsTrigger>
						</TabsList>
						<TabsContent value="claude">
							<Terminal code={SETUP_CLAUDE} />
						</TabsContent>
						<TabsContent value="agents-md">
							<Terminal code={SETUP_AGENTS_MD} />
						</TabsContent>
						<TabsContent value="chat" className="grid gap-3">
							<p className="text-docs text-ink-prose">Assistants without file access read the same rules from one file. Attach it to the conversation, or the index plus the pages you need.</p>
							<div className="flex flex-wrap gap-2">
								<Button asChild variant="outline" size="sm"><a href="/llms-full.txt" target="_blank" rel="noreferrer"><FileText />llms-full.txt<span className="sr-only">(opens in a new tab)</span></a></Button>
								<Button asChild variant="outline" size="sm"><a href="/llms.txt" target="_blank" rel="noreferrer"><FileText />llms.txt<span className="sr-only">(opens in a new tab)</span></a></Button>
							</div>
						</TabsContent>
					</Tabs>
					<p className="mt-3 text-docs-sm text-ink-2">Not published to npm yet. The package name and the commands on this page are final.</p>

					<h3 id="mcp" className="mt-10 mb-1 scroll-mt-16 text-docs-h3 font-semibold text-ink">Connect over MCP</h3>
					<p className="mb-4 text-docs text-ink-prose"><Code>twoux init</Code> connects the server for you. To add it to another project or tool by hand, use the entry for your tool. The server runs on your machine over stdio and reads only the installed package.</p>
					<Tabs defaultValue="claude" className="gap-4">
						<TabsList aria-label="MCP client">
							{MCP_CLIENTS.map((c) => <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>)}
						</TabsList>
						{MCP_CLIENTS.map((c) => (
							<TabsContent key={c.id} value={c.id}>
								{c.file ? <Terminal title={c.file} icon={<FileJson />} code={c.code} /> : <Terminal code={c.code} />}
							</TabsContent>
						))}
					</Tabs>
					<ul className="mt-4 grid divide-y divide-line border-y border-line">
						{MCP_TOOLS.map(([tool, what]) => (
							<li key={tool} className="grid grid-cols-[12rem_minmax(0,1fr)] items-baseline gap-4 py-2.5 max-md:grid-cols-1 max-md:gap-0.5">
								<Code className="w-fit">{tool}</Code>
								<span className="text-docs-sm text-ink-prose">{what}</span>
							</li>
						))}
					</ul>

					<h3 id="init" className="mt-10 mb-1 scroll-mt-16 text-docs-h3 font-semibold text-ink">What twoux init writes</h3>
					<p className="mb-4 text-docs text-ink-prose">It never overwrites: it adds to files that exist and skips what is already there. To update the skills after upgrading TwoUX, run <Code>npx twoux init --force</Code>.</p>
					<p className="mb-4 text-docs text-ink-prose">For an app that is not built with TwoUX, run <Code>npx twoux init --principles</Code>. Agents then follow TwoUX's principles with the app's own components and brand, and get only /twoux-audit and /twoux-write. To move the app onto TwoUX, see <Link to="/foundation/migrating" className="font-medium text-primary-ink hover:underline">Migrating an existing app</Link>.</p>
					<ul className="grid divide-y divide-line border-y border-line">
						{INIT_WRITES.map(([file, what]) => (
							<li key={file} className="grid grid-cols-[12rem_minmax(0,1fr)] items-baseline gap-4 py-2.5 max-md:grid-cols-1 max-md:gap-0.5">
								<Code className="w-fit">{file}</Code>
								<span className="text-docs-sm text-ink-prose wrap-anywhere">{what}</span>
							</li>
						))}
					</ul>

					<H2 id="resources">What your agent gets</H2>
					<ul className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
						{RESOURCES.map((r) => <li key={r.title}><LinkCard {...r} /></li>)}
					</ul>

					<H2 id="before">Before writing any UI</H2>
					<ol className="grid gap-4">
						{rules.before.map((r, i) => (
							<li key={r.rule} className="grid grid-cols-[20px_1fr] gap-2.5 text-docs">
								<NumberMarker n={i + 1} />
								<span className="grid gap-0.5">
									<span><Inline text={r.rule} /></span>
									<span className="text-docs-sm text-ink-2"><Inline text={r.why} /></span>
								</span>
							</li>
						))}
					</ol>

					<p className="mt-6 text-docs text-ink-prose">Rules tagged <Tag>TwoUX only</Tag> are about the @twoux/ui package, its tokens and its theme. Every other rule is a principle: it also holds in an app not built with TwoUX, where the component it names is the TwoUX way of meeting it.</p>

					{rules.groups.map((g) => (
						<section key={g.title}>
							<H2 id={slug(g.title)}>{g.title}</H2>
							<ul className="grid divide-y divide-line">
								{g.rules.map((r) => {
									const use = (r as { use?: [string, string[]][] }).use ?? [];
									return (
										<li key={r.rule} className="grid gap-2.5 py-4 first:pt-1">
											<p className="text-docs font-medium text-ink">{(r as { scope?: string }).scope === "twoux" && <><Tag>TwoUX only</Tag>{" "}</>}{r.rule}</p>
											{use.length > 0 && (
												<dl className="grid grid-cols-[96px_1fr] items-start gap-x-3 gap-y-1.5">
													{use.map(([label, values]) => (
														<div key={label} className="contents">
															<dt className="pt-0.5 text-docs-sm text-ink-3">{label}</dt>
															<dd className="flex flex-wrap gap-1.5">
																{values.map((v) => {
																	const [code, note] = v.split(" · ");
																	return (
																		<span key={v} className="inline-flex h-6 items-center gap-1.5 rounded-sm border border-line bg-surface-2 px-2 text-docs-sm">
																			<code className="font-mono text-ink">{code}</code>
																			{note && <span className="text-ink-3">{note}</span>}
																		</span>
																	);
																})}
															</dd>
														</div>
													))}
												</dl>
											)}
											<p className="flex gap-1.5 text-docs-sm text-ink-2">
												<Info className="mt-0.75 size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
												<span>{r.why}</span>
											</p>
										</li>
									);
								})}
							</ul>
						</section>
					))}

					<H2 id="jobs">Which component for which job</H2>
					<p className="mb-5 text-docs text-ink-prose">Search this with ⌘K too: type the job, such as “confirm an action”.</p>
					<div className="overflow-x-auto rounded-md border border-line">
						{/* Three columns so each stays readable in the reading column: How sits under the component it describes. */}
						<table className="w-full min-w-150 table-fixed border-collapse text-left text-docs-sm">
							<colgroup><col className="w-[34%]" /><col className="w-[42%]" /><col className="w-[24%]" /></colgroup>
							<thead className="bg-surface-2 text-ink-2">
								<tr><th className="px-4 py-2.5 font-medium">Job</th><th className="px-4 py-2.5 font-medium">Use</th><th className="px-4 py-2.5 font-medium">Not this</th></tr>
							</thead>
							<tbody>
								{jobs.jobs.map((j) => {
									const d = docById[j.use];
									const how = (j as { how?: string }).how;
									return (
										<tr key={j.job} className="border-t border-line align-top">
											<td className="px-4 py-3 font-medium text-ink">{j.job}</td>
											<td className="px-4 py-3">
												<span className="flex flex-wrap items-center gap-1.5">{d ? <Link to={docPath(d)} className="font-medium text-primary-ink hover:underline">{d.name}</Link> : j.use}{d?.kind === "component" && !isBuilt(j.use) && <Badge variant="secondary">Planned</Badge>}</span>
												{how && <span className="mt-1 block text-ink-2"><Inline text={how} /></span>}
											</td>
											<td className="px-4 py-3 text-ink-2">{((j as { notThis?: string[] }).notThis ?? []).map(name).join(", ")}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<H2 id="files">Files</H2>
					<div className="overflow-hidden rounded-sm border border-line">
						{(
							[
								["/AGENTS.md", "Every rule above and the job table. Short enough to load on every task.", true],
								["/llms.txt", "Index of every foundation, component and pattern page, one line each.", true],
								["/llms-full.txt", "Every page in one file, for chat tools without file access.", true],
								["/docs-md/button.md", "One page per foundation, component and pattern: guidance and real example code.", true],
								["packages/ui/registry/rules.json", "Source of the rules on this page. Edit here.", false],
								["packages/ui/registry/jobs.json", "Source of the job table. Edit here.", false],
								["packages/ui/src/styles/twoux.css", "Role tokens. palette.css holds the generated ranges.", false],
							] as [string, string, boolean][]
						).map(([f, d, open]) => (
							<div key={f} className="grid grid-cols-[280px_1fr] items-baseline gap-4 border-t border-line px-4 py-2.5 first:border-t-0 max-lg:grid-cols-1 max-lg:gap-1">
								{open ? (
									<a href={f} target="_blank" rel="noreferrer" className="inline-flex min-h-6 items-center gap-1.5 font-mono text-docs-sm font-medium text-primary-ink hover:underline">
										{f}
										<ExternalLink className="size-3" aria-hidden="true" />
									</a>
								) : (
									<code className="font-mono text-docs-sm">{f}</code>
								)}
								<span className="text-docs-sm text-ink-2">{d}</span>
							</div>
						))}
					</div>
				</article>
				</div>
				<OnThisPage items={toc} />
		</div>
	);
}
