/**
 * GuideCue: a short guide of one to three popovers, each pointing at a real control. Pulled, never pushed.
 * TwoUX composition on the @twoux/ui Popover (Radix Popover.Anchor with the target element as its virtual ref).
 *  - Opens only when the person asks: a SetupChecklist Start, a Help menu entry, a HelpPanel link or a FeatureLabel
 *    popover's "Show me". Never on page load, on a timer or on hover. This is the only in-product guide TwoUX allows.
 *  - One to three steps, counted as text ("Step 2 of 3"). A step whose target is missing or hidden is skipped, so the
 *    cue never points at nothing; if no step has a target, the guide does not open.
 *  - The target gets the focus ring (outline in the focus colour) drawn above it. No dimmed overlay, no spotlight, no
 *    beacon: the page stays usable, and nothing pulses (WCAG 2.3.3).
 *  - Not modal: role="dialog" aria-modal="false", named by its heading, described by its body. Focus moves to the
 *    heading on open, step changes are announced, Esc or Close ends it and focus returns to what started it.
 *  - Back (outline), Next or Done (the single primary inside the cue) and Close (ghost icon button).
 */
"use client"

import { X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { Kbd } from "./kbd"
import { Popover, PopoverAnchor, PopoverContent } from "./popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ---------------------------------------------------------------- types */

/** Where a step points: a ref, a CSS selector (prefer a data attribute, e.g. '[data-guide="filters"]') or a function. */
export type GuideTarget = React.RefObject<HTMLElement | null> | string | (() => HTMLElement | null | undefined)

export type GuideStep = {
  target: GuideTarget
  /** Names what the person does here, sentence case: "Filter the list" */
  title: string
  /** One or two sentences: what the control does for them. */
  body: React.ReactNode
  /** Preferred side of the target. The cue flips when there is no room. */
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export type GuideCueProps = {
  /** One to three steps. More are dropped (with a warning in development): split the guide or write a help article. */
  steps: GuideStep[]
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called when the person presses Done on the last step (not on Close or Esc). */
  onFinish?: () => void
  /** Accessible name prefix for the step count and the live announcement, e.g. "Saved views guide". */
  label?: string
  /**
   * Docs and design previews only: the cue is shown open without taking focus or scrolling, because nobody started it.
   * In a product a guide opens only from something the person pressed; never set this there.
   */
  preview?: boolean
  className?: string
}

export const GUIDE_MAX_STEPS = 3

/* ---------------------------------------------------------------- helpers */

function resolve(target: GuideTarget): HTMLElement | null {
  if (typeof document === "undefined") return null
  if (typeof target === "string") return document.querySelector<HTMLElement>(target)
  if (typeof target === "function") return target() ?? null
  return target.current
}

/** Present, laid out and not hidden from people: a cue never points at nothing. */
export function isGuideTargetAvailable(el: HTMLElement | null): el is HTMLElement {
  if (!el || !el.isConnected) return false
  if (el.getClientRects().length === 0) return false
  if (el.closest("[hidden],[inert],[aria-hidden='true']")) return false
  const style = window.getComputedStyle(el)
  return style.visibility !== "hidden"
}

const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/** The focus ring drawn over the target, following it on scroll and resize. Never takes pointer events. */
function TargetRing({ el }: { el: HTMLElement }) {
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  React.useLayoutEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setRect(el.getBoundingClientRect()))
    }
    setRect(el.getBoundingClientRect())
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [el])
  if (!rect) return null
  const radius = window.getComputedStyle(el).borderRadius
  return createPortal(
    <span
      aria-hidden="true"
      data-slot="guide-cue-ring"
      className="pointer-events-none fixed top-(--gy) left-(--gx) z-40 h-(--gh) w-(--gw) rounded-(--gr) outline-2 outline-offset-2 outline-ring"
      style={{ "--gx": `${rect.left}px`, "--gy": `${rect.top}px`, "--gw": `${rect.width}px`, "--gh": `${rect.height}px`, "--gr": radius || "0px" } as React.CSSProperties}
    />,
    document.body,
  )
}

/* ---------------------------------------------------------------- component */

export function GuideCue({ steps, open, onOpenChange, onFinish, label = "Guide", preview = false, className }: GuideCueProps) {
  const id = React.useId()
  const list = steps.slice(0, GUIDE_MAX_STEPS)

  // Resolved once per opening: the steps whose target is there, with their elements.
  const [live, setLive] = React.useState<{ step: GuideStep; el: HTMLElement }[]>([])
  const [index, setIndex] = React.useState(0)
  const [announce, setAnnounce] = React.useState("")
  const returnTo = React.useRef<HTMLElement | null>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const nextRef = React.useRef<HTMLButtonElement>(null)
  const moved = React.useRef(false)

  const stepsKey = list.map((s) => s.title).join("|")
  React.useLayoutEffect(() => {
    if (!open) {
      setLive([])
      // Back to what started the guide, unless the person has already moved focus somewhere else on the page.
      const back = returnTo.current
      returnTo.current = null
      if (back?.isConnected) {
        requestAnimationFrame(() => {
          const now = document.activeElement
          if (!now || now === document.body) back.focus()
        })
      }
      return
    }
    // Remember what started the guide before anything moves focus. A preview was started by nobody.
    returnTo.current = !preview && document.activeElement instanceof HTMLElement ? document.activeElement : null
    const found = list.flatMap((step) => { const el = resolve(step.target); return isGuideTargetAvailable(el) ? [{ step, el }] : [] })
    if (found.length === 0) {
      console.warn("GuideCue: no step has a visible target, so the guide did not open.")
      onOpenChange(false)
      return
    }
    setLive(found)
    setIndex(0)
    setAnnounce("")
    moved.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepsKey])

  const current = live[index]
  const total = live.length
  const last = index === total - 1

  // Keep the target in view; respect reduced motion.
  React.useEffect(() => {
    if (!open || !current) return
    // A preview opens in place: no scrolling until the person moves through the steps.
    if (!preview || moved.current) current.el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reducedMotion() ? "auto" : "smooth" })
    // Announce step changes only; on open, focus on the heading already reads the first step.
    if (moved.current) setAnnounce(`${label}, step ${index + 1} of ${total}: ${current.step.title}`)
    // On a step change, keep focus inside the cue: if the pressed button went away (Back on step 1), go to Next.
    if (moved.current) {
      requestAnimationFrame(() => {
        const content = headingRef.current?.closest("[data-slot='guide-cue']")
        if (!content?.contains(document.activeElement)) nextRef.current?.focus()
      })
    }
  }, [open, current, index, total, label])

  // A guide given more than three steps keeps the first three: split it, or write a help article instead.
  React.useEffect(() => {
    if (steps.length > GUIDE_MAX_STEPS) console.warn(`GuideCue: ${steps.length} steps given; only the first ${GUIDE_MAX_STEPS} are shown.`)
  }, [steps.length])

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])
  const go = (to: number) => { moved.current = true; setIndex(to) }

  if (!open || !current) return null
  const { step, el } = current
  const virtualRef = { current: el }

  return (
    <>
      <TargetRing el={el} />
      <Popover open onOpenChange={(o) => { if (!o) close() }}>
        <PopoverAnchor virtualRef={virtualRef} />
        <PopoverContent
          data-slot="guide-cue"
          side={step.side ?? "bottom"}
          align={step.align ?? "start"}
          sideOffset={8}
          updatePositionStrategy="always"
          aria-modal="false"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-body`}
          // Focus goes to the heading, so the title is read first; it returns to what started the guide.
          onOpenAutoFocus={(e) => { e.preventDefault(); if (!preview) headingRef.current?.focus() }}
          onCloseAutoFocus={(e) => e.preventDefault()}
          // Not modal: people can try the highlighted control without the guide closing.
          onInteractOutside={(e) => e.preventDefault()}
          className={cn("grid w-72 max-w-(--radix-popover-content-available-width) gap-2 text-base", className)}
        >
          <div className="flex items-start gap-2">
            <h2 ref={headingRef} id={`${id}-title`} tabIndex={-1} className="min-w-0 flex-1 pt-0.5 text-base font-semibold text-ink outline-none">
              {step.title}
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs" aria-label="Close guide" onClick={close} className="-mt-0.5 -mr-1 text-ink-3">
                  <X aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close guide <Kbd>Esc</Kbd></TooltipContent>
            </Tooltip>
          </div>
          <div id={`${id}-body`} className="text-ink-2">{step.body}</div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {total > 1 && <span className="tabular flex-1 text-sm text-ink-2">Step {index + 1} of {total}</span>}
            {total === 1 && <span className="flex-1" />}
            {index > 0 && <Button variant="outline" size="sm" onClick={() => go(index - 1)}>Back</Button>}
            <Button
              ref={nextRef}
              size="sm"
              onClick={() => { if (last) { onFinish?.(); close() } else go(index + 1) }}
            >
              {last ? "Done" : "Next"}
            </Button>
          </div>
          <span className="sr-only" aria-live="polite" aria-atomic="true">{announce}</span>
        </PopoverContent>
      </Popover>
    </>
  )
}

/* ---------------------------------------------------------------- hook */

/**
 * State for one guide. `start` is what a "Show me" or Start button calls; spread `cueProps` on GuideCue.
 * `finished` turns true once Done is pressed on the last step, so the starting point can say so.
 */
export function useGuide(steps: GuideStep[], options: { onFinish?: () => void; label?: string; /** Docs and design previews only: start open, without taking focus. See GuideCue `preview`. */ preview?: boolean } = {}) {
  const [open, setOpen] = React.useState(!!options.preview)
  // Quiet only for the first, unrequested opening; once the person starts or closes it, it behaves normally.
  const [quiet, setQuiet] = React.useState(!!options.preview)
  const [finished, setFinished] = React.useState(false)
  const start = React.useCallback(() => { setQuiet(false); setOpen(true) }, [])
  // A guide given more than three steps keeps the first three: split it, or write a help article instead.
  React.useEffect(() => {
    if (steps.length > GUIDE_MAX_STEPS) console.warn(`GuideCue: ${steps.length} steps given; only the first ${GUIDE_MAX_STEPS} are shown.`)
  }, [steps.length])

  const close = React.useCallback(() => { setQuiet(false); setOpen(false) }, [])
  const { onFinish, label } = options
  const cueProps: GuideCueProps = {
    steps,
    open,
    onOpenChange: (o) => { if (!o) setQuiet(false); setOpen(o) },
    preview: quiet,
    onFinish: () => { setFinished(true); onFinish?.() },
    label,
  }
  return { open, finished, start, close, cueProps }
}
