/**
 * TwoUX composition: SplitButton, built on the generated shadcn ButtonGroup, Button and DropdownMenu.
 * The main part runs the most common action with its label ("Import data"); the chevron part opens the related
 * variants ("Import all", "Import selection") and has its own name ("More import options").
 */
import { ChevronDown } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { ButtonGroup, ButtonGroupSeparator } from "./button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"

export function SplitButton({
  children,
  onClick,
  menuLabel,
  menu,
  variant = "outline",
  size = "sm",
  disabled,
  loading,
  shortcut,
  align = "end",
  className,
}: {
  /** The main action's label, with an optional leading icon. */
  children: React.ReactNode
  onClick: () => void
  /** Names the chevron part, e.g. "More import options". */
  menuLabel: string
  /** DropdownMenuItem children: the variants of the main action. Repeat the main action first so the menu is complete. */
  menu: React.ReactNode
  variant?: "default" | "outline" | "secondary"
  size?: "xs" | "sm" | "default"
  disabled?: boolean
  loading?: boolean
  shortcut?: string
  align?: "start" | "end"
  className?: string
}) {
  const icon = size === "xs" ? "icon-xs" : size === "sm" ? "icon-sm" : "icon"
  return (
    <ButtonGroup data-slot="split-button" data-variant={variant} className={className}>
      <Button variant={variant} size={size} onClick={onClick} disabled={disabled} loading={loading} shortcut={shortcut}>
        {children}
      </Button>
      {variant !== "outline" && <ButtonGroupSeparator />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={icon} aria-label={menuLabel} disabled={disabled} className={cn(size === "xs" ? "w-5" : "w-6")}>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-48">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
