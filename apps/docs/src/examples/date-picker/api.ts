export const install = "";
export const api = [
	{ component: "DatePicker", props: [
		{ name: "label", type: "string", description: "Always visible. Also used in the typing error: \"Enter the closing date as dd/mm/yyyy…\"." },
		{ name: "value · onValueChange", type: "string | null · (value) => void", description: "An ISO calendar date, \"2026-03-12\". null when empty or when the typed text isn't a date." },
		{ name: "min · max", type: "string", description: "Earliest and latest ISO dates people can choose. Typed dates outside them get an error naming the limit." },
		{ name: "isDateUnavailable · unavailableReason", type: "(iso) => boolean · string", description: "Other dates people can't choose, and the one sentence under the calendar that says why." },
		{ name: "hint · error", type: "string", default: "\"dd/mm/yyyy\"", description: "Hint under the field; error from the form's own checks. Typing errors are shown without it." },
		{ name: "required · optional · disabled · readOnly", type: "boolean", description: "readOnly shows the date as selectable text without the calendar button." },
		{ name: "name", type: "string", description: "Submitted with the form as the ISO date." },
	] },
	{ component: "DateRangePicker", props: [
		{ name: "value · onValueChange", type: "{ from?, to?, preset? } · (value) => void", description: "ISO dates, or a preset id that is worked out from today each time it is read." },
		{ name: "presets", type: "DatePreset[] | true", description: "Preset periods beside the calendar. true uses DATE_PRESETS: Last 7 days, Last 30 days, This month, Last month, This quarter, Last quarter." },
		{ name: "maxDays", type: "number", description: "Longest range, counting both ends." },
		{ name: "min · max · isDateUnavailable · unavailableReason · hint · error", type: "", description: "As on DatePicker." },
	] },
	{ component: "DateFilterPill", props: [
		{ name: "field · value · onChange · onRemove", type: "string · DateRangeValue · (value) => void · () => void", description: "A filter pill for a date field, in a FilterBar beside FilterPill: \"Applied is in Last 30 days\". Dashed while empty." },
		{ name: "presets", type: "DatePreset[]", default: "DATE_PRESETS", description: "[] shows the typed dates and calendar only, for fields such as a closing date where \"last 30 days\" means little." },
		{ name: "maxDays · min · max · isDateUnavailable · unavailableReason", type: "", description: "As on DateRangePicker; errors show inside the popover." },
	] },
	{ component: "Calendar (shadcn)", props: [{ name: "...props", type: "DayPicker props", description: "The generated shadcn calendar: en-GB, weeks start on Monday. Use it inside your own layouts; use DatePicker for a field." }] },
	{ component: "Helpers", props: [
		{ name: "parseDate(text)", type: "string | null", description: "Reads 12/03/2026, 12/3/26, 12 Mar 2026 and 2026-03-12." },
		{ name: "resolveDateRange(value, presets?, today?)", type: "{ from, to }", description: "The dates a range value stands for today. Use it to query data for a preset." },
		{ name: "dateFilterToValues(value) · dateFilterFromValues(values)", type: "string[] · DateRangeValue", description: "A date filter as URL-safe strings for FilterValue and the address bar: [\"last-30-days\"] or [\"2026-10-01\", \"2026-10-31\"]. Reading back drops anything that isn't a preset or an ISO date." },
		{ name: "describeDateFilter(value)", type: "{ operator, text, spoken } | null", description: "\"is in\" Last 30 days, \"is between\" 3 Oct – 12 Oct 2026, \"is on or after\" 3 Oct 2026." },
		{ name: "formatDateInput · formatDateLong · fromIsoDate", type: "function", description: "12/03/2026 · 12 March 2026 · a local Date at midnight." },
	] },
];
