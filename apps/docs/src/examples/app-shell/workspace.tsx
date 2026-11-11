import type React from "react";
import { AppShell, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, PageHeader, SidebarItem, SidebarSection } from "@twoux/ui";
import { BarChart3, Briefcase, Inbox, Plus, Settings, MessageSquare, Users } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Hiring workspace", description: "Tinted sidebar with a text label on every item, two levels at most, and the current page marked by fill and aria-current. Below 860px the sidebar moves behind the menu button.", order: 1 };

export default function Example() {
	const [page, setPage] = useState("Listings");
	const item = (label: string, icon: React.ReactNode, count?: number) => <SidebarItem key={label} label={label} icon={icon} count={count} current={page === label} onClick={() => setPage(label)} />;
	return (
		<div className="h-120 w-full overflow-hidden rounded-sm border border-line">
			<AppShell
				sidebar={
					<>
						<div className="px-2 pt-1 text-base font-semibold text-ink">TwoUX Hiring</div>
						<SidebarSection>{[item("Inbox", <Inbox />, 4), item("Assistant", <MessageSquare />)]}</SidebarSection>
						<SidebarSection title="Hiring">{[item("Listings", <Briefcase />), item("Candidates", <Users />), item("Reports", <BarChart3 />)]}</SidebarSection>
						<SidebarSection title="Workspace">{[item("Settings", <Settings />)]}</SidebarSection>
					</>
				}
				topBar={
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem><BreadcrumbLink href="#hiring">Hiring</BreadcrumbLink></BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem><BreadcrumbPage>{page}</BreadcrumbPage></BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				}
			>
				<PageHeader title={page} description="24 listings across 6 teams" actions={<><Button variant="outline">Export</Button><Button shortcut="C"><Plus />New listing</Button></>} />
			</AppShell>
		</div>
	);
}
