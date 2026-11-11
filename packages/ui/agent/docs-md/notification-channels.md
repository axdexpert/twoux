# Notifications: inbox, bell, toast or email digest

Route every message by one question: does it need this person to act? Things that need you go to the Inbox; your own results go in a toast; nothing gets a separate bell list.

Kind: pattern · Group: Patterns: general

**Problem:** Products grow a bell, an inbox, toasts, banners and emails that overlap, so people get the same news three times and miss the one that needed them.

**Solution:** The Inbox is the one place for things that need you (agent approvals and questions, listings about to close, mentions, assignments). Toasts only confirm your own actions. Workspace-wide problems use a banner. Email sends a digest of open Inbox items to people who are away.

**Built from:** Inbox (triage), Toast, Banner (inline alert), Notifications vs inbox vs toast, App shell and sidebar navigation, Agent run timeline

## How it works

1. Did this person just do it? Confirm with a toast, or with nothing if the change is already visible.
2. Does it need this person to act or reply? Put it in the Inbox. It stays until marked done (E) or snoozed (⇧H).
3. Does it affect everyone's use of the workspace, such as a broken connection? Show a banner on the affected pages until fixed.
4. Is the person away from TwoUX and is something waiting on them? Send an email digest of open Inbox items, at the frequency they chose.
5. Needs nothing from anyone? Record it in the record's activity only.

## When to use

- Whenever a feature wants to tell someone something. Pick the channel with the steps above before designing the message.

## When not to use

- For validation of what someone typed. Use field messages from Inline editing and validation.
- For errors that need a retry. A toast disappears and cannot hold Retry reliably; use a banner or the error state.

## Guidelines

- No separate bell list. The Inbox count is the only unread count; when the sidebar is hidden, a small inbox button with the same count replaces it.
- Toasts never carry critical warnings or errors and never auto-dismiss something the person must act on.
- Don't resend notifications people have not acted on; let them set email frequency and channels.
- Trivial updates go nowhere but activity. Notification fatigue makes people ignore the important ones.

## Content

- Toasts are past tense and short: "Listing published". Three lines at most.
- Banners say what is affected and what to do: "Workable is disconnected. Reconnect to keep importing candidates."

## Accessibility

- Toasts and count changes are announced as status messages.
- Toasts must not cover the focused element; they appear in an empty corner.
- Anything shown only in a vanishing toast must also be findable elsewhere, such as activity or the Inbox.

## Do

- Do send everything that needs action to the Inbox.
- Do give people control over email frequency.

## Don't

- Don't add a bell next to the Inbox.
- Don't use a toast for errors that need a follow-up.

## Related

- Agents acting on your behalf
- Undo and destructive actions
- Empty, loading and error states
- Inbox (triage)
- Toast
- Banner (inline alert)
