"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons";

const plans = [
  { name: "Member", tagline: "The planned free starting point for players.", monthly: 0, features: ["Free platform access", "Friends and communities", "Standard avatar options", "Core discovery features"] },
  { name: "Plus", tagline: "Planned extras for active players.", monthly: 9.99, features: ["Everything in Member", "Monthly ESBucks allowance", "Expanded avatar options", "Additional community benefits"] },
  { name: "Pro", tagline: "Planned tools for active players and creators.", monthly: 19.99, featured: "Preview", features: ["Everything in Plus", "Creator analytics", "Larger community limits", "Profile customisation", "Priority support eligibility"] },
  { name: "Max", tagline: "The planned highest membership tier.", monthly: 34.99, featured: "Preview", orange: true, features: ["Everything in Pro", "Advanced creator benefits", "Highest upload allowances", "Premium support eligibility", "Additional testing opportunities"] },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <>
      <div className="pricing-preview-banner" role="note"><strong>Preview pricing</strong><span>Plans, prices and benefits are provisional and may change before subscriptions launch. No payment is being taken on this website.</span></div>
      <div className="billing-toggle" aria-label="Preview billing frequency">
        <button type="button" className={!yearly ? "active" : ""} onClick={() => setYearly(false)}>Monthly preview</button>
        <button type="button" className={yearly ? "active" : ""} onClick={() => setYearly(true)}>Yearly preview <span className="save-pill">Illustrative 20%</span></button>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => {
          const display = yearly ? plan.monthly * 0.8 : plan.monthly;
          return (
            <article key={plan.name} className={`price-card ${plan.featured ? "featured" : ""}`}>
              {plan.featured && <div className={`price-ribbon ${plan.orange ? "orange" : ""}`}>{plan.featured}</div>}
              <div className="price-content">
                <h3>{plan.name}</h3><p className="price-tagline">{plan.tagline}</p>
                <div className="price"><sup>£</sup>{display === 0 ? "0" : display.toFixed(2)} <small>/ mo</small></div>
                <span className="billing-note">{display === 0 ? "Planned free tier" : "Provisional price"}</span>
                <ul className="feature-list">{plan.features.map((feature) => <li key={feature}><CheckIcon size={16}/>{feature}</li>)}</ul>
                <a href="https://esbgames.com/sign-up" className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}>Create an account</a>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
