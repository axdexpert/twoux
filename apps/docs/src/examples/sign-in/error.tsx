import { SignInOptions } from "@twoux/ui";

export const meta = { title: "Say what to do next", description: "The error sits under the field and names the way in. It does not say which part was wrong.", order: 2 };

export default function Example() {
	return (
		<div className="w-full max-w-sm">
			<SignInOptions
				providers={["google"]}
				error="This email signs in with Google. Continue with Google instead."
				onProvider={() => {}}
				onEmail={() => {}}
			/>
		</div>
	);
}
