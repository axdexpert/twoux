/**
 * TwoUX composition: the one place for things that need the person. List and detail side by side,
 * Inbox / Snoozed / Done tabs with counts, items that block an agent first ("Needs you"), J/K to move,
 * E to mark done, ⇧H to snooze. Acting never leaves the Inbox; the next item opens after Done.
 */
import { Check, Clock } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Badge } from "./badge"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "./tabs"

export type InboxItem = { id: string; title: string; source: string; time: string; needsYou?: boolean; state: "inbox" | "snoozed" | "done"; snoozedUntil?: string }
export const SNOOZE_TIMES = ["In an hour", "Tomorrow, 9:00", "Next week", "In a month"] as const

export function Inbox({
  items,
  onDone,
  onSnooze,
  renderDetail,
  className,
}: {
  items: InboxItem[]
  onDone: (id: string) => void
  onSnooze: (id: string, until: string) => void
  renderDetail: (item: InboxItem) => React.ReactNode
  className?: string
}) {
  const [tab, setTab] = React.useState<InboxItem["state"]>("inbox")
  const list = items.filter((i) => i.state === tab).sort((a, b) => Number(!!b.needsYou) - Number(!!a.needsYou))
  const [activeId, setActiveId] = React.useState<string | null>(list[0]?.id ?? null)
  const [snoozeOpen, setSnoozeOpen] = React.useState(false)
  const active = list.find((i) => i.id === activeId) ?? list[0] ?? null
  const idx = active ? list.indexOf(active) : -1
  const count = (s: InboxItem["state"]) => items.filter((i) => i.state === s).length
  const listRef = React.useRef<HTMLUListElement>(null)

  const next = () => list[idx + 1]?.id ?? list[idx - 1]?.id ?? null
  const done = () => { if (!active) return; const n = next(); onDone(active.id); setActiveId(n) }
  const snooze = (until: string) => { if (!active) return; const n = next(); onSnooze(active.id, until); setActiveId(n); setSnoozeOpen(false) }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input, textarea")) return
    const k = e.key.toLowerCase()
    if (k === "j" || e.key === "ArrowDown") { e.preventDefault(); setActiveId(list[Math.min(list.length - 1, idx + 1)]?.id ?? null) }
    else if (k === "k" || e.key === "ArrowUp") { e.preventDefault(); setActiveId(list[Math.max(0, idx - 1)]?.id ?? null) }
    else if (k === "e" && tab !== "done") { e.preventDefault(); done() }
    else if (k === "h" && e.shiftKey && tab === "inbox") { e.preventDefault(); setSnoozeOpen(true) }
  }

  return (
    <div data-slot="inbox" className={cn("grid min-h-0 grid-cols-[minmax(0,320px)_minmax(0,1fr)] overflow-hidden rounded-sm border border-line bg-surface max-md:grid-cols-1", className)}>
      <div className="flex min-h-0 flex-col border-r border-line max-md:border-r-0 max-md:border-b">
        <Tabs value={tab} onValueChange={(v) => { setTab(v as InboxItem["state"]); setActiveId(null) }} className="px-3 pt-2">
          <TabsList aria-label="Inbox views">
            <TabsTrigger value="inbox" count={count("inbox")}>Inbox</TabsTrigger>
            <TabsTrigger value="snoozed" count={count("snoozed")}>Snoozed</TabsTrigger>
            <TabsTrigger value="done" count={count("done")}>Done</TabsTrigger>
          </TabsList>
        </Tabs>
        {list.length === 0 ? (
          <p className="px-4 py-8 text-center text-base text-ink-2">{tab === "inbox" ? "You're all caught up." : tab === "snoozed" ? "Nothing snoozed." : "Nothing done yet."}</p>
        ) : (
          <ul ref={listRef} role="listbox" aria-label="Items" aria-activedescendant={active ? `inbox-${active.id}` : undefined} tabIndex={0} onKeyDown={onKey} className="min-h-0 flex-1 overflow-y-auto py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset">
            {list.map((it) => (
              <li
                key={it.id}
                id={`inbox-${it.id}`}
                role="option"
                aria-selected={active?.id === it.id}
                onClick={() => setActiveId(it.id)}
                className={cn("mx-1 grid cursor-default gap-0.5 rounded-xs px-2 py-2", active?.id === it.id ? "bg-selected" : "hover:bg-hover")}
              >
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-base font-medium text-ink">{it.title}</span>
                  <span className="tabular shrink-0 text-sm text-ink-3">{it.state === "snoozed" && it.snoozedUntil ? it.snoozedUntil : it.time}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-2">{it.source}</span>
                  {it.needsYou && it.state === "inbox" && <Badge variant="warning" dot>Needs you</Badge>}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="border-t border-line px-3 py-2 text-xs text-ink-3">J K to move · E done · ⇧H snooze</p>
      </div>
      <div className="flex min-h-0 flex-col">
        {active ? (
          <>
            <div className="flex items-start gap-2 border-b border-line px-4 py-2">
              <h2 className="min-w-0 flex-1 pt-1 text-md font-semibold text-ink">{active.title}</h2>
              {tab === "inbox" && (
                <DropdownMenu open={snoozeOpen} onOpenChange={setSnoozeOpen}>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" shortcut="⇧H"><Clock />Snooze</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Snooze until</DropdownMenuLabel>
                    {SNOOZE_TIMES.map((t) => <DropdownMenuItem key={t} onSelect={() => snooze(t)}>{t}</DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {tab !== "done" && <Button variant="outline" size="sm" shortcut="E" onClick={done}><Check />Done</Button>}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">{renderDetail(active)}</div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center p-8 text-base text-ink-3">Select an item to see it here.</div>
        )}
      </div>
    </div>
  )
}
