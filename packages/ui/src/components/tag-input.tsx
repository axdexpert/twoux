/**
 * TagInput: several short values that don't come from a list (email addresses, domains, keywords), typed or pasted.
 * TwoUX composition on the generated shadcn Field. Nothing is dropped silently: duplicates are reported, invalid values
 * stay as marked tags with their reason, and values past the limit stay in the input. Proposal: proposals/tag-input.md.
 */
"use client"

import { AlertCircle, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Field, FieldDescription, FieldLabel } from "./field"

type TagInputProps = {
  label: string
  value: string[]
  onValueChange: (value: string[]) => void
  /** The reason a value is not valid, or undefined when it is: "Not an email address." */
  validateValue?: (value: string) => string | undefined
  /** Most values people can add. Shows "3 of 10" under the field. */
  max?: number
  /** The thing entered, used in messages: { one: "address", many: "addresses" }. Defaults to value and values. */
  noun?: { one: string; many: string }
  /** Defaults to "Separate <many> with commas or new lines". */
  hint?: string
  /** An error from the form's own checks, such as "Add at least one address." */
  error?: string
  placeholder?: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
  /** Values stay focusable and readable, without remove or edit. */
  readOnly?: boolean
  id?: string
  /** Each value is submitted as a separate form value. */
  name?: string
  className?: string
}

const SPLIT = /[,;\n\t]+/
const same = (a: string, b: string) => a.localeCompare(b, "en-GB", { sensitivity: "base" }) === 0

/** Several free values in one field: Enter or comma adds, pasted lists are split, each value is checked as it is added. */
export function TagInput({ label, value, onValueChange, validateValue, max, noun = { one: "value", many: "values" }, hint, error, placeholder, required, optional, disabled, readOnly, id, name, className }: TagInputProps) {
  const auto = React.useId()
  const fid = id ?? auto
  const inputRef = React.useRef<HTMLInputElement>(null)
  const chipRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [text, setText] = React.useState("")
  const [notice, setNotice] = React.useState("")
  const [flash, setFlash] = React.useState<string | null>(null)
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (focusIndex === null) return
    ;(chipRefs.current[focusIndex] ?? inputRef.current)?.focus()
    setFocusIndex(null)
  }, [focusIndex, value])
  React.useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 600)
    return () => clearTimeout(t)
  }, [flash])

  const reasons = value.map((v) => validateValue?.(v))
  const invalid = reasons.filter(Boolean).length
  const word = (n: number) => (n === 1 ? noun.one : noun.many)

  /** Adds values; returns the text that has to stay in the input (values past the limit). */
  const add = (items: string[], pasted: boolean) => {
    const next = [...value]
    let added = 0, bad = 0
    const dups: string[] = []
    const left: string[] = []
    for (const raw of items) {
      const v = raw.trim()
      if (!v) continue
      const dup = next.find((x) => same(x, v))
      if (dup) { dups.push(dup); continue }
      if (max && next.length >= max) { left.push(v); continue }
      next.push(v)
      added++
      if (validateValue?.(v)) bad++
    }
    if (added) onValueChange(next)
    const parts: string[] = []
    if (pasted && added) parts.push(`${added} added${bad ? `, ${bad} not valid` : ""}.`)
    else if (bad) parts.push(`${validateValue?.(next[next.length - 1])}`)
    if (dups.length === 1 && !pasted) parts.push(`${dups[0]} is already added.`)
    else if (dups.length) parts.push(`${dups.length} already added.`)
    if (left.length) parts.push(`You can add up to ${max}. ${left.length} ${word(left.length)} weren't added.`)
    setNotice(parts.join(" "))
    if (dups.length) setFlash(dups[dups.length - 1])
    return left.join(", ")
  }
  const commit = () => {
    if (!text.trim()) return
    setText(add(text.split(SPLIT), false))
  }
  const remove = (i: number, then: "next" | "prev") => {
    const v = value[i]
    onValueChange(value.filter((_, j) => j !== i))
    setNotice(`${v} removed.`)
    // Focus the tag before (Backspace) or the one that moved into this place (Delete); the input when none is left.
    const left = value.length - 1
    setFocusIndex(left === 0 ? -1 : then === "prev" ? Math.max(i - 1, 0) : Math.min(i, left - 1))
  }
  const edit = (i: number) => {
    const v = value[i]
    onValueChange(value.filter((_, j) => j !== i))
    setText(v)
    setNotice("")
    setFocusIndex(-1)
  }

  const shownError = error ?? (invalid ? `${invalid} ${word(invalid)} ${invalid === 1 ? "isn't" : "aren't"} valid. Fix or remove ${invalid === 1 ? "it" : "them"}.` : undefined)
  const hintText = hint ?? `Separate ${noun.many} with commas or new lines`
  const msgId = `${fid}-msg`
  const helpId = `${fid}-help`

  return (
    <Field data-invalid={!!shownError || undefined} className={cn("gap-2", className)}>
      <FieldLabel htmlFor={fid} id={`${fid}-label`}>
        {label}
        {required && <span aria-hidden="true" className="text-bad">*</span>}
        {optional && <span className="font-normal text-ink-3">(optional)</span>}
      </FieldLabel>
      <div
        data-slot="tag-input"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault()
            inputRef.current?.focus()
          }
        }}
        className={cn(
          "flex min-h-8 w-full min-w-0 cursor-text flex-wrap items-center gap-1 rounded-sm border border-input bg-background px-1 py-1 shadow-xs transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out) hover:border-input-hover",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          shownError && "not-focus-within:border-destructive-edge",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {value.length > 0 && (
          <ul role="list" aria-labelledby={`${fid}-label`} className="contents">
            {value.map((v, i) => {
              const reason = reasons[i]
              return (
                <li
                  key={v}
                  className={cn(
                    "inline-flex h-5.5 max-w-60 items-center gap-1 rounded-xs border px-control text-sm transition-colors duration-(--duration-base) ease-(--ease-out)",
                    reason ? "border-bad-line bg-bad-bg text-ink" : "border-line-strong bg-surface text-ink",
                    flash === v && "bg-selected",
                  )}
                >
                  {reason && <AlertCircle className="size-3 shrink-0 text-bad" aria-hidden="true" />}
                  <button
                    type="button"
                    tabIndex={-1}
                    ref={(el) => {
                      chipRefs.current[i] = el
                    }}
                    aria-label={reason ? `${v}, not valid: ${reason}` : v}
                    aria-describedby={readOnly ? undefined : helpId}
                    title={reason}
                    disabled={disabled}
                    onDoubleClick={() => !readOnly && edit(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") { e.preventDefault(); chipRefs.current[i - 1]?.focus() }
                      if (e.key === "ArrowRight") { e.preventDefault(); (chipRefs.current[i + 1] ?? inputRef.current)?.focus() }
                      if (e.key === "Home") { e.preventDefault(); chipRefs.current[0]?.focus() }
                      if (e.key === "End" || e.key === "Escape") { e.preventDefault(); inputRef.current?.focus() }
                      if (readOnly) return
                      if (e.key === "Backspace") { e.preventDefault(); remove(i, "prev") }
                      if (e.key === "Delete") { e.preventDefault(); remove(i, "next") }
                      if (e.key === "Enter") { e.preventDefault(); edit(i) }
                    }}
                    className="min-w-0 truncate rounded-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                  >
                    {v}
                  </button>
                  {!readOnly && (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={`Remove ${v}`}
                      disabled={disabled}
                      onClick={() => remove(i, "next")}
                      className="relative -mr-0.5 grid size-4 shrink-0 place-items-center rounded-xs text-ink-3 after:absolute after:-inset-1 hover:bg-hover hover:text-ink"
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
        <input
          ref={inputRef}
          id={fid}
          value={text}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={value.length ? undefined : placeholder}
          autoComplete="off"
          aria-invalid={shownError ? true : undefined}
          aria-describedby={msgId}
          aria-required={required || undefined}
          onChange={(e) => {
            const t = e.target.value
            if (/[,;]/.test(t)) setText(add(t.split(SPLIT), false))
            else setText(t)
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text")
            if (!SPLIT.test(pasted)) return
            e.preventDefault()
            setText(add((text + pasted).split(SPLIT), true))
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            const atStart = e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0
            if (e.key === "Enter" && text.trim()) { e.preventDefault(); commit() }
            if (e.key === "Tab" && !e.shiftKey && text.trim()) commit()
            if ((e.key === "Backspace" || e.key === "ArrowLeft") && atStart && value.length) {
              e.preventDefault()
              chipRefs.current[value.length - 1]?.focus()
            }
          }}
          className="h-5.5 min-w-24 flex-1 bg-transparent px-control text-base outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {shownError ? (
            // One message that wraps as text. Each invalid tag carries its own reason, and the live notice
            // still tells screen readers what the last paste or entry did.
            <p id={msgId} className="flex items-start gap-control text-sm text-bad">
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">{shownError}</span>
            </p>
          ) : (
            <FieldDescription id={msgId}>{notice || hintText}</FieldDescription>
          )}
        </div>
        {max && <span className="tabular shrink-0 text-sm text-ink-3">{value.length} of {max}</span>}
      </div>
      <span id={helpId} hidden>Enter to edit, Delete to remove</span>
      <span className="sr-only" role="status" aria-live="polite">{notice}</span>
      {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
    </Field>
  )
}
