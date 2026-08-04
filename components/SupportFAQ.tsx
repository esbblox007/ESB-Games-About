"use client";

import { useState } from "react";
import { ChevronIcon } from "./Icons";

const questions = [
  ["How do I recover my account?", "Open the main ESB Games login page and choose the password recovery option. Follow the recovery steps shown there. If you still cannot access the account, open a secure Account & Access ticket."],
  ["How will refunds be reviewed?", "Refund eligibility will depend on the purchase type, account activity and applicable consumer rules. The final Billing & Payments workflow will request the relevant transaction details."],
  ["My game is not showing after publishing. What should I check?", "Review the project status, moderation messages and publishing settings available in the creator systems. Public publishing guidance will be expanded as those tools move through testing."],
  ["How will I report another player?", "In-platform report tools are planned for player and experience concerns. The dedicated Safety & Abuse form shown on this page will connect to the Trust & Safety workflow before public launch."],
  ["What is the expected response time?", "Response targets have not been published yet. They will be based on issue type and priority, with serious safety concerns handled through a dedicated escalation process."],
] as const;

export default function SupportFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="support-faq-list">
      {questions.map(([question, answer], index) => {
        const expanded = open === index;
        const panelId = `support-faq-${index}`;
        return (
          <article className={expanded ? "open" : ""} key={question}>
            <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? -1 : index)}>{question}<ChevronIcon /></button>
            {expanded && <p id={panelId}>{answer}</p>}
          </article>
        );
      })}
    </div>
  );
}
