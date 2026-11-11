# Choosing a selection control

Pick the control from three questions: one choice or many, how many options, and does it apply at once or on Save.

Kind: pattern · Group: Patterns: general

**Problem:** The same kind of choice ends up as a radio group on one form, a dropdown on another and a switch on a third, so people can't predict when a change takes effect.

**Solution:** One choice from up to seven: radio. One choice from eight or more: select. Many from up to seven: checkboxes. Many from eight or more: multiselect. On or off with immediate effect: switch. On or off applied on Save: checkbox. Two to three view options: segmented control.

**Built from:** Radio, Checkbox, Switch, Segmented control, Combobox, Text input

## How it works

1. One option or many? Many means checkboxes or a multiselect.
2. How many options? Up to seven show all of them (radio or checkboxes); eight or more use a Combobox (combobox), with multiple for several.
3. For on or off: does it take effect at once (switch) or when the form is saved (checkbox)?
4. If both the on and off states need explaining, use two radio options with descriptions instead.

## When to use

- Radio: Work pattern on a listing (On-site, Hybrid, Remote (UK)).
- Select: Location from the list of offices; multiselect: Skills from a long list.
- Switch: "Email me when a listing closes" in notification settings, saved at once. Checkbox: "Offer visa sponsorship" in the Create listing form.

## When not to use

- Segmented control for a form value. It switches views or settings of what is shown, such as Daily or Weekly.
- A switch inside a form with a Save button; people expect a switch to act at once.
- Any selection control for a filter on a list page; filters use the filter pills.

## Guidelines

- When a choice reveals sub-options, use a different control for the parent than for the children: a checkbox that reveals radio options, not checkboxes inside checkboxes.
- Place revealed sub-options after the whole radio group, never between two radio options.
- Use the same parent control for the same kind of reveal everywhere on a page.
- Order options logically: by frequency, by the order of the hiring process, or alphabetically for long lists.
- Give options short descriptions only when they help people choose; keep the sentence structure the same across options.

## Content

- Switch labels describe the setting when on: "Email me when a listing closes".
- Checkbox labels describe what ticking does: "Offer visa sponsorship".
- When every option shares a subject, put it in the group label ("Work pattern") and keep options short.

## Accessibility

- Radio and checkbox groups are fieldsets with a legend that is the group label.
- A switch uses role="switch" and announces on or off.
- Revealed sub-options follow their parent in the focus order.

## Do

- Do show all options when there are seven or fewer.
- Do use a switch only for changes that apply at once.
- Do use radio options with descriptions when both on and off need explaining.

## Don't

- Don't hide three options in a dropdown.
- Don't nest the same control type for parent and sub-options.
- Don't put controls between radio options.

## Related

- Inline editing and validation
- Filtering and search
- Radio
- Checkbox
- Switch
- Segmented control
