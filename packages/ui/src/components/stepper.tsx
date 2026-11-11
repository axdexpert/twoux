/**
 * TwoUX composition: a vertical list of numbered steps joined by a line (shadcn has no stepper).
 * Done steps show a check, the current step is indigo and marked aria-current="step",
 * later steps are faded. With onStepSelect, done steps become buttons to go back to.
 */
import { Check } from "lucide-react"
import { cn } from "../lib/cn"
import { Swap } from "./motion"

type StepItem = { title: string; description?: string }

export function Stepper({
  steps,
  current,
  onStepSelect,
  className,
  "aria-label": label = "Progress",
}: {
  steps: StepItem[]
  /** Index of the current step. Steps before it are done. */
  current: number
  /** Lets people go back to a done step. Steps ahead stay locked. */
  onStepSelect?: (index: number) => void
  className?: string
  "aria-label"?: string
}) {
  return (
    <ol aria-label={label} data-slot="stepper" className={cn("grid", className)}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming"
        const last = i === steps.length - 1
        const marker = (
          <span
            data-slot="stepper-marker"
            className={cn(
              "relative z-10 grid size-5 shrink-0 place-items-center rounded-full border text-sm font-semibold tabular transition-[color,background-color,border-color] duration-(--duration-slow) ease-(--ease-standard)",
              state === "done" && "border-primary bg-primary text-primary-foreground",
              state === "current" && "border-primary bg-primary-soft text-primary-ink",
              state === "upcoming" && "border-line-strong bg-surface text-ink-3"
            )}
          >
            <Swap kind="icon" swapKey={state === "done" ? "done" : "number"}>{state === "done" ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : i + 1}</Swap>
          </span>
        )
        const text = (
          <span className="grid gap-0.5 pb-5 text-left">
            <span className={cn("text-base font-medium transition-colors duration-(--duration-slow) ease-(--ease-standard)", state === "upcoming" ? "text-ink-3" : "text-ink")}>
              {step.title}
              <span className="sr-only">{state === "done" ? " (done)" : state === "current" ? " (current step)" : ""}</span>
            </span>
            {step.description && <span className={cn("text-sm transition-colors duration-(--duration-slow) ease-(--ease-standard)", state === "upcoming" ? "text-ink-3" : "text-ink-2")}>{step.description}</span>}
          </span>
        )
        const canSelect = state === "done" && !!onStepSelect
        return (
          <li key={step.title} data-state={state} aria-current={state === "current" ? "step" : undefined} className="group/step relative grid grid-cols-[20px_1fr] gap-x-3 has-[button:hover]:[&_[data-slot=stepper-marker]]:bg-primary-hover">
            {!last && (
              // The line fills downwards when the step is done, instead of switching colour.
              <span aria-hidden="true" className="absolute top-5 bottom-0 left-[9.5px] w-px overflow-hidden bg-line-strong">
                <span className={cn("block size-full origin-top bg-primary transition-transform duration-(--duration-slow) ease-(--ease-standard)", i < current ? "scale-y-100" : "scale-y-0")} />
              </span>
            )}
            {/* Same elements in every state, so colour and icon changes can animate; a done step gets a button laid over the row. */}
            {marker}
            {text}
            {canSelect && (
              <button type="button" onClick={() => onStepSelect(i)} className="peer absolute inset-0 rounded-xs">
                <span className="sr-only">Go back to {step.title}</span>
              </button>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export type { StepItem }
