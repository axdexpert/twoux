import { DropdownMenuItem, DropdownMenuSeparator, SplitButton, toast } from "@twoux/ui";
import { FileSpreadsheet, Upload } from "lucide-react";

export const meta = { title: "Import data", description: "The main part runs the usual action. The chevron, named “More import options”, opens its variants; Import selection is disabled until rows are selected.", order: 1 };

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<SplitButton
				onClick={() => toast("Choose a CSV or Excel file to import")}
				menuLabel="More import options"
				menu={
					<>
						<DropdownMenuItem onSelect={() => toast("Importing all rows from the file")}>Import all</DropdownMenuItem>
						<DropdownMenuItem disabled>Import selection</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => toast("Downloaded the import template")}><FileSpreadsheet />Download template</DropdownMenuItem>
					</>
				}
			>
				<Upload />Import data
			</SplitButton>
			<SplitButton
				variant="default"
				onClick={() => toast.success("Published 12 products")}
				menuLabel="More publish options"
				menu={
					<>
						<DropdownMenuItem onSelect={() => toast.success("Published 12 products")}>Publish now</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => toast("Scheduled for 9:00 tomorrow")}>Schedule for tomorrow</DropdownMenuItem>
					</>
				}
			>
				Publish 12 products
			</SplitButton>
		</div>
	);
}
