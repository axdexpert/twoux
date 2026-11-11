# Regenerating an answer

Regenerate reruns the same question with the same context and replaces the latest answer, keeping the earlier version one step away. It never touches changes already applied.

Kind: pattern · Group: Patterns: AI

**Problem:** The first answer sometimes takes the wrong angle: too long, the wrong listings, the wrong period. Typing "try again" sends a new message, so the thread fills with near-duplicates and the assistant reads the bad answer as context.

**Solution:** Put a Regenerate button in the answer actions of the latest answer. It reruns the original question with the same context chips and settings, and the new answer takes the old one's place with a "2 / 2" switch to go back. It works the same after a finished answer and after Stop.

**Built from:** Answer actions, Assistant side panel, Message composer, Thinking and steps, Suggested changes, AI origin label

## How it works

1. While the assistant works, the send button becomes Stop. Stop acts at once and keeps what was written so far, marked "Stopped".
2. Under the latest answer, finished or stopped, show Regenerate in the answer actions next to Copy and feedback.
3. Regenerate sends the same question with the same context chips, team files and Quick or Thorough setting. Nothing new is typed into the thread.
4. The new answer replaces the old one in place. A "2 / 2" control under it switches between versions; the thread continues from the version on screen.
5. If regenerating fails, keep the earlier version on screen and show the error under it with Try again.

## When to use

- When the person asked a question and wants a different take on the same request, such as a shorter summary of why LST-1044 has few applicants.
- After Stop, when the answer was heading the wrong way and the question itself was fine.
- For drafts the person will review anyway, such as a job description or an interview question set.

## When not to use

- To change the question. Edit the question or send a new message; regenerate repeats the input exactly.
- On agent runs or scheduled tasks that changed data. Run them again as a new run under the same permissions.
- On a single generated table cell. Use Try again on the cell (see Generated table columns).

## Guidelines

- Offer Regenerate on the latest answer only. Regenerating an earlier answer would drop everything after it, which the person can't see coming.
- Only answers the person asked for get Regenerate. Starters, notices and approval results don't.
- Regenerating never undoes or repeats applied changes. Changes already applied stay applied; reversing them is Undo's job.
- Suggested changes in the replaced version are dropped if not yet applied; the new version brings its own proposal.
- Each version keeps its own citations and origin label, so switching versions never mixes sources.

## Content

- Button tooltip and accessible name: "Regenerate answer". Version control: "2 / 2", with "Previous version" and "Next version" as names.
- A stopped answer ends with "Stopped" in muted text, not an apology.
- Failure: "Couldn't regenerate. Your earlier answer is still here." then Try again.

## Accessibility

- Regenerate sits in the answer actions, which follow the answer in tab order, so it is reached right after reading.
- Focus stays on Regenerate while the new answer is written; announce "Regenerating" and then the finished answer once.
- The version switch announces the version on screen: "Version 1 of 2".

## Do

- Do let people stop at once and regenerate straight after.
- Do keep the earlier version reachable.
- Do keep the same context chips for the rerun, visibly.

## Don't

- Don't put a confirmation or delay on Stop.
- Don't show Regenerate on every answer in the thread.
- Don't let regenerate reverse or repeat applied changes.

## Related

- Showing reasoning and progress
- Propose, then apply
- Generated drafts and files
- Answer actions
