/**
 * TwoUX compositions on shadcn Field, Label, Input, Checkbox, RadioGroup and Switch.
 * They wire label, hint and error to the control (htmlFor, aria-describedby, aria-invalid) so every field is accessible by default.
 */
import { AlertCircle, CheckCircle2 } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Checkbox } from "./checkbox"
import { Field, FieldDescription, FieldLabel } from "./field"
import { Input } from "./input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./input-group"
import { RadioGroupItem } from "./radio-group"
import { Switch } from "./switch"

type TextFieldProps = Omit<React.ComponentProps<"input">, "prefix"> & {
	label: string
	hint?: string
	error?: string
	/** Confirms the value meets the rules, e.g. a password. Shown in place of the hint. */
	success?: string
	optional?: boolean
	/** Inside the field, before the value: £, a search icon. */
	prefix?: React.ReactNode
	/** Inside the field, after the value: a unit or a shortcut. */
	suffix?: React.ReactNode
}

export function TextField({ label, hint, error, success, optional, required, prefix, suffix, id, className, ...props }: TextFieldProps) {
	const auto = React.useId()
	const fid = id ?? auto
	const describedBy = error ? `${fid}-error` : success ? `${fid}-ok` : hint ? `${fid}-hint` : undefined
	const control = { id: fid, required, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, ...props }
	return (
		<Field data-invalid={!!error || undefined} className={cn("gap-2", className)}>
			<FieldLabel htmlFor={fid}>
				{label}
				{required && <span aria-hidden="true" className="text-bad">*</span>}
				{optional && <span className="font-normal text-ink-3">(optional)</span>}
			</FieldLabel>
			{prefix || suffix ? (
				<InputGroup>
					{prefix && <InputGroupAddon><InputGroupText>{prefix}</InputGroupText></InputGroupAddon>}
					<InputGroupInput {...control} />
					{suffix && <InputGroupAddon align="inline-end"><InputGroupText>{suffix}</InputGroupText></InputGroupAddon>}
				</InputGroup>
			) : (
				<Input {...control} />
			)}
			{error ? (
				<p id={`${fid}-error`} className="flex items-start gap-control text-sm text-bad">
					<AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
					{error}
				</p>
			) : success ? (
				<p id={`${fid}-ok`} className="flex items-start gap-control text-sm text-ok">
					<CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
					{success}
				</p>
			) : hint ? (
				<FieldDescription id={`${fid}-hint`}>{hint}</FieldDescription>
			) : null}
		</Field>
	)
}

function Choice({ id, label, hint, control }: { id: string; label: string; hint?: string; control: React.ReactNode }) {
	return (
		<div className="grid grid-cols-[16px_1fr] gap-x-2">
			<span className="flex h-6 items-center">{control}</span>
			<label htmlFor={id} className="flex min-h-6 cursor-pointer items-center text-base text-ink">{label}</label>
			{hint && <span id={`${id}-hint`} className="col-start-2 text-sm text-ink-3">{hint}</span>}
		</div>
	)
}

export function CheckboxField({ id, label, hint, ...props }: React.ComponentProps<typeof Checkbox> & { id: string; label: string; hint?: string }) {
	return <Choice id={id} label={label} hint={hint} control={<Checkbox id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />} />
}

export function RadioField({ id, value, label, hint, disabled }: { id: string; value: string; label: string; hint?: string; disabled?: boolean }) {
	return <Choice id={id} label={label} hint={hint} control={<RadioGroupItem id={id} value={value} disabled={disabled} aria-describedby={hint ? `${id}-hint` : undefined} />} />
}

export function SwitchField({ id, label, hint, ...props }: React.ComponentProps<typeof Switch> & { id: string; label: string; hint?: string }) {
	return (
		<div className="flex items-start justify-between gap-6">
			<div className="grid gap-0.5">
				<label htmlFor={id} className="cursor-pointer text-base text-ink">{label}</label>
				{hint && <span id={`${id}-hint`} className="text-sm text-ink-3">{hint}</span>}
			</div>
			<span className="flex h-5 items-center"><Switch id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} /></span>
		</div>
	)
}

/** Shown above a form after a failed submit. Each link moves focus to its field. */
export function ErrorSummary({ errors, className }: { errors: { field: string; message: string; href: string }[]; className?: string }) {
	if (!errors.length) return null
	return (
		<div role="alert" tabIndex={-1} className={cn("grid gap-2 rounded-md border border-bad-line bg-bad-bg/60 px-3 py-2", className)}>
			<p className="flex items-center gap-control text-base font-medium text-bad">
				<AlertCircle className="size-3.5" aria-hidden="true" />
				{errors.length === 1 ? "1 field needs fixing" : `${errors.length} fields need fixing`}
			</p>
			<ul className="grid gap-0.5 pl-5.5 text-sm">
				{errors.map((e) => (
					<li key={e.href}><a href={e.href} className="text-ink underline decoration-bad-line underline-offset-3 transition-colors duration-(--duration-fast) hover:decoration-bad"><span className="font-medium">{e.field}</span>: {e.message}</a></li>
				))}
			</ul>
		</div>
	)
}
