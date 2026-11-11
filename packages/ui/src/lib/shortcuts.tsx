/**
 * TwoUX: keyboard shortcuts that match what the button shows.
 * <ShortcutsProvider enabled={setting}> wraps the app once. Button's `shortcut` then both shows the key
 * and presses the button. Single-key shortcuts obey `enabled`, so people can turn them off (WCAG 2.1.4);
 * shortcuts with ⌘/Ctrl/⌥ always work.
 * A shortcut fires only when its button is visible and enabled, focus is not in a text field,
 * and no dialog is open (unless the button is inside that dialog).
 */
import * as React from "react"

type Ctx = { enabled: boolean }
const ShortcutsContext = React.createContext<Ctx | null>(null)

export function ShortcutsProvider({ enabled = true, children }: { enabled?: boolean; children: React.ReactNode }) {
  const value = React.useMemo(() => ({ enabled }), [enabled])
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

const isTyping = (el: Element | null) => !!el?.closest("input:not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable=true]")

/** Presses `ref` when `shortcut` is typed. Used by Button; usable for any element. */
/** Whether single-key shortcuts are on. Components with their own single-key keys (zoom, etc.) check this. */
export function useShortcutsEnabled() {
  return React.useContext(ShortcutsContext)?.enabled ?? true
}

export function useShortcut(shortcut: string | undefined, ref: React.RefObject<HTMLElement | null>, disabled = false) {
  const ctx = React.useContext(ShortcutsContext)
  React.useEffect(() => {
    if (!shortcut || !ctx || disabled) return
    const want = parse(shortcut)
    if (want.single && !ctx.enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat) return
      if (e.key.toLowerCase() !== want.key || (e.metaKey || e.ctrlKey) !== want.meta || e.shiftKey !== want.shift || e.altKey !== want.alt) return
      if (want.single && isTyping(document.activeElement)) return
      const el = ref.current
      if (!el || !el.isConnected || el.offsetParent === null || el.closest("[inert]") || (el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true") return
      const dialog = document.querySelector("[role=dialog][data-state=open], [role=alertdialog][data-state=open]")
      if (dialog && !dialog.contains(el)) return
      e.preventDefault()
      el.click()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [shortcut, ctx, disabled, ref])
}
