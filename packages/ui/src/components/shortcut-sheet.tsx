/**
 * TwoUX composition: every shortcut by task, opened with ? from anywhere outside a text field,
 * with the switch that turns single-key shortcuts off (WCAG 2.1.4). Built on Dialog, Kbd and Switch.
 */
import * as React from "react"
import { cn } from "../lib/cn"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
import { Kbd } from "./kbd"
import { Switch } from "./switch"

export type ShortcutGroup = { title: string; items: { keys: string[]; action: string }[] }

export function ShortcutSheet({ groups, singleKeys, onSingleKeysChange }: { groups: ShortcutGroup[]; singleKeys: boolean; onSingleKeysChange: (on: boolean) => void }) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?" || e.metaKey || e.ctrlKey) return
      // A shortcut can dispatch "?" on document (⌘/ in a sheet), whose target isn't an element.
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable=true]")) return
      e.preventDefault()
      setOpen(true)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Press ? anywhere to open this list.</DialogDescription>
        </DialogHeader>
        <label className="flex items-start justify-between gap-4 rounded-sm bg-surface-2 p-3">
          <span className="grid gap-0.5">
            <span className="text-base font-medium text-ink">Single-key shortcuts</span>
            <span className="text-sm text-ink-2">Turn off if you use a screen reader or voice control. ⌘ shortcuts stay on.</span>
          </span>
          <Switch checked={singleKeys} onCheckedChange={onSingleKeysChange} />
        </label>
        <div className="grid gap-4">
          {groups.map((g) => (
            <section key={g.title} className="grid gap-1">
              <h3 className="text-sm font-medium text-ink-3">{g.title}</h3>
              <dl className="grid divide-y divide-line">
                {g.items.map((it) => (
                  <div key={it.action} className="flex items-center justify-between gap-3 py-2">
                    <dt className="text-base text-ink">{it.action}</dt>
                    <dd className="flex shrink-0 items-center gap-1">{it.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** The same groups as ShortcutSheet, laid out on the page: under a grid or an editor, so the keys are visible without pressing ?. */
export function ShortcutList({ groups, title = "Keyboard shortcuts", className }: { groups: ShortcutGroup[]; title?: string; className?: string }) {
  const id = React.useId()
  return (
    <section aria-labelledby={id} className={cn("@container grid gap-3", className)}>
      <h3 id={id} className="text-md font-semibold text-ink">{title}</h3>
      <div className="grid gap-x-8 gap-y-4 @xl:grid-cols-2 @5xl:grid-cols-3">
        {groups.map((g) => (
          <section key={g.title} className="grid content-start gap-1">
            <h4 className="text-sm font-medium text-ink-3">{g.title}</h4>
            <dl className="grid divide-y divide-line">
              {g.items.map((it) => (
                <div key={it.action} className="flex items-center justify-between gap-3 py-2">
                  <dt className="text-base text-ink">{it.action}</dt>
                  <dd className="flex shrink-0 items-center gap-1">{it.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </section>
  )
}
