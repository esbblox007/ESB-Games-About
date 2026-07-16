"use client";

import { useState } from "react";
import { ChevronIcon } from "./Icons";

const questions = [
  ["How do I recover my account?", "Open the login page and choose the password recovery option. If you cannot access the email connected to your account, submit an Account & Access ticket so the support team can verify ownership."],
  ["When will I get a refund?", "Refund eligibility depends on the purchase type, account activity and applicable consumer rules. Submit a Billing & Payments ticket with the transaction details for review."],
  ["My game is not showing after publishing — what now?", "Check the project status, moderation messages and publishing settings in the Creator Hub. If the experience remains unavailable, submit a Creator & Developer ticket."],
  ["How do I report another player?", "Use the in-platform report tools where possible. For urgent safety concerns, choose Safety & Abuse when submitting a ticket and include any relevant usernames, message IDs or evidence."],
  ["What is the expected response time?", "Response times vary by issue type. Safety reports are prioritised, while general requests are handled in the order received."],
] as const;

export default function SupportFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="support-faq-list">
      {questions.map(([question, answer], index) => (
        <article className={open === index ? "open" : ""} key={question}>
          <button type="button" onClick={() => setOpen(open === index ? -1 : index)}>{question}<ChevronIcon /></button>
          {open === index && <p>{answer}</p>}
        </article>
      ))}
    </div>
  );
}
