import { Combobox } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Several values", description: "Ticking keeps the list open. Up to three skills show in the field, then +N more; the footer counts them against the limit.", order: 2 };

const SKILLS = ["Airflow", "AWS", "Azure", "dbt", "Docker", "Excel", "Figma", "GCP", "Go", "Java", "Kotlin", "Kubernetes", "Looker", "Power BI", "Python", "R", "React", "Rust", "Scala", "Snowflake", "Spark", "SQL", "Tableau", "Terraform", "TypeScript"].map((s) => ({ value: s, label: s }));

export default function Example() {
	const [value, setValue] = useState<string[]>(["Python", "SQL", "dbt", "Airflow"]);
	return (
		<div className="w-80">
			<Combobox multiple label="Skills" noun={{ one: "skill", many: "skills" }} options={SKILLS} value={value} onValueChange={setValue} max={8} hint="Shown on the listing and used to match candidates." />
		</div>
	);
}
