import { TextField } from "@twoux/ui";
export default function Thumbnail() {
	return <TextField label="Salary" prefix="£" defaultValue="18,000" error="Enter at least £23,400." className="w-56" />;
}
