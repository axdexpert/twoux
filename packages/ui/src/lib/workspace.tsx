import * as React from "react"

/**
 * Workspace density (see Content density): set by AppShell frame="flush" for tool pages that keep several regions in view.
 * Components read it to drop their own chrome and gaps, never their sizes: ChartFrame goes flush, PageHeader tightens
 * its padding. Text, controls, rows and targets stay the same.
 */
export const WorkspaceContext = React.createContext(false)
/** True inside AppShell frame="flush". */
export const useWorkspace = () => React.useContext(WorkspaceContext)
