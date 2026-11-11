# Timestamps

Show when things happened as relative time in lists ("3 hours ago"), the exact date and time on hover and in record details, and always say what the time refers to and who caused it.

Kind: pattern · Group: Patterns: general

**Problem:** "12/03" means different days to different readers, times without a zone mislead remote teams, and a bare date in a column says nothing about whether it is when the listing was posted, edited or closes.

**Solution:** Use the timestamp component everywhere. It renders relative time for past events in lists, absolute time in UK format in details and tooltips, and ISO 8601 in exports and code. Every timestamp has a label of noun and verb, and the person or system that made the change when it matters.

**Built from:** Timestamp, List table, Side panel (drawer), Tooltip, Export menu

## How it works

1. Choose the format by the reader's need: how long ago (relative), exactly when (absolute), or a machine (ISO 8601).
2. Label it with what happened: "Posted", "Last edited", "Applied". In a table the label is the column header.
3. Add the source when it matters: "Edited 6 hours ago by Priya Shah", linked to their profile.
4. Give every relative time its absolute value on hover and focus, and in the accessible name.

## When to use

- Relative: activity feeds, Applied and Last edited columns, the Inbox, "Last updated" after a refresh.
- Absolute: the Details section of a record, audit history, and deadlines such as a listing's closing date.
- ISO 8601: CSV exports, API responses and anything people paste into code.

## When not to use

- Relative time for deadlines. "Closes in 2 weeks" hides the actual day; show "Closes 20 November 2026", with "in 14 days" in muted text if useful.
- Relative time for billing or usage periods; use the unit being counted, such as hours.
- Durations such as time to hire. Show a number and unit ("18 days"), not a timestamp.

## Guidelines

- Relative units: "Just now" under a minute, then minutes, hours, days, weeks, months and years ago, in the largest whole unit.
- Absolute format in the UK: "6 November 2026, 14:32 GMT" (BST in summer). Teammates in other time zones see their own zone, and the zone is always shown.
- Spell months and units in full in details and tooltips: "November", "minutes". Omit the year in tables when it is the current year.
- Relative times refresh about once a minute without announcing each change.
- When the change came from an applied assistant proposal, the source is the person, with "via Assistant": "Edited 2 minutes ago by Priya Shah via Assistant".

## Content

- Labels are noun and verb, with no "date" or "time": "Listing posted", not "Posted date".
- Past tense for things that happened ("Closed"), present or future for things to come ("Closes").
- Add "Last" only for events that repeat: "Last edited", "Last updated".
- In tables where rows start and end at different times, "[noun] [verb] time" is allowed: "Interview start time".

## Accessibility

- Render with <time datetime="2026-11-06T14:32:00Z"> using the ISO value, and the absolute human date in the tooltip and accessible description.
- Don't rely on the title attribute for the absolute time; it is not available to keyboard or touch users. Use TwoUX's tooltip on focus and hover.
- Relative times that update do not sit inside a live region.

## Do

- Do label every timestamp with its event.
- Do show the time zone on every absolute time.
- Do use ISO 8601 in exports.

## Don't

- Don't write numeric dates such as 06/11/2026; they read differently in the UK and US.
- Don't abbreviate units: "5 minutes ago", not "5m ago", outside dense tables.
- Don't show a relative deadline without the date.

## Related

- Empty, loading and error states
- Record detail: side panel, overlay or full page
- Data export
- Timestamp
