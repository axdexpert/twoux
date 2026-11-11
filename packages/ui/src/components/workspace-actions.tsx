/**
 * TwoUX compositions for shaping a sheet.
 * ActionCatalogue: the actions that add a column (look-ups, AI, formulas, exports), searchable and in tabs, each with a
 *   one-line description and its cost per row; choosing one opens a short set-up with the estimated total before adding.
 *   New columns test on a few rows by default; running on every row is a choice made with the total in view.
 * TableSettings: duplicates, empty rows and sharing as a template, in the side panel, saved with Save. Closing with
 *   unsaved changes asks first; nothing asks when nothing changed.
 */
import { ArrowLeft, Check, Copy, Search } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { cn } from "../lib/cn"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog"
import { Button } from "./button"
import { CheckboxField, RadioField, TextField } from "./fields"
import { Input } from "./input"
import { Swap } from "./motion"
import { ProviderLogo } from "./onboarding"
import type { ProviderId } from "./provider-logos.data"
import { RadioGroup } from "./radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { SidePanel, type PanelMode } from "./shell"
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { formatCredits } from "./workspace"

/* ---------------------------------------------------------------- action catalogue */

export type CatalogueCategory = "Enrichment" | "AI" | "Formulas" | "Exports"
export type CatalogueAction = {
  id: string
  name: string
  /** One line: what the new column holds. */
  description: string
  category: CatalogueCategory
  suggested?: boolean
  /** The third-party service it uses; its logo replaces the icon. */
  provider?: ProviderId
  /** A lucide icon for actions that don't use another service. */
  icon?: React.ReactNode
  /** 0 for free. */
  costPerRow: number
  /** Inputs chosen before adding, such as which column holds the company domain. */
  inputs?: { id: string; label: string; options: string[]; defaultValue?: string }[]
}
export type ActionRunChoice = "test" | "all" | "none"
export type ActionConfig = { action: CatalogueAction; columnName: string; inputs: Record<string, string>; run: ActionRunChoice }

const TABS = ["Suggested", "Enrichment", "AI", "Formulas", "Exports"] as const
const perRow = (c: number) => (c ? `≈ ${formatCredits(c)} / row` : "Free")

function ActionIcon({ action }: { action: CatalogueAction }) {
  if (action.provider) return <ProviderLogo provider={action.provider} size="md" />
  return <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-xs border border-line bg-surface-2 text-ink-2 [&_svg]:size-3.5">{action.icon}</span>
}

export function ActionCatalogue({ actions, rowCount, testRows = 10, onAdd, className }: { actions: CatalogueAction[]; /** Rows in the table now, for the estimate. */ rowCount: number; testRows?: number; onAdd: (config: ActionConfig) => void; className?: string }) {
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("Suggested")
  const [query, setQuery] = React.useState("")
  const [chosen, setChosen] = React.useState<CatalogueAction | null>(null)
  const [name, setName] = React.useState("")
  const [inputs, setInputs] = React.useState<Record<string, string>>({})
  const [run, setRun] = React.useState<ActionRunChoice>("test")
  const [nameError, setNameError] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)

  const q = query.trim().toLowerCase()
  const inTab = (a: CatalogueAction, t: (typeof TABS)[number]) => (t === "Suggested" ? !!a.suggested : a.category === t)
  const shown = q ? actions.filter((a) => `${a.name} ${a.description}`.toLowerCase().includes(q)) : actions.filter((a) => inTab(a, tab))
  const n = (x: number) => x.toLocaleString("en-GB")
  const tested = Math.min(testRows, rowCount)

  const choose = (a: CatalogueAction) => {
    setChosen(a); setName(a.name); setNameError(""); setRun(a.costPerRow ? "test" : "all")
    setInputs(Object.fromEntries((a.inputs ?? []).map((i) => [i.id, i.defaultValue ?? i.options[0] ?? ""])))
  }
  const add = () => {
    if (!chosen) return
    if (!name.trim()) { setNameError("Enter a column name."); document.getElementById("action-column-name")?.focus(); return }
    onAdd({ action: chosen, columnName: name.trim(), inputs, run })
    setChosen(null)
  }

  if (chosen) {
    const total = chosen.costPerRow * rowCount
    const runLabel = run === "test" ? `Add column and test on ${n(tested)} rows` : run === "all" ? `Add column and run on ${n(rowCount)} rows` : "Add column"
    return (
      <div data-slot="action-catalogue" className={cn("grid content-start gap-4", className)}>
        <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => { setChosen(null); window.setTimeout(() => listRef.current?.querySelector<HTMLElement>(`[data-action="${chosen.id}"]`)?.focus()) }}><ArrowLeft />All actions</Button>
        <div className="flex items-start gap-3">
          <ActionIcon action={chosen} />
          <div className="grid min-w-0 gap-0.5">
            <h3 className="text-base font-semibold text-ink">{chosen.name}</h3>
            <p className="text-sm text-ink-2">{chosen.description}</p>
            <p className="tabular text-sm text-ink-3">{perRow(chosen.costPerRow)}{chosen.provider ? ` · uses your connected account` : ""}</p>
          </div>
        </div>
        <TextField id="action-column-name" label="Column name" value={name} onChange={(e) => { setName(e.target.value); setNameError("") }} error={nameError} required />
        {(chosen.inputs ?? []).map((i) => (
          <div key={i.id} className="grid gap-2">
            <label htmlFor={`action-input-${i.id}`} className="text-base font-medium text-ink">{i.label}</label>
            <Select value={inputs[i.id]} onValueChange={(v) => setInputs((x) => ({ ...x, [i.id]: v }))}>
              <SelectTrigger id={`action-input-${i.id}`} className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{i.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        ))}
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-base font-medium text-ink">Run after adding</legend>
          <RadioGroup value={run} onValueChange={(v) => setRun(v as ActionRunChoice)} className="gap-2">
            {chosen.costPerRow > 0 && <RadioField id="run-test" value="test" label={`Test on the first ${n(tested)} rows`} hint={`About ${formatCredits(chosen.costPerRow * tested)}. Check the results, then run the rest.`} />}
            <RadioField id="run-all" value="all" label={`Run on all ${n(rowCount)} rows`} hint={chosen.costPerRow ? `About ${formatCredits(total)}.` : "Free."} />
            <RadioField id="run-none" value="none" label="Don't run yet" hint="The column is added empty. Run it from its menu." />
          </RadioGroup>
        </fieldset>
        <div className="grid gap-0.5 rounded-sm bg-surface-2 px-3 py-2">
          <p className="text-base font-medium text-ink">{chosen.costPerRow ? `About ${formatCredits(total)} for ${n(rowCount)} rows` : `Free for all ${n(rowCount)} rows`}</p>
          <p className="tabular text-sm text-ink-2">{chosen.costPerRow ? `${formatCredits(chosen.costPerRow)} × ${n(rowCount)} rows. Failed and not found rows aren't charged. New rows cost the same when Auto-run is on.` : "Formulas and exports don't use credits."}</p>
        </div>
        <Button className="justify-self-end" onClick={add}>{runLabel}</Button>
      </div>
    )
  }

  return (
    <div data-slot="action-catalogue" ref={listRef} className={cn("grid content-start gap-3", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actions" aria-label="Search actions" className="pl-8" />
      </div>
      {!q && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as (typeof TABS)[number])}>
          <TabsList aria-label="Action categories" className="w-full overflow-x-auto">
            {TABS.map((t) => <TabsTrigger key={t} value={t} count={actions.filter((a) => inTab(a, t)).length}>{t}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      )}
      {q && <p className="text-sm text-ink-2" aria-live="polite">{shown.length ? `${shown.length} ${shown.length === 1 ? "action matches" : "actions match"} in all categories` : ""}</p>}
      {shown.length ? (
        <ul className="grid gap-1">
          {shown.map((a) => (
            <li key={a.id}>
              <button type="button" data-action={a.id} onClick={() => choose(a)} className="flex w-full items-start gap-3 rounded-sm px-2 py-2 text-left transition-colors duration-(--duration-fast) hover:bg-hover">
                <ActionIcon action={a} />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="text-base font-medium text-ink">{a.name}</span>
                  <span className="text-sm text-ink-2">{a.description}</span>
                </span>
                <span className="tabular shrink-0 text-sm text-ink-3">{perRow(a.costPerRow)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid justify-items-start gap-1 py-4">
          <p className="text-base text-ink-2">{q ? `No actions match “${query.trim()}”.` : "No actions in this category yet."}</p>
          {q && <Button variant="link" size="xs" onClick={() => setQuery("")}>Clear search</Button>}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- table settings */

export type TableSettingsValue = {
  duplicates: "keep-oldest" | "keep-newest" | "allow"
  /** Column id that identifies a duplicate. */
  matchOn: string
  deleteEmptyRows: boolean
  template: { shared: boolean; audience: "workspace" | "link" }
}

export function TableSettings({
  open,
  onOpenChange,
  value,
  onSave,
  columns,
  tableName,
  workspaceName,
  templateLink,
  mode = "push",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: TableSettingsValue
  /** May return a promise; Save shows Saving until it settles. */
  onSave: (value: TableSettingsValue) => void | Promise<void>
  /** Columns that can identify a duplicate. */
  columns: { id: string; label: string }[]
  tableName: string
  workspaceName: string
  templateLink: string
  mode?: PanelMode
}) {
  const [draft, setDraft] = React.useState(value)
  const [saving, setSaving] = React.useState(false)
  const [asking, setAsking] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => { if (open) setDraft(value) }, [open, value])
  const dirty = JSON.stringify(draft) !== JSON.stringify(value)
  const changes = (Object.keys(value) as (keyof TableSettingsValue)[]).filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(value[k])).length

  React.useEffect(() => {
    if (!open || !dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [open, dirty])

  const close = (o: boolean) => { if (!o && dirty) { setAsking(true); return } onOpenChange(o) }
  const save = async () => {
    setSaving(true)
    try { await onSave(draft); toast.success("Table settings saved"); onOpenChange(false) } finally { setSaving(false) }
  }
  const match = columns.find((c) => c.id === draft.matchOn)?.label ?? "the key column"

  return (
    <>
      <SidePanel
        open={open}
        onOpenChange={close}
        mode={mode}
        label="Table settings"
        title="Table settings"
        meta={tableName}
        footer={<><Button variant="outline" onClick={() => close(false)}>Cancel</Button><Button loading={saving} onClick={save} shortcut="⌘↵">Save</Button></>}
      >
        <form className="grid gap-6" onSubmit={(e) => { e.preventDefault(); void save() }} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void save() } }}>
          <section aria-labelledby="ts-dupes" className="grid gap-3">
            <div className="grid gap-0.5">
              <h3 id="ts-dupes" className="text-base font-semibold text-ink">Duplicate rows</h3>
              <p className="text-sm text-ink-2">Checked when rows are added, imported or arrive from an automation.</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="ts-match" className="text-base font-medium text-ink">Rows are duplicates when they share</label>
              <Select value={draft.matchOn} onValueChange={(v) => setDraft((d) => ({ ...d, matchOn: v }))}>
                <SelectTrigger id="ts-match" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{columns.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <RadioGroup value={draft.duplicates} onValueChange={(v) => setDraft((d) => ({ ...d, duplicates: v as TableSettingsValue["duplicates"] }))} aria-labelledby="ts-dupes" className="gap-3">
              <RadioField id="ts-oldest" value="keep-oldest" label="Keep the oldest row" hint={`A new row with the same ${match} isn't added. Imports say how many were skipped. Nothing already in the table changes.`} />
              <RadioField id="ts-newest" value="keep-newest" label="Keep the newest row" hint={`A new row with the same ${match} replaces the old one. The old row's values, including looked-up and AI cells, are overwritten, and computed columns run again for it at their usual cost.`} />
              <RadioField id="ts-allow" value="allow" label="Keep both" hint="Duplicates are allowed. Every copy runs computed columns, so each one costs credits." />
            </RadioGroup>
          </section>
          <section aria-labelledby="ts-empty" className="grid gap-3">
            <h3 id="ts-empty" className="text-base font-semibold text-ink">Empty rows</h3>
            <CheckboxField id="ts-delete-empty" label="Delete empty rows automatically" hint="Rows with no value in any column are moved to Deleted after 24 hours. You can restore them from Deleted for 30 days." checked={draft.deleteEmptyRows} onCheckedChange={(v) => setDraft((d) => ({ ...d, deleteEmptyRows: v === true }))} />
          </section>
          <section aria-labelledby="ts-template" className="grid gap-3">
            <h3 id="ts-template" className="text-base font-semibold text-ink">Share as a template</h3>
            <CheckboxField id="ts-share" label="Share this table as a template" hint="Shares the columns, formulas, prompts and these settings. Rows and looked-up values are never shared." checked={draft.template.shared} onCheckedChange={(v) => setDraft((d) => ({ ...d, template: { ...d.template, shared: v === true } }))} />
            {draft.template.shared && (
              <div className="grid gap-3 border-l-2 border-line pl-4">
                <fieldset className="grid gap-2">
                  <legend className="mb-2 text-base font-medium text-ink">Who can use the template</legend>
                  <RadioGroup value={draft.template.audience} onValueChange={(v) => setDraft((d) => ({ ...d, template: { ...d.template, audience: v as "workspace" | "link" } }))} className="gap-2">
                    <RadioField id="ts-aud-ws" value="workspace" label={`People in ${workspaceName}`} hint="They find it in Templates." />
                    <RadioField id="ts-aud-link" value="link" label="Anyone with the link" hint="Including people outside the workspace. They get a copy, never this table." />
                  </RadioGroup>
                </fieldset>
                <div className="grid gap-2">
                  <label htmlFor="ts-link" className="text-base font-medium text-ink">Template link</label>
                  <div className="flex gap-2">
                    <Input id="ts-link" readOnly value={templateLink} onFocus={(e) => e.currentTarget.select()} className="font-mono" />
                    <Button type="button" variant="outline" onClick={() => { void navigator.clipboard?.writeText(templateLink); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }}>
                      <Swap kind="icon" swapKey={copied ? "y" : "n"}>{copied ? <Check className="text-ok" /> : <Copy />}</Swap>
                      <Swap swapKey={copied ? "c" : "n"}>{copied ? "Copied" : "Copy"}</Swap>
                    </Button>
                  </div>
                  <p className="text-sm text-ink-3">The link works once you save.</p>
                </div>
              </div>
            )}
          </section>
        </form>
      </SidePanel>
      <AlertDialog open={asking} onOpenChange={setAsking}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>You changed {changes} {changes === 1 ? "setting" : "settings"} in {tableName}. They haven't been saved.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { setAsking(false); setDraft(value); onOpenChange(false) }}>Discard changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
