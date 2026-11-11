/**
 * TwoUX: one indicator that slides to the active item (tabs underline, segment pill),
 * instead of each item painting its own and the highlight jumping.
 * Place it as the first child of a `relative` list. It follows the child matching `selector`.
 */
import * as React from "react"
import { cn } from "./cn"

type Box = { left: number; top?: number; width: number; height?: number }

export function ActiveIndicator({ selector, fit = "box", className }: { selector: string; fit?: "x" | "box"; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [box, setBox] = React.useState<Box | null>(null)
  const [animate, setAnimate] = React.useState(false)

  React.useLayoutEffect(() => {
    const list = ref.current?.parentElement
    if (!list) return
    const measure = () => {
      const el = list.querySelector<HTMLElement>(`:scope > ${selector}`)
      if (!el || !el.offsetWidth) return setBox(null)
      setBox(fit === "x" ? { left: el.offsetLeft, width: el.offsetWidth } : { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight })
    }
    measure()
    const mo = new MutationObserver(measure)
    mo.observe(list, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state"] })
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    for (const c of Array.from(list.children)) ro.observe(c)
    // First position is set without motion; only later changes slide.
    const raf = requestAnimationFrame(() => setAnimate(true))
    return () => {
      mo.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [selector, fit])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="active-indicator"
      className={cn(
        "pointer-events-none absolute",
        animate && "transition-[left,top,width,height] duration-(--duration-base) ease-(--ease-out)",
        !box && "invisible",
        className
      )}
      style={box ?? undefined}
    />
  )
}
