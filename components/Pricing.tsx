import { CheckIcon } from "./Icons";

const plans = [
  { name: "Member", tagline: "The planned free starting point for players.", price: "Free tier planned", features: ["Core platform access", "Friends and communities", "Standard avatar options", "Core discovery features"] },
  { name: "Plus", tagline: "A planned membership tier for active players.", price: "Pricing to be confirmed", features: ["Member features", "Additional account benefits", "Expanded customisation", "Additional community features"] },
  { name: "Pro", tagline: "A planned tier for active players and creators.", price: "Pricing to be confirmed", featured: "In development", features: ["Plus features", "Creator-focused benefits", "Expanded community features", "Additional profile options"] },
  { name: "Max", tagline: "The planned highest membership tier.", price: "Pricing to be confirmed", featured: "In development", orange: true, features: ["Pro features", "Advanced creator benefits", "Higher supported allowances", "Additional programme benefits"] },
] as const;

export default function Pricing() {
  return (
    <>
      <div className="pricing-preview-banner" role="note"><strong>Pre-launch membership preview</strong><span>Plan names, pricing and benefits are still being finalised. No payment is being taken on this website.</span></div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.name} className={`price-card ${plan.featured ? "featured" : ""}`}>
            {plan.featured && <div className={`price-ribbon ${plan.orange ? "orange" : ""}`}>{plan.featured}</div>}
            <div className="price-content">
              <h3>{plan.name}</h3><p className="price-tagline">{plan.tagline}</p>
              <div className="price price-text-only">{plan.price}</div>
              <span className="billing-note">Final commercial terms will be published before purchase becomes available.</span>
              <ul className="feature-list">{plan.features.map((feature) => <li key={feature}><CheckIcon size={16}/>{feature}</li>)}</ul>
              <a href="https://esbgames.com" className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}>Explore ESB Games</a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
