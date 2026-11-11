/**
 * The README banner: the TwoUX wordmark among real TwoUX components, at 1200×630 CSS pixels.
 * Open the playground with ?page=banner and screenshot at device scale 2 for a 2400×1260 image
 * (node scripts/banner.mjs does both). Every card is a live component, not a picture of one.
 */
import {
	AiOrigin,
	Badge,
	BulkActionBar,
	Checkbox,
	CodeBlock,
	CodeBlockContent,
	CodeBlockHeader,
	CodeBlockTitle,
	MessageComposer,
	StatCompare,
	SuggestedChanges,
	SwitchField,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@twoux/ui";
import { CalendarPlus, Copy, SquareTerminal } from "lucide-react";
import { TwoUXLogo } from "../../../docs/src/components/twoux-logo";

const noop = () => {};

const ROWS = [
	{ role: "Senior Product Designer", location: "Leeds", status: "Open", variant: "success", selected: true },
	{ role: "Data Analyst", location: "Glasgow", status: "Closing soon", variant: "warning", selected: false },
	{ role: "QA Engineer", location: "Bristol", status: "Open", variant: "success", selected: true },
	{ role: "Recruitment Coordinator", location: "Leeds", status: "Draft", variant: "secondary", selected: false },
] as const;

const FIND = `$ npx twoux find "confirm a permanent delete"

Erase a candidate's data on request
  Use: Deleting records
  How: confirmation dialog, typed name`;

function Tile({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return <div className={`overflow-hidden rounded-md border border-line bg-surface shadow-card ${className}`}>{children}</div>;
}

export function Banner() {
	return (
		<div className="relative h-157.5 w-300 overflow-hidden bg-linear-to-br from-primary-soft via-bg to-surface-2">
			{/* Top row: cut off by the top edge. */}
			<div className="absolute inset-x-12 -top-10 grid grid-cols-3 items-end gap-8">
				<Tile className="grid gap-4 p-5">
					<p className="text-lg font-semibold text-ink">Keyboard</p>
					<SwitchField id="b-keys" label="Single-key shortcuts" defaultChecked />
					<SwitchField id="b-hints" label="Show shortcut hints" defaultChecked />
					<SwitchField id="b-motion" label="Reduce motion" />
				</Tile>
				<Tile className="p-5">
					<StatCompare label="Applications this month" value="595" change="+12%" period="October" good spark={[42, 48, 51, 47, 55, 60, 58, 66]} />
				</Tile>
				<div className="grid gap-4">
					<CodeBlock>
						<CodeBlockHeader>
							<CodeBlockTitle icon={<SquareTerminal />}>Terminal</CodeBlockTitle>
						</CodeBlockHeader>
						<CodeBlockContent code={FIND} className="py-3" />
					</CodeBlock>
					<div className="flex items-center gap-2">
						<Badge variant="success" dot>Live</Badge>
						<Badge variant="warning" dot>Needs you</Badge>
						<Badge variant="secondary" dot>Draft</Badge>
					</div>
				</div>
			</div>

			{/* The wordmark. */}
			<div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
				<TwoUXLogo className="h-28" />
				<p className="text-lg text-ink-2">The engineering-first design system for complex apps.</p>
			</div>

			{/* Bottom row: cut off by the bottom edge. */}
			<div className="absolute inset-x-12 -bottom-24 grid grid-cols-3 items-start gap-8">
				<Tile>
					<BulkActionBar count={2} noun="listings" onClear={noop} actions={[
						{ label: "Extend", icon: <CalendarPlus />, shortcut: "T", onSelect: noop },
						{ label: "Duplicate", icon: <Copy />, shortcut: "D", onSelect: noop },
					]} />
					<Table aria-label="Listings">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="w-9"><Checkbox aria-label="Select all" checked="indeterminate" /></TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{ROWS.map((r) => (
								<TableRow key={r.role} data-state={r.selected ? "selected" : undefined}>
									<TableCell><Checkbox checked={r.selected} aria-label={`Select ${r.role}`} /></TableCell>
									<TableCell className="font-medium text-ink">{r.role}</TableCell>
									<TableCell><Badge variant={r.variant} dot>{r.status}</Badge></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Tile>
				<div className="grid gap-4">
					<Tile className="p-1">
						<MessageComposer noun={{ one: "listing", many: "listings" }} chips={[{ id: "sel", label: "2 selected listings" }]} onSend={noop} />
					</Tile>
					<Tile className="grid gap-2 p-4">
						<AiOrigin from="2 listings and the 2026 salary bands" />
						<p className="text-base text-ink">Both listings are missing a salary range. I can add one from the current bands.</p>
					</Tile>
				</div>
				<Tile>
					<SuggestedChanges
						changes={[
							{ id: "1", label: "Add salary range", detail: "LST-1041", after: "£48,000 to £56,000" },
							{ id: "2", label: "Extend closing date", detail: "LST-1043", before: "21 Nov", after: "21 Dec" },
						]}
						onApply={noop}
						onDismiss={noop}
					/>
				</Tile>
			</div>
		</div>
	);
}
