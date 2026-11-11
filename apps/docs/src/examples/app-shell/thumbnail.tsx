import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, SidebarItem, SidebarSection } from "@twoux/ui";
import { BarChart3, Briefcase, Inbox, Plus } from "lucide-react";

/* AppShell's layout, built from its own markup at a smaller size: the tinted sidebar with real SidebarItems (a count, the
   current page filled), and the surface with the breadcrumb bar and the page title. */
export default function Thumbnail() {
	return (
		<div className="grid h-28 w-64 grid-cols-[116px_minmax(0,1fr)] overflow-hidden rounded-sm border border-line bg-bg" aria-hidden="true">
			<nav aria-label="Main" className="flex flex-col gap-0.5 overflow-hidden px-1.5 py-2 [&_button]:pointer-events-none">
				<SidebarSection>
					<SidebarItem label="Inbox" icon={<Inbox />} count={4} />
					<SidebarItem label="Listings" icon={<Briefcase />} current />
					<SidebarItem label="Reports" icon={<BarChart3 />} />
				</SidebarSection>
			</nav>
			<div className="my-1.5 mr-1.5 flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface">
				<div className="flex h-8 shrink-0 items-center border-b border-line px-2.5">
					<Breadcrumb>
						<BreadcrumbList className="text-sm">
							<BreadcrumbItem>Hiring</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem><BreadcrumbPage>Listings</BreadcrumbPage></BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="flex items-center justify-between gap-2 px-2.5 pt-2.5">
					<span className="truncate text-md font-semibold text-ink">Listings</span>
					<Button size="icon-xs" tabIndex={-1} aria-label="New listing"><Plus /></Button>
				</div>
			</div>
		</div>
	);
}
