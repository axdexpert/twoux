import { WhyChoice, toast } from "@twoux/ui";

export const meta = { title: "Why the agent picked this", description: "A Why? link beside the choice. On demand it names the factors, the options that lost and what could not be met, then offers Change this or Keep it.", order: 1 };

export default function Example() {
	return (
		<div className="flex w-full max-w-xl items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2.5 text-base text-ink">
			<span className="min-w-0 flex-1">Interview scheduled for <span className="font-medium">Thursday 14:00</span></span>
			<WhyChoice
				choice="Thursday at 14:00"
				factors={["Everyone invited is free", "It is inside the applicant's availability window", "Room 2 is booked for the full hour"]}
				alternatives={[
					{ name: "Wednesday 10:00", why: "Imogen Hart is out until 11:00" },
					{ name: "Friday 09:30", why: "Falls after the applicant's deadline to reply" },
				]}
				dropped="No slot was free before 12:00, which you asked for."
				onChange={() => toast("Opened the schedule for editing")}
				onKeep={() => toast("Kept Thursday at 14:00")}
			/>
		</div>
	);
}
