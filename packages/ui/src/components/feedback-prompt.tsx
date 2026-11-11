/**
 * TwoUX composition: “Was this helpful?” with Yes / No, one vote, an optional follow-up, and every state
 * (sending, sent, failed with Try again). One per page or panel.
 */
import { Check, ThumbsDown, ThumbsUp } from "lucide-react"
import * as React from "react"
import { Button } from "./button"
import { Textarea } from "./textarea"

type Vote = "yes" | "no"

export function FeedbackPrompt({
  question = "Was this helpful?",
  description,
  onVote,
  onFollowUp,
  privacy = "Don't include personal information about candidates.",
}: {
  question?: string
  description?: string
  /** Sends the vote. Reject to show the failed state. */
  onVote: (vote: Vote) => Promise<void>
  /** Optional: sends what they typed after voting. */
  onFollowUp?: (text: string, vote: Vote) => Promise<void>
  privacy?: string
}) {
  const [vote, setVote] = React.useState<Vote | null>(null)
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "failed">("idle")
  const [text, setText] = React.useState("")
  const [followState, setFollowState] = React.useState<"idle" | "sending" | "sent" | "failed">("idle")
  const id = React.useId()

  const send = async (v: Vote) => {
    setVote(v)
    setState("sending")
    try { await onVote(v); setState("sent") } catch { setState("failed") }
  }
  const sendFollow = async () => {
    if (!vote || !onFollowUp) return
    setFollowState("sending")
    try { await onFollowUp(text, vote); setFollowState("sent") } catch { setFollowState("failed") }
  }

  return (
    <section aria-labelledby={`${id}-q`} data-slot="feedback-prompt" className="grid gap-2">
      <h3 id={`${id}-q`} className="text-base font-medium text-ink">{question}</h3>
      {description && <p className="text-sm text-ink-2">{description}</p>}
      {state === "sent" && vote ? (
        <p role="status" className="flex items-center gap-control text-base text-ink-2">
          <Check className="size-3.5 text-ok" aria-hidden="true" />
          You answered {vote === "yes" ? "Yes" : "No"}. Thanks for telling us.
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" loading={state === "sending" && vote === "yes"} disabled={state === "sending"} onClick={() => send("yes")}><ThumbsUp />Yes</Button>
          <Button variant="outline" size="sm" loading={state === "sending" && vote === "no"} disabled={state === "sending"} onClick={() => send("no")}><ThumbsDown />No</Button>
        </div>
      )}
      {state === "failed" && (
        <p role="alert" className="flex items-center gap-2 text-sm text-bad">
          Your answer wasn't sent.
          <Button variant="ghost" size="xs" onClick={() => vote && send(vote)}>Try again</Button>
        </p>
      )}
      {state === "sent" && onFollowUp && followState !== "sent" && (
        <div className="grid gap-2">
          <label htmlFor={`${id}-f`} className="text-sm font-medium text-ink">{vote === "no" ? "What was missing or wrong? (optional)" : "Anything else? (optional)"}</label>
          <Textarea id={`${id}-f`} value={text} maxLength={500} onChange={(e) => setText(e.target.value)} aria-describedby={`${id}-p ${id}-c`} />
          <div className="flex items-center justify-between gap-2 text-sm text-ink-3">
            <span id={`${id}-p`}>{privacy}</span>
            <span id={`${id}-c`} className="tabular">{text.length} / 500</span>
          </div>
          {followState === "failed" && <p role="alert" className="text-sm text-bad">Your comment wasn't sent. It's still here; try again.</p>}
          <Button size="sm" variant="outline" className="justify-self-start" disabled={!text.trim()} loading={followState === "sending"} onClick={sendFollow}>Send</Button>
        </div>
      )}
      {followState === "sent" && <p role="status" className="text-sm text-ink-2">Comment sent.</p>}
    </section>
  )
}
