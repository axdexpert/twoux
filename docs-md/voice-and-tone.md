# Voice and tone

TwoUX sounds like a capable colleague who knows the data: precise, calm, candid and respectful of people's expertise. The voice is the same on every screen and in the assistant. The tone moves with the moment, from strictly practical in an error to one sentence warmer when someone is starting out or has just finished.

Kind: foundation · Group: Key principles

## Principles

- Precise. Name the thing, the number and the result: '3 listings closed', not 'Items updated'. Translate system detail into what it means for the person's work.
- Calm. Use the same level voice for success and failure. Excitement comes from what happened, not from punctuation or adjectives: no exclamation marks, no hype, no apologies.
- Candid. Say what is known and what is not, what can't be undone, and what the assistant did. Never promise more than the product does.
- Respectful of expertise. Write for people who do this work every day. Teach only on first run, in empty states and when help is asked for. Never say a task is easy, quick or simple.

## Guidelines

- Voice is fixed; tone varies. Before writing, ask three questions: how does the person probably feel, how often will they see this, and what is at stake? The answers set the tone, never the voice.
- TwoUX sits at one end of three of the four common tone dimensions: serious, not funny; respectful, not irreverent; matter-of-fact, not enthusiastic. On formal to casual it sits in the middle: plain and conversational, with common contractions and no slang. Tone moves within this range, never outside it.
- Inform to build trust: the default for every screen. Statuses, warnings, errors and assistant caveats say what happened, what it affects and what to do next, and only what is needed now. Banner, ErrorState, ConfidenceNote, AiOrigin.
- Empower to act: wherever a decision is needed. State the consequence and both choices plainly and leave the choice to the person; never nudge. ConfirmationDialog, PlanCard, approval cards, AgentPermissions.
- Encourage people along the path: wherever work is stuck or partly done. Say how much is done, what is left and one way forward. EmptyState, RunStatusBar, CsvImport, SetupChecklist.
- Motivate by showing possibilities: only where someone is starting something. Say what it lets them do in their own terms, as an outcome, never a superlative. OnboardingStep, empty workspace, FeatureLabel popover, ConnectorPicker.
- Satisfy by meeting expectations: the routine. Saves, completions and toasts are short, past tense, with a count and Undo. Nothing more is added.
- Delight: in TwoUX, delight comes from speed and precision, not from words. A quiet line is allowed at a real milestone people reach rarely, such as a finished setup checklist or an empty Inbox ('You're all caught up.'). Never in errors, never on repeated messages, never a joke, pun or emoji.
- Tone by person: experienced, daily users get the short form. First-run screens, empty states and help get one more sentence saying why. Both use the same words for the same things; there is no beginner vocabulary.
- Tone by stakes: the higher the stakes (money, people outside the workspace, decisions about candidates, permanent deletes), the plainer and more complete the copy. Never soften a risky action with 'just', 'quickly' or 'simply'.
- Address the person as 'you'. The product does not say 'we' or 'I': in a shared workspace 'we' could mean the vendor or the team. State the event instead: 'Listing not saved', not 'We couldn't save your listing'.
- The assistant speaks in the same voice. It opens with the answer, does not greet, praise the question or claim feelings ('I'd love to'), uses 'I' only for what it did ('I drafted 3 replies'), and states its limits as one specific caveat.
- When an agent or model writes copy, give it these four traits and a short sample of existing TwoUX copy, not a single adjective such as 'friendly'. Models exaggerate a single tone word; then edit the result by hand.

## Content

- Words to cut: just, simply, easy, quick (unless measured), seamless, powerful, robust, smart, magic, AI-powered, awesome, great, oops, whoops, sorry, please, successfully, exclamation marks. 'twoux check' warns on the most common ones.
- Common contractions (can't, don't, isn't, you're) are fine because they read as speech. Avoid unusual ones (it'd, mustn't, should've). Write 'not' in full when the negative is the point and could be missed: 'Do not close this window while the import runs.'

## Accessibility

- Plain, literal words translate and read aloud well. Avoid idioms, wordplay and cultural references, which screen reader users, people reading in a second language and translation tools often get wrong.
- Tone never replaces information: a reassuring sentence does not stand in for the cause and the fix an error must give.

## Do

- Error, inform: 'Listing not published. The closing date is in the past. Change the date and publish again.'
- Stuck, encourage: '12 of 240 rows have no email. Import the other 228, or fix them first.'
- Starting, motivate: 'Connect your calendar to offer candidates interview times that are really free.'
- Routine, satisfy: '3 candidates moved to Interview. Undo'
- High stakes, empower: 'Delete 3 candidates permanently? Their CVs and notes are erased. Interview history stays.'

## Don't

- Don't celebrate routine work: 'Woohoo! Your listing was successfully published!'
- Don't be playful when work is blocked: 'Uh-oh, our robots tripped over your file.'
- Don't minimise effort: 'Just connect your ATS, it's easy.'
- Don't make the assistant perform: 'Great question! I'd be happy to help you with that.'

## Related

- Writing
- Error messages
- Labelling AI output
- Consistency
