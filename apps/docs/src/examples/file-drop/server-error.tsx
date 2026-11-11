import { FileDrop } from "@twoux/ui";

export const meta = { title: "An error from the server", description: "The message names what is wrong with the file and what to choose instead.", order: 2 };

export default function Example() {
	return (
		<div className="w-full max-w-md">
			<FileDrop
				id="hiring-csv"
				label="Candidates file"
				accept="text/csv"
				hint="CSV, up to 5 MB"
				error="Row 14 has no email address. Add one and choose the file again."
				onFile={() => {}}
			/>
		</div>
	);
}
