# Navigation: what goes in the sidebar and the top bar

The sidebar holds where you can go and the few things you always need; the top bar holds where you are and what this page does. Records never become sidebar items.

Kind: pattern · Group: Patterns: general

**Problem:** Without a rule, global links land in page headers, record pages add themselves to the sidebar, and every feature adds a top-level item. People lose track of where they are and the sidebar turns into a site map.

**Solution:** One app shell. The sidebar has three parts: the workspace menu with Search (⌘K) and Inbox at the top, the main sections in the middle, and Settings and Help at the bottom. The top bar shows the breadcrumb and page-level controls only. One sidebar item is always active, including on record pages.

**Built from:** App shell and sidebar navigation, Breadcrumb, Page header, Command palette (⌘K), Inbox (triage), Saved views, Keyboard shortcut hint

## How it works

1. Top of the sidebar: the workspace menu (switch workspace, your profile, Preferences, Sign out last), then Search (⌘K) and Inbox with its count.
2. Middle: the main sections, ordered by how often a hiring team uses them: Home, Listings, Candidates, Interviews, Reports. Saved views sit under their section.
3. Bottom: Settings and Help, set apart by space or a divider.
4. Top bar: breadcrumb on the left, page-level controls such as the side panel toggle on the right. No global destinations.
5. On a record page, the record's type stays active in the sidebar: viewing Priya Shah keeps Candidates active.

## When to use

- For every screen inside the product.
- When adding a new area: add a sidebar item only if people go there on its own, not only through a record.
- When placing account and workspace utilities such as profile, preferences, Search and Inbox.

## When not to use

- Not for sign-in, public careers pages or marketing pages. They have their own simple frame.
- Don't use the sidebar for actions. Create listing lives in the Listings page header, not the sidebar.
- Not for moving between records in a list. Use J and K with the side panel, as Record detail describes.

## Guidelines

- Organise by the team's tasks and the things they manage, not by a site map. Create, edit and settings pages for one record are reached from the record, never from the sidebar.
- Two levels at most. Deeper pages are reached through links in the page, and the breadcrumb shows the way back.
- Group only when it helps: no group with only two links, and don't mix headed groups with expandable items in one sidebar.
- Sidebar labels, breadcrumb items and page titles use the same words.
- Counts in the sidebar are for things that need action, like Inbox. Saved views may show their live row count. No decorative counts or static labels other than New or Beta.
- The sidebar is either shown in full or hidden; TwoUX has no icon-only rail. When hidden, Inbox keeps a small button with its count in the top bar.
- Every destination is also reachable from ⌘K, so the sidebar is never the only way.

## Content

- Section names are plural nouns for what they hold: "Listings", "Candidates". Not verbs or team jargon.
- The workspace menu shows the workspace name and the person's name, so people with two workspaces know which one is open.
- Breadcrumb items match sidebar labels: "Listings / Junior Product Designer".

## Accessibility

- The sidebar is a nav landmark named "Main"; the breadcrumb is a nav named "Breadcrumb".
- The active item has aria-current="page"; its look does not rely on colour alone.
- A skip link to the main content is the first focusable item on every page.
- The order of sidebar items is the same on every page.

## Do

- Do keep one sidebar item active on every page.
- Do order items from most to least used.
- Do put profile, preferences and sign out in the workspace menu, with Sign out last.

## Don't

- Don't add a sidebar item when a record opens.
- Don't put global links in the top bar or page header.
- Don't add a top-level section for a feature people only reach from inside another one.

## Related

- App shell and sidebar navigation
- Breadcrumb
- Page header
- Command palette (⌘K)
- Keyboard-first navigation
- Record detail: side panel, overlay or full page
- Announcing new and beta features
