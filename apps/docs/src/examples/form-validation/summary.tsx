import { Button, ErrorSummary, TextField } from "@twoux/ui";
import { useState } from "react";
export const meta = {"title": "Validate on submit, then summarise", "description": "Press Publish. On submit, each field shows its own error and the summary at the top counts the problems and links to each field.", "order": 1};

export default function Example() {
	const [title, setTitle] = useState("");
	const [salary, setSalary] = useState("18000");
	const [sent, setSent] = useState(false);
	const errs = [
		!title.trim() && { field: "Job title", message: "Enter a job title.", href: "#fv-title" },
		Number(salary.replace(/\D/g, "")) < 23400 && { field: "Salary", message: "Enter at least £23,400.", href: "#fv-salary" },
	].filter(Boolean) as { field: string; message: string; href: string }[];
	const show = sent ? errs : [];
	return (
		<form className="grid w-96 gap-4" noValidate onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
			<ErrorSummary errors={show} />
			<TextField id="fv-title" label="Job title" required error={show.find((e) => e.field === "Job title")?.message} value={title} onChange={(e) => setTitle(e.target.value)} />
			<TextField id="fv-salary" label="Salary" required hint="Per year, before tax." error={show.find((e) => e.field === "Salary")?.message} prefix="£" value={salary} onChange={(e) => setSalary(e.target.value)} inputMode="numeric" />
			<div><Button type="submit" variant="default">Publish listing</Button></div>
		</form>
	);
}
