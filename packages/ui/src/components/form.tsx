/**
 * TwoUX: a form that behaves the same everywhere. Enter in a field submits it (a submit button inside it is the
 * default action), the browser's own validation bubbles are off (fields show TwoUX errors instead), and when a
 * submit leaves any field invalid, focus moves to the first one, so its error is read out and can be fixed
 * straight away (WCAG 3.3.1). Mark invalid fields with aria-invalid (Input, Textarea and TextField do).
 */
import * as React from "react"

export function Form({ onSubmit, noValidate = true, ref, ...props }: Omit<React.ComponentProps<"form">, "onSubmit"> & { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  const own = React.useRef<HTMLFormElement | null>(null)
  const setRef = (el: HTMLFormElement | null) => {
    own.current = el
    if (typeof ref === "function") ref(el)
    else if (ref) ref.current = el
  }
  return (
    <form
      ref={setRef}
      noValidate={noValidate}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(e)
        // Errors render on the next frames; then focus the first invalid field unless focus is already in one.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const form = own.current
          const bad = form?.querySelector<HTMLElement>("[aria-invalid=true]")
          if (!form || !bad || document.activeElement?.closest("[aria-invalid=true]")) return
          bad.focus()
        }))
      }}
      {...props}
    />
  )
}
