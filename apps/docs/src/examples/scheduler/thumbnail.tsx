import { Scheduler } from "@twoux/ui";
import { INTERVIEWERS, INTERVIEWS, NOW } from "./data";

/* The real Scheduler in week view, drawn at half size: day columns, interviewer stripes and the now line. */
export default function Thumbnail() {
	return (
		<div className="h-40 w-64 overflow-hidden select-none" inert>
			<div className="w-lg origin-top-left scale-50">
				<Scheduler
					aria-label="Example"
					events={INTERVIEWS}
					resources={INTERVIEWERS}
					view="week"
					onViewChange={() => {}}
					date={NOW}
					onDateChange={() => {}}
					now={NOW}
					workWeek
					layout="grid"
					dayStart={9}
					dayEnd={15}
					height={320}
				/>
			</div>
		</div>
	);
}
