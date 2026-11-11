import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@twoux/ui";

/* The real Breadcrumb: links, separators and the current page last. */
export default function Thumbnail() {
	return (
		<Breadcrumb aria-hidden="true">
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink tabIndex={-1}>Listings</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbLink tabIndex={-1}>Designer</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbPage>Questions</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
