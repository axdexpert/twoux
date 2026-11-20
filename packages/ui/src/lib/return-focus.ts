// Recent focus, newest last, so an overlay can hand focus back to what had it before it opened, even when it
// opened from state or a shortcut, or a field inside it took focus with autoFocus (Radix then skips its open event).
const history: Element[] = []
if (typeof document !== "undefined") {
  document.addEventListener("focusin", (e) => {
    const t = e.target as Element
    if (history[history.length - 1] === t) return
    history.push(t)
    if (history.length > 30) history.shift()
  }, true)
}

/**
 * TwoUX: focus goes back where it was when an overlay closes. Radix returns focus to a Trigger only, so a dialog
 * opened from state, a shortcut or a menu item would drop focus to the page. Pass the returned handler to Content.
 */
export function useReturnFocus<E extends Event>(props: { onCloseAutoFocus?: (e: E) => void }) {
  return {
    onCloseAutoFocus: (e: E) => {
      props.onCloseAutoFocus?.(e)
      if (e.defaultPrevented) return
      const box = e.currentTarget as Element | null
      for (let i = history.length - 1; i >= 0; i--) {
        const el = history[i]
        if (!(el instanceof HTMLElement) || el === document.body || box?.contains(el) || el.closest("[role=dialog], [role=alertdialog], [role=menu]")) continue
        if (!el.isConnected || !el.getClientRects().length || el.matches(":disabled, [aria-disabled=true]")) continue
        e.preventDefault()
        el.focus({ preventScroll: true })
        if (document.activeElement === el) return
      }
    },
  }
}
