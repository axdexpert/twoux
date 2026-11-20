/**
 * TwoUX: keyboard shortcuts that match what the button shows.
 * <ShortcutsProvider> wraps the app once. Button's `shortcut` then both shows the key and presses the button.
 * Single-key shortcuts can be turned off (WCAG 2.1.4): the provider keeps that setting (or takes it controlled, with
 * `enabled` and `onEnabledChange`) and ShortcutSheet's switch changes it; shortcuts with ⌘/Ctrl/⌥ always work.
 * A shortcut fires only when its button is visible and enabled, focus is not in a text field, a menu, a listbox,
 * a select or a grid cell (whose own keys own letters), and no dialog, menu or listbox is open (unless the button is in it).
 * Enter and Space shortcuts never take over a focused control: that control's own Enter or Space wins.
 * The provider also keeps keyboard focus from falling to the page when the focused control is removed (focus-keeper).
 */
import * as React from "react"
import { useFocusKeeper } from "./focus-keeper"

type Ctx = { enabled: boolean; setEnabled: (on: boolean) => void }
const ShortcutsContext = React.createContext<Ctx | null>(null)

export function ShortcutsProvider({ enabled, defaultEnabled = true, onEnabledChange, children }: { enabled?: boolean; defaultEnabled?: boolean; onEnabledChange?: (on: boolean) => void; children: React.ReactNode }) {
  const [own, setOwn] = React.useState(defaultEnabled)
  const on = enabled ?? own
  const change = React.useRef(onEnabledChange)
  change.current = onEnabledChange
  const setEnabled = React.useCallback((v: boolean) => { setOwn(v); change.current?.(v) }, [])
  const value = React.useMemo(() => ({ enabled: on, setEnabled }), [on, setEnabled])
  useFocusKeeper()
  return <ShortcutsContext.Provider value={value}>{children}</ShortcutsContext.Provider>
}

/** Parses "C", "⇧C", "⌘↵", "⌘K", "Esc" into a matcher. */
function parse(shortcut: string) {
  const mods = { meta: false, shift: false, alt: false }
  let key = shortcut
  for (;;) {
    if (key.startsWith("⌘")) { mods.meta = true; key = key.slice(1) }
    else if (key.startsWith("⇧")) { mods.shift = true; key = key.slice(1) }
    else if (key.startsWith("⌥")) { mods.alt = true; key = key.slice(1) }
    else break
  }
  const named: Record<string, string> = { "↵": "Enter", Esc: "Escape", "⌫": "Backspace", "←": "ArrowLeft", "→": "ArrowRight", "↑": "ArrowUp", "↓": "ArrowDown" }
  return { ...mods, key: (named[key] ?? key).toLowerCase(), single: !mods.meta && !mods.alt }
}
const matches = (e: KeyboardEvent, want: ReturnType<typeof parse>) => e.key.toLowerCase() === want.key && (e.metaKey || e.ctrlKey) === want.meta && e.shiftKey === want.shift && e.altKey === want.alt

/** Focus is somewhere whose own keys own letters (or Esc): a text field, select, menu, listbox, grid cell. */
export const isTyping = (el: Element | null) => !!el?.closest("input:not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable=true], [role=combobox], [role=listbox], [role=menu], [role=menubar], [role=gridcell]")

/** An open layer (dialog, menu, listbox) that `el` is not inside: keys belong to that layer. */
export function blockedByLayer(el: Element | null) {
  const layers = document.querySelectorAll("[role=dialog][data-state=open], [role=alertdialog][data-state=open], [role=menu][data-state=open], [role=listbox][data-state=open]")
  return [...layers].some((l) => !el || !l.contains(el))
}
const CONTROL = "button, a[href], input, select, textarea, summary, [role=button], [role=tab], [role=radio], [role=checkbox], [role=switch], [role=menuitem], [role=option], [role=gridcell], [role=row], [role=treeitem], [tabindex]:not([tabindex='-1'])"

/** Whether single-key shortcuts are on. Components with their own single-key keys (zoom, etc.) check this. */
export function useShortcutsEnabled() {
  return React.useContext(ShortcutsContext)?.enabled ?? true
}
/** The single-key setting and its setter, for the switch in ShortcutSheet or a settings page. */
export function useShortcutSettings() {
  const ctx = React.useContext(ShortcutsContext)
  return { enabled: ctx?.enabled ?? true, setEnabled: ctx?.setEnabled ?? (() => {}) }
}

/** Presses `ref` when `shortcut` is typed. Used by Button; usable for any element. */
export function useShortcut(shortcut: string | undefined, ref: React.RefObject<HTMLElement | null>, disabled = false) {
  const ctx = React.useContext(ShortcutsContext)
  React.useEffect(() => {
    if (!shortcut || !ctx || disabled) return
    const want = parse(shortcut)
    if (want.single && !ctx.enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || !matches(e, want)) return
      const active = document.activeElement
      if (want.single && isTyping(active)) return
      const el = ref.current
      if (!el || !el.isConnected || el.offsetParent === null || el.closest("[inert]") || (el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true") return
      if (blockedByLayer(el)) return
      // A form's submit shortcut (⌘↵) submits that form: from a text field in another form or none, it does nothing.
      const form = (el as HTMLButtonElement).form
      if (form && isTyping(active) && !form.contains(active)) return
      // Enter or Space on a focused control is that control's: don't press a different button instead.
      if (want.single && (want.key === "enter" || want.key === " ") && active && active !== el && active !== document.body && active.closest(CONTROL)) return
      e.preventDefault()
      // From nowhere, focus the button first, so whatever it opens can hand focus back to it.
      if (!active || active === document.body) el.focus({ preventScroll: true })
      el.click()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [shortcut, ctx, disabled, ref])
}

/**
 * A page-level key that isn't a button, such as ⌘Z for Undo or Esc to stop a running agent, with the same rules as
 * Button shortcuts: it never fires while typing (for single keys and Esc), behind an open dialog, menu or listbox,
 * on a repeat, or when something closer already handled the key. `when` turns it off, e.g. while nothing is running.
 */
export function useHotkey(shortcut: string, handler: (e: KeyboardEvent) => void, { when = true, allowInFields = false, within }: { when?: boolean; allowInFields?: boolean; /** Only while focus is inside this element, such as a region with its own Retry key. */ within?: React.RefObject<HTMLElement | null> } = {}) {
  const ctx = React.useContext(ShortcutsContext)
  const fn = React.useRef(handler)
  fn.current = handler
  React.useEffect(() => {
    if (!when) return
    const want = parse(shortcut)
    const singleOff = want.single && want.key !== "escape" && ctx && !ctx.enabled
    if (singleOff) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || !matches(e, want)) return
      const t = e.target instanceof Element ? e.target : document.activeElement
      if (within && !(within.current && t && within.current.contains(t))) return
      if (!allowInFields && (want.single || want.key === "z") && isTyping(t)) return
      if (blockedByLayer(null)) return
      if (want.key === "escape" && t?.closest("[aria-expanded=true]")) return
      e.preventDefault()
      fn.current(e)
    }
    // Esc listens in the capture phase so a page-level Esc (stop the agent) runs before a panel's own Esc closes it;
    // fields and open popups are skipped above, so their Esc still reaches them.
    const capture = want.key === "escape"
    document.addEventListener("keydown", onKey, capture)
    return () => document.removeEventListener("keydown", onKey, capture)
  }, [shortcut, when, allowInFields, ctx, within])
}
