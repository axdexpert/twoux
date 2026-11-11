import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@twoux/ui";

export const meta = { title: "Where the page sits", description: "Names match page titles. The current page is the last item, darker and not a link. On narrow screens middle items collapse behind the ellipsis; the trail never wraps.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-xl gap-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem><BreadcrumbLink href="#listings">Listings</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbLink href="#l1040">Junior Product Designer</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbPage>Screening questions</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem><BreadcrumbLink href="#settings">Settings</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbPage>Email templates</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
