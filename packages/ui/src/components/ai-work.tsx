/**
 * TwoUX compositions for agents, saved tasks and the assistant's set-up.
 * Every permission is Off, Ask first or Allow; candidate decisions are never Allow (UK GDPR Art. 22).
 * Shared context (team instructions, connected tools) is visible and editable, never hidden in a prompt.
 */
import { Check, CircleAlert, CircleDashed, Clock, ExternalLink, FileText, Loader2, Pause, Plug, RefreshCw, Search, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { AiMark, AiOrigin } from "./ai-basics"
import { Badge } from "./badge"
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Segment, SegmentedControl } from "./segmented-control"
import { Textarea } from "./textarea"

/* ---------------------------------------------------------------- AI column */

export function AiColumnHeader({ name, written, onRefresh }: { name: string; written: string; onRefresh?: () => void }) {
  return (
    <span className="inline-flex items-center gap-control">
      <AiMark />
      <span>{name}</span>
      <span className="font-normal text-ink-3">· {written}</span>
      {onRefresh && <Button variant="ghost" size="icon-xs" aria-label={`Refresh ${name}`} onClick={onRefresh}><RefreshCw /></Button>}
    </span>
  )
}

export type AiCellState = { state: "writing" } | { state: "done"; value: string; source?: string } | { state: "failed"; reason: string } | { state: "queued" }

/** One generated cell: writing, done (with its citation), or failed with why and Try again. */
export function AiCell({ cell, onRetry, onOpenSource }: { cell: AiCellState; onRetry?: () => void; onOpenSource?: (id: string) => void }) {
  if (cell.state === "queued") return <span className="text-sm text-ink-3">Waiting</span>
  if (cell.state === "writing") return <span role="status" className="inline-flex items-center gap-control text-sm text-ink-3"><Loader2 className="size-3 animate-spin" aria-hidden="true" />Writing</span>
  if (cell.state === "failed")
    return (
      <span className="inline-flex items-center gap-control text-sm text-bad">
        <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate" title={cell.reason}>{cell.reason}</span>
        {onRetry && <Button variant="ghost" size="xs" onClick={onRetry}>Try again</Button>}
      </span>
    )
  return (
    <span className="inline-flex min-w-0 items-center gap-control">
      <span className="truncate">{cell.value}</span>
      {cell.source && <button type="button" onClick={() => onOpenSource?.(cell.source!)} className="shrink-0 rounded-xs font-mono text-xs text-ink-3 hover:text-primary-ink">{cell.source}</button>}
    </span>
  )
}

/* ---------------------------------------------------------------- task builder */

export type TaskSlot = { id: string; placeholder: string; options: string[]; required?: boolean }

/** A repeated task written as a sentence with slots. Empty required slots are dashed and block Run. */
export function TaskBuilder({ parts, value, onChange, onRun, onSave, onSchedule }: { parts: (string | TaskSlot)[]; value: Record<string, string>; onChange: (v: Record<string, string>) => void; onRun: () => void; onSave?: () => void; onSchedule?: () => void }) {
  const slots = parts.filter((p): p is TaskSlot => typeof p !== "string")
  const missing = slots.find((s) => s.required && !value[s.id])
  const [tried, setTried] = React.useState(false)
  const run = () => { setTried(true); if (!missing) onRun() }
  return (
    <section aria-label="Task" className="grid gap-3 rounded-md border border-line bg-surface p-3" onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run() } }}>
      <p className="text-md leading-8 text-ink">
        {parts.map((p, i) =>
          typeof p === "string" ? (
            <span key={i}>{p}</span>
          ) : (
            <Popover key={p.id}>
              <PopoverTrigger asChild>
                <button type="button" aria-label={`${p.placeholder}${p.required ? " (required)" : ""}: ${value[p.id] ?? "not set"}`} className={cn("mx-1 inline-flex h-7 items-center rounded-sm border px-2 align-baseline text-base transition-colors", value[p.id] ? "border-line-strong bg-surface-2 font-medium text-ink" : "border-dashed border-line-strong text-ink-3 hover:border-input-hover", tried && missing?.id === p.id && "border-destructive-edge")}>
                  {value[p.id] ?? p.placeholder}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1">
                {p.options.map((o) => <button key={o} type="button" onClick={() => onChange({ ...value, [p.id]: o })} className={cn("flex w-full items-center justify-between rounded-xs px-2 py-2 text-left text-base hover:bg-accent", value[p.id] === o && "font-medium")}>{o}{value[p.id] === o && <Check className="size-3.5" aria-hidden="true" />}</button>)}
              </PopoverContent>
            </Popover>
          ),
        )}
      </p>
      {tried && missing && <p role="alert" className="flex items-center gap-control text-sm text-bad"><CircleAlert className="size-3.5" aria-hidden="true" />Choose {missing.placeholder.toLowerCase()} before running.</p>}
      <div className="flex justify-end gap-2">
        {onSchedule && <Button variant="ghost" size="sm" onClick={onSchedule}><Clock />Schedule</Button>}
        {onSave && <Button variant="outline" size="sm" onClick={onSave}>Save as task</Button>}
        <Button size="sm" shortcut="⌘↵" onClick={run}>Run</Button>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- permissions */

export type PermissionLevel = "off" | "ask" | "allow"
export type Permission = { id: string; action: string; covers: string; level: PermissionLevel; group: "Read" | "Change"; neverAllow?: boolean }

export function AgentPermissions({ items, onChange }: { items: Permission[]; onChange: (id: string, level: PermissionLevel) => void }) {
  return (
    <div className="grid gap-4">
      {(["Read", "Change"] as const).map((g) => (
        <section key={g} aria-label={g === "Read" ? "What the assistant can read" : "What the assistant can change"} className="grid gap-1">
          <h3 className="text-sm font-medium text-ink-2">{g === "Read" ? "Read" : "Change"}</h3>
          <ul className="divide-y divide-line rounded-sm border border-line bg-surface">
            {items.filter((p) => p.group === g).map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-3 py-2">
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <span className="text-base font-medium text-ink">{p.action}</span>
                  <span className="text-sm text-ink-2">{p.covers}{p.neverAllow && " Always asks first: decisions about people are never automatic."}</span>
                </div>
                <SegmentedControl value={p.level} onValueChange={(v) => onChange(p.id, v as PermissionLevel)} size="sm" aria-label={`${p.action}: access level`}>
                  <Segment value="off">Off</Segment>
                  <Segment value="ask">Ask first</Segment>
                  <Segment value="allow" disabled={p.neverAllow}>Allow</Segment>
                </SegmentedControl>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- agent run */

export type RunStep = { title: string; detail?: string; state: "done" | "running" | "waiting" | "skipped" | "failed"; action?: React.ReactNode }
const RUN_ICON = { done: <Check className="size-3.5 text-ok" />, running: <Loader2 className="size-3.5 animate-spin text-ink-3" />, waiting: <Pause className="size-3.5 text-warn" />, skipped: <CircleDashed className="size-3.5 text-ink-3" />, failed: <X className="size-3.5 text-bad" /> }
const RUN_WORD = { done: "Done", running: "Running", waiting: "Waiting for you", skipped: "Skipped", failed: "Failed" }

export function AgentRun({ task, status, steps, meta, onStop }: { task: string; status: "Running" | "Needs you" | "Done" | "Failed" | "Stopped"; steps: RunStep[]; meta: string; onStop?: () => void }) {
  return (
    <section aria-label={`Run: ${task}`} className="grid rounded-sm border border-line bg-surface">
      <header className="flex items-center gap-2 border-b border-line px-3 py-2">
        <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-ink">{task}</h3>
        <Badge variant={status === "Done" ? "success" : status === "Needs you" ? "warning" : status === "Failed" ? "destructive" : "secondary"} dot>{status}</Badge>
        {onStop && status === "Running" && <Button variant="ghost" size="sm" onClick={onStop}>Stop</Button>}
      </header>
      <ol className="grid">
        {steps.map((s, i) => (
          <li key={i} className={cn("flex items-start gap-2 px-3 py-2", s.state === "waiting" && "bg-warn-bg/60")}>
            <span className="mt-0.5" aria-hidden="true">{RUN_ICON[s.state]}</span>
            <span className="grid min-w-0 flex-1 gap-0.5"><span className="text-base text-ink">{s.title}<span className="sr-only"> ({RUN_WORD[s.state]})</span></span>{s.detail && <span className="text-sm text-ink-2">{s.detail}</span>}</span>
            {s.action}
          </li>
        ))}
      </ol>
      <footer className="border-t border-line px-3 py-2 text-sm text-ink-3">{meta}</footer>
    </section>
  )
}

/* ---------------------------------------------------------------- tools, instructions, history, templates */

export type Tool = { id: string; name: string; kind: string; connected: boolean; canRead: string; canChange: string; stored: string; connectedBy?: string; privacyHref?: string }

export function ConnectedToolCard({ tool, onConnect, onDisconnect }: { tool: Tool; onConnect?: () => void; onDisconnect?: () => void }) {
  return (
    <article aria-label={tool.name} className="grid gap-3 rounded-sm border border-line bg-surface p-3">
      <header className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-sm bg-surface-2 text-ink-2"><Plug className="size-4" aria-hidden="true" /></span>
        <span className="grid min-w-0 flex-1"><span className="text-base font-semibold text-ink">{tool.name}</span><span className="text-sm text-ink-3">{tool.kind}</span></span>
        <Badge variant={tool.connected ? "success" : "secondary"} dot>{tool.connected ? "Connected" : "Not connected"}</Badge>
      </header>
      <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-sm">
        <dt className="text-ink-2">Can read</dt><dd className="text-ink">{tool.canRead}</dd>
        <dt className="text-ink-2">Can change</dt><dd className="text-ink">{tool.canChange}</dd>
        <dt className="text-ink-2">Data stored</dt><dd className="text-ink">{tool.stored}</dd>
        {tool.connectedBy && <><dt className="text-ink-2">Connected by</dt><dd className="text-ink">{tool.connectedBy}</dd></>}
      </dl>
      <footer className="flex items-center gap-2">
        {tool.privacyHref && <a href={tool.privacyHref} className="inline-flex items-center gap-1 text-sm font-medium text-primary-ink hover:underline">Privacy policy<ExternalLink className="size-3" aria-hidden="true" /></a>}
        <span className="flex-1" />
        {tool.connected ? <Button variant="outline" size="sm" onClick={onDisconnect}>Disconnect</Button> : <Button size="sm" onClick={onConnect}>Connect</Button>}
      </footer>
    </article>
  )
}

export function TeamInstructions({ text, setBy, files, onSave, onAddFile }: { text: string; setBy: string; files: { name: string; size: string }[]; onSave: (text: string) => void; onAddFile?: () => void }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(text)
  return (
    <div className="grid gap-3">
      <section aria-label="Team instructions" className="grid gap-2 rounded-sm border border-line bg-surface p-3">
        <header className="flex items-center gap-2"><h3 className="flex-1 text-base font-semibold text-ink">Instructions</h3>{!editing && <Button variant="ghost" size="sm" onClick={() => { setDraft(text); setEditing(true) }}>Edit</Button>}</header>
        {editing ? (
          <>
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Team instructions" className="min-h-28" />
            <div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button><Button size="sm" onClick={() => { onSave(draft); setEditing(false) }}>Save</Button></div>
          </>
        ) : (
          <p className="text-base whitespace-pre-line text-ink">{text}</p>
        )}
        <p className="text-sm text-ink-3">Set by {setBy} · Applies to everyone in this workspace</p>
      </section>
      <section aria-label="Team files" className="grid gap-2 rounded-sm border border-line bg-surface p-3">
        <header className="flex items-center gap-2"><h3 className="flex-1 text-base font-semibold text-ink">Files</h3>{onAddFile && <Button variant="ghost" size="sm" onClick={onAddFile}>Add a file</Button>}</header>
        <ul className="grid gap-1">{files.map((f) => <li key={f.name} className="flex items-center gap-2 text-base"><FileText className="size-3.5 text-ink-3" aria-hidden="true" /><span className="flex-1 text-ink">{f.name}</span><span className="tabular text-sm text-ink-3">{f.size}</span></li>)}</ul>
      </section>
      <p className="text-sm text-ink-3">The assistant reads these for every answer. Don't add personal information about candidates.</p>
    </div>
  )
}

export type Conversation = { id: string; title: string; date: string; status?: "new" | "needs-you" }

export function ConversationHistory({ scheduled, recent, onOpen }: { scheduled: Conversation[]; recent: Conversation[]; onOpen: (id: string) => void }) {
  const [q, setQ] = React.useState("")
  const f = (l: Conversation[]) => l.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()))
  const row = (c: Conversation) => (
    <li key={c.id}>
      <button type="button" onClick={() => onOpen(c.id)} className="flex w-full items-center gap-2 rounded-xs px-2 py-2 text-left hover:bg-hover">
        {c.status === "new" && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-label="New answer" />}
        <span className="min-w-0 flex-1 truncate text-base text-ink">{c.title}</span>
        {c.status === "needs-you" && <Badge variant="warning" dot>Needs you</Badge>}
        <span className="tabular shrink-0 text-sm text-ink-3">{c.date}</span>
      </button>
    </li>
  )
  return (
    <div className="grid gap-3">
      <div className="relative"><Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" aria-hidden="true" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" aria-label="Search conversations" className="pl-8" /></div>
      {f(scheduled).length > 0 && <section className="grid gap-0.5"><h3 className="px-2 text-sm font-medium text-ink-3">Scheduled tasks</h3><ul>{f(scheduled).map(row)}</ul></section>}
      <section className="grid gap-0.5"><h3 className="px-2 text-sm font-medium text-ink-3">Recent</h3>{f(recent).length ? <ul>{f(recent).map(row)}</ul> : <p className="px-2 text-base text-ink-2">No conversations match.</p>}</section>
    </div>
  )
}

export type Template = { id: string; name: string; does: string; tools: string[]; category: string }

/** Picking a template opens it as a draft task; it never runs. */
export function TemplatesGallery({ open, onOpenChange, templates, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; templates: Template[]; onPick: (t: Template) => void }) {
  const cats = ["All", ...new Set(templates.map((t) => t.category))]
  const [cat, setCat] = React.useState("All")
  const [q, setQ] = React.useState("")
  const shown = templates.filter((t) => (cat === "All" || t.category === cat) && `${t.name} ${t.does}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-line p-4"><DialogTitle>Templates</DialogTitle><DialogDescription>Start from a template. It opens as a draft you can change before it runs.</DialogDescription></DialogHeader>
        <div className="grid min-h-80 grid-cols-[180px_1fr] max-sm:grid-cols-1">
          <nav aria-label="Categories" className="grid content-start gap-0.5 border-r border-line p-2">
            {cats.map((c) => <button key={c} type="button" aria-current={cat === c || undefined} onClick={() => setCat(c)} className={cn("rounded-xs px-2 py-2 text-left text-base", cat === c ? "bg-selected font-medium text-ink" : "text-ink-2 hover:bg-hover")}>{c}</button>)}
          </nav>
          <div className="grid content-start gap-3 p-4">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates" aria-label="Search templates" />
            <ul className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              {shown.map((t) => (
                <li key={t.id}>
                  <button type="button" onClick={() => onPick(t)} className="grid h-full w-full content-start gap-1 rounded-sm border border-line p-3 text-left transition-shadow hover:shadow-raised">
                    <span className="text-base font-medium text-ink">{t.name}</span>
                    <span className="text-sm text-ink-2">{t.does}</span>
                    <span className="text-xs text-ink-3">Uses {t.tools.join(", ")}</span>
                  </button>
                </li>
              ))}
            </ul>
            {!shown.length && <p className="text-base text-ink-2">No templates match.</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ---------------------------------------------------------------- prompt editor */

export function PromptEditor({ segments, onRemoveField, inputs, outputs, onTest, testing, results }: { segments: (string | { field: string })[]; onRemoveField: (i: number) => void; inputs: { name: string; type: string }[]; outputs: { name: string; type: string }[]; onTest: () => void; testing?: boolean; results?: { row: string; value: string }[] }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-ink-3">Type <kbd className="rounded-xs border border-line px-1 font-mono">{"{{"}</kbd> for a field, <kbd className="rounded-xs border border-line px-1 font-mono">@</kbd> for a team file.</p>
      <div role="textbox" aria-label="Prompt" aria-multiline="true" className="min-h-20 rounded-sm border border-input bg-surface px-2 py-2 text-base leading-7 text-ink shadow-xs">
        {segments.map((s, i) =>
          typeof s === "string" ? (
            <span key={i}>{s}</span>
          ) : (
            <span key={i} className="mx-0.5 inline-flex h-5.5 items-center gap-1 rounded-xs bg-primary-soft pr-0.5 pl-2 align-baseline font-mono text-sm text-primary-ink">
              {s.field}
              <button type="button" aria-label={`Remove field ${s.field}`} onClick={() => onRemoveField(i)} className="relative grid size-4 place-items-center rounded-xs after:absolute after:-inset-1 hover:bg-surface"><X className="size-3" aria-hidden="true" /></button>
            </span>
          ),
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {[["Inputs", inputs], ["Output", outputs]].map(([title, list]) => (
          <section key={title as string} className="grid gap-1 rounded-sm border border-line p-2">
            <h3 className="text-sm font-medium text-ink-2">{title as string}</h3>
            <ul className="grid gap-1">{(list as { name: string; type: string }[]).map((f) => <li key={f.name} className="flex justify-between text-base"><span className="font-mono text-ink">{f.name}</span><span className="text-sm text-ink-3">{f.type}</span></li>)}</ul>
          </section>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" loading={testing} onClick={onTest}>Test on 3 rows</Button>
        <span className="text-sm text-ink-3">Check the results before running on the whole table.</span>
      </div>
      {results && (
        <ul aria-label="Test results" className="divide-y divide-line rounded-sm border border-line">
          {results.map((r) => <li key={r.row} className="grid gap-0.5 px-3 py-2"><span className="text-sm text-ink-3">{r.row}</span><span className="text-base text-ink">{r.value}</span><AiOrigin from={r.row} /></li>)}
        </ul>
      )}
    </div>
  )
}
