/**
 * TwoUX compositions for supervising agents: agree the plan before work starts, review what an agent wants to change
 * (including changes an agent proposes to another agent), and say plainly when the agent is unsure or why it chose.
 *
 * PlanCard: the plan before a multi-step run. Steps can be removed; steps that reach people or can't be undone are marked.
 * PlanChange: one line in the run when the plan changes, saying what changed and why.
 * DiffView: files with +/− counts and a unified diff; markers and words carry the change, never colour alone.
 * SimulationResults: test conversations run against a change, failures first, new failures called out.
 * ChangeRequest: one proposed change with its reason, diff and simulation results; Approve, or Reject with a reason.
 * ConfidenceNote: uncertainty in words (never a percentage), what caused it, and a safer option or a way to check.
 * WhyChoice: a "Why?" control that names the deciding factors and the options that lost, then Change this or Keep it.
 */
import { AlertTriangle, Check, ChevronRight, CircleHelp, FileText, Lock, Users, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { AiOrigin } from "./ai-basics"
import { Badge } from "./badge"
import { Button } from "./button"
import { Field, FieldError, FieldLabel } from "./field"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Textarea } from "./textarea"

/* ---------------------------------------------------------------- plan */

export type PlanStep = {
  id: string
  title: string
  detail?: string
  /** "external" reaches people or systems outside the workspace; "irreversible" can't be undone */
  risk?: "external" | "irreversible"
}

const RISK = {
  external: { icon: Users, word: "Reaches people outside the workspace" },
  irreversible: { icon: Lock, word: "Can't be undone" },
} as const

/**
 * The plan before the agent starts. People can remove steps (and put them back) before approving. When any step reaches
 * people outside the workspace or can't be undone, Approve and Cancel carry equal weight and nothing runs on a timeout.
 */
export function PlanCard({
  title,
  steps,
  from,
  onApprove,
  onCancel,
  className,
}: {
  title: string
  steps: PlanStep[]
  /** What the plan is based on, for the origin label */
  from: string
  onApprove: (steps: PlanStep[]) => void
  onCancel: () => void
  className?: string
}) {
  const [removed, setRemoved] = React.useState<string[]>([])
  const kept = steps.filter((s) => !removed.includes(s.id))
  const highStakes = kept.some((s) => s.risk)
  return (
    <section aria-label={`Plan: ${title}`} data-slot="plan-card" className={cn("grid rounded-sm border border-line bg-surface", className)}>
      <header className="grid gap-0.5 border-b border-line px-3 py-2">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <AiOrigin from={from} />
      </header>
      <ol className="grid">
        {steps.map((s, i) => {
          const off = removed.includes(s.id)
          const R = s.risk ? RISK[s.risk] : null
          return (
            <li key={s.id} className={cn("flex items-start gap-2 border-b border-line px-3 py-2 last:border-b-0", off && "bg-surface-2")}>
              <span className={cn("tabular mt-0.5 w-4 shrink-0 text-sm text-ink-3", off && "line-through")}>{i + 1}</span>
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className={cn("text-base text-ink", off && "text-ink-3 line-through")}>{s.title}{off && <span className="sr-only"> (removed)</span>}</span>
                {s.detail && !off && <span className="text-sm text-ink-2">{s.detail}</span>}
                {R && !off && <span className="inline-flex items-center gap-1 text-sm font-medium text-warn"><R.icon className="size-3.5" aria-hidden="true" />{R.word}</span>}
              </span>
              <Button variant="ghost" size="xs" onClick={() => setRemoved((r) => (off ? r.filter((x) => x !== s.id) : [...r, s.id]))}>
                {off ? "Put back" : "Remove"}<span className="sr-only"> step {i + 1}</span>
              </Button>
            </li>
          )
        })}
      </ol>
      <footer className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2">
        <span className="min-w-0 flex-1 text-sm text-ink-2">
          {kept.length} of {steps.length} steps · nothing runs until you approve
        </span>
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant={highStakes ? "outline" : "default"} size="sm" disabled={kept.length === 0} onClick={() => onApprove(kept)}>
          Approve plan
        </Button>
      </footer>
    </section>
  )
}

/** One line in the thread or run when the plan changes mid-way. Never reroute silently. */
export function PlanChange({ what, why, className }: { what: string; why: string; className?: string }) {
  return (
    <p role="status" data-slot="plan-change" className={cn("flex items-start gap-2 rounded-xs border border-line bg-surface-2 px-2 py-2 text-sm text-ink-2", className)}>
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden="true" />
      <span><span className="font-medium text-ink">Plan changed: </span>{what}. {why}</span>
    </p>
  )
}

/* ---------------------------------------------------------------- diff */

export type DiffLine = { type: "add" | "del" | "ctx"; text: string }
export type DiffFile = { path: string; lines: DiffLine[]; note?: string }

const count = (f: DiffFile, t: DiffLine["type"]) => f.lines.filter((l) => l.type === t).length

/** Changed files with +/− counts; each file opens to a unified diff. Added and removed lines carry + and − and a hidden word. */
export function DiffView({ files, defaultOpen, className }: { files: DiffFile[]; /** Path of the file to show open */ defaultOpen?: string; className?: string }) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen ? [defaultOpen] : files.slice(0, 1).map((f) => f.path))
  const totals = files.reduce((a, f) => [a[0] + count(f, "add"), a[1] + count(f, "del")], [0, 0])
  return (
    <div data-slot="diff-view" className={cn("grid min-w-0 rounded-sm border border-line bg-surface", className)}>
      <div className="flex items-center gap-3 border-b border-line px-3 py-2 text-sm text-ink-2">
        <span className="flex-1">{files.length} {files.length === 1 ? "file" : "files"} changed</span>
        <span className="tabular font-medium text-ok">+{totals[0]}</span>
        <span className="tabular font-medium text-bad">−{totals[1]}</span>
      </div>
      {files.map((f) => {
        const isOpen = open.includes(f.path)
        return (
          <div key={f.path} className="min-w-0 border-b border-line last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen((o) => (isOpen ? o.filter((p) => p !== f.path) : [...o, f.path]))}
              className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-hover"
            >
              <ChevronRight className={cn("size-3.5 shrink-0 text-ink-3 transition-transform duration-(--duration-fast)", isOpen && "rotate-90")} aria-hidden="true" />
              <FileText className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-mono text-sm text-ink">{f.path}</span>
              <span className="tabular text-sm text-ok">+{count(f, "add")}<span className="sr-only"> added</span></span>
              <span className="tabular text-sm text-bad">−{count(f, "del")}<span className="sr-only"> removed</span></span>
            </button>
            {isOpen && (
              <div className="overflow-x-auto border-t border-line bg-surface-2 py-1 font-mono text-sm">
                {f.note && <p className="px-3 py-1 font-sans text-ink-3">{f.note}</p>}
                {f.lines.map((l, i) => (
                  <div key={i} className={cn("flex min-w-max px-3 leading-6", l.type === "add" && "bg-ok-bg", l.type === "del" && "bg-bad-bg")}>
                    <span aria-hidden="true" className={cn("w-4 shrink-0 select-none", l.type === "add" ? "text-ok" : l.type === "del" ? "text-bad" : "text-ink-3")}>{l.type === "add" ? "+" : l.type === "del" ? "−" : " "}</span>
                    <span className="sr-only">{l.type === "add" ? "Added: " : l.type === "del" ? "Removed: " : ""}</span>
                    <span className={cn("whitespace-pre", l.type === "del" ? "text-ink-2" : "text-ink")}>{l.text || " "}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- simulations */

export type SimulationCase = {
  name: string
  /** "fail" failed before and still fails; "new-fail" passed before this change and fails now; "fixed" failed before and passes now */
  status: "pass" | "fail" | "new-fail" | "fixed"
  detail?: string
}

const SIM_ORDER = { "new-fail": 0, fail: 1, fixed: 2, pass: 3 } as const
const SIM_WORD = { "new-fail": "Newly failing", fail: "Failing", fixed: "Fixed", pass: "Passed" } as const

/** Test conversations run against a change. Failures come first; a change that breaks a passing case says so in words. */
export function SimulationResults({ cases, suite, className }: { cases: SimulationCase[]; /** e.g. "Golden set, 240 conversations" */ suite: string; className?: string }) {
  const n = (s: SimulationCase["status"]) => cases.filter((c) => c.status === s).length
  const passing = n("pass") + n("fixed")
  const sorted = [...cases].sort((a, b) => SIM_ORDER[a.status] - SIM_ORDER[b.status])
  return (
    <section aria-label="Simulation results" data-slot="simulation-results" className={cn("grid rounded-sm border border-line bg-surface", className)}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-3 py-2">
        <span className="text-base font-semibold text-ink">{passing} of {cases.length} pass</span>
        <span className="text-sm text-ink-2">{suite}</span>
        <span className="flex-1" />
        {n("fixed") > 0 && <Badge variant="success" dot>{n("fixed")} fixed</Badge>}
        {n("new-fail") > 0 && <Badge variant="destructive" dot>{n("new-fail")} newly failing</Badge>}
      </header>
      <ul className="grid max-h-64 overflow-y-auto">
        {sorted.map((c, i) => (
          <li key={i} className="flex items-start gap-2 border-b border-line px-3 py-2 last:border-b-0">
            {c.status === "pass" || c.status === "fixed" ? <Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" /> : <X className="mt-0.5 size-3.5 shrink-0 text-bad" aria-hidden="true" />}
            <span className="grid min-w-0 flex-1"><span className="text-base text-ink">{c.name}</span>{c.detail && <span className="text-sm text-ink-2">{c.detail}</span>}</span>
            <span className={cn("shrink-0 text-sm", c.status === "new-fail" ? "font-medium text-bad" : "text-ink-3")}>{SIM_WORD[c.status]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- change request */

export type ChangeRequestState = "open" | "approved" | "rejected"

/**
 * One change an agent proposes (to records, procedures or another agent): why, what changes, how it tested.
 * Nothing goes live until a person approves; rejecting asks for a reason the agent can learn from.
 * After a decision the card keeps a resolved line with who decided and when.
 */
export function ChangeRequest({
  title,
  reason,
  from,
  files,
  simulation,
  state = "open",
  decidedBy,
  onApprove,
  onReject,
  className,
}: {
  title: string
  /** Why the agent proposes this, in one or two sentences */
  reason: string
  /** What the proposal is based on, e.g. "14 conversations this week" */
  from: string
  files?: DiffFile[]
  simulation?: { suite: string; cases: SimulationCase[] }
  state?: ChangeRequestState
  /** e.g. "Approved by Imogen Hart · 10:42" */
  decidedBy?: string
  onApprove: () => void
  onReject: (reason: string) => void
  className?: string
}) {
  const [rejecting, setRejecting] = React.useState(false)
  const [why, setWhy] = React.useState("")
  const [error, setError] = React.useState("")
  const newFails = simulation?.cases.filter((c) => c.status === "new-fail").length ?? 0
  const submitReject = () => {
    if (!why.trim()) { setError("Say why, so the agent can do better next time."); return }
    onReject(why.trim())
    setRejecting(false)
  }
  return (
    <article aria-label={`Change: ${title}`} data-slot="change-request" className={cn("grid min-w-0 gap-3 rounded-sm border border-line bg-surface p-3", className)}>
      <header className="grid gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 flex-1 text-md font-semibold text-ink">{title}</h3>
          <Badge variant={state === "approved" ? "success" : state === "rejected" ? "secondary" : "warning"} dot>
            {state === "approved" ? "Approved" : state === "rejected" ? "Rejected" : "Waiting for review"}
          </Badge>
        </div>
        <AiOrigin from={from} />
        <p className="max-w-prose text-base text-ink-2">{reason}</p>
      </header>
      {files && files.length > 0 && <DiffView files={files} />}
      {simulation && <SimulationResults suite={simulation.suite} cases={simulation.cases} />}
      {state === "open" ? (
        rejecting ? (
          <div className="grid gap-2">
            <Field data-invalid={!!error || undefined}>
              <FieldLabel htmlFor={`${title}-why`}>Why are you rejecting this?</FieldLabel>
              <Textarea
                id={`${title}-why`}
                value={why}
                rows={2}
                aria-invalid={!!error || undefined}
                onChange={(e) => { setWhy(e.target.value); setError("") }}
              />
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setRejecting(false); setError("") }}>Back</Button>
              <Button variant="outline" size="sm" onClick={submitReject}>Reject change</Button>
            </div>
          </div>
        ) : (
          <footer className="flex flex-wrap items-center gap-2">
            <span className="min-w-0 flex-1 text-sm text-ink-2">
              {newFails > 0 ? `${newFails} conversation${newFails === 1 ? "" : "s"} that passed before now fail. Check them before approving.` : "Nothing goes live until you approve."}
            </span>
            <Button variant="outline" size="sm" onClick={() => setRejecting(true)}>Reject</Button>
            <Button size="sm" onClick={onApprove}>Approve change</Button>
          </footer>
        )
      ) : (
        <p role="status" className="text-sm text-ink-2">{decidedBy ?? (state === "approved" ? "Approved" : "Rejected")}</p>
      )}
    </article>
  )
}

/* ---------------------------------------------------------------- confidence */

/**
 * The agent is unsure. Say so in words, never as a percentage; say what caused it; offer a safer option or a way to check.
 * Scale it to the stakes: use it when the output affects other people, shared records or money.
 */
export function ConfidenceNote({ cause, children, action, className }: { /** What made the agent unsure, e.g. "the connection is 35 minutes" */ cause: string; /** The safer option or what to check */ children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div data-slot="confidence-note" className={cn("grid gap-2 rounded-sm border border-warn-line bg-warn-bg px-3 py-2", className)}>
      <p className="flex items-start gap-2 text-base text-ink">
        <CircleHelp className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden="true" />
        <span><span className="font-medium">Not sure: </span>{cause}.</span>
      </p>
      {children && <div className="pl-5.5 text-base text-ink-2">{children}</div>}
      {action && <div className="flex flex-wrap gap-2 pl-5.5">{action}</div>}
    </div>
  )
}

/* ---------------------------------------------------------------- why */

/**
 * "Why?" on demand, next to a choice the agent made. Names the deciding factors and the options that lost, says if a
 * requirement couldn't be met, and ends with an action. Store the reasoning with the choice so the answer never drifts.
 */
export function WhyChoice({
  choice,
  factors,
  alternatives = [],
  dropped,
  onChange,
  onKeep,
}: {
  choice: string
  factors: string[]
  alternatives?: { name: string; why: string }[]
  /** A requirement that couldn't be met */
  dropped?: string
  onChange?: () => void
  onKeep?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" data-slot="why-choice" className="relative inline-flex items-center rounded-xs text-sm font-medium text-primary-ink after:absolute after:-inset-1 hover:underline">
          Why?<span className="sr-only"> Why {choice}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="grid w-80 gap-3 text-base">
        <p className="font-medium text-ink">Why {choice}</p>
        <ul className="grid gap-1 text-ink-2">
          {factors.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />{f}</li>)}
        </ul>
        {alternatives.length > 0 && (
          <div className="grid gap-1">
            <span className="text-sm font-medium text-ink">Not chosen</span>
            {alternatives.map((a) => <p key={a.name} className="text-sm text-ink-2"><span className="text-ink">{a.name}</span>: {a.why}</p>)}
          </div>
        )}
        {dropped && <p className="text-sm text-ink-2"><span className="font-medium text-warn">Couldn't meet: </span>{dropped}</p>}
        {(onChange || onKeep) && (
          <div className="flex justify-end gap-2 border-t border-line pt-2">
            {onChange && <Button variant="outline" size="sm" onClick={() => { setOpen(false); onChange() }}>Change this</Button>}
            {onKeep && <Button variant="ghost" size="sm" onClick={() => { setOpen(false); onKeep() }}>Keep it</Button>}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
