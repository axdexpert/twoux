# Citing sources

Every claim in an answer links to the record it came from by ID; clicking opens the record in the side panel, and the full page lists every record used.

Kind: pattern · Group: Patterns: AI

**Problem:** People can't act on an answer they can't check, and generic "Sources" lists at the bottom don't say which claim came from where.

**Solution:** Citations are record IDs (LST-1044) placed right after the claim. They open the record in the side panel. The full-page view adds a Sources panel listing every record and file the answer used, and highlights the one being cited.

**Built from:** Citations and sources, Assistant side panel, Assistant page, Side panel (drawer), AI column, Team instructions and files

## How it works

1. Place the record ID straight after the sentence it supports.
2. Hover or focus shows a preview: record title, the figure used, when it was updated.
3. Click opens the record in the side panel next to the answer.
4. When the answer relied on a team file, cite the file by name.
5. Expanded to a full page, a Sources panel lists every record and file used, and citations highlight their source.

## When to use

- For every factual claim about workspace data in an answer, a generated cell or an agent step.

## When not to use

- To decorate an answer with sources that don't support a specific claim; that builds false trust.
- For reasoning steps; those are progress, not evidence (see Showing reasoning and progress).

## Guidelines

- Cite at the claim, not in a list at the end, so people can tell sourced claims from synthesis.
- Use descriptive citations (the record ID and title on hover), never "Source 1".
- If a source is missing or deleted, say so openly instead of hiding the gap.
- Keep citation style identical in answers, AI columns and agent runs.
- Say what data the answer could not see, so people know when to rely on their own judgement.

## Content

- Citations use the record ID as it appears in the product: "LST-1044".
- Sources panel heading: "Sources", each item with title, type and last updated.

## Accessibility

- Citations are links with accessible names that include the record title, not just the ID.
- Citation previews open on focus as well as hover and close with Esc.

## Do

- Do link each claim to its record.
- Do cite team files by name.

## Don't

- Don't list sources only at the bottom.
- Don't show a citation that doesn't support the claim.

## Related

- Ask about what's on screen
- Labelling AI output
- Generated table columns and enrichment
- Citations and sources
