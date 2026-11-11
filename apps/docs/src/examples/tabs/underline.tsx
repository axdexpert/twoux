import { Tabs, TabsContent, TabsList, TabsTrigger } from "@twoux/ui";
export const meta = {"title": "Sections of one record", "description": "Underline tabs split one page into sections. Counts help people decide where to go. Arrow keys switch tabs.", "order": 1};

export default function Example() {
	return (
		<Tabs defaultValue="overview" className="w-full max-w-lg">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="candidates" count={54}>Candidates</TabsTrigger>
				<TabsTrigger value="activity">Activity</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="text-ink-2">Views, applies and the funnel for this listing.</TabsContent>
			<TabsContent value="candidates" className="text-ink-2">54 people applied. 16 are shortlisted.</TabsContent>
			<TabsContent value="activity" className="text-ink-2">Edited by Rahul S. 2 days ago.</TabsContent>
		</Tabs>
	);
}
