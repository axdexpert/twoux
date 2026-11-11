import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@twoux/ui";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
export const meta = {"title": "Options with a check", "description": "Radio items for one choice, checkbox items for several. The menu stays a menu: it does not replace a form.", "order": 2};

export default function Example() {
	const [sort, setSort] = useState("posted");
	const [cols, setCols] = useState({ salary: true, owner: false });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild><Button variant="outline">Display<ChevronDown /></Button></DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Sort by</DropdownMenuLabel>
				<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
					<DropdownMenuRadioItem value="posted">Posted date</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="applies">Applies</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Columns</DropdownMenuLabel>
				<DropdownMenuCheckboxItem checked={cols.salary} onCheckedChange={(v) => setCols({ ...cols, salary: v })}>Salary</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked={cols.owner} onCheckedChange={(v) => setCols({ ...cols, owner: v })}>Owner</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
