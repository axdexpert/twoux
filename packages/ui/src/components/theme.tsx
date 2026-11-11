/**
 * TwoUX composition: light and dark themes. Light is the default; dark and "follow the system" are a choice the person makes.
 * The theme lives on <html data-theme>, so every role token (light-dark() pairs in twoux.css) switches at once, with no provider.
 * The choice is remembered in localStorage. Add THEME_SCRIPT to <head> so the page doesn't flash light before React loads.
 */
import { Monitor, Moon, Sun } from "lucide-react"
import * as React from "react"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export type ThemeChoice = "light" | "dark" | "system"
const KEY = "twoux-theme"
const listeners = new Set<() => void>()

/** Inline in <head>, before the stylesheet: applies the saved theme before the first paint. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${KEY}");if(t==="dark"||t==="system")document.documentElement.dataset.theme=t}catch(e){}`

const read = (): ThemeChoice => {
  if (typeof document === "undefined") return "light"
  const t = document.documentElement.dataset.theme
  return t === "dark" || t === "system" ? t : "light"
}
const prefersDark = () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches

export function setTheme(choice: ThemeChoice) {
  const root = document.documentElement
  if (choice === "light") delete root.dataset.theme
  else root.dataset.theme = choice
  try { if (choice === "light") localStorage.removeItem(KEY); else localStorage.setItem(KEY, choice) } catch { /* private mode: the choice lasts this visit */ }
  listeners.forEach((l) => l())
}

/** The person's choice, and what it resolves to now ("system" follows the OS and updates when it changes). */
export function useTheme() {
  const [choice, setChoice] = React.useState<ThemeChoice>(read)
  const [osDark, setOsDark] = React.useState(prefersDark)
  React.useEffect(() => {
    const sync = () => setChoice(read())
    listeners.add(sync)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onOs = () => setOsDark(mq.matches)
    mq.addEventListener("change", onOs)
    return () => { listeners.delete(sync); mq.removeEventListener("change", onOs) }
  }, [])
  const resolved: "light" | "dark" = choice === "system" ? (osDark ? "dark" : "light") : choice
  return { choice, resolved, setTheme }
}

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match system", icon: Monitor },
] as const

/** Icon button with a menu: Light, Dark, Match system. Put it in the app header or the account menu. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { choice, resolved } = useTheme()
  const Icon = resolved === "dark" ? Moon : Sun
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Theme" className={className}><Icon /></Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={choice} onValueChange={(v) => setTheme(v as ThemeChoice)}>
          {OPTIONS.map(({ value, label, icon: I }) => (
            <DropdownMenuRadioItem key={value} value={value}><I />{label}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
