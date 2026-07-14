"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "./Icons";

const plans = [
  { name: "Member", tagline: "Everything needed to start playing.", monthly: 0, features: ["Play free experiences", "Join communities", "Friends and messaging", "Standard avatar options"] },
  { name: "Pro", tagline: "Level up your everyday play.", monthly: 9.99, features: ["Everything in Member", "Monthly ESBucks allowance", "Expanded avatar options", "Priority matchmaking"] },
  { name: "Plus", tagline: "For active players and creators.", monthly: 19.99, featured: "Most popular", features: ["Everything in Pro", "Creator analytics", "Larger community limits", "Profile banner and extras", "Priority support"] },
  { name: "Max", tagline: "Maximum access for power users.", monthly: 34.99, featured: "Best value", orange: true, features: ["Everything in Plus", "Advanced creator tools", "Highest upload allowances", "Premium support", "Exclusive testing access"] },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <>
      <div className="billing-toggle" aria-label="Billing frequency">
        <button className={!yearly ? "active" : ""} onClick={() => setYearly(false)}>Monthly</button>
        <button className={yearly ? "active" : ""} onClick={() => setYearly(true)}>Yearly <span className="save-pill">Save 20%</span></button>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => {
          const display = yearly ? plan.monthly * 0.8 : plan.monthly;
          return (
            <article key={plan.name} className={`price-card ${plan.featured ? "featured" : ""}`}>
              {plan.featured && <div className={`price-ribbon ${plan.orange ? "orange" : ""}`}>{plan.featured}</div>}
              <div className="price-content">
                <h3>{plan.name}</h3>
                <p className="price-tagline">{plan.tagline}</p>
                <div className="price"><sup>£</sup>{display === 0 ? "0" : display.toFixed(2)} <small>/ mo</small></div>
                <span className="billing-note">{yearly && display > 0 ? `£${(display * 12).toFixed(2)} billed yearly` : display > 0 ? "Billed monthly" : "Free, no card required"}</span>
                <ul className="feature-list">{plan.features.map((feature) => <li key={feature}><CheckIcon size={16}/>{feature}</li>)}</ul>
                <Link href={`/early-access?plan=${plan.name.toLowerCase()}`} className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}>{display === 0 ? "Get started" : `Choose ${plan.name}`}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
