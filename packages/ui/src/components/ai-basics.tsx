/**
 * TwoUX assistant basics: the parts every assistant UI needs.
 * Origin label, citations and sources, thinking steps, starters and follow-ups, and the message composer.
 * AI is marked by one small mark (a speech bubble: the assistant wrote this) plus words ("Assistant · from …"), never by a sparkle, a separate colour or a gradient.
 * Proposals, the assistant panel and page, and agent controls live in ai.tsx.
 */
import { ArrowUp, Check, ChevronDown, ChevronRight, CornerDownRight, Lightbulb, Loader2, MessageSquareText, Plus, Square, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { ShimmerText } from "./motion"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu"
import { Textarea } from "./textarea"

/* ---------------------------------------------------------------- origin */

export function AiMark({ className }: { className?: string }) {
  return <MessageSquareText aria-hidden="true" className={cn("size-3 shrink-0 text-ink-3", className)} strokeWidth={2} />
}

/** “Assistant · from your workspace data · 2 min ago”: what produced it and from what. One per group of generated content. */
export function AiOrigin({ from, time, className }: { from: string; time?: string; className?: string }) {
  return (
    <span data-slot="ai-origin" className={cn("inline-flex items-center gap-1 text-sm text-ink-3", className)}>
      <AiMark />
      <span>Assistant · from {from}{time ? ` · ${time}` : ""}</span>
    </span>
  )
}

/* ---------------------------------------------------------------- citations */

/** A record ID that opens the record, placed at the end of the claim it supports. */
export function Citation({ id, onOpen, active }: { id: string; onOpen?: (id: string) => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(id)}
      className={cn("relative mx-0.5 inline-flex h-4.5 items-center rounded-xs border px-1 align-baseline font-mono text-xs transition-colors after:absolute after:-inset-1", active ? "border-primary bg-primary-soft text-primary-ink" : "border-line-strong bg-surface-2 text-ink-2 hover:border-input-hover hover:text-ink")}
    >
      {id}
    </button>
  )
}

export function SourcesList({ sources, active, onSelect }: { sources: { id: string; title: string; detail?: string }[]; active?: string; onSelect?: (id: string) => void }) {
  return (
    <ul aria-label="Sources" className="grid gap-1">
      {sources.map((s) => (
        <li key={s.id}>
          <button type="button" onClick={() => onSelect?.(s.id)} aria-current={active === s.id || undefined} className={cn("grid w-full gap-0.5 rounded-xs border px-2 py-2 text-left transition-colors", active === s.id ? "border-primary bg-primary-soft" : "border-line hover:bg-hover")}>
            <span className="flex items-center gap-2"><span className="font-mono text-xs text-ink-3">{s.id}</span><span className="truncate text-base font-medium text-ink">{s.title}</span></span>
            {s.detail && <span className="text-sm text-ink-2">{s.detail}</span>}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------------- thinking */

export type ThinkingStep = { title: string; detail?: string }

/** Says the current step in words with a running timer, then collapses to “Thought for 2.1s · 4 steps”. */
export function ThinkingSteps({ steps, done, seconds, verb = "Thought" }: { steps: ThinkingStep[]; done: boolean; seconds: number; /** "Thought" for reasoning, "Worked" for an agent that also ran tools */ verb?: string }) {
  const [open, setOpen] = React.useState(false)
  if (!done) {
    const cur = steps[steps.length - 1]
    return (
      <div role="status" className="grid gap-2 text-base">
        <span className="flex items-center gap-2 text-ink-2"><Loader2 className="size-3.5 animate-spin text-ink-3" aria-hidden="true" /><ShimmerText active={!done}>{cur?.title ?? "Thinking"}</ShimmerText><span className="tabular text-sm text-ink-3">{seconds.toFixed(1)}s</span></span>
        {cur?.detail && <span className="pl-5.5 text-sm text-ink-3">{cur.detail}</span>}
      </div>
    )
  }
  return (
    <div className="grid gap-2">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="inline-flex w-fit items-center gap-control rounded-xs text-sm text-ink-2 hover:text-ink">
        <Check className="size-3.5 text-ok" aria-hidden="true" />{verb} for {seconds.toFixed(1)}s · {steps.length} steps
        <ChevronRight className={cn("size-3.5 text-ink-3 transition-transform duration-(--duration-fast)", open && "rotate-90")} aria-hidden="true" />
      </button>
      {open && (
        <ol className="ml-2 grid gap-2 border-l border-line pl-3.5">
          {steps.map((s, i) => <li key={i} className="grid text-sm"><span className="font-medium text-ink">{s.title}</span>{s.detail && <span className="text-ink-2">{s.detail}</span>}</li>)}
        </ol>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- suggestions */

export function Starters({ items, onPick, onHide }: { items: string[]; onPick: (q: string) => void; onHide?: () => void }) {
  return (
    <div className="grid gap-2">
      <span className="flex items-center gap-control text-sm text-ink-3"><Lightbulb className="size-3.5" aria-hidden="true" />Try asking{onHide && <Button variant="ghost" size="xs" className="ml-auto" onClick={onHide}>Hide</Button>}</span>
      <div className="flex flex-wrap gap-control">{items.slice(0, 3).map((q) => <Button key={q} variant="outline" size="sm" onClick={() => onPick(q)}>{q}</Button>)}</div>
    </div>
  )
}

export function FollowUps({ items, onPick }: { items: string[]; onPick: (q: string) => void }) {
  return (
    <div className="grid gap-0.5">
      <span className="text-sm text-ink-3">Follow-ups</span>
      {items.slice(0, 3).map((q) => (
        <button key={q} type="button" onClick={() => onPick(q)} className="flex items-start gap-2 rounded-xs px-1 py-1 text-left text-base text-ink-2 hover:bg-hover hover:text-ink">
          <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-ink-3" aria-hidden="true" />{q}
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- composer */

export type ContextChip = { id: string; label: string }

export function MessageComposer({
  chips = [],
  onRemoveChip,
  onSend,
  busy = false,
  onStop,
  mentions = [],
  tasks = [],
  plusMenu,
  noun = { one: "record", many: "records" },
  placeholder = `Ask about these ${noun.many}`,
}: {
  chips?: ContextChip[]
  onRemoveChip?: (id: string) => void
  onSend: (text: string, mode: "quick" | "thorough") => void
  busy?: boolean
  onStop?: () => void
  /** @ suggestions: the records people can mention */
  mentions?: { id: string; label: string }[]
  /** / suggestions: saved tasks */
  tasks?: string[]
  plusMenu?: React.ReactNode
  /** What @ mentions refer to in this product, e.g. { one: "listing", many: "listings" } or { one: "file", many: "files" } */
  noun?: { one: string; many: string }
  placeholder?: string
}) {
  const [text, setText] = React.useState("")
  const [mode, setMode] = React.useState<"quick" | "thorough">("quick")
  const [hi, setHi] = React.useState(0)
  const trigger = /(^|\s)([@/])(\w*)$/.exec(text)
  const list = trigger ? (trigger[2] === "@" ? mentions.map((m) => m.label) : tasks).filter((x) => x.toLowerCase().includes(trigger[3].toLowerCase())).slice(0, 6) : []
  const accept = (v: string) => { setText((t) => t.replace(/(^|\s)[@/]\w*$/, `$1${trigger?.[2] === "@" ? "@" : "/"}${v} `)); setHi(0) }
  const send = () => { if (!text.trim() || busy) return; onSend(text.trim(), mode); setText("") }
  const listId = React.useId()
  return (
    <div data-slot="composer" className="grid gap-2 rounded-md border border-input bg-surface p-2 shadow-xs focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {chips.map((c) => (
            <span key={c.id} className="inline-flex h-5.5 items-center gap-1 rounded-xs border border-line bg-surface-2 pr-0.5 pl-2 text-sm text-ink-2">
              {c.label}
              {onRemoveChip && <button type="button" onClick={() => onRemoveChip(c.id)} aria-label={`Remove ${c.label} from context`} className="relative grid size-4 place-items-center rounded-xs text-ink-3 after:absolute after:-inset-1 hover:bg-hover hover:text-ink"><X className="size-3" aria-hidden="true" /></button>}
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setHi(0) }}
          placeholder={placeholder}
          aria-label="Message the assistant"
          role="combobox"
          aria-expanded={list.length > 0}
          aria-controls={listId}
          aria-activedescendant={list.length ? `${listId}-${hi}` : undefined}
          onKeyDown={(e) => {
            if (list.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); setHi((h) => (h + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length); return }
            if (list.length && (e.key === "Enter" || e.key === "Tab")) { e.preventDefault(); accept(list[hi]); return }
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
          }}
          className="min-h-10 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
        />
        {list.length > 0 && (
          <ul id={listId} role="listbox" aria-label={trigger?.[2] === "@" ? noun.many.charAt(0).toUpperCase() + noun.many.slice(1) : "Saved tasks"} className="absolute bottom-full left-0 z-20 mb-1 grid w-64 rounded-md border border-line bg-surface p-1 shadow-pop">
            {list.map((v, i) => <li key={v} id={`${listId}-${i}`} role="option" aria-selected={i === hi} onMouseDown={(e) => { e.preventDefault(); accept(v) }} className={cn("rounded-xs px-2 py-2 text-base", i === hi ? "bg-accent text-ink" : "text-ink-2")}>{trigger?.[2]}{v}</li>)}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Add context or options"><Plus /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {plusMenu ?? (<><DropdownMenuLabel>Insert</DropdownMenuLabel><DropdownMenuItem onSelect={() => setText((t) => `${t}@`)}>Mention a {noun.one}</DropdownMenuItem><DropdownMenuItem onSelect={() => setText((t) => `${t}/`)}>Run a saved task</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">{mode === "quick" ? "Quick" : "Thorough"}<ChevronDown className="text-ink-3" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => setMode("quick")}>Quick: answers in seconds</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setMode("thorough")}>Thorough: reads more {noun.many}, takes longer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="flex-1" />
        {busy ? (
          <Button size="sm" variant="outline" onClick={onStop} aria-label="Stop the answer"><Square className="fill-current" />Stop</Button>
        ) : (
          <Button size="icon-sm" aria-label="Send" disabled={!text.trim()} onClick={send}><ArrowUp /></Button>
        )}
      </div>
    </div>
  )
}
