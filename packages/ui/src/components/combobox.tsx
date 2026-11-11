/**
 * Combobox: pick one or several values from a long list by typing, and add a missing one without leaving the form.
 * TwoUX composition on the generated shadcn Popover and Command (cmdk), following shadcn's combobox pattern.
 * Proposal: proposals/combobox.md.
 */
"use client"

import { AlertCircle, Check, ChevronDown, Plus, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { Field, FieldDescription, FieldLabel } from "./field"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover"

export type ComboboxOption = {
  value: string
  label: string
  /** Secondary text, matched as well as the label: a region, a team, a code. */
  description?: string
  /** Options with the same group are listed under that heading, in the order they first appear. */
  group?: string
  disabled?: boolean
}

type Common = {
  label: string
  options: ComboboxOption[]
  /** The thing listed, used in messages: { one: "location", many: "locations" }. Defaults to the label in lower case. */
  noun?: { one: string; many: string }
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
  /** Shows the value as text, without the list. */
  readOnly?: boolean
  id?: string
  /** Submitted with the form: one value, or one value per chosen option. */
  name?: string
  className?: string
  /** Called as people type, after 250ms without typing. Set filter to null when the app filters (server search). */
  onSearch?: (text: string) => void
  /** null: the app has already filtered options for the text. A function: custom matching. Default: label and description, ignoring case and accents. */
  filter?: null | ((option: ComboboxOption, text: string) => boolean)
  /** The app is fetching options. "Searching…" appears only if this lasts more than a second. */
  loading?: boolean
  /** Options failed to load: what failed and what to check, shown in the list with Try again. */
  loadError?: string
  onRetry?: () => void
  /**
   * Offers Create "<text>" when nothing matches exactly. Return the new option to select it at once (name-only
   * records), or open an overlay side panel and select the record when it is saved.
   */
  onCreate?: (text: string) => ComboboxOption | void | Promise<ComboboxOption | void>
}
type Single = Common & { multiple?: false; value: string | null; onValueChange: (value: string | null) => void }
type Multiple = Common & {
  multiple: true
  value: string[]
  onValueChange: (value: string[]) => void
  /** Most options people can choose. The footer says so. */
  max?: number
}
export type ComboboxProps = Single | Multiple

const collator = new Intl.Collator("en-GB", { sensitivity: "base", usage: "search" })
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
/** Case- and accent-insensitive "contains", on the label and the description. */
export const matchOption = (o: ComboboxOption, text: string) => {
  const t = fold(text.trim())
  return !t || fold(o.label).includes(t) || (!!o.description && fold(o.description).includes(t))
}
const MORE = 3

function useDelayed(on: boolean | undefined, ms: number) {
  const [late, setLate] = React.useState(false)
  React.useEffect(() => {
    if (!on) return setLate(false)
    const t = setTimeout(() => setLate(true), ms)
    return () => clearTimeout(t)
  }, [on, ms])
  return late
}

/** Searchable select for long lists: one value, or several with multiple. Values always come from the list or from Create. */
export function Combobox(props: ComboboxProps) {
  const { label, options, noun, placeholder, hint, error, required, optional, disabled, readOnly, id, name, className, onSearch, filter, loading, loadError, onRetry, onCreate } = props
  const auto = React.useId()
  const fid = id ?? auto
  const many = noun?.many ?? label.toLowerCase()
  const multiple = props.multiple === true
  const chosen: string[] = multiple ? props.value : props.value ? [props.value] : []
  const max = multiple ? props.max : undefined
  const known = React.useRef(new Map<string, ComboboxOption>())
  for (const o of options) known.current.set(o.value, o)
  const labelOf = (v: string) => known.current.get(v)?.label ?? v

  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState("")
  const [order, setOrder] = React.useState<string[]>([])
  const [creating, setCreating] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const tagRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const searching = useDelayed(loading, 1000)

  React.useEffect(() => {
    if (!onSearch || !open) return
    const t = setTimeout(() => onSearch(text), 250)
    return () => clearTimeout(t)
  }, [text, open, onSearch])

  const setValue = (next: string[]) => (multiple ? (props as Multiple).onValueChange(next) : (props as Single).onValueChange(next[0] ?? null))
  const openWith = (initial: string) => {
    // Chosen options are listed first, in the order they had when the list opened, so rows don't jump while ticking.
    setOrder(multiple ? [...chosen] : [])
    setText(initial)
    setOpen(true)
  }
  const pick = (v: string) => {
    if (!multiple) {
      setValue([v])
      setOpen(false)
      return
    }
    if (chosen.includes(v)) setValue(chosen.filter((x) => x !== v))
    else if (!max || chosen.length < max) setValue([...chosen, v])
  }
  const create = async () => {
    if (!onCreate) return
    setCreating(true)
    try {
      const made = await onCreate(text.trim())
      if (made) {
        known.current.set(made.value, made)
        pick(made.value)
      }
      setText("")
    } finally {
      setCreating(false)
    }
  }
  const remove = (i: number) => {
    setValue(chosen.filter((_, j) => j !== i))
    requestAnimationFrame(() => (tagRefs.current[i - 1] ?? triggerRef.current)?.focus())
  }

  const visible = filter === null ? options : options.filter((o) => (filter ?? matchOption)(o, text))
  const sorted = order.length ? [...visible.filter((o) => order.includes(o.value)), ...visible.filter((o) => !order.includes(o.value))] : visible
  const groups: [string, ComboboxOption[]][] = []
  for (const o of sorted) {
    const g = o.group ?? ""
    const at = groups.find(([k]) => k === g)
    if (at) at[1].push(o)
    else groups.push([g, [o]])
  }
  const exact = options.some((o) => collator.compare(o.label, text.trim()) === 0)
  const canCreate = !!onCreate && !!text.trim() && !exact && !loading
  const full = !!max && chosen.length >= max
  const shown = chosen.slice(0, multiple ? MORE : 1)
  const rest = chosen.length - shown.length
  const msgId = `${fid}-msg`
  const labelId = `${fid}-label`
  const valueId = `${fid}-value`
  const status = searching ? `Searching ${many}…` : loadError ? "" : `${visible.length} ${visible.length === 1 ? "result" : "results"}`
  const summary = multiple ? (chosen.length ? `${chosen.length} selected` : "None selected") : chosen[0] ? labelOf(chosen[0]) : "None selected"

  const message = error ? (
    <p id={msgId} className="flex items-start gap-control text-sm text-bad">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      {error}
    </p>
  ) : hint ? (
    <FieldDescription id={msgId}>{hint}</FieldDescription>
  ) : null

  const fieldLabel = (
    <FieldLabel id={labelId} htmlFor={fid}>
      {label}
      {required && <span aria-hidden="true" className="text-bad">*</span>}
      {optional && <span className="font-normal text-ink-3">(optional)</span>}
    </FieldLabel>
  )

  if (readOnly)
    return (
      <Field className={cn("gap-2", className)}>
        {fieldLabel}
        <p id={fid} className="flex min-h-8 flex-wrap items-center gap-1 text-base text-ink">
          {chosen.length ? chosen.map((v) => (multiple ? <span key={v} className="inline-flex h-5.5 items-center rounded-xs border border-line-strong bg-surface px-control text-sm">{labelOf(v)}</span> : <span key={v}>{labelOf(v)}</span>)) : <span className="text-ink-3">None</span>}
        </p>
      </Field>
    )

  return (
    <Field data-invalid={!!error || undefined} className={cn("gap-2", className)}>
      {fieldLabel}
      <Popover
        open={open}
        onOpenChange={(o) => {
          if (o) openWith("")
          else setOpen(false)
        }}
      >
        <PopoverAnchor asChild>
          <div
            data-slot="combobox"
            className={cn(
              "flex min-h-8 w-full min-w-0 flex-wrap items-center gap-1 rounded-sm border border-input bg-background shadow-xs transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) hover:border-input-hover",
              "has-[[data-slot=combobox-trigger]:focus-visible]:border-ring has-[[data-slot=combobox-trigger]:focus-visible]:ring-3 has-[[data-slot=combobox-trigger]:focus-visible]:ring-ring/50",
              error && "border-destructive-edge",
              multiple && chosen.length > 0 && "py-1 pl-1",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            {multiple &&
              shown.map((v, i) => (
                <span key={v} className="inline-flex h-5.5 max-w-48 items-center gap-control rounded-xs border border-line-strong bg-surface px-control text-sm text-ink">
                  <span className="truncate">{labelOf(v)}</span>
                  <button
                    type="button"
                    ref={(el) => {
                      tagRefs.current[i] = el
                    }}
                    aria-label={`Remove ${labelOf(v)}`}
                    disabled={disabled}
                    onClick={() => remove(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" || e.key === "Delete") {
                        e.preventDefault()
                        remove(i)
                      }
                      if (e.key === "ArrowLeft") tagRefs.current[i - 1]?.focus()
                      if (e.key === "ArrowRight") (tagRefs.current[i + 1] ?? triggerRef.current)?.focus()
                    }}
                    className="relative -mr-0.5 grid size-4 shrink-0 place-items-center rounded-xs text-ink-3 after:absolute after:-inset-1 hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            {multiple && rest > 0 && <span className="tabular px-0.5 text-sm text-ink-3">+{rest} more</span>}
            <PopoverTrigger asChild>
              <button
                ref={triggerRef}
                id={fid}
                type="button"
                data-slot="combobox-trigger"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-labelledby={`${labelId} ${valueId}`}
                aria-describedby={message ? msgId : undefined}
                aria-invalid={error ? true : undefined}
                aria-required={required || undefined}
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== " ") {
                    e.preventDefault()
                    openWith(e.key)
                  }
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    openWith("")
                  }
                  if (e.key === "Backspace" && multiple && shown.length) {
                    e.preventDefault()
                    tagRefs.current[shown.length - 1]?.focus()
                  }
                }}
                // With tags chosen the button only holds the chevron, so it needs just enough room to stay on the tags' line.
                className={cn("flex h-7.5 flex-1 items-center justify-between gap-2 rounded-sm px-2 text-left text-base outline-none", multiple && chosen.length ? "min-w-7" : "min-w-16")}
              >
                <span id={valueId} className={cn("truncate", (multiple || !chosen[0]) && "text-muted-foreground")}>
                  {multiple ? (chosen.length ? <span className="sr-only">{summary}</span> : (placeholder ?? `Choose ${many}`)) : chosen[0] ? <span className="text-ink">{labelOf(chosen[0])}</span> : (placeholder ?? `Choose ${noun?.one ?? many}`)}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
              </button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-64 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Command shouldFilter={false} loop={false} label={label}>
            <CommandInput autoFocus value={text} onValueChange={setText} placeholder={`Search ${many}`} aria-label={`Search ${many}`} />
            <CommandList aria-multiselectable={multiple || undefined} aria-label={label}>
              {loadError ? (
                <div role="alert" className="grid justify-items-start gap-2 px-3 py-3 text-base text-ink-2">
                  <span className="flex items-start gap-control"><AlertCircle className="mt-0.5 size-3.5 shrink-0 text-bad" aria-hidden="true" />{loadError}</span>
                  {onRetry && <Button variant="outline" size="xs" onClick={onRetry}>Try again</Button>}
                </div>
              ) : searching && !visible.length ? (
                <p className="px-3 py-3 text-base text-ink-2">Searching {many}…</p>
              ) : !visible.length && !canCreate ? (
                <p className="px-3 py-3 text-base text-ink-2">{text.trim() ? `No ${many} match "${text.trim()}".` : `No ${many} yet.`}</p>
              ) : null}
              {!loadError &&
                groups.map(([g, items]) => (
                  <CommandGroup key={g || "_"} heading={g || undefined}>
                    {items.map((o) => {
                      const on = chosen.includes(o.value)
                      return (
                        <CommandItem key={o.value} value={o.value} disabled={o.disabled || (full && !on)} data-checked={on || undefined} onSelect={() => pick(o.value)} className="pr-8">
                          <span className="min-w-0 flex-1 truncate">{o.label}</span>
                          {o.description && <span className="shrink-0 text-sm text-ink-3">{o.description}</span>}
                          <Check className={cn("absolute right-2 size-3.5 text-ink-2", !on && "invisible")} aria-hidden="true" />
                          <span className="sr-only">{on ? ", selected" : ""}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                ))}
              {canCreate && !loadError && (
                <CommandGroup>
                  <CommandItem value={`__create__${text}`} disabled={creating} onSelect={create}>
                    <Plus aria-hidden="true" />
                    <span className="truncate">Create "{text.trim()}"</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          {multiple && (
            <div className="flex items-center gap-2 border-t border-line px-3 py-2 text-sm text-ink-2">
              <span className="tabular flex-1">
                {chosen.length} selected
                {max ? ` · up to ${max} ${many}` : ""}
              </span>
              {chosen.length > 0 && <Button variant="ghost" size="xs" onClick={() => setValue([])}>Clear</Button>}
            </div>
          )}
          <span className="sr-only" role="status" aria-live="polite">{open ? status : ""}</span>
        </PopoverContent>
      </Popover>
      {name && chosen.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      {message}
    </Field>
  )
}
