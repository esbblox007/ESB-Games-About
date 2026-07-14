"use client";

import { useState } from "react";
import { ChevronIcon } from "./Icons";

const items = [
  ["Is early access free?", "Yes. Joining the waitlist is free and does not require a payment method."],
  ["When will ESB Games launch?", "Launch dates should only be announced once testing and safety readiness meet the required standard. Waitlist members will receive confirmed updates."],
  ["Can creators apply for ESB Studio testing?", "Yes. Choose Creator on the early-access form so your interest can be grouped correctly."],
  ["Will my details be shared?", "No. The supplied implementation uses your details for ESB Games access and updates. Your final privacy policy should explain retention and deletion clearly."],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return <div className="faq-list">{items.map(([question, answer], index)=><article className={`faq-item ${open===index?"open":""}`} key={question}><button className="faq-question" onClick={()=>setOpen(open===index?-1:index)}>{question}<ChevronIcon/></button>{open===index&&<div className="faq-answer">{answer}</div>}</article>)}</div>;
}
