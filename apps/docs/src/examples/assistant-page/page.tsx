import { AssistantMessage, AssistantPage, Citation, MessageComposer, SourcesList, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, UserMessage } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "The conversation as a full page", description: "A centred reading column with Answer and Records tabs, and a Sources panel listing every record the answer used. Selecting a citation highlights its source.", order: 1 };

const SOURCES = [{ id: "LST-1041", title: "Frontend Engineer", detail: "Manchester · 6 applicants" }, { id: "LST-1044", title: "Customer Success Lead", detail: "Bristol · 3 applicants" }];

export default function Example() {
	const [active, setActive] = useState<string>();
	return (
		<div className="h-120 w-full overflow-auto rounded-sm border border-line bg-surface">
			<AssistantPage
				thread={
					<>
						<UserMessage>Which listings close this week with fewer than 10 applicants?</UserMessage>
						<AssistantMessage from="24 listings">
							<p><strong>2 listings</strong>: Frontend Engineer <Citation id="LST-1041" active={active === "LST-1041"} onOpen={setActive} /> and Customer Success Lead <Citation id="LST-1044" active={active === "LST-1044"} onOpen={setActive} />.</p>
						</AssistantMessage>
					</>
				}
				records={<Table aria-label="Records used"><TableHeader><TableRow><TableHead>Listing</TableHead><TableHead className="text-right">Applicants</TableHead></TableRow></TableHeader><TableBody>{SOURCES.map((s) => <TableRow key={s.id}><TableCell>{s.title}</TableCell><TableCell className="tabular text-right">{s.detail?.split("· ")[1]}</TableCell></TableRow>)}</TableBody></Table>}
				sources={<SourcesList sources={SOURCES} active={active} onSelect={setActive} />}
				composer={<MessageComposer noun={{ one: "listing", many: "listings" }} onSend={() => {}} placeholder="Ask a follow-up" />}
			/>
		</div>
	);
}
