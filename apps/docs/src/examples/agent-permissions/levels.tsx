import { AgentPermissions, type Permission } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Off, Ask first or Allow", description: "Reading defaults to Allow, changes to Ask first, anything that reaches people outside the workspace to Off. Decisions about candidates can never be set to Allow.", order: 1 };

export default function Example() {
	const [items, setItems] = useState<Permission[]>([
		{ id: "r1", group: "Read", action: "Read listings and applicants", covers: "Titles, descriptions, stages and counts", level: "allow" },
		{ id: "r2", group: "Read", action: "Read team files", covers: "Salary bands and the hiring handbook", level: "allow" },
		{ id: "c1", group: "Change", action: "Edit listings", covers: "Titles, descriptions, closing dates", level: "ask" },
		{ id: "c2", group: "Change", action: "Move candidates between stages", covers: "Screen, interview, offer, reject", level: "ask", neverAllow: true },
		{ id: "c3", group: "Change", action: "Email candidates", covers: "Sends from your address", level: "off" },
	]);
	return <div className="w-full max-w-2xl"><AgentPermissions items={items} onChange={(id, level) => setItems((x) => x.map((p) => (p.id === id ? { ...p, level } : p)))} /></div>;
}
