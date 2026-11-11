# Data visualisation colours

One categorical palette of eight colours in a fixed order, one single-hue ordinal ramp of five steps, and a hard rule that status colours never become a series. Validated on white (#ffffff) with an OKLab and colour vision deficiency (CVD) simulator; every colour reaches at least 3:1.

Kind: foundation · Group: Visual foundation

## Principles

- Fixed order, always. Series take --c1, --c2, --c3 and so on in sequence, so 'Applications' is the same colour in every chart on a page. The categorical palette is applied strictly in sequence and stays consistent across charts.
- Every mark is visible. All eight categorical colours reach at least 3:1 on white, the WCAG minimum for graphical objects needed to understand a chart.
- No palette is colour-blind safe. There is no such thing as a true colour-blind safe palette, so colour is never the only way to tell series apart.
- Status is not data. --ok, --warn and --bad keep their meaning; a series that happens to be 'bad' news is still drawn in its categorical slot.

## When to use

- Categorical (--c1 to --c8): unordered groups such as source (job board, referral, careers site) or listing type. Up to about eight series for line and bar charts.
- Ordinal ramp (--q1 to --q5): ordered buckets such as days open (0 to 7, 8 to 14...) or match score bands, and sequential heatmaps. More means more contrast with the surface: darker in the light theme, brighter in the dark theme, with a sequential palette for each theme.

## When not to use

- Do not use data colours for buttons, badges, tags or any UI element.
- Do not use more than three categorical colours in a scatter plot or categorical heatmap; fold the rest into 'Other' or split into small multiples.
- Do not use pie or donut charts for more than about five slices.

## Guidelines

- Why this order: adjacent pairs were ordered to stay apart. Worst adjacent difference under normal vision is OKLab ΔE 18.0; worst adjacent difference under simulated CVD is ΔE 10.0 (protan, --c3 teal against --c2 orange). Neighbours in a legend or stacked bar are the pairs people compare most, so adjacency is what the order optimises.
- Why only three for scatter and heatmaps: in those forms any colour can sit next to any other, so all pairs matter, not just neighbours. Only --c1, --c2 and --c3 pass the all-pairs check; from the fourth colour some pair falls too close under CVD.
- Why one hue for the ramp: --q1 to --q5 are indigo with lightness falling monotonically, so order reads from lightness alone, which survives CVD and greyscale print. One hue also means the ramp cannot be mistaken for categorical series.
- Limit of the ramp: --q1 is 2.23:1 on white, below 3:1. The lightest bucket must carry a value label or sit inside a bordered cell, so understanding never depends on seeing it.
- Separate touching segments (stacked bars, pies) with a 2px --surface gap so edges do not rely on hue difference.
- Charts sit on --surface (#ffffff), the background the palette was validated on. Do not place charts on --bg or tinted cards.
- Every chart has a legend or direct labels, and a table view of the same data.

## Accessibility

- 3:1 is required for the parts of a chart needed to understand it. When the values are also printed as text, the marks themselves are exempt, which is how --q1 stays usable.
- Colour is never the only cue: use direct labels, a legend in series order, and patterns or markers where lines cross.
- CVD was checked with simulation; the worst adjacent case is protan. Simulation models such as Machado et al. are a check, not a guarantee; about 200 million people have some CVD.
- Offer a 'View as table' toggle on every chart so screen reader and keyboard users get the same data.

## Do

- Assign series in order and keep a series on the same colour across every chart in a view.
- Fold small categories into 'Other' (drawn in --ink-3) rather than reaching for a ninth colour.
- Label the lightest ordinal bucket with its value.

## Don't

- Do not use --ok green for 'hired' and --bad red for 'rejected' in a chart; use categorical slots and say the meaning in the legend.
- Do not use colour for decoration, or give different colours to points in the same series.
- Do not reorder or skip palette colours to make a chart look nicer.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--c1` | `#5753e0` | Series 1, indigo (5.65:1) |
| `--c2` | `#e0602b` | Series 2, orange (3.57:1) |
| `--c3` | `#00897b` | Series 3, teal (4.32:1) |
| `--c4` | `#a87000` | Series 4, ochre (4.21:1) |
| `--c5` | `#cc4a7a` | Series 5, magenta (4.35:1) |
| `--c6` | `#008300` | Series 6, green (4.95:1) |
| `--c7` | `#2a78d6` | Series 7, blue (4.42:1) |
| `--c8` | `#d93f3e` | Series 8, red (4.44:1) |
| `--q1` | `#a9a6f3` | Ordinal lowest (2.23:1, needs a label) |
| `--q2` | `#7f7beb` | Ordinal 2 (3.54:1) |
| `--q3` | `#5753e0` | Ordinal midpoint (5.65:1) |
| `--q4` | `#3d39b0` | Ordinal 4 (8.71:1) |
| `--q5` | `#24226f` | Ordinal highest (13.7:1) |

## Related

- Colours
- Accessibility
- Design tokens
