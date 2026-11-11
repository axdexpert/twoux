# Secondary panels: which right-hand panel

TwoUX has one right-hand panel slot. Record detail, the assistant, help and filters each have a clear job, only one is open at a time, and none is ever required to finish a task.

Kind: pattern · Group: Patterns: general

**Problem:** When every feature adds its own panel, people can't tell which icon opens what, panels pile up and crush the table, and tasks end up depending on something hidden behind a toggle.

**Solution:** Choose the panel by what the person is trying to do: look at a record (side panel), ask about the data (assistant panel), learn how something works (help panel), narrow a large search (filter panel). Opening one replaces the one already in the slot.

**Built from:** Side panel (drawer), Assistant side panel, Help panel, Filter panel, App shell and sidebar navigation

## How it works

1. Name the person's goal: review a record, get an answer about the data, learn the product, or narrow results.
2. Pick the panel: side panel for a record, assistant panel for questions, help panel for guidance, filter panel for searches with many fields.
3. Check the main task can be finished without the panel. If it can't, the content belongs in the page.
4. Open the panel only from a person's action; opening it moves the previous panel out of the slot, and closing it brings that panel back.

## When to use

- For supporting information or tools that relate to the page the person is on.
- When the person benefits from seeing the list and the extra content side by side.
- When the extra content should stay open while people move through records with J and K.

## When not to use

- For a decision that must interrupt the task. Use a confirmation dialog.
- For a long, standalone task such as editing a whole listing. Use a full page.
- For content unrelated to the current page, such as account settings.

## Guidelines

- At most three panel types on any page. If a fourth is needed, one of them is probably a page or a dialog.
- Triggers sit in a fixed order wherever they appear: record detail opens from the row, then Assistant (⌘J), then Help.
- Panels are secondary: they can speed a task up, but every task can be completed without opening one.
- Help panel content is read-only; side panel, assistant and filter panel content can be interactive.
- Below 860px the open panel takes the full width of the canvas and has a clear close button.

## Content

- Trigger buttons have text or a tooltip with the panel name and shortcut: "Assistant ⌘J", "Help".
- The panel heading names what is inside: the record title, "Assistant", or the help topic.
- Close buttons are named for the panel: "Close help", "Close assistant".

## Accessibility

- Every panel is a labelled complementary region, not a modal, unless it overlays content (then it follows the dialog pattern).
- Opening a panel from a control moves focus into it; Esc closes it and focus returns to the control.
- The panel never hides the focused element on the page (2.4.11).

## Do

- Do choose the panel from the person's goal.
- Do keep panel triggers in the same order on every page.
- Do restore the previous panel when the newer one closes.

## Don't

- Don't open two right-hand panels at once.
- Don't open a panel on page load.
- Don't hide a required step inside a panel.

## Related

- Record detail: side panel, overlay or full page
- Ask about what's on screen
- Contextual help
- Side panel (drawer)
- Assistant side panel
- Help panel
- Filter panel
