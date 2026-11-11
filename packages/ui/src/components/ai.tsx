/**
 * TwoUX compositions for working with the assistant, built from generated shadcn parts.
 * The assistant changes nothing on its own: it proposes (SuggestedChanges), the person applies, Undo follows.
 * The basic parts (origin label, citations, thinking steps, composer, starters and follow-ups) live in ai-basics.tsx.
 * AI is marked by one small mark plus words ("Assistant · from …"), never by a separate colour or gradient.
 */
import { Check, Copy, Ellipsis, FileText, Loader2, RefreshCw, ThumbsDown, ThumbsUp, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { ShimmerText, Swap } from "./motion"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"
import { SidePanel, type PanelMode } from "./shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Textarea } from "./textarea"
import { AiMark, AiOrigin } from "./ai-basics"

/* ---------------------------------------------------------------- clarifying question */

export type ClarifyOption = { id: string; title: string; detail?: string }

/** Up to three questions, one at a time; the recommended option first; Other last; Skip keeps the defaults. */
export function ClarifyingQuestion({ questions, onDone }: { questions: { question: string; options: ClarifyOption[] }[]; onDone: (answers: string[]) => void }) {
  const [i, setI] = React.useState(0)
  const [answers, setAnswers] = React.useState<string[]>(questions.map((q) => q.options[0]?.id ?? ""))
  const [other, setOther] = React.useState("")
  const q = questions[i]
  const choose = (v: string) => setAnswers((a) => a.map((x, j) => (j === i ? v : x)))
  const next = () => (i < questions.length - 1 ? setI(i + 1) : onDone(answers.map((a) => (a === "__other" ? other : a))))
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).tagName === "INPUT") return
    const n = Number(e.key)
    if (n >= 1 && n <= q.options.length) { e.preventDefault(); choose(q.options[n - 1].id) }
    else if (n === q.options.length + 1) { e.preventDefault(); choose("__other") }
    else if (e.key === "Enter") { e.preventDefault(); next() }
  }
  return (
    <section aria-label="Question from the assistant" onKeyDown={onKey} className="grid gap-3 rounded-md border border-line bg-surface p-3 shadow-card">
      <div className="flex items-baseline gap-2"><span className="tabular text-sm text-ink-3">{i + 1} / {questions.length}</span><h3 className="text-base font-medium text-ink">{q.question}</h3></div>
      <div role="radiogroup" aria-label={q.question} className="grid gap-1">
        {[...q.options, { id: "__other", title: "Other", detail: undefined }].map((o, k) => {
          const on = answers[i] === o.id
          return (
            <button key={o.id} type="button" role="radio" aria-checked={on} onClick={() => choose(o.id)} className={cn("flex items-start gap-2 rounded-sm border px-2 py-2 text-left transition-colors", on ? "border-primary bg-primary-soft" : "border-line hover:bg-hover")}>
              <span className="tabular mt-px grid size-4.5 shrink-0 place-items-center rounded-xs border border-line-strong bg-surface text-xs text-ink-2">{k + 1}</span>
              <span className="grid gap-0.5">
                <span className="text-base text-ink">{o.title}{k === 0 && <span className="text-ink-3"> (Recommended)</span>}</span>
                {o.detail && <span className="text-sm text-ink-2">{o.detail}</span>}
              </span>
            </button>
          )
        })}
        {answers[i] === "__other" && <Textarea autoFocus value={other} onChange={(e) => setOther(e.target.value)} placeholder="Tell the assistant what you want" aria-label="Your answer" />}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
        <span className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => onDone(answers)}>Skip, use defaults</Button>
        <Button size="sm" shortcut="↵" onClick={next}>{i < questions.length - 1 ? "Next" : "Continue"}</Button>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- proposals */

export type ProposedChange = { id: string; label: string; detail?: string; before?: string; after?: string }

/** The proposal: each change with a tick and before/after. Nothing changes until Apply. */
export function SuggestedChanges({ changes, onApply, onDismiss, onEdit }: { changes: ProposedChange[]; onApply: (ids: string[]) => void; onDismiss: () => void; onEdit?: () => void }) {
  const [on, setOn] = React.useState(changes.map((c) => c.id))
  const n = on.length
  return (
    <section aria-label="Suggested changes" onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && n) { e.preventDefault(); onApply(on) } }} className="grid rounded-md border border-line bg-surface shadow-card">
      <header className="flex items-center gap-2 border-b border-line px-3 py-2"><AiMark /><h3 className="text-base font-semibold text-ink">Suggested changes</h3><span className="tabular text-sm text-ink-3">{changes.length}</span></header>
      <ul className="divide-y divide-line">
        {changes.map((c) => {
          const id = `chg-${c.id}`
          const checked = on.includes(c.id)
          return (
            <li key={c.id} className="flex items-start gap-2 px-3 py-2">
              <Checkbox id={id} checked={checked} onCheckedChange={() => setOn((x) => (checked ? x.filter((y) => y !== c.id) : [...x, c.id]))} className="mt-0.5" />
              <label htmlFor={id} className="grid min-w-0 gap-0.5">
                <span className="text-base font-medium text-ink">{c.label}</span>
                {c.detail && <span className="text-sm text-ink-2">{c.detail}</span>}
                {(c.before || c.after) && (
                  <span className="text-sm">
                    {c.before && <del className="mr-2 rounded-xs bg-bad-bg px-1 text-bad decoration-bad/60">{c.before}</del>}
                    {c.after && <ins className="rounded-xs bg-ok-bg px-1 text-ok no-underline">{c.after}</ins>}
                  </span>
                )}
              </label>
            </li>
          )
        })}
      </ul>
      <footer className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2">
        <span className="flex-1 text-sm text-ink-3">Nothing changes until you apply.</span>
        <Button variant="ghost" size="sm" onClick={onDismiss}>Dismiss</Button>
        {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>}
        <Button size="sm" shortcut="⌘↵" disabled={!n} onClick={() => onApply(on)}>Apply {n} {n === 1 ? "change" : "changes"}</Button>
      </footer>
    </section>
  )
}

/** While changes apply: each step pending, done or failed (with why); a counter; then a summary. */
export function StepCard({ steps, title }: { title: string; steps: { label: string; state: "pending" | "done" | "failed"; reason?: string }[] }) {
  const done = steps.filter((s) => s.state === "done").length
  const finished = steps.every((s) => s.state !== "pending")
  return (
    <section aria-label={title} className="grid rounded-md border border-line bg-surface shadow-card">
      <header className="flex items-center justify-between border-b border-line px-3 py-2"><h3 className="text-base font-semibold text-ink">{title}</h3><span className="tabular text-sm text-ink-3">{done} / {steps.length}</span></header>
      <ul className="grid gap-2 px-3 py-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-base">
            {s.state === "pending" ? <Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-ink-3" aria-hidden="true" /> : s.state === "done" ? <Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" /> : <X className="mt-0.5 size-3.5 shrink-0 text-bad" aria-hidden="true" />}
            <span className="grid"><span className="text-ink">{s.label}<span className="sr-only"> ({s.state})</span></span>{s.reason && <span className="text-sm text-bad">{s.reason}</span>}</span>
          </li>
        ))}
      </ul>
      <footer role="status" className="border-t border-line px-3 py-2 text-sm text-ink-2">{finished ? `Applied ${done} of ${steps.length}.` : <ShimmerText>Working…</ShimmerText>}</footer>
    </section>
  )
}

/* ---------------------------------------------------------------- answer actions and artifacts */

export function AnswerActions({ text, latest = true, onRegenerate, onFeedback, more }: { text: string; latest?: boolean; onRegenerate?: () => void; onFeedback: (v: "up" | "down") => Promise<void>; more?: React.ReactNode }) {
  const [fb, setFb] = React.useState<{ v: "up" | "down"; state: "sending" | "sent" } | null>(null)
  const [copied, setCopied] = React.useState(false)
  const send = async (v: "up" | "down") => { setFb({ v, state: "sending" }); try { await onFeedback(v); setFb({ v, state: "sent" }) } catch { setFb(null) } }
  return (
    <div role="group" aria-label="Answer actions" className="flex items-center gap-0.5">
      <Button variant="ghost" size="icon-xs" aria-label={copied ? "Copied" : "Copy answer"} onClick={() => { void navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}><Swap kind="icon" swapKey={copied ? "copied" : "copy"}>{copied ? <Check /> : <Copy />}</Swap></Button>
      <Button variant="ghost" size="icon-xs" aria-label="Helpful" aria-pressed={fb?.v === "up"} disabled={fb?.state === "sent" && fb.v !== "up"} loading={fb?.state === "sending" && fb.v === "up"} onClick={() => send("up")} className="aria-pressed:text-primary-ink"><ThumbsUp /></Button>
      <Button variant="ghost" size="icon-xs" aria-label="Not helpful" aria-pressed={fb?.v === "down"} disabled={fb?.state === "sent" && fb.v !== "down"} loading={fb?.state === "sending" && fb.v === "down"} onClick={() => send("down")} className="aria-pressed:text-primary-ink"><ThumbsDown /></Button>
      {latest && onRegenerate && <Button variant="ghost" size="icon-xs" aria-label="Regenerate" onClick={onRegenerate}><RefreshCw /></Button>}
      {more && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-xs" aria-label="More answer actions"><Ellipsis /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start">{more}</DropdownMenuContent>
        </DropdownMenu>
      )}
      {fb?.state === "sent" && <span role="status" className="ml-1 text-sm text-ink-3">Thanks for the feedback</span>}
    </div>
  )
}

export function ArtifactCard({ title, meta, from, writing, actions, preview }: { title: string; meta: string; from: string; writing?: boolean; actions?: React.ReactNode; preview?: React.ReactNode }) {
  return (
    <article aria-label={title} className="grid rounded-sm border border-line bg-surface">
      <div className="flex items-start gap-2 p-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-surface-2 text-ink-2"><FileText className="size-4" aria-hidden="true" /></span>
        <div className="grid min-w-0 flex-1 gap-0.5">
          <span className="truncate text-base font-medium text-ink">{title}</span>
          {writing ? <span role="status" className="flex items-center gap-control text-sm text-ink-3"><Loader2 className="size-3 animate-spin" aria-hidden="true" />Writing {title.toLowerCase()}</span> : <span className="text-sm text-ink-3">{meta}</span>}
          <AiOrigin from={from} />
        </div>
        {!writing && actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>
      {preview && !writing && <div className="max-h-48 overflow-hidden border-t border-line bg-surface-2 px-3 py-2 text-sm text-ink-2">{preview}</div>}
    </article>
  )
}

/* ---------------------------------------------------------------- thread, panel and page */

export function UserMessage({ children }: { children: React.ReactNode }) {
  return <div className="justify-self-end rounded-md bg-surface-2 px-3 py-2 text-base text-ink">{children}</div>
}

export function AssistantMessage({ from, children, actions, followUps }: { from: string; children: React.ReactNode; actions?: React.ReactNode; followUps?: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <AiOrigin from={from} />
      <div className="grid gap-2 text-base text-ink [&_p]:max-w-prose">{children}</div>
      {actions}
      {followUps}
    </div>
  )
}

export function AssistantPanel({
  open,
  onOpenChange,
  title = "Assistant",
  mode = "push",
  onOpenPage,
  children,
  composer,
  caveat,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title?: string
  mode?: PanelMode
  onOpenPage?: () => void
  children: React.ReactNode
  composer: React.ReactNode
  /** One specific limit and what to check, e.g. "Reads listings and applications only, not emails. Check closing dates before extending." Never a generic "can make mistakes". */
  caveat?: string
}) {
  return (
    <SidePanel open={open} onOpenChange={onOpenChange} mode={mode} label="Assistant" title={<span className="flex items-center gap-control"><AiMark className="size-3.5" />{title}</span>} onOpenFull={onOpenPage} footer={<div className="grid w-full gap-2">{composer}{caveat && <p className="text-xs text-ink-3">{caveat}</p>}</div>}>
      <div role="log" aria-label="Conversation" className="grid gap-5">{children}</div>
    </SidePanel>
  )
}

export function AssistantPage({ thread, records, sources, composer }: { thread: React.ReactNode; records: React.ReactNode; sources: React.ReactNode; composer: React.ReactNode }) {
  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_280px] max-lg:grid-cols-1">
      <Tabs defaultValue="answer" className="min-h-0 gap-0">
        <div className="border-b border-line px-6"><TabsList aria-label="Assistant views" className="border-b-0"><TabsTrigger value="answer">Answer</TabsTrigger><TabsTrigger value="records">Records</TabsTrigger></TabsList></div>
        <TabsContent value="answer" className="mx-auto grid w-full max-w-2xl content-start gap-5 px-6 py-5"><div role="log" aria-label="Conversation" className="grid gap-5">{thread}</div>{composer}</TabsContent>
        <TabsContent value="records" className="px-6 py-5">{records}</TabsContent>
      </Tabs>
      <aside aria-label="Sources" className="grid content-start gap-2 border-l border-line bg-surface-2 p-4 max-lg:border-t max-lg:border-l-0">
        <h2 className="text-sm font-medium text-ink-2">Sources</h2>
        {sources}
      </aside>
    </div>
  )
}

