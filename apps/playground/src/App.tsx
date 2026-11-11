import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, toast } from "@twoux/ui";
import { Copy, Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";
import { LISTINGS } from "./data";

const STATUS = { Open: "success", "Closing soon": "warning", Draft: "secondary", Closed: "secondary" } as const;

export function App() {
	return (
		<div className="min-h-screen bg-bg p-6">
			<div className="mx-auto grid max-w-5xl gap-4">
				<header className="flex items-center justify-between">
					<div>
						<h1 className="text-xl font-semibold text-ink">Listings</h1>
						<p className="text-base text-ink-2">{LISTINGS.length} listings across 6 teams</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline">Export</Button>
						<Button shortcut="C" onClick={() => toast.success("Draft listing created")}>
							<Plus />
							New listing
						</Button>
					</div>
				</header>
				<div className="overflow-hidden rounded-sm border border-line bg-surface">
					<Table aria-label="Listings">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>Role</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Applicants</TableHead>
								<TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{LISTINGS.map((l) => (
								<TableRow key={l.id}>
									<TableCell className="font-medium text-ink">{l.role}</TableCell>
									<TableCell className="text-ink-2">{l.location}</TableCell>
									<TableCell><Badge variant={STATUS[l.status]} dot>{l.status}</Badge></TableCell>
									<TableCell className="tabular text-right">{l.applicants}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${l.role}`}><Ellipsis /></Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem><Pencil />Edit</DropdownMenuItem>
												<DropdownMenuItem><Copy />Duplicate</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem variant="destructive"><Trash2 />Close listing</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
