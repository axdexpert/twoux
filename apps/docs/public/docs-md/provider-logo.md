# Provider logo

The official mark of a service people sign in with or connect, shown unaltered on a white tile beside the service's name.

Kind: component · Group: Content · Status: built, import from @twoux/ui

## When to use

- Identifying a service someone signs in with, such as Google or Microsoft.
- Identifying a service someone connects, such as Slack or Google Drive, in a list or a connection dialog.

## When not to use

- Marking a competitor or a product we studied as a reference. Those get a text name only.
- Decoration, avatars or a stand-in for our own brand. Use Avatar (avatar) for people and the product mark for us.
- Logos of services that are not connectable. A mark implies the connection exists.

## Structure

1. Tile (white in both themes, hairline border)
2. Official mark (unaltered)
3. Name or label beside it

## Guidelines

- Use the official mark only for third-party services people sign in with or connect. Never for competitors or reference products.
- Show the mark unaltered: no recolouring, no cropping, no effects, no new background shapes.
- Put the mark beside the service's name. When it stands alone, give it a label so the service is still named.
- Keep the tile white in light and dark themes so dark marks, such as GitHub and Notion, stay visible.
- To add a provider, add a line to the list in scripts/provider-logos.mjs and run node scripts/provider-logos.mjs. Check the brand's own page for permitted use first.
- The icon sources are licensed for reuse: Iconify's logos set is CC0, vscode-icons and thesvg-color are MIT. Trademarks stay with their owners, so show a mark only to identify that service.

## Content

- "Continue with Google" and "Connect Slack": the name is always in words, never only in the mark.
- When alone, label it with the service name only, for example "Google Drive".

## Accessibility

- Beside a visible name the mark is decorative and hidden from assistive technology. Alone, it has role="img" and an aria-label with the service name (SC 1.1.1).
- The tile keeps the mark's edges distinct from either theme (SC 1.4.11).

## Keyboard

| Keys | Action |
|---|---|
| None | Not focusable. The button or row that contains it is the focus stop. |

## Examples

### alone-and-sizes

```tsx
import { ProviderLogo } from "@twoux/ui";

export const meta = { title: "Alone, with a label", description: "When the mark has no name beside it, give it a label. Three sizes; the mark inside is never changed.", order: 2 };

export default function Example() {
	return (
		<div className="flex items-center gap-4">
			<ProviderLogo provider="slack" size="sm" label="Slack" />
			<ProviderLogo provider="slack" size="md" label="Slack" />
			<ProviderLogo provider="slack" size="lg" label="Slack" />
		</div>
	);
}
```

### beside-name

```tsx
import { PROVIDERS, ProviderLogo, type ProviderId } from "@twoux/ui";

export const meta = { title: "Beside the name", description: "The mark identifies the service and the name says it. On a white tile in both themes, so dark marks stay visible.", order: 1 };

const SHOWN: ProviderId[] = ["google", "microsoft", "github", "slack", "notion", "google-drive"];

export default function Example() {
	return (
		<ul className="grid w-full max-w-md gap-1">
			{SHOWN.map((p) => (
				<li key={p} className="flex items-center gap-3 rounded-xs px-1 py-1.5">
					<ProviderLogo provider={p} />
					<span className="text-base text-ink">{PROVIDERS[p].label}</span>
				</li>
			))}
		</ul>
	);
}
```

## Related

- Connector picker
- Sign in
- Connected tools
- Avatar and avatar stack
