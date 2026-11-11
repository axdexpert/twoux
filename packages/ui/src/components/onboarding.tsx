/**
 * TwoUX compositions for getting started and connecting other services.
 *
 * ProviderLogo: the official mark of a service people sign in with or connect (Google, Microsoft, Slack…), on a white
 *   tile in both themes so dark marks stay visible. Only for identifying that service; never altered or recoloured.
 * SignInOptions: provider buttons, single sign-on found from the email domain, and an email link.
 * OnboardingStep: one step of first-run setup: why we ask, the fields, "Step 2 of 5", Back, Skip for optional steps.
 * FileDrop: a drop zone with a button, the accepted types and size limit, and the error under it.
 * ConnectorPicker: search, what is connected, everything else; each service says what it will let the product do.
 * ConnectDialog: before connecting, the access asked for in plain words; then OAuth in a new window, or an API key with a test.
 * SetupChecklist: the few things that make the product useful, in the sidebar, dismissible, never a tour.
 * UsageMeter: credits or seats used against the limit, when it resets, and an upgrade link only when close to the limit.
 */
import { AlertTriangle, Check, CheckCircle2, ExternalLink, KeyRound, Search, Upload, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Badge } from "./badge"
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "./field"
import { Input } from "./input"
import { PROVIDERS, type ProviderId } from "./provider-logos.data"

export { PROVIDERS, type ProviderId }

/* ---------------------------------------------------------------- logo */

const LOGO_SIZE = { sm: "size-5 p-0.5", md: "size-7 p-1", lg: "size-9 p-1" } as const
const BARE_SIZE = { sm: "size-4", md: "size-6", lg: "size-8" } as const
/* Marks drawn in black or near-black. They vanish on a dark surface and may not be recoloured, so they always keep the white tile. */
const DARK_MARKS = new Set<ProviderId>(["apple", "github", "okta", "notion", "hubspot"])

/**
 * The service's official mark on a white tile. Decorative next to its name; pass `label` when it stands alone.
 * `tile={false}` shows a full-colour mark bare, e.g. inside a button; dark marks keep their tile regardless.
 */
export function ProviderLogo({ provider, size = "md", label, tile = true, className }: { provider: ProviderId; size?: keyof typeof LOGO_SIZE; label?: string; tile?: boolean; className?: string }) {
  const p = PROVIDERS[provider]
  const tiled = tile || DARK_MARKS.has(provider)
  return (
    <span data-slot="provider-logo" data-tile={tiled || undefined} className={cn("inline-grid shrink-0 place-items-center", tiled ? cn("rounded-xs border border-line bg-white", LOGO_SIZE[size]) : BARE_SIZE[size], className)}>
      <svg
        viewBox={p.viewBox}
        className="size-full"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        // Generated, trusted SVG from scripts/provider-logos.mjs
        dangerouslySetInnerHTML={{ __html: p.body }}
      />
    </span>
  )
}

/* ---------------------------------------------------------------- sign in */

const ssoDomain = (email: string) => /^[^@\s]+@([^@\s]+\.[^@\s]+)$/.exec(email.trim())?.[1]

/**
 * Sign-in choices in one column: providers first, then email. When the email's domain uses single sign-on, the email
 * button becomes "Continue with SSO". Errors appear under the field and say what to do.
 */
export function SignInOptions({
  providers = ["google", "microsoft"],
  ssoDomains = [],
  onProvider,
  onEmail,
  onSso,
  busy,
  error,
  className,
}: {
  providers?: ProviderId[]
  /** Domains that must sign in with SSO, e.g. ["northwind.example"] */
  ssoDomains?: string[]
  onProvider: (p: ProviderId) => void
  /** Send a sign-in link to this address */
  onEmail: (email: string) => void
  onSso?: (domain: string) => void
  /** The choice in progress, so its button shows the spinner */
  busy?: ProviderId | "email" | "sso"
  /** e.g. "This email uses Google to sign in. Continue with Google instead." */
  error?: string
  className?: string
}) {
  const [email, setEmail] = React.useState("")
  const [fieldError, setFieldError] = React.useState("")
  const domain = ssoDomain(email)
  const sso = !!domain && ssoDomains.includes(domain)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ssoDomain(email)) { setFieldError("Enter your work email, for example sam@company.com."); return }
    setFieldError("")
    if (sso && onSso && domain) onSso(domain)
    else onEmail(email.trim())
  }
  return (
    <div data-slot="sign-in-options" className={cn("grid gap-3", className)}>
      {/* One grid shared by every button (subgrid): space | mark | label | space. Mark and label sit centred as a block,
          and every mark and label starts at the same x, because the label column is as wide as the longest label.
          The first child is the mark, or Button's spinner while loading, so both take the mark's column. */}
      <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-2">
        {providers.map((p) => (
          <Button key={p} variant="outline" className="col-span-full grid grid-cols-subgrid items-center [&>:first-child]:col-start-2 [&>:first-child]:justify-self-center" loading={busy === p} onClick={() => onProvider(p)}>
            {busy !== p && <ProviderLogo provider={p} size="sm" tile={false} />}
            <span className="col-start-3 text-left">Continue with {PROVIDERS[p].label}</span>
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-3"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <form noValidate onSubmit={submit} className="grid gap-2">
        <Field data-invalid={!!(fieldError || error) || undefined}>
          <FieldLabel htmlFor="sign-in-email">Work email</FieldLabel>
          <Input id="sign-in-email" type="email" autoComplete="email" value={email} aria-invalid={!!(fieldError || error) || undefined} onChange={(e) => { setEmail(e.target.value); setFieldError("") }} />
          {sso && <FieldDescription>{domain} signs in with single sign-on.</FieldDescription>}
          {(fieldError || error) && <FieldError>{fieldError || error}</FieldError>}
        </Field>
        <Button type="submit" className="w-full" loading={busy === "email" || busy === "sso"}>
          {sso ? <><KeyRound />Continue with SSO</> : "Continue with email"}
        </Button>
      </form>
    </div>
  )
}

/* ---------------------------------------------------------------- onboarding step */

/**
 * One step of first-run setup on a plain page (no gradients). Say why each question is asked; optional steps say
 * "Optional" and offer Skip. Continue is never disabled: validate when pressed and put the error under the field.
 */
export function OnboardingStep({
  step,
  total,
  title,
  description,
  optional,
  children,
  onBack,
  onSkip,
  onContinue,
  continueLabel = "Continue",
  busy,
  aside,
  className,
}: {
  /** 1-based */
  step: number
  total: number
  title: string
  description?: string
  optional?: boolean
  children: React.ReactNode
  onBack?: () => void
  onSkip?: () => void
  onContinue: () => void
  continueLabel?: string
  busy?: boolean
  /** A right-hand panel on wide screens, e.g. what a connection adds */
  aside?: React.ReactNode
  className?: string
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  // Move focus to the step's heading when the step changes, so screen readers hear where they are.
  React.useEffect(() => { headingRef.current?.focus() }, [step])
  return (
    <section data-slot="onboarding-step" aria-labelledby="onboarding-title" className={cn("grid w-full max-w-xl overflow-hidden rounded-md border border-line bg-surface shadow-card", aside && "max-w-4xl md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]", className)}>
      <div className="flex min-h-0 flex-col gap-5 p-6 max-md:p-4">
        <header className="grid gap-1">
          <p className="text-sm text-ink-3">Step {step} of {total}{optional && " · Optional"}</p>
          <h1 ref={headingRef} id="onboarding-title" tabIndex={-1} className="text-xl font-semibold text-ink outline-none">{title}</h1>
          {description && <p className="text-base text-ink-2">{description}</p>}
        </header>
        <div className="min-h-0 flex-1">{children}</div>
        <footer className="flex items-center gap-2 border-t border-line pt-4">
          {onBack ? <Button variant="ghost" size="sm" onClick={onBack}>Back</Button> : <span />}
          <span aria-hidden="true" className="flex flex-1 justify-center gap-1">
            {Array.from({ length: total }, (_, i) => <span key={i} className={cn("h-1.5 rounded-full transition-all duration-(--duration-base) ease-(--ease-standard)", i + 1 === step ? "w-4 bg-primary" : i + 1 < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-line-strong")} />)}
          </span>
          {optional && onSkip && <Button variant="ghost" size="sm" onClick={onSkip}>Skip</Button>}
          <Button size="sm" loading={busy} onClick={onContinue}>{continueLabel}</Button>
        </footer>
      </div>
      {aside && <aside className="border-l border-line bg-surface-2 p-6 max-md:hidden">{aside}</aside>}
    </section>
  )
}

/* ---------------------------------------------------------------- file drop */

/** Drop a file or choose one. Shows the accepted types and limit; the preview replaces the icon once chosen. */
export function FileDrop({
  id,
  label,
  accept,
  hint,
  maxBytes,
  preview,
  onFile,
  onRemove,
  error,
  className,
}: {
  id: string
  label: string
  /** Types or extensions, e.g. "image/png,image/jpeg" or ".csv,text/csv" */
  accept: string
  /** e.g. "PNG or JPEG, up to 10 MB" */
  hint: string
  maxBytes?: number
  /** URL of the chosen file's preview */
  preview?: string
  onFile: (file: File) => void
  onRemove?: () => void
  error?: string
  className?: string
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const [over, setOver] = React.useState(false)
  const [localError, setLocalError] = React.useState("")
  const take = (f?: File) => {
    if (!f) return
    // Match by extension (".csv") or type ("image/*", "text/csv"); some systems give CSVs an empty or spreadsheet type.
    const ext = `.${f.name.split(".").pop()?.toLowerCase() ?? ""}`
    const ok = accept.split(",").map((t) => t.trim().toLowerCase()).some((t) => (t.startsWith(".") ? ext === t : t.endsWith("/*") ? f.type.startsWith(t.slice(0, -1)) : f.type === t))
    if (!ok) { setLocalError(`That file type isn't supported. Choose ${hint.split(",")[0]}.`); return }
    if (maxBytes && f.size > maxBytes) { setLocalError(`That file is ${(f.size / 1e6).toFixed(1)} MB. Choose one up to ${(maxBytes / 1e6).toFixed(0)} MB.`); return }
    setLocalError("")
    onFile(f)
  }
  const shown = localError || error
  return (
    <Field data-invalid={!!shown || undefined} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div
        data-slot="file-drop"
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]) }}
        className={cn("flex items-center gap-3 rounded-sm border border-dashed p-3 transition-colors duration-(--duration-fast)", over ? "border-primary bg-primary-soft" : shown ? "border-destructive-edge" : "border-input")}
      >
        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xs bg-surface-2">
          {preview ? <img src={preview} alt="" className="size-full object-cover" /> : <Upload className="size-4 text-ink-3" aria-hidden="true" />}
        </span>
        <span className="grid min-w-0 flex-1">
          <span className="text-base text-ink">{over ? "Drop to upload" : "Drop a file here"}</span>
          <span className="text-sm text-ink-2">{hint}</span>
        </span>
        {preview && onRemove && <Button variant="ghost" size="sm" onClick={onRemove}>Remove</Button>}
        <Button variant="outline" size="sm" onClick={() => input.current?.click()}>{preview ? "Replace" : "Upload"}</Button>
        <input ref={input} id={id} type="file" accept={accept} className="sr-only" aria-invalid={!!shown || undefined} onChange={(e) => { take(e.target.files?.[0]); e.target.value = "" }} />
      </div>
      {shown && <FieldError>{shown}</FieldError>}
    </Field>
  )
}

/* ---------------------------------------------------------------- connectors */

export type Connector = {
  id: string
  provider: ProviderId
  /** What connecting lets the product do, in plain words: "Read and send email" */
  can: string[]
  connected?: boolean
  /** A connected service that needs attention */
  problem?: string
  /** e.g. "Included in your plan" */
  note?: string
}

/** Search, then Connected and All services. Rows say what each connection lets the product do. */
export function ConnectorPicker({ connectors, onConnect, onManage, onActive, className }: { connectors: Connector[]; onConnect: (c: Connector) => void; onManage?: (c: Connector) => void; /** The row under the pointer or keyboard focus, e.g. to show what it adds beside the list */ onActive?: (c: Connector) => void; className?: string }) {
  const [q, setQ] = React.useState("")
  const match = (c: Connector) => `${PROVIDERS[c.provider].label} ${c.can.join(" ")}`.toLowerCase().includes(q.trim().toLowerCase())
  const shown = connectors.filter(match)
  const groups: [string, Connector[]][] = [["Connected", shown.filter((c) => c.connected)], [q ? "Results" : "All services", shown.filter((c) => !c.connected)]]
  return (
    <div data-slot="connector-picker" className={cn("grid gap-3", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <Input type="search" aria-label={`Search ${connectors.length} services`} placeholder={`Search ${connectors.length} services`} value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
      </div>
      {shown.length === 0 && <p className="py-4 text-center text-base text-ink-2">No service called “{q}”. Check the spelling, or connect it through webhooks or the API.</p>}
      {groups.map(([title, list]) => list.length > 0 && (
        <section key={title} aria-label={title} className="grid gap-0.5">
          <h2 className="px-1 text-sm font-medium text-ink-2">{title} <span className="tabular text-ink-3">{list.length}</span></h2>
          <ul className="grid">
            {list.map((c) => (
              <li key={c.id} onMouseEnter={() => onActive?.(c)} onFocus={() => onActive?.(c)} className="flex items-center gap-2 rounded-xs px-1 py-2 hover:bg-hover">
                <ProviderLogo provider={c.provider} />
                <span className="grid min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-base font-medium text-ink">
                    {PROVIDERS[c.provider].label}
                    {/* Status sits in one place for every row, as a word in a badge; the right edge holds only actions. */}
                    {c.problem ? <Badge variant="warning" dot>Needs attention</Badge> : c.connected && <Badge variant="success" dot>Connected</Badge>}
                  </span>
                  <span className="truncate text-sm text-ink-2">{c.problem ?? c.note ?? c.can.join(" · ")}</span>
                </span>
                {c.connected ? (
                  c.problem ? <Button variant="outline" size="sm" onClick={() => onConnect(c)}>Reconnect</Button>
                    : onManage && <Button variant="outline" size="sm" onClick={() => onManage(c)}>Manage<span className="sr-only"> {PROVIDERS[c.provider].label}</span></Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => onConnect(c)}>Connect<span className="sr-only"> {PROVIDERS[c.provider].label}</span></Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/**
 * Before connecting: what access is asked for, in plain words, and who it applies to. OAuth opens the provider in a new
 * window; an API key is tested before it is saved, and the error says what to check.
 */
export function ConnectDialog({
  connector,
  open,
  onOpenChange,
  method = "oauth",
  scope = "Only you",
  product = "the product",
  onAuthorise,
  onTestKey,
  onDone,
}: {
  connector: Connector | null
  open: boolean
  onOpenChange: (o: boolean) => void
  method?: "oauth" | "apikey"
  /** Who the connection is shared with, e.g. "Everyone in TwoUX" */
  scope?: string
  /** Your product's name, for "This lets TwoUX:" */
  product?: string
  /** OAuth: open the provider's window; resolve when it returns */
  onAuthorise?: () => Promise<void>
  /** API key: resolve with an error message, or undefined when the key works */
  onTestKey?: (key: string) => Promise<string | undefined>
  onDone: () => void
}) {
  const [key, setKey] = React.useState("")
  const [state, setState] = React.useState<"idle" | "busy" | "ok">("idle")
  const [error, setError] = React.useState("")
  React.useEffect(() => { if (open) { setKey(""); setState("idle"); setError("") } }, [open])
  if (!connector) return null
  const name = PROVIDERS[connector.provider].label
  const go = async () => {
    if (method === "apikey") {
      if (!key.trim()) { setError(`Paste the API key from your ${name} settings.`); return }
      setState("busy")
      const msg = await onTestKey?.(key.trim())
      if (msg) { setError(msg); setState("idle"); return }
      setState("ok")
    } else {
      setState("busy")
      await onAuthorise?.()
      setState("ok")
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ProviderLogo provider={connector.provider} />Connect {name}</DialogTitle>
          <DialogDescription>This lets {product}:</DialogDescription>
        </DialogHeader>
        <ul className="grid gap-2 text-base text-ink">
          {connector.can.map((c) => <li key={c} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />{c}</li>)}
        </ul>
        <p className="text-sm text-ink-2">Shared with: {scope}. You can disconnect at any time in Settings, Connections.</p>
        {method === "apikey" && state !== "ok" && (
          <Field data-invalid={!!error || undefined}>
            <FieldLabel htmlFor="connect-key">API key</FieldLabel>
            <Input id="connect-key" type="password" autoComplete="off" value={key} aria-invalid={!!error || undefined} onChange={(e) => { setKey(e.target.value); setError("") }} />
            {error ? <FieldError>{error}</FieldError> : <FieldDescription>The key is tested before it is saved. It is stored encrypted and never shown again.</FieldDescription>}
          </Field>
        )}
        {state === "ok" && <p role="status" className="flex items-center gap-2 text-base text-ok"><CheckCircle2 className="size-4" aria-hidden="true" />{name} is connected.</p>}
        <DialogFooter>
          {state === "ok" ? (
            <Button onClick={() => { onDone(); onOpenChange(false) }}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button loading={state === "busy"} onClick={go}>
                {method === "oauth" ? <>Continue to {name}<ExternalLink /></> : "Test and connect"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------------------------------------------------------------- checklist */

export type SetupItem = { id: string; label: string; done: boolean; onStart?: () => void }

/** "Get set up" in the sidebar: a few steps that make the product useful, with progress. Dismissible; never a tour. */
export function SetupChecklist({ items, onDismiss, className }: { items: SetupItem[]; onDismiss?: () => void; className?: string }) {
  const done = items.filter((i) => i.done).length
  return (
    <section aria-label="Get set up" data-slot="setup-checklist" className={cn("grid gap-2 rounded-sm border border-line bg-surface p-3", className)}>
      <header className="flex items-center gap-2">
        <h2 className="flex-1 text-base font-semibold text-ink">Get set up</h2>
        <span className="tabular text-sm text-ink-2">{done} of {items.length}</span>
        {onDismiss && <Button variant="ghost" size="icon-xs" aria-label="Hide setup checklist" onClick={onDismiss}><X /></Button>}
      </header>
      <span aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-hover"><span className="block h-full w-(--p) rounded-full bg-primary transition-all duration-(--duration-slow) ease-(--ease-standard)" style={{ "--p": `${(done / items.length) * 100}%` } as React.CSSProperties} /></span>
      <ul className="grid">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 py-1">
            <span className={cn("grid size-4 shrink-0 place-items-center rounded-full border", i.done ? "border-primary bg-primary text-primary-foreground" : "border-control")}>{i.done && <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />}</span>
            <span className={cn("min-w-0 flex-1 text-base", i.done ? "text-ink-3 line-through" : "text-ink")}>{i.label}<span className="sr-only">{i.done ? " (done)" : ""}</span></span>
            {!i.done && i.onStart && <Button variant="outline" size="xs" onClick={i.onStart}>Start<span className="sr-only"> {i.label}</span></Button>}
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- usage */

/**
 * Usage against a limit: "13.2k of 20k credits", when it resets, and what used it. The upgrade link appears only from
 * 80% used, and the warning names what stops at the limit. Never a permanent bright button.
 */
export function UsageMeter({ used, limit, unit, resets, atLimit, onDetails, onUpgrade, className }: { used: number; limit: number; unit: string; /** e.g. "1 Dec" */ resets?: string; /** What stops at the limit, e.g. "Agents pause until 1 Dec" */ atLimit?: string; onDetails?: () => void; onUpgrade?: () => void; className?: string }) {
  const pct = Math.min(100, (used / limit) * 100)
  const near = pct >= 80
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toLocaleString("en-GB", { maximumFractionDigits: 1 })}k` : n.toLocaleString("en-GB"))
  return (
    <section aria-label={`${unit} used`} data-slot="usage-meter" className={cn("grid gap-2", className)}>
      <div className="flex items-baseline gap-2 text-sm">
        <span className="flex-1 font-medium text-ink">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
        <span className="tabular text-ink-2">{fmt(used)} of {fmt(limit)}</span>
      </div>
      <span role="meter" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used} aria-label={`${unit} used`} className="h-1.5 overflow-hidden rounded-full bg-hover">
        <span className={cn("block h-full w-(--p) rounded-full transition-all duration-(--duration-slow) ease-(--ease-standard)", near ? "bg-warn" : "bg-primary")} style={{ "--p": `${pct}%` } as React.CSSProperties} />
      </span>
      {near && atLimit && <p className="flex items-start gap-control text-sm text-ink-2"><AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden="true" />{Math.round(pct)}% used. {atLimit}.</p>}
      <div className="flex flex-wrap items-center gap-x-3 text-sm">
        {resets && <span className="text-ink-3">Resets {resets}</span>}
        {onDetails && <Button variant="link" size="xs" onClick={onDetails}>What used them</Button>}
        {near && onUpgrade && <Button variant="link" size="xs" onClick={onUpgrade}>Add more</Button>}
      </div>
    </section>
  )
}
