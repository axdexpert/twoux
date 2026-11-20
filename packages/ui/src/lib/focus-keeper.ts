/**
 * TwoUX: keyboard focus never falls to the page because the control that had it went away.
 * When the focused element is removed or hidden (a row deleted, a card resolved, a button swapped for another),
 * focus moves to the nearest place that still exists: the closest surviving container's `[data-focus-fallback]`
 * (a composer, a table body) if it has one, else the control now at the same position in that container (so
 * deleting a row lands on the next row's same control), else the container itself if it can take focus.
 * A click on empty space, Esc out of a field and a closing overlay that returns focus itself are left alone.
 * Installed once by ShortcutsProvider.
 */
import * as React from "react"

const FOCUSABLE = "button:not([disabled]), a[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex='-1']), [contenteditable=true]"
const visible = (el: Element) => el.isConnected && (el as HTMLElement).getClientRects().length > 0 && !el.closest("[inert], [hidden], [aria-hidden=true]")
// Tab stops only: a roving tabIndex=-1 control (a grid's row checkbox, a menu item) is not where focus should land.
const focusables = (root: Element) => [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => visible(el) && el.getAttribute("tabindex") !== "-1")

let installs = 0
let teardown: (() => void) | null = null

function install() {
  // Where focus was: the element, its ancestors, and its position among each ancestor's focusable controls.
  // Positions are read for the nearest few containers only (cheap on every focus move, even in big grids);
  // farther ones fall back to their first control.
  let last: { el: Element; chain: { box: Element; index: number }[] } | null = null
  // Recent focus, newest last, to find the way back when a whole view is swapped (an editor closes back to its list).
  const trail: Element[] = []
  // The same control after a re-render: same id, else the one element with the same tag and label (or link).
  const twinOf = (was: Element): HTMLElement | null => {
    if (was.id) { const same = document.getElementById(was.id); if (same && same !== was && visible(same)) return same }
    const label = was.getAttribute("aria-label"), href = was.getAttribute("href")
    const sel = label ? `${was.tagName}[aria-label="${CSS.escape(label)}"]` : href ? `${was.tagName}[href="${CSS.escape(href)}"]` : null
    if (!sel) return null
    const found = [...document.querySelectorAll<HTMLElement>(sel)].filter((x) => x !== was && visible(x))
    return found.length === 1 ? found[0] : null
  }
  const remember = (el: Element) => {
    if (trail[trail.length - 1] !== el) { trail.push(el); if (trail.length > 30) trail.shift() }
    const chain: { box: Element; index: number }[] = []
    let depth = 0
    for (let box = el.parentElement; box && box !== document.body; box = box.parentElement) chain.push({ box, index: depth++ < 6 ? focusables(box).indexOf(el as HTMLElement) : -1 })
    last = { el, chain }
  }
  // Focus inside a floating layer (menu, listbox, popover, dialog) isn't remembered: if the layer's action removes
  // what opened it (Delete in a row's menu), focus should land where that opener was, not where the layer was.
  const LAYER = "[role=menu], [role=listbox], [role=dialog], [role=alertdialog], [data-radix-popper-content-wrapper]"
  // A press on empty page space is a deliberate move away: whatever had focus may now close (an editor saves and
  // unmounts), and focus must not be pulled back to it.
  const onPress = (e: PointerEvent) => { if (e.target instanceof Element && !e.target.closest(FOCUSABLE) && !e.target.closest("label")) last = null }
  const onFocusIn = (e: FocusEvent) => { if (e.target instanceof Element && e.target !== document.body && !e.target.closest(LAYER)) remember(e.target) }
  const rescue = () => {
    const a = document.activeElement
    if (a && a !== document.body) return
    if (!last) return
    // Still there and visible: focus left on purpose (a click on empty space, Esc out of a field), not because the
    // control went away. Forget it, so a later change can't pull focus back.
    if (visible(last.el)) { last = null; return }
    // An open overlay manages its own focus.
    if (document.querySelector("[role=dialog][data-state=open], [role=alertdialog][data-state=open], [role=menu][data-state=open]")) return
    // The same control re-rendered elsewhere (a ticked task moved to another group): focus it, by id or label.
    const match = twinOf(last.el)
    if (match) { last = null; match.focus(); return }
    // The whole view around it went away (nothing survives within a few levels): go back to where you came from,
    // the most recent earlier control that is still, or again, on screen.
    const near = last.chain.findIndex(({ box }) => visible(box))
    if (near < 0 || near > 4) {
      for (let i = trail.length - 1; i >= 0; i--) {
        const el = trail[i]
        if (el === last.el) continue
        const back = visible(el) ? (el as HTMLElement) : twinOf(el)
        if (back && back.matches(FOCUSABLE) && back.getAttribute("tabindex") !== "-1") { last = null; back.focus(); return }
      }
    }
    for (const { box, index } of last.chain) {
      if (!visible(box)) continue
      const preferred = box.querySelector<HTMLElement>("[data-focus-fallback]")
      const target = preferred && visible(preferred) ? (preferred.matches(FOCUSABLE) || preferred.tabIndex >= 0 ? preferred : focusables(preferred)[0]) : null
      const list = focusables(box)
      const pick = target ?? (list.length ? list[Math.max(0, Math.min(index < 0 ? 0 : index, list.length - 1))] : (box as HTMLElement).tabIndex >= -1 && box.hasAttribute("tabindex") ? (box as HTMLElement) : null)
      // Clear first: focusing `pick` records it as the new last, so a later removal can be rescued too.
      if (pick) { last = null; pick.focus(); return }
    }
    last = null
  }
  // Removal shows up as focusout with nowhere to go; React re-renders first, so look a couple of frames later.
  const onFocusOut = (e: FocusEvent) => { if (!e.relatedTarget) requestAnimationFrame(() => requestAnimationFrame(rescue)) }
  // A removed element doesn't always fire focusout (Chrome): also check after DOM changes.
  let queued = false
  const mo = new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => requestAnimationFrame(() => { queued = false; rescue() }))
  })
  document.addEventListener("focusin", onFocusIn, true)
  document.addEventListener("pointerdown", onPress, true)
  document.addEventListener("focusout", onFocusOut, true)
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "inert", "aria-hidden", "style", "class"] })
  return () => {
    document.removeEventListener("focusin", onFocusIn, true)
    document.removeEventListener("pointerdown", onPress, true)
    document.removeEventListener("focusout", onFocusOut, true)
    mo.disconnect()
  }
}

export function useFocusKeeper() {
  React.useEffect(() => {
    if (installs++ === 0) teardown = install()
    return () => { if (--installs === 0) { teardown?.(); teardown = null } }
  }, [])
}
