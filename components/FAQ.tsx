"use client";

import { useState } from "react";
import { ArrowIcon } from "./Icons";

const questions = [
  ["When will ESB Games launch?", "Launch dates will be announced once testing, safety and platform readiness meet the required standard."],
  ["Can I create an ESB Games account now?", "Account registration is available through the main ESB Games platform. Access to unfinished services may remain restricted during development and testing."],
  ["When will ESB Studio downloads be available?", "ESB Studio is currently in development. Final public availability, supported platforms and system requirements will be confirmed on the Downloads page."],
  ["How will creator monetisation work?", "Creator monetisation, payout eligibility and the planned revenue share will be published in full before paid creator systems launch."],
  ["Where can I follow development updates?", "Development and launch information will be published through the ESB Games News page and official social channels."],
] as const;

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {questions.map(([question, answer], index) => {
        const expanded = open === index;
        const answerId = `faq-answer-${index}`;
        return (
          <article key={question} className={expanded ? "open" : ""}>
            <button type="button" aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(expanded ? null : index)}>
              <span>{question}</span><ArrowIcon size={17} />
            </button>
            {expanded && <p id={answerId}>{answer}</p>}
          </article>
        );
      })}
    </div>
  );
}
