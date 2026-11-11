import { AppShell, SidebarItem, SidebarSection, useSidebarRail } from "@twoux/ui";
import { type ComponentProps, createContext, type ReactNode, useContext, useEffect, useState } from "react";

const KEY = "twoux.examples.rail";
const ExpandCtx = createContext<() => void>(() => {});

/** AppShell for the example apps: the sidebar starts as a rail so the work gets the width, and the choice (⌘B or the
 *  Collapse sidebar button) is kept across every example app in this browser. A real app saves it per person on the server. */
export function ExampleShell(props: ComponentProps<typeof AppShell>) {
	const [rail, setRail] = useState(() => {
		try {
			return window.localStorage.getItem(KEY) !== "false";
		} catch {
			return true;
		}
	});
	useEffect(() => {
		try { window.localStorage.setItem(KEY, String(rail)); } catch { /* storage blocked: keep it for this visit */ }
	}, [rail]);
	return (
		<ExpandCtx.Provider value={() => setRail(false)}>
			<AppShell sidebarRail={rail} onSidebarRailChange={setRail} {...props} />
		</ExpandCtx.Provider>
	);
}

/** Sidebar content that only fits the full width (a switcher, a checklist, a meter). In the rail it becomes one icon item
 *  whose name carries the status, and choosing it expands the sidebar; without an icon it is left out of the rail. */
export function RailSwap({ icon, label, children }: { icon?: ReactNode; label?: string; children: ReactNode }) {
	const rail = useSidebarRail();
	const expand = useContext(ExpandCtx);
	if (!rail) return <>{children}</>;
	if (!icon || !label) return null;
	return (
		<SidebarSection>
			<SidebarItem icon={icon} label={label} onClick={expand} />
		</SidebarSection>
	);
}
