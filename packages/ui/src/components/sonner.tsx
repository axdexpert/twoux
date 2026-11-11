/**
 * Generated from shadcn/ui new-york-v4 "sonner" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Theme from TwoUX's <html data-theme> (light by default), not next-themes
 *  - Status icons 14px in their status colour
 *  - TwoUX defaults: bottom right, 16px from the edges, one at a time, 6 seconds, 340px wide; Undo is a quiet text button
 *  - Solid surface: shadcn points at --popover and --border, which TwoUX names --color-popover and --color-line, so the toast was see-through
 *  - Anti-collision: the toast rises above the focused element and anything marked data-toast-avoid (such as a sticky footer), so it never hides them (WCAG 2.4.11)
 */
"use client"

import * as React from "react"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "./theme"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/** TwoUX: bottom offset that keeps toasts clear of the focused element and of [data-toast-avoid] elements. */
function useToastClearance(base = 16, width = 340, height = 96) {
  const [clearance, setClearance] = React.useState(base)
  React.useEffect(() => {
    let frame = 0
    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const zoneTop = vh - base - height
      const zoneLeft = vw - base - width
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-toast-avoid]"))
      const active = document.activeElement as HTMLElement | null
      if (active && active !== document.body && !active.closest("[data-sonner-toaster]")) targets.push(active)
      let next = base
      for (const el of targets) {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height || r.top < vh * 0.4) continue
        if (r.bottom > zoneTop && r.top < vh && r.right > zoneLeft) next = Math.max(next, Math.round(vh - r.top + 8))
      }
      setClearance(next)
    }
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    measure()
    document.addEventListener("focusin", update)
    document.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    const mo = new MutationObserver(update)
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-toast-avoid"] })
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("focusin", update)
      document.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
      mo.disconnect()
    }
  }, [base, width, height])
  return clearance
}

const Toaster = ({ ...props }: ToasterProps) => {
  const clearance = useToastClearance()
  const { resolved } = useTheme()

  return (
    <Sonner
      theme={resolved}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-3.5 text-ok" />,
        info: <InfoIcon className="size-3.5 text-ink-2" />,
        warning: <TriangleAlertIcon className="size-3.5 text-warn" />,
        error: <OctagonXIcon className="size-3.5 text-bad" />,
        loading: <Loader2Icon className="size-3.5 animate-spin text-ink-3" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-surface)",
          "--normal-text": "var(--color-ink)",
          "--normal-border": "var(--color-line)",
          "--border-radius": "var(--radius-md)",
          "--width": "340px",
        } as React.CSSProperties
      }
      position="bottom-right"
      offset={{ bottom: clearance, right: 16 }}
      visibleToasts={1}
      duration={6000}
      toastOptions={{
        classNames: {
          toast: "gap-2! px-3! py-2.5! text-base! shadow-pop! border-line!",
          title: "font-medium!",
          description: "text-ink-2!",
          actionButton: "h-6! rounded-xs! bg-transparent! px-2! text-base! font-medium! text-primary-ink! hover:bg-hover!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
