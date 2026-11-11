# Iconography

One line icon set, 16px with a 1.7 stroke in currentColor, and a fixed meaning for every icon. An icon that means one thing in one place means that thing everywhere.

Kind: foundation · Group: Visual foundation

## Principles

- One meaning per icon. WCAG requires components with the same function to be identified consistently, and people cannot rely on icons whose function varies.
- Words first. Few icons are universally understood, so icons sit beside a text label; icon-only buttons are kept to well-known actions and always have an accessible name and tooltip.
- Reuse before you draw. Use existing icons rather than making new ones.

## Guidelines

- ↗ external (i-ext): the link leaves TwoUX, for example 'View public page' on the job board. Never used for in-app navigation.
- ↳ follow-up (i-reply): a suggested follow-up question that continues an AI answer, under a 'Follow-ups' label.
- Bulb (i-bulb): a starter idea, a suggested first prompt in an empty assistant. Starters can be hidden.
- Expand (i-expand): open this record or conversation as a full page. Not used for 'show more'; that is a chevron.
- Panel (i-panel): show the side panel side by side (push).
- Origin mark (AiMark, a small speech bubble): content the assistant wrote, beside that content, and the type icon of AI columns in a sheet.
- Sizes: 16px default, 14px (.sm) inside small controls and tabs, the smaller size mainly for chevrons and badges.
- Colour: icons inherit text colour. Status icons take the status text token; the origin mark is muted (text-ink-3) like any supporting icon, never an accent or AI colour.
- AI is marked in one place only: the origin mark next to generated output. Buttons that start AI work (Ask, Suggest titles) use their normal icon or none.
- The origin mark is not a sparkle and is never added to other icons to mean "AI-enhanced". Search that uses a model is still Search.
- The assistant's identity is its name, "Assistant", in text. If several agents speak in one thread, each has its own avatar and name; the origin mark is never used as an avatar.
- Match the strength of the marking to the stage: the entry point looks like any button, work in progress shows step text and a timer, finished output carries the small mark and "Assistant · from …".

## Accessibility

- Icons that carry meaning reach 3:1 against their background.
- Decorative icons beside a text label are hidden from assistive technology; icon-only buttons get an aria-label that matches the tooltip.
- Never use an icon as the only signal of status; pair it with text.

## Do

- Use the origin mark only beside output the assistant produced, and as the AI column type in sheets.
- Keep the same icon and the same accessible name for Save, Close or Share everywhere.

## Don't

- Do not use ↗ for links that stay inside TwoUX.
- Do not use a sparkle for AI anywhere, and do not put the origin mark on buttons, menu items or sidebar items that start AI work.
- Do not draw a new icon when an existing one already has that meaning.

## Related

- Writing
- Consistency
- Accessibility
