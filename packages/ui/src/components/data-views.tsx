/**
 * TwoUX compositions for working with collections, built only from generated shadcn parts.
 * FilterButton + FilterRow: the filter UX to use (button in the toolbar, applied filters on their own row). Built from
 * FilterBar, FilterPill, FilterMenu, FilterSummary: filters as segmented chips that read as sentences; values apply on tick.
 * ExportMenu: options, then downloads, then copies, in one menu.
 * GroupedList, ListGroup: records under collapsible, counted group headers.
 * SavedViews: named filter + sort + column sets as tabs, with unsaved changes, save and reset.
 */
import { Check, ChevronRight, Download, EllipsisVertical, ListFilter, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { useShortcut } from "../lib/shortcuts"
import { Badge } from "./badge"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { DateFilterPill, DateRangeChooser, type DatePreset, dateFilterFromValues, dateFilterToValues, describeDateFilter } from "./date-picker"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { Input } from "./input"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover"
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { Kbd } from "./kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ---------------------------------------------------------------- filters */

export type FilterOption = { value: string; label: string; count?: number }

export function FilterBar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label="Filters" data-slot="filter-bar" className={cn("flex flex-wrap items-center gap-control", className)}>
      {children}
    </div>
  )
}

/** A filter. Dashed while empty (a suggestion), solid once set. Reads "Field operator values". */
export function FilterPill({
  field,
  operator = "is any of",
  options,
  selected,
  onChange,
  onRemove,
  defaultOpen = false,
  searchable,
  valueNoun,
}: {
  field: string
  /** How three or more values are counted on the chip, e.g. { one: "seniority", many: "seniorities" }. Falls back to "3 selected". */
  valueNoun?: { one: string; many: string }
  operator?: string
  options: FilterOption[]
  selected: string[]
  /** Called on every tick: list values apply at once. */
  onChange: (values: string[]) => void
  /** Removes the pill. Without it, a set pill clears its values instead. */
  onRemove?: () => void
  defaultOpen?: boolean
  /** Type-ahead inside the list; on by default past 7 options. */
  searchable?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const set = selected.length > 0
  const labels = options.filter((o) => selected.includes(o.value)).map((o) => o.label)
  // One or two values read in full; three or more are counted, the full list stays in the popover and the name.
  const summary = labels.length <= 2 ? labels.join(", ") : `${labels.length} ${valueNoun?.many ?? "selected"}`
  const spoken = labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : labels[0]
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  const remove = onRemove ?? (() => onChange([]))
  const segment = "flex items-center px-2 whitespace-nowrap"
  const focus = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* A segmented chip: field | operator | value | remove, one unit with hairlines between the parts. */}
      <div
        data-slot="filter-pill"
        data-state={set ? "set" : "empty"}
        className={cn(
          "inline-flex h-7 items-stretch overflow-hidden rounded-sm border text-base transition-colors duration-(--duration-fast) ease-(--ease-out)",
          set ? "divide-x divide-line border-line-strong bg-surface text-ink shadow-xs" : "border-dashed border-line-strong text-ink-2 hover:border-input-hover hover:text-ink"
        )}
      >
        {set ? (
          <>
            <span className={cn(segment, "text-ink-2")}>{field}</span>
            <span className={cn(segment, "text-ink-3")}>{operator}</span>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`${field} ${operator} ${spoken}. Change values`}
                onKeyDown={(e) => { if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); remove() } }}
                className={cn(segment, "max-w-56 font-medium transition-colors hover:bg-hover", focus)}
              >
                <span className="truncate">{summary}</span>
              </button>
            </PopoverTrigger>
            <button type="button" onClick={remove} aria-label={`Remove ${field} filter`} className={cn("grid w-7 place-items-center text-ink-3 transition-colors hover:bg-hover hover:text-ink", focus)}>
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <PopoverTrigger asChild>
            <button type="button" className={cn("inline-flex items-center gap-1 px-2 whitespace-nowrap", focus)}>
              <Plus className="size-3.5 text-ink-3" aria-hidden="true" />
              {field}
            </button>
          </PopoverTrigger>
        )}
      </div>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          {(searchable ?? options.length > 7) && <CommandInput placeholder={`Search ${field.toLowerCase()}`} />}
          <CommandList>
            <CommandEmpty>No matches</CommandEmpty>
            <CommandGroup heading={`${field} ${operator}`}>
              {options.map((o) => {
                const on = selected.includes(o.value)
                return (
                  <CommandItem key={o.value} value={o.label} onSelect={() => toggle(o.value)} aria-checked={on}>
                    <Checkbox checked={on} tabIndex={-1} aria-hidden="true" className="pointer-events-none" />
                    <span className="truncate">{o.label}</span>
                    {o.count !== undefined && <span className="tabular ml-auto text-sm text-ink-3">{o.count}</span>}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export type FilterField = {
  id: string
  label: string
  group?: "Most used" | "All fields"
  /** With options, picking the field opens its values beside the list; ticks apply at once through onChange. */
  options?: FilterOption[]
  selected?: string[]
  /** date: picking the field opens typed dates, presets and a calendar beside the list; selected holds dateFilterToValues. */
  kind?: "date"
  presets?: DatePreset[]
  maxDays?: number
}

/**
 * The Filter (F) button: fields first, then, beside them, the chosen field's values with counts.
 * A filter shows as a chip only once a value is applied, so nothing appears in the filter row half-made.
 */
export function FilterMenu({
  fields,
  onPick,
  onChange,
  label = "Filter",
  variant = "button",
}: {
  fields: FilterField[]
  /** Fields without options: called when one is picked (the app adds an empty pill). */
  onPick?: (id: string) => void
  /** Fields with options: called on every tick in the values panel. */
  onChange?: (id: string, values: string[]) => void
  label?: string
  /**
   * button: labelled, ghost (the original).
   * icon: a bordered icon button for a toolbar, named by label, F in its tooltip; filters then show on their own row.
   * add: a + after applied filters, to add another one. No shortcut, so it never competes with the toolbar button.
   */
  variant?: "button" | "icon" | "add"
}) {
  const [open, setOpen] = React.useState(false)
  const [sub, setSub] = React.useState<string | null>(null)
  const groups = ["Most used", "All fields"] as const
  const field = fields.find((f) => f.id === sub)
  const toggle = (f: FilterField, v: string) => {
    const cur = f.selected ?? []
    onChange?.(f.id, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v])
  }
  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSub(null) }}>
      {variant !== "button" ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              {variant === "icon" ? (
                <Button variant="outline" size="icon-sm" shortcut="F" aria-label={label}><ListFilter /></Button>
              ) : (
                <Button variant="ghost" size="icon-sm" aria-label="Add filter"><Plus /></Button>
              )}
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{variant === "icon" ? <>{label} <Kbd>F</Kbd></> : "Add filter"}</TooltipContent>
        </Tooltip>
      ) : (
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" shortcut="F">
            <ListFilter />
            {label}
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent align={variant === "icon" ? "end" : "start"} className="w-60 p-0">
        {/* The values panel anchors to this list and opens beside it. */}
        <Popover open={!!field} onOpenChange={(o) => { if (!o) setSub(null) }}>
          <PopoverAnchor asChild>
            <div>
              <Command>
                <CommandInput placeholder="Filter by…" />
                <CommandList>
                  <CommandEmpty>No fields match</CommandEmpty>
                  {groups.map((g) => {
                    const items = fields.filter((f) => (f.group ?? "All fields") === g)
                    if (!items.length) return null
                    return (
                      <CommandGroup key={g} heading={g}>
                        {items.map((f) => {
                          const panel = !!f.options || f.kind === "date"
                          const date = f.kind === "date" ? describeDateFilter(dateFilterFromValues(f.selected, f.presets), f.presets) : null
                          return (
                            <CommandItem
                              key={f.id}
                              value={f.label}
                              aria-haspopup={f.kind === "date" ? "dialog" : f.options ? "listbox" : undefined}
                              aria-expanded={panel ? sub === f.id : undefined}
                              onKeyDown={(e) => { if (e.key === "ArrowRight" && panel) { e.preventDefault(); setSub(f.id) } }}
                              onSelect={() => { if (panel) setSub(f.id); else { setOpen(false); onPick?.(f.id) } }}
                              className={cn(sub === f.id && "bg-accent")}
                            >
                              <span className="flex-1 truncate">{f.label}</span>
                              {date ? <span className="max-w-24 truncate text-sm text-ink-3">{date.text}</span> : !!f.selected?.length && <span className="tabular text-sm text-ink-3">{f.selected.length}</span>}
                              {panel && <ChevronRight className="text-ink-3" />}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    )
                  })}
                </CommandList>
              </Command>
            </div>
          </PopoverAnchor>
          {field?.kind === "date" && (
            <PopoverContent
              side={variant === "icon" ? "left" : "right"}
              align="start"
              sideOffset={6}
              role="dialog"
              aria-label={`${field.label} dates`}
              className="w-auto max-w-(--radix-popover-content-available-width) p-0"
              onKeyDown={(e) => { if (e.key === "ArrowLeft" && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setSub(null) } }}
            >
              <DateRangeChooser
                months={1}
                value={dateFilterFromValues(field.selected, field.presets)}
                presets={field.presets}
                maxDays={field.maxDays}
                onApply={(v) => {
                  onChange?.(field.id, dateFilterToValues(v))
                  setOpen(false)
                  setSub(null)
                }}
              />
            </PopoverContent>
          )}
          {field?.options && (
            <PopoverContent
              side={variant === "icon" ? "left" : "right"}
              align="start"
              sideOffset={6}
              className="w-64 p-0"
              onKeyDown={(e) => { if (e.key === "ArrowLeft") { e.preventDefault(); setSub(null) } }}
            >
              <Command>
                {field.options.length > 7 && <CommandInput placeholder={`Search ${field.label.toLowerCase()}`} />}
                <CommandList>
                  <CommandEmpty>No matches</CommandEmpty>
                  <CommandGroup heading={field.label}>
                    {field.options.map((o) => {
                      const on = !!field.selected?.includes(o.value)
                      return (
                        <CommandItem key={o.value} value={o.label} onSelect={() => toggle(field, o.value)} aria-checked={on}>
                          <Checkbox checked={on} tabIndex={-1} aria-hidden="true" className="pointer-events-none" />
                          <span className="truncate">{o.label}</span>
                          {o.count !== undefined && <span className="tabular ml-auto text-sm text-ink-3">{o.count}</span>}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </PopoverContent>
    </Popover>
  )
}


/** Result count and Clear, right after the pills. */
export function FilterSummary({ shown, total, noun = "rows", onClear }: { shown: number; total: number; noun?: string; onClear?: () => void }) {
  const fmt = (n: number) => n.toLocaleString("en-GB")
  return (
    <span className="ml-1 inline-flex items-center gap-control text-sm text-ink-2">
      <span className="tabular" aria-live="polite">{shown === total ? `${fmt(total)} ${noun}` : `${fmt(shown)} of ${fmt(total)} ${noun}`}</span>
      {onClear && shown !== total && (
        <Button variant="ghost" size="xs" onClick={onClear}>Clear</Button>
      )}
    </span>
  )
}

/* ---------------------------------------------------------------- filter button and row */

/** A field people can filter by, with its values, or a date field (kind: "date") filtered by a period. */
export type FilterFieldDef = {
  id: string
  label: string
  /** The values to tick. Not used for date fields. */
  options?: FilterOption[]
  /**
   * date: filtered by a period, "Applied is in Last 30 days". The field's entry in FilterValue holds
   * dateFilterToValues (["last-30-days"] or ["2026-10-01", "2026-10-31"]); read it with dateFilterFromValues.
   */
  kind?: "date"
  /** Date fields: preset periods. Defaults to DATE_PRESETS; [] shows typed dates and the calendar only. */
  presets?: DatePreset[]
  /** Date fields: longest range, in days. */
  maxDays?: number
  operator?: string
  /** How three or more values are counted on the chip, e.g. { one: "stage", many: "stages" }. */
  valueNoun?: { one: string; many: string }
  group?: "Most used" | "All fields"
}

/** Applied filters: field id to its values, in the order they were added. A field is present only while it has values. */
export type FilterValue = Record<string, string[]>

/** Sets one field's values. An empty list removes the field, so a filter exists only while it filters something. */
export function setFilterValue(value: FilterValue, id: string, values: string[]): FilterValue {
  const next = { ...value }
  if (values.length) next[id] = values
  else delete next[id]
  return next
}

const toMenuFields = (fields: FilterFieldDef[], value: FilterValue): FilterField[] =>
  fields.map((f) => ({ id: f.id, label: f.label, group: f.group ?? "Most used", options: f.kind === "date" ? undefined : (f.options ?? []), kind: f.kind, presets: f.presets, maxDays: f.maxDays, selected: value[f.id] ?? [] }))

/**
 * The toolbar's filter button: fields, then that field's values beside them, applied on tick.
 * Pair it with FilterRow, which shows what is applied on its own row.
 */
export function FilterButton({ fields, value, onChange, label = "Filter" }: { fields: FilterFieldDef[]; value: FilterValue; onChange: (value: FilterValue) => void; label?: string }) {
  return <FilterMenu variant="icon" label={label} fields={toMenuFields(fields, value)} onChange={(id, v) => onChange(setFilterValue(value, id, v))} />
}

/**
 * The applied filters, on their own row under the toolbar: one chip per field, + for another field, then the count
 * and Clear. Renders nothing while no filter is applied, so the row appears only when it has something to say.
 */
export function FilterRow({
  fields,
  value,
  onChange,
  shown,
  total,
  noun,
  className,
}: {
  fields: FilterFieldDef[]
  value: FilterValue
  onChange: (value: FilterValue) => void
  /** Rows showing and in total, for "16 of 150 people" and Clear. */
  shown?: number
  total?: number
  noun?: string
  className?: string
}) {
  const active = Object.keys(value).filter((id) => value[id]?.length && fields.some((f) => f.id === id))
  if (!active.length) return null
  const rest = fields.filter((f) => !active.includes(f.id))
  return (
    <div data-slot="filter-row" className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <FilterBar className="min-w-0 flex-1">
        {active.map((id) => {
          const f = fields.find((x) => x.id === id)!
          if (f.kind === "date")
            return (
              <DateFilterPill
                key={id}
                field={f.label}
                value={dateFilterFromValues(value[id], f.presets)}
                onChange={(v) => onChange(setFilterValue(value, id, dateFilterToValues(v)))}
                onRemove={() => onChange(setFilterValue(value, id, []))}
                presets={f.presets}
                maxDays={f.maxDays}
              />
            )
          return (
            <FilterPill
              key={id}
              field={f.label}
              operator={f.operator ?? "is any of"}
              options={f.options ?? []}
              selected={value[id]}
              onChange={(v) => onChange(setFilterValue(value, id, v))}
              onRemove={() => onChange(setFilterValue(value, id, []))}
              valueNoun={f.valueNoun}
            />
          )
        })}
        {rest.length > 0 && <FilterMenu variant="add" fields={toMenuFields(rest, value)} onChange={(id, v) => onChange(setFilterValue(value, id, v))} />}
      </FilterBar>
      {shown !== undefined && total !== undefined && <FilterSummary shown={shown} total={total} noun={noun} onClear={() => onChange({})} />}
    </div>
  )
}

/* ---------------------------------------------------------------- export */

export type ExportFormat = "CSV" | "JSON"

export function ExportMenu({
  onlyVisible,
  onOnlyVisibleChange,
  includeAi,
  onIncludeAiChange,
  formats = ["CSV", "JSON"],
  onDownload,
  onCopy,
  label = "Export",
  shortcut = "⇧E",
}: {
  /** The trigger's label. */
  label?: string
  /** Bound to the trigger and shown inside the menu, beside its heading (a menu button keeps its hint in the menu); false for no shortcut. */
  shortcut?: string | false
  onlyVisible: boolean
  onOnlyVisibleChange: (v: boolean) => void
  /** Show the AI columns option only when the table has AI columns. */
  includeAi?: boolean
  onIncludeAiChange?: (v: boolean) => void
  /** Most used first. */
  formats?: ExportFormat[]
  onDownload: (format: ExportFormat) => void
  onCopy?: (format: ExportFormat) => void
}) {
  const keepOpen = (fn: () => void) => (e: Event) => { e.preventDefault(); fn() }
  // The key works on the trigger; its hint lives in the menu, so the button is just icon and label.
  // Radix opens a menu on pointer-down and key-down, not on click, so the shortcut's programmatic click
  // (detail 0) opens it here. Real clicks and Enter are already handled by Radix and never reach this.
  const [open, setOpen] = React.useState(false)
  const trigger = React.useRef<HTMLButtonElement>(null)
  useShortcut(shortcut || undefined, trigger)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button ref={trigger} variant="outline" size="sm" onClick={(e) => { if (e.detail === 0) setOpen(true) }} aria-keyshortcuts={shortcut ? shortcut.replace("⇧", "Shift+") : undefined}>
          <Download />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between gap-3 text-ink">
          {label}
          {shortcut && <Kbd>{shortcut}</Kbd>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={onlyVisible} onSelect={keepOpen(() => onOnlyVisibleChange(!onlyVisible))}>Only visible columns</DropdownMenuCheckboxItem>
        {onIncludeAiChange && (
          <DropdownMenuCheckboxItem checked={!!includeAi} onSelect={keepOpen(() => onIncludeAiChange(!includeAi))}>Include AI columns</DropdownMenuCheckboxItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Download</DropdownMenuLabel>
        {formats.map((f) => <DropdownMenuItem key={`d${f}`} onSelect={() => onDownload(f)}>Download {f}</DropdownMenuItem>)}
        {onCopy && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Copy</DropdownMenuLabel>
            {formats.map((f) => <DropdownMenuItem key={`c${f}`} onSelect={() => onCopy(f)}>Copy as {f}</DropdownMenuItem>)}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------------------------------------------------------------- grouped list */

export function GroupedList({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="grouped-list" className={cn("overflow-hidden rounded-sm border border-line bg-surface", className)} {...props}>{children}</div>
}

export function ListGroup({ title, count, action, defaultOpen = true, children }: { title: string; count: number; action?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <Collapsible open={open} onOpenChange={setOpen} data-slot="list-group" className="border-b border-line last:border-b-0">
      <div className="flex h-8 items-center gap-2 bg-surface-2 pr-2 pl-1">
        <CollapsibleTrigger asChild>
          <button type="button" className="flex h-full min-w-0 flex-1 items-center gap-control rounded-xs px-2 text-left text-sm font-medium text-ink">
            <ChevronRight className={cn("size-3.5 shrink-0 text-ink-3 transition-transform duration-(--duration-fast) ease-(--ease-out)", open && "rotate-90")} aria-hidden="true" />
            <span className="truncate">{title}</span>
            <span className="tabular font-normal text-ink-3">{count}</span>
          </button>
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent>
        <ul className="divide-y divide-line">{children}</ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

/* ---------------------------------------------------------------- saved views */

export type SavedView = { id: string; name: string; count?: number }

/** A view action that can't run right now: focusable, announced as unavailable, with its reason under the label. */
function UnavailableItem({ icon, label, reason }: { icon: React.ReactNode; label: string; reason: string }) {
  return (
    <DropdownMenuItem aria-disabled="true" onSelect={(e) => e.preventDefault()} className="items-start text-ink-3 focus:bg-hover focus:text-ink-3">
      {icon}
      <span className="grid gap-0.5">
        {label}
        <span className="text-sm text-ink-3">{reason}</span>
      </span>
    </DropdownMenuItem>
  )
}

export function SavedViews({
  views,
  value,
  onValueChange,
  dirty = false,
  onReset,
  onSave,
  onSaveAs,
  onRename,
  onDelete,
  defaultId,
  onSetDefault,
  className,
}: {
  views: SavedView[]
  value: string
  onValueChange: (id: string) => void
  /** Filters, sort or columns differ from the saved view. */
  dirty?: boolean
  onReset?: () => void
  /** Update the current view. */
  onSave?: () => void
  /** Save the current state as a new view. */
  onSaveAs?: (name: string) => void
  /** Rename a view. Names are unique; the dialog checks before it calls this. */
  onRename?: (id: string, name: string) => void
  /** Delete a view at once. Show a toast with Undo: deleting a view is reversible, so there is no dialog. */
  onDelete?: (id: string) => void
  /** The view that loads when the page opens without filters in the URL. */
  defaultId?: string
  onSetDefault?: (id: string) => void
  className?: string
}) {
  // One name dialog for Save view and Rename view, validated on submit (never a disabled submit button).
  const [naming, setNaming] = React.useState<null | "save" | "rename">(null)
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState("")
  const fieldId = React.useId()
  // The dialog opens from a button or from a menu item that is gone once the menu closes: focus returns to the button that started it.
  const saveRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLButtonElement>(null)
  const returnTo = React.useRef<HTMLButtonElement | null>(null)
  const current = views.find((v) => v.id === value)
  const openNaming = (mode: "save" | "rename", from: React.RefObject<HTMLButtonElement | null>) => { returnTo.current = from.current; setName(mode === "rename" ? current?.name ?? "" : ""); setError(""); setNaming(mode) }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    if (!n) return setError("Enter a name for the view.")
    const taken = views.some((v) => v.name.toLowerCase() === n.toLowerCase() && !(naming === "rename" && v.id === value))
    if (taken) return setError(`A view called “${n}” already exists. Choose another name.`)
    if (naming === "rename") { if (n !== current?.name) onRename?.(value, n) }
    else onSaveAs?.(n)
    setNaming(null)
  }
  const manage = !!(onRename || onDelete || onSetDefault)
  return (
    // The tabs keep their natural width. When the actions don't fit beside them, they wrap onto a line above
    // (wrap-reverse), so the tabs stay on the bottom border; tabs wider than the space scroll in their own box.
    <div data-slot="saved-views" className={cn("flex flex-wrap-reverse items-end justify-end gap-x-3 border-b border-line", className)}>
      <Tabs value={value} onValueChange={onValueChange} className="max-w-full min-w-0 flex-auto">
        <TabsList aria-label="Saved views" className="max-w-full overflow-x-auto border-b-0">
          {views.map((v) => (
            <TabsTrigger key={v.id} value={v.id} count={v.count}>
              {v.name}
              {v.id === defaultId && <span className="sr-only">(default view)</span>}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex max-w-full flex-wrap items-center justify-end gap-control pb-2">
        {dirty && (
          <>
            <Badge variant="warning" dot>Unsaved changes</Badge>
            {onReset && <Button variant="ghost" size="sm" onClick={onReset}>Reset</Button>}
            {onSave && <Button variant="outline" size="sm" onClick={onSave}>Update “{current?.name}”</Button>}
          </>
        )}
        {onSaveAs && <Button ref={saveRef} variant="outline" size="sm" onClick={() => openNaming("save", saveRef)}>Save view</Button>}
        {manage && current && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button ref={menuRef} variant="ghost" size="icon-sm" aria-label={`Manage view “${current.name}”`} className="data-[state=open]:bg-hover">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="truncate">{current.name}{current.id === defaultId ? " · Default" : ""}</DropdownMenuLabel>
              {onSave && (dirty
                ? <DropdownMenuItem onSelect={onSave}><Save />Update view</DropdownMenuItem>
                : <UnavailableItem icon={<Save />} label="Update view" reason="No changes to save." />)}
              {onSaveAs && <DropdownMenuItem onSelect={() => openNaming("save", menuRef)}><Plus />Save as new view</DropdownMenuItem>}
              {onRename && <DropdownMenuItem onSelect={() => openNaming("rename", menuRef)}><Pencil />Rename view</DropdownMenuItem>}
              {onSetDefault && (current.id === defaultId
                ? <UnavailableItem icon={<Star />} label="Set as default" reason="This is already your default view." />
                : dirty
                  ? <UnavailableItem icon={<Star />} label="Set as default" reason="Update or reset your changes first." />
                  : <DropdownMenuItem onSelect={() => onSetDefault(current.id)}><Star />Set as default</DropdownMenuItem>)}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  {views.length > 1
                    ? <DropdownMenuItem variant="destructive" onSelect={() => onDelete(current.id)}><Trash2 />Delete view</DropdownMenuItem>
                    : <UnavailableItem icon={<Trash2 />} label="Delete view" reason="The only view can't be deleted." />}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Dialog open={naming !== null} onOpenChange={(o) => !o && setNaming(null)}>
        <DialogContent className="sm:max-w-sm" onCloseAutoFocus={(e) => { if (returnTo.current) { e.preventDefault(); returnTo.current.focus() } }}>
          <DialogHeader>
            <DialogTitle>{naming === "rename" ? "Rename view" : "Save view"}</DialogTitle>
            <DialogDescription>{naming === "rename" ? "The view keeps its filters, sort order and columns." : "Saves the current filters, sort order and columns."}</DialogDescription>
          </DialogHeader>
          <form noValidate className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-2">
              <label htmlFor={fieldId} className="text-base font-medium text-ink">Name</label>
              <Input
                id={fieldId}
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError("") }}
                placeholder="Closing this month"
                aria-invalid={!!error || undefined}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                autoFocus
              />
              {error && <p id={`${fieldId}-error`} className="text-sm text-bad">{error}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">{naming === "rename" ? "Rename view" : "Save view"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------------------------------------------------------- filter panel */

export type FilterSection = { id: string; title: string; options: FilterOption[]; defaultOpen?: boolean }

/** Many-field search: collapsible sections, live counts per option, Clear all and a clear per section. */
export function FilterPanel({
  sections,
  value,
  onChange,
  className,
}: {
  sections: FilterSection[]
  value: Record<string, string[]>
  onChange: (value: Record<string, string[]>) => void
  className?: string
}) {
  const active = Object.values(value).reduce((n, v) => n + v.length, 0)
  const set = (id: string, vals: string[]) => onChange({ ...value, [id]: vals })
  return (
    <div data-slot="filter-panel" className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <h2 className="text-base font-semibold text-ink">Filters</h2>
        {active > 0 && <Badge variant="secondary" className="tabular">{active}</Badge>}
        <span className="flex-1" />
        {active > 0 && <Button variant="ghost" size="xs" onClick={() => onChange({})}>Clear all</Button>}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {sections.map((s) => {
          const sel = value[s.id] ?? []
          return (
            <Collapsible key={s.id} defaultOpen={s.defaultOpen} className="group/sec border-b border-line">
              <div className="flex items-center pr-2">
                <CollapsibleTrigger asChild>
                  <button type="button" className="flex h-9 min-w-0 flex-1 items-center gap-control rounded-xs px-3 text-left text-base font-medium text-ink">
                    <ChevronRight className="size-3.5 shrink-0 text-ink-3 transition-transform duration-(--duration-fast) group-data-[state=open]/sec:rotate-90" aria-hidden="true" />
                    <span className="truncate">{s.title}</span>
                    {sel.length > 0 && <span className="tabular text-sm font-normal text-primary-ink">{sel.length} set</span>}
                  </button>
                </CollapsibleTrigger>
                {sel.length > 0 && <Button variant="ghost" size="xs" onClick={() => set(s.id, [])} aria-label={`Clear ${s.title}`}>Clear</Button>}
              </div>
              <CollapsibleContent>
                <ul className="grid gap-0.5 px-2 pb-2">
                  {s.options.map((o) => {
                    const on = sel.includes(o.value)
                    const id = `fp-${s.id}-${o.value}`.replace(/\W+/g, "-")
                    return (
                      <li key={o.value} className="flex h-7 items-center gap-2 rounded-xs px-2 hover:bg-hover">
                        <Checkbox id={id} checked={on} onCheckedChange={() => set(s.id, on ? sel.filter((x) => x !== o.value) : [...sel, o.value])} />
                        <label htmlFor={id} className="min-w-0 flex-1 truncate text-base text-ink">{o.label}</label>
                        {o.count !== undefined && <span className="tabular text-sm text-ink-3">{o.count}</span>}
                      </li>
                    )
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}
