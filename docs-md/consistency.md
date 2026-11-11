# Consistency

TwoUX's first rule: the same job gets the same component, the same token and the same behaviour, on every screen, whether a designer, an engineer or a language model wrote the code. Consistency is what makes a dense product learnable.

Kind: foundation · Group: Key principles

## Principles

- Same job, same component. People should not have to wonder whether different words, situations or actions mean the same thing.
- Consistency is also a WCAG requirement. Components with the same function are identified the same way (3.2.4) and repeated navigation keeps its order (3.2.3).
- Learn once, use everywhere. People transfer expectations from what they already know, inside the product as much as between products.
- A design system manages design at scale with reusable components and patterns; its value is lost the first time someone rebuilds a component by hand.

## Guidelines

- The job to component registry is the source of truth. Each row names a job and the one component that does it. Examples: show a record's state = Badge; confirm a destructive action = Dialog; peek at a record from a list = Side panel; run any command = Command menu (⌘K); ask the assistant = Assistant (⌘J); act on many rows = Bulk bar; show a one-line result with undo = Toast; filter a list = Filter pill.
- If a job is not in the registry, do not improvise. Propose a new row, or extend an existing component, through design review. Always check for an existing component before building a custom one.
- No one-off styling. Product code sets no colours, font sizes, radii, shadows or spacing; those come from components and tokens.
- Same behaviour, too: Esc closes the innermost layer, J and K move through every list, ↵ opens, ⇧↵ opens full page. A component that behaves differently in one place is a different component.
- Same words: one term per concept (listing, not job post in one place and role in another), and the same button label for the same action.

## Content

- Rules for code written by language models: 1. Import components from the TwoUX package; never recreate a button, badge, menu or panel with raw HTML and CSS.
- 2. Look up the job in the registry before choosing a component. If two components could fit, the registry decides.
- 3. Use tokens only. No hex, rgb, raw px font sizes, raw radii, raw shadows or raw durations. Choose the token by its role, not its value.
- 4. Use the icon meaning table; never pick an icon because it looks right.
- 5. Copy follows the Writing page: UK English, sentence case, verb-first buttons.
- 6. Lint must pass. Stylelint and ESLint rules reject raw values and unknown tokens. A generated change that needs a lint exception goes to human review.

## Accessibility

- Predictable components are an accessibility feature: the same icon and the same accessible name for the same function.
- Navigation and the shell appear in the same order on every page.
- Reusing tested components carries their keyboard and focus behaviour; custom components lack built-in testing and accessibility.

## Do

- Use the Toast for every 'done, undo?' message, from bulk close to AI actions.
- Add to the registry when you add a component.

## Don't

- Do not make a 'special' button for one page.
- Do not copy a component's markup to tweak it; extend the component.
- Do not accept generated code that hard-codes visual values, even when it looks right.

## Related

- Design tokens
- Iconography
- Writing
- Keyboard model
