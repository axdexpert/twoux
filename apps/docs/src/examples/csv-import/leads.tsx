import { Button, CsvImport, type MappingTarget, toast } from "@twoux/ui";
import { FileUp } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Import event leads", description: "Use the sample file or choose your own CSV. The summary says what happens to rows with problems before anything is imported, and the button states how many rows will be added.", order: 1 };

const TARGETS: MappingTarget[] = [
	{ id: "name", label: "Name", kind: "text", required: true },
	{ id: "email", label: "Work email", kind: "email" },
	{ id: "company", label: "Company", kind: "text" },
	{ id: "size", label: "Company size", kind: "number" },
];
const SAMPLE = {
	name: "leads.csv",
	text: "Full name,E-mail,Company,Headcount,Country\nMaya Fischer,maya.fischer@larkfield.energy,Larkfield Energy,3100,UK\nRuairi Doyle,ruairi.doyle@pennine,Pennine Freight,1200,Ireland\nSana Iqbal,sana.iqbal@mosaiclending.co.uk,Mosaic Lending,410,UK\n,info@copperleaf.co.uk,Copperleaf Foods,780,UK\nTheo Clarke,theo.clarke@orrin.dev,Orrin Software,about 130,UK\nGrace Ndlovu,grace.ndlovu@harbourvale.co.uk,Harbour & Vale,240,UK",
};

export default function Example() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}><FileUp />Import CSV</Button>
			<CsvImport open={open} onOpenChange={setOpen} targets={TARGETS} tableName="People" sample={SAMPLE} aliases={{ email: ["e-mail"], size: ["headcount"] }} onImport={(r) => toast.success(`Imported ${r.rows.length} rows${r.skipped ? `, skipped ${r.skipped}` : ""}`)} />
		</>
	);
}
