import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FieldSeparator, TextField } from "@twoux/ui";

export const meta = { title: "Sign in, with a footer band", description: "The band holds one secondary line, apart from the main action. The labelled separator divides the two ways in.", order: 2 };

export default function Example() {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="text-center">
				<CardTitle>Sign in to TwoUX Hiring</CardTitle>
				<CardDescription>Welcome back. Sign in to continue.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Button variant="outline" className="w-full">Continue with Google</Button>
				<FieldSeparator>or</FieldSeparator>
				<TextField id="signin-email" label="Work email" type="email" placeholder="name@company.co.uk" />
				<Button className="w-full">Continue</Button>
			</CardContent>
			<CardFooter band>
				Don't have an account?&nbsp;<a href="#signup" className="font-medium text-primary-ink hover:underline">Sign up</a>
			</CardFooter>
		</Card>
	);
}
