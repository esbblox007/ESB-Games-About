import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CubeIcon, GamepadIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Create an Account" };

function UserIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-4 3.1-6 7-6s6.4 2 7 6"/></svg>;
}
function MailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m5 7 7 5 7-5"/></svg>;
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
}
function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3.5v4M17 3.5v4M4 10h16"/></svg>;
}

export default function SignupPage() {
  return (
    <main className="auth-page auth-signup-page">
      <header className="auth-minimal-header">
        <Link href="/login" className="auth-back-link">← Back to login</Link>
        <Logo />
        <p>Already have an account? <Link href="/login">Log In</Link></p>
      </header>

      <section className="auth-shell auth-signup-shell">
        <aside className="auth-showcase auth-showcase-signup">
          <div className="auth-showcase-copy">
            <span className="auth-kicker">JOIN THE UNIVERSE</span>
            <h1>Create your<br/><span>ESB Games account</span></h1>
            <p>Join players and creators building, discovering and connecting across ESB Games.</p>
          </div>

          <div className="auth-signup-benefits">
            <div><span><UsersIcon/></span><p><strong>Play together</strong>Discover experiences and join your communities.</p></div>
            <div><span><GamepadIcon/></span><p><strong>Create and share</strong>Build, publish and grow your own games.</p></div>
            <div><span><CubeIcon/></span><p><strong>Earn rewards</strong>Unlock creator tools, ESBucks and achievements.</p></div>
            <div><span><ShieldIcon/></span><p><strong>Safe and secure</strong>Age-appropriate settings and parental controls.</p></div>
          </div>

          <div className="auth-product-preview auth-signup-preview">
            <div className="auth-preview-glow"/>
            <Image
              src="/hero-discover-preview.png"
              alt="ESB Games platform preview"
              fill
              sizes="(max-width: 900px) 90vw, 580px"
              className="auth-preview-image"
              priority
            />
          </div>

          <div className="auth-welcome-offer">
            <span>✦</span><div><strong>New here? Start with exclusive perks.</strong><p>Create an account and be ready for the ESB Games launch.</p></div><b>JOIN</b>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-kicker">CREATE YOUR ACCOUNT</span>
            <h2>Start your journey</h2>
            <p>It is quick, secure and designed for players, creators and families.</p>
          </div>

          <form className="auth-form auth-signup-form">
            <label>
              <span>Username</span>
              <div className="auth-input-wrap"><i><UserIcon/></i><input type="text" name="username" placeholder="Choose a unique username" autoComplete="username" /></div>
              <small>Use between 3 and 20 characters, with letters, numbers and underscores.</small>
            </label>
            <label>
              <span>Email address</span>
              <div className="auth-input-wrap"><i><MailIcon/></i><input type="email" name="email" placeholder="Enter your email address" autoComplete="email" /></div>
              <small>We will never share your email with anyone else.</small>
            </label>
            <div className="auth-form-columns">
              <label>
                <span>Password</span>
                <div className="auth-input-wrap"><i><LockIcon/></i><input type="password" name="password" placeholder="Create a strong password" autoComplete="new-password" /></div>
              </label>
              <label>
                <span>Confirm password</span>
                <div className="auth-input-wrap"><i><LockIcon/></i><input type="password" name="confirmPassword" placeholder="Confirm your password" autoComplete="new-password" /></div>
              </label>
            </div>
            <label>
              <span>Date of birth</span>
              <div className="auth-input-wrap"><i><CalendarIcon/></i><input type="date" name="dateOfBirth" /></div>
              <small>Please enter your real age so we can apply the correct safety settings.</small>
            </label>

            <div className="auth-info-card">
              <span>i</span><p><strong>Why we ask for your age</strong>Your age helps us provide age-appropriate content, communication settings and parental controls.</p>
            </div>

            <label className="auth-check auth-terms"><input type="checkbox"/><span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</span></label>

            <button type="button" className="auth-submit">Sign Up</button>

            <div className="auth-divider"><span>Already registered?</span></div>
            <Link href="/login" className="auth-secondary-action">Log in to your account</Link>
          </form>
        </section>
      </section>

      <footer className="auth-footer">
        <nav><a href="#terms">Terms of Service</a><a href="#privacy">Privacy Policy</a><a href="#standards">Community Standards</a><Link href="/support">Support</Link></nav>
        <p>© 2026 ESB Games. All rights reserved.</p>
      </footer>
    </main>
  );
}
