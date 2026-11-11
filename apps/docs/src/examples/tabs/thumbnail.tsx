import { Tabs, TabsList, TabsTrigger } from "@twoux/ui";
export default function Thumbnail() {
	return (
		<Tabs defaultValue="a">
			<TabsList><TabsTrigger value="a">Overview</TabsTrigger><TabsTrigger value="b" count={54}>Candidates</TabsTrigger></TabsList>
		</Tabs>
	);
}
