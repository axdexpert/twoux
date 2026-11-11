/**
 * TwoUX compositions for bringing data in.
 * FieldMapping: each target field with the source column that fills it, required fields marked, type mismatches
 *   warned in words, and the other source columns either skipped or created as new columns. Reusable for imports
 *   and automations alike.
 * CsvImport: choose a CSV file (or a sample), set the delimiter and header row, map the columns, see the first 20 rows
 *   with problem cells marked in words, read the summary of what will be skipped, then "Import 1,248 rows".
 */
import { ArrowLeft, CircleAlert, FileSpreadsheet, TriangleAlert } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { FileDrop } from "./onboarding"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "./select"
import { Switch } from "./switch"
import { ColumnTypeIcon, toIsoDate, type ColumnType } from "./workspace"

/* ---------------------------------------------------------------- values */

export type FieldKind = "text" | "number" | "date" | "email" | "url" | "select"
export type MappingTarget = { id: string; label: string; kind: FieldKind; required?: boolean; options?: string[] }
export type MappingSource = { id: string; label: string; samples: string[] }
/** Target field id → source column id, or null for not filled. */
export type FieldMap = Record<string, string | null>
/** Source column id → what happens to a column no field uses. */
export type ExtraColumns = Record<string, "skip" | "create">

const KIND_WORD: Record<FieldKind, string> = { text: "text", number: "a number", date: "a date", email: "an email address", url: "a link", select: "one of the choices" }
const KIND_ICON: Record<FieldKind, ColumnType> = { text: "text", number: "number", date: "date", email: "text", url: "text", select: "select" }

/** The problem with a value for this kind of field, in two or three words, or undefined when it fits. */
export function checkFieldValue(kind: FieldKind, value: string, options?: string[]): string | undefined {
  const v = value.trim()
  if (!v) return undefined
  if (kind === "number" && Number.isNaN(Number(v.replace(/[,£$€\s]/g, "")))) return "Not a number"
  if (kind === "date" && !toIsoDate(v)) return "Not a date"
  if (kind === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return "Invalid email"
  if (kind === "url" && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/.test(v)) return "Not a link"
  if (kind === "select" && options && !options.some((o) => o.toLowerCase() === v.toLowerCase())) return "Not a choice"
  return undefined
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
/** Pairs fields and columns whose names match, ignoring case and punctuation ("E-mail" fills "Email"). */
export function autoMapFields(targets: MappingTarget[], sources: MappingSource[], aliases: Record<string, string[]> = {}): FieldMap {
  const used = new Set<string>()
  return Object.fromEntries(targets.map((t) => {
    const names = [t.label, t.id, ...(aliases[t.id] ?? [])].map(norm)
    const s = sources.find((x) => !used.has(x.id) && names.includes(norm(x.label))) ?? sources.find((x) => !used.has(x.id) && names.some((n) => norm(x.label).includes(n) || n.includes(norm(x.label))))
    if (s) used.add(s.id)
    return [t.id, s?.id ?? null]
  }))
}

/** RFC 4180 CSV: quoted fields, doubled quotes, line breaks inside quotes. */
export function parseCsv(text: string, delimiter = ","): string[][] {
  const rows: string[][] = []
  let row: string[] = [], cell = "", quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"' && cell === "") quoted = true
    else if (ch === delimiter) { row.push(cell); cell = "" }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++
      row.push(cell); cell = ""
      if (row.some((c) => c !== "")) rows.push(row)
      row = []
    } else cell += ch
  }
  row.push(cell)
  if (row.some((c) => c !== "")) rows.push(row)
  return rows
}

export const detectDelimiter = (text: string) => {
  const line = text.split(/\r?\n/)[0] ?? ""
  return [",", ";", "\t", "|"].map((d) => [d, line.split(d).length] as const).sort((a, b) => b[1] - a[1])[0][0]
}

/* ---------------------------------------------------------------- field mapping */

export function FieldMapping({
  targets,
  sources,
  value,
  onChange,
  extra,
  onExtraChange,
  errors = {},
  targetHeading = "Field in the table",
  sourceHeading = "Column in the file",
  className,
}: {
  targets: MappingTarget[]
  sources: MappingSource[]
  value: FieldMap
  onChange: (value: FieldMap) => void
  /** What happens to source columns no field uses. Omit both to hide that section. */
  extra?: ExtraColumns
  onExtraChange?: (extra: ExtraColumns) => void
  /** Messages per target id after a failed submit, e.g. a required field with no column. */
  errors?: Record<string, string>
  targetHeading?: string
  sourceHeading?: string
  className?: string
}) {
  const id = React.useId()
  const used = new Set(Object.values(value).filter(Boolean) as string[])
  const unused = sources.filter((s) => !used.has(s.id))
  const NONE = "__none"
  return (
    <div data-slot="field-mapping" className={cn("grid gap-4", className)}>
      <div role="table" aria-label="Field mapping" className="grid">
        <div role="row" className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-center gap-2 border-b border-line pb-2 text-sm font-medium text-ink-2">
          <span role="columnheader">{targetHeading}</span><span aria-hidden="true" /><span role="columnheader">{sourceHeading}</span>
        </div>
        {targets.map((t) => {
          const src = sources.find((s) => s.id === value[t.id])
          const bad = src ? src.samples.filter((v) => checkFieldValue(t.kind, v, t.options)).length : 0
          const err = errors[t.id]
          const fid = `${id}-${t.id}`
          return (
            <div key={t.id} role="row" className="grid gap-1 border-b border-line py-2 last:border-b-0">
              <div className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-center gap-2">
                <label role="rowheader" htmlFor={fid} className="flex min-w-0 items-center gap-control text-base text-ink">
                  <ColumnTypeIcon type={KIND_ICON[t.kind]} />
                  <span className="truncate">{t.label}</span>
                  {t.required && <span className="shrink-0 text-sm text-ink-3">Required</span>}
                </label>
                <ArrowLeft className="size-3.5 text-ink-3" aria-hidden="true" />
                <span role="cell" className="min-w-0">
                  <Select value={value[t.id] ?? NONE} onValueChange={(v) => onChange({ ...value, [t.id]: v === NONE ? null : v })}>
                    <SelectTrigger id={fid} size="sm" className="w-full" aria-invalid={!!err || undefined} aria-describedby={err || bad ? `${fid}-msg` : undefined}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>{t.required ? "Choose a column" : "Leave empty"}</SelectItem>
                      <SelectSeparator />
                      {sources.map((s) => (
                        <SelectItem key={s.id} value={s.id} disabled={used.has(s.id) && value[t.id] !== s.id}>
                          {s.label}{s.samples[0] ? <span className="text-ink-3"> · {s.samples[0]}</span> : null}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </span>
              </div>
              {err ? (
                <p id={`${fid}-msg`} className="flex items-start gap-control text-sm text-bad"><CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{err}</p>
              ) : bad > 0 && src ? (
                <p id={`${fid}-msg`} className="flex items-start gap-control text-sm text-warn"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{bad} of {src.samples.length} values in “{src.label}” aren't {KIND_WORD[t.kind]}.</p>
              ) : null}
            </div>
          )
        })}
      </div>
      {extra && onExtraChange && unused.length > 0 && (
        <section aria-labelledby={`${id}-other`} className="grid gap-1">
          <h3 id={`${id}-other`} className="text-sm font-medium text-ink-2">Other columns in the file</h3>
          <ul className="grid divide-y divide-line rounded-sm border border-line">
            {unused.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="grid min-w-0 flex-1"><span className="truncate text-base text-ink">{s.label}</span>{s.samples[0] && <span className="truncate text-sm text-ink-3">e.g. {s.samples[0]}</span>}</span>
                <Select value={extra[s.id] ?? "skip"} onValueChange={(v) => onExtraChange({ ...extra, [s.id]: v as "skip" | "create" })}>
                  <SelectTrigger size="sm" className="w-40" aria-label={`What to do with ${s.label}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">Don't import</SelectItem>
                    <SelectItem value="create">Create column</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- CSV import */

export type CsvImportResult = {
  /** One object per imported row, keyed by target id; created columns are keyed by their source label. Date fields arrive as ISO 8601 (2026-11-02); 02/11/2026 is read day first, as in the UK. */
  rows: Record<string, string>[]
  /** Source labels turned into new columns. */
  created: string[]
  skipped: number
  /** Why rows were skipped or imported with empty cells, one entry per field and problem, so the app can say what happened. */
  problems: CsvImportProblem[]
}

export type CsvImportProblem = {
  /** Target id and label of the field. */
  field: string
  label: string
  /** missing: a required value was empty. invalid: the value didn't fit the field (Not a date, Invalid email…). */
  problem: "missing" | "invalid"
  /** Rows with this problem. A row with two problems counts once in each. */
  rows: number
  /** What happened to those rows: skipped, or imported with this cell left empty. */
  outcome: "skipped" | "emptied"
}

const DELIMS = [["auto", "Detect automatically"], [",", "Comma"], [";", "Semicolon"], ["\t", "Tab"], ["|", "Pipe"]] as const
const n = (x: number) => x.toLocaleString("en-GB")

export function CsvImport({
  open,
  onOpenChange,
  targets,
  tableName,
  sample,
  aliases,
  onImport,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  targets: MappingTarget[]
  /** "People" */
  tableName: string
  /** Lets people try the flow without a file. */
  sample?: { name: string; text: string }
  /** Other names a field goes by, for automatic mapping: { email: ["work email"] } */
  aliases?: Record<string, string[]>
  onImport: (result: CsvImportResult) => void
}) {
  const [file, setFile] = React.useState<{ name: string; text: string } | null>(null)
  const [fileError, setFileError] = React.useState("")
  const [delim, setDelim] = React.useState<string>("auto")
  const [header, setHeader] = React.useState(true)
  const [step, setStep] = React.useState<1 | 2>(1)
  const [map, setMap] = React.useState<FieldMap>({})
  const [extra, setExtra] = React.useState<ExtraColumns>({})
  const [badRows, setBadRows] = React.useState<"skip" | "empty">("skip")
  const [onlyProblems, setOnlyProblems] = React.useState(false)
  const [edits, setEdits] = React.useState<Record<string, string>>({})
  const [fixing, setFixing] = React.useState<string | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const summary = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    setFile(null); setFileError(""); setDelim("auto"); setHeader(true); setStep(1); setMap({}); setExtra({}); setBadRows("skip"); setOnlyProblems(false); setEdits({}); setFixing(null); setErrors({})
  }, [open])

  const parsed = React.useMemo(() => {
    if (!file) return null
    const d = delim === "auto" ? detectDelimiter(file.text) : delim
    const all = parseCsv(file.text, d)
    const width = Math.max(0, ...all.map((r) => r.length))
    const head = header ? all[0] ?? [] : []
    const body = header ? all.slice(1) : all
    const sources: MappingSource[] = Array.from({ length: width }, (_, i) => ({ id: `c${i}`, label: (head[i] ?? "").trim() || `Column ${i + 1}`, samples: body.slice(0, 20).map((r) => r[i] ?? "").filter(Boolean) }))
    return { sources, body, delimiter: d }
  }, [file, delim, header])

  // Map once per parsed file; targets and aliases may be new objects on every render.
  const mapInputs = React.useRef({ targets, aliases })
  mapInputs.current = { targets, aliases }
  React.useEffect(() => { if (parsed) { setMap(autoMapFields(mapInputs.current.targets, parsed.sources, mapInputs.current.aliases)); setExtra({}); setEdits({}) } }, [parsed])

  const cellOf = (r: number, sid: string) => edits[`${r}:${sid}`] ?? parsed?.body[r]?.[Number(sid.slice(1))] ?? ""
  const problems = React.useMemo(() => {
    if (!parsed) return { byRow: new Map<number, Map<string, string>>(), byTarget: new Map<string, number>(), missing: 0 }
    const byRow = new Map<number, Map<string, string>>()
    const byTarget = new Map<string, number>()
    let missing = 0
    parsed.body.forEach((_, r) => {
      let rowMissing = false
      for (const t of targets) {
        const sid = map[t.id]
        if (!sid) continue
        const v = cellOf(r, sid)
        const p = t.required && !v.trim() ? `No ${t.label.toLowerCase()}` : checkFieldValue(t.kind, v, t.options)
        if (!p) continue
        if (t.required && !v.trim()) rowMissing = true
        if (!byRow.has(r)) byRow.set(r, new Map())
        byRow.get(r)!.set(sid, p)
        const key = `${t.id}:${t.required && !v.trim() ? "missing" : "invalid"}`
        byTarget.set(key, (byTarget.get(key) ?? 0) + 1)
      }
      if (rowMissing) missing++
    })
    return { byRow, byTarget, missing }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed, map, edits, targets])

  const total = parsed?.body.length ?? 0
  const problemRows = problems.byRow.size
  const skipped = badRows === "skip" ? problemRows : problems.missing
  const importing = total - skipped

  const take = async (f: File) => {
    if (!/\.csv$/i.test(f.name)) { setFileError("That isn't a CSV file. Save the sheet as CSV and choose it again."); return }
    setFileError("")
    setFile({ name: f.name, text: await f.text() })
  }

  const next = () => {
    if (!parsed || !parsed.body.length) { setFileError(parsed ? "That file has no rows. Choose a file with at least one row under the column names." : "Choose a CSV file, or use the sample file."); return }
    setStep(2)
  }
  const submit = () => {
    const errs: Record<string, string> = {}
    for (const t of targets) if (t.required && !map[t.id]) errs[t.id] = `Choose the column that holds ${t.label.toLowerCase()}. It's required for every row.`
    setErrors(errs)
    if (Object.keys(errs).length) { summary.current?.focus(); return }
    const created = Object.entries(extra).filter(([, v]) => v === "create").map(([sid]) => sid)
    const rows: Record<string, string>[] = []
    parsed!.body.forEach((_, r) => {
      const p = problems.byRow.get(r)
      const missingRequired = targets.some((t) => t.required && map[t.id] && !cellOf(r, map[t.id]!).trim())
      if (p && (badRows === "skip" || missingRequired)) return
      const out: Record<string, string> = {}
      for (const t of targets) { const sid = map[t.id]; if (!sid) continue; const v = p?.has(sid) ? "" : cellOf(r, sid); out[t.id] = t.kind === "date" && v.trim() ? (toIsoDate(v.trim()) ?? "") : v }
      for (const sid of created) out[parsed!.sources.find((s) => s.id === sid)!.label] = cellOf(r, sid)
      rows.push(out)
    })
    const report: CsvImportProblem[] = [...problems.byTarget.entries()].map(([key, count]) => {
      const [tid, why] = key.split(":") as [string, "missing" | "invalid"]
      const t = targets.find((x) => x.id === tid)!
      return { field: tid, label: t.label, problem: why, rows: count, outcome: why === "missing" || badRows === "skip" ? "skipped" : "emptied" }
    })
    onImport({ rows, created: created.map((sid) => parsed!.sources.find((s) => s.id === sid)!.label), skipped: total - rows.length, problems: report })
    onOpenChange(false)
  }

  const mappedCols = parsed ? [
    ...targets.filter((t) => map[t.id]).map((t) => ({ key: t.id, label: t.label, sid: map[t.id]! })),
    ...Object.entries(extra).filter(([, v]) => v === "create").map(([sid]) => ({ key: sid, label: `${parsed.sources.find((s) => s.id === sid)?.label} (new)`, sid })),
  ] : []
  const previewRows = parsed ? (onlyProblems ? [...problems.byRow.keys()] : parsed.body.map((_, i) => i)).slice(0, 20) : []
  const PHRASE: Record<FieldKind, string> = { email: "an invalid email", number: "a value that isn't a number", date: "a date that can't be read", url: "an invalid link", select: "a value that isn't one of the choices", text: "an invalid value" }
  const summaryLines = [...problems.byTarget.entries()].map(([key, count]) => {
    const [tid, why] = key.split(":")
    const t = targets.find((x) => x.id === tid)!
    return `${n(count)} ${count === 1 ? "row has" : "rows have"} ${why === "missing" ? `no ${t.label.toLowerCase()}` : PHRASE[t.kind]}.`
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-9/10 grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-4xl">
        <DialogHeader>
          <p className="text-sm text-ink-3">Step {step} of 2</p>
          <DialogTitle>{step === 1 ? `Import a CSV file into ${tableName}` : "Match columns and check the rows"}</DialogTitle>
          <DialogDescription>{step === 1 ? "Rows are added at the bottom of the table. Nothing changes until you press Import." : `${file?.name} · ${n(total)} rows · ${parsed?.sources.length} columns`}</DialogDescription>
        </DialogHeader>

        <div className="-mx-6 min-h-0 overflow-y-auto px-6">
          {step === 1 ? (
            <div className="grid gap-4 pb-1">
              <FileDrop id="csv-file" label="CSV file" accept="text/csv,application/vnd.ms-excel,.csv" hint="CSV, with a header row, up to 10 MB" maxBytes={10_000_000} onFile={take} error={fileError} />
              {sample && !file && <p className="text-sm text-ink-2">No file to hand? <Button variant="link" size="xs" onClick={() => { setFile(sample); setFileError("") }}>Use the sample file</Button></p>}
              {file && parsed && (
                <p className="flex items-center gap-2 text-base text-ink"><FileSpreadsheet className="size-4 text-ink-3" aria-hidden="true" />{file.name}<span className="tabular text-ink-2">· {n(parsed.body.length)} rows · {parsed.sources.length} columns</span></p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="csv-delim" className="text-base font-medium text-ink">Delimiter</label>
                  <Select value={delim} onValueChange={setDelim}>
                    <SelectTrigger id="csv-delim" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>{DELIMS.map(([v, l]) => <SelectItem key={v} value={v}>{l}{v === "auto" && parsed ? ` (${DELIMS.find((d) => d[0] === parsed.delimiter)?.[1].toLowerCase()})` : ""}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2 self-end pb-2 text-base text-ink">
                  <Checkbox checked={header} onCheckedChange={(v) => setHeader(v === true)} />
                  First row contains column names
                </label>
              </div>
            </div>
          ) : parsed && (
            <div className="grid gap-5 pb-1">
              <div ref={summary} tabIndex={-1} className="outline-none">
                {Object.keys(errors).length > 0 ? (
                  <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>{Object.keys(errors).length === 1 ? "1 required field has no column" : `${Object.keys(errors).length} required fields have no column`}</AlertTitle>
                    <AlertDescription>Choose a column for {Object.keys(errors).map((k) => targets.find((t) => t.id === k)?.label).join(" and ")} below, then import.</AlertDescription>
                  </Alert>
                ) : problemRows > 0 ? (
                  <Alert variant="warning">
                    <TriangleAlert />
                    <AlertTitle>{summaryLines.join(" ")} {problemRows === 1 ? "Fix it in the preview, or choose what happens to it." : "Fix them in the preview, or choose what happens to them."}</AlertTitle>
                    <AlertDescription>
                      <RadioGroup value={badRows} onValueChange={(v) => setBadRows(v as "skip" | "empty")} aria-label="Rows with problems" className="mt-1 gap-2">
                        <label className="flex items-center gap-2"><RadioGroupItem value="skip" />Skip {n(problemRows)} {problemRows === 1 ? "row" : "rows"} with problems</label>
                        <label className="flex items-center gap-2"><RadioGroupItem value="empty" />Import them and leave the problem cells empty{problems.missing ? ` (${n(problems.missing)} without a required value ${problems.missing === 1 ? "is" : "are"} still skipped)` : ""}</label>
                      </RadioGroup>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert><AlertTitle>All {n(total)} rows look right.</AlertTitle><AlertDescription>Check the preview, then import.</AlertDescription></Alert>
                )}
              </div>
              <FieldMapping targets={targets} sources={parsed.sources} value={map} onChange={(m) => { setMap(m); setErrors({}) }} extra={extra} onExtraChange={setExtra} errors={errors} />
              <section aria-labelledby="csv-preview" className="grid gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 id="csv-preview" className="flex-1 text-sm font-medium text-ink-2">Preview · {onlyProblems ? `${n(Math.min(20, problemRows))} of ${n(problemRows)} rows with problems` : `first ${n(previewRows.length)} of ${n(total)} rows`}</h3>
                  {problemRows > 0 && <label className="flex items-center gap-2 text-sm text-ink"><Switch checked={onlyProblems} onCheckedChange={setOnlyProblems} />Only rows with problems</label>}
                </div>
                <div className="overflow-x-auto rounded-sm border border-line">
                  <table className="w-max min-w-full border-separate border-spacing-0 text-base">
                    <thead>
                      <tr>
                        <th scope="col" className="sticky left-0 border-b border-line bg-surface-2 px-2 py-2 text-right text-sm font-medium text-ink-3">Row</th>
                        {mappedCols.map((c) => <th key={c.key} scope="col" className="border-b border-line bg-surface-2 px-3 py-2 text-left text-sm font-medium whitespace-nowrap text-ink-2">{c.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((r) => (
                        <tr key={r}>
                          <th scope="row" className="sticky left-0 border-b border-line bg-surface-2 px-2 text-right text-sm font-normal text-ink-3 tabular">{r + (header ? 2 : 1)}</th>
                          {mappedCols.map((c) => {
                            const p = problems.byRow.get(r)?.get(c.sid)
                            const k = `${r}:${c.sid}`
                            return (
                              <td key={c.key} className={cn("h-9 max-w-64 border-b border-line px-3 whitespace-nowrap", p ? "bg-bad-bg" : "text-ink")}>
                                {fixing === k ? (
                                  <Input
                                    autoFocus
                                    defaultValue={cellOf(r, c.sid)}
                                    aria-label={`Fix ${c.label} in row ${r + (header ? 2 : 1)}`}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") { e.preventDefault(); setEdits((x) => ({ ...x, [k]: e.currentTarget.value })); setFixing(null) }
                                      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setFixing(null) }
                                    }}
                                    onBlur={(e) => { setEdits((x) => ({ ...x, [k]: e.currentTarget.value })); setFixing(null) }}
                                  />
                                ) : p ? (
                                  <span className="flex items-center gap-control">
                                    <CircleAlert className="size-3.5 shrink-0 text-bad" aria-hidden="true" />
                                    <span className="text-sm font-medium text-bad">{p}</span>
                                    <span className="min-w-0 truncate text-ink-2">{cellOf(r, c.sid)}</span>
                                    <Button variant="ghost" size="xs" onClick={() => setFixing(k)} aria-label={`Fix ${c.label} in row ${r + (header ? 2 : 1)}`}>Fix</Button>
                                  </span>
                                ) : <span className="block truncate">{cellOf(r, c.sid)}</span>}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 2 && <Button variant="outline" className="sm:mr-auto" onClick={() => setStep(1)}>Back</Button>}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {step === 1 ? <Button onClick={next}>Continue</Button> : <Button onClick={submit}>Import {n(importing)} {importing === 1 ? "row" : "rows"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
