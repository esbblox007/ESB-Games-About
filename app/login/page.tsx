import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CubeIcon, GamepadIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Log In" };

function MailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m5 7 7 5 7-5"/></svg>;
}

function LockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
}

export default function LoginPage() {
  return (
    <main className="auth-page auth-login-page">
      <section className="auth-shell auth-login-shell">
        <aside className="auth-showcase">
          <div className="auth-showcase-brand"><Logo /></div>
          <div className="auth-showcase-copy">
            <span className="auth-kicker">WELCOME BACK</span>
            <h1>Log in to<br/><span>ESB Games</span></h1>
            <p>Connect, create and play across one community of endless possibilities.</p>
          </div>

          <div className="auth-product-preview">
            <div className="auth-preview-glow"/>
            <Image
              src="/hero-discover-preview.png"
              alt="ESB Games discover platform preview"
              fill
              sizes="(max-width: 900px) 90vw, 620px"
              className="auth-preview-image"
              priority
            />
          </div>

          <div className="auth-benefit-strip">
            <div><UsersIcon/><span>Millions of<br/>players</span></div>
            <div><GamepadIcon/><span>Play and<br/>connect</span></div>
            <div><CubeIcon/><span>Create and<br/>publish</span></div>
            <div><ShieldIcon/><span>Safe and<br/>secure</span></div>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-kicker">YOUR ACCOUNT</span>
            <h2>Welcome back!</h2>
            <p>Log in to continue your ESB Games adventure.</p>
          </div>

          <form className="auth-form">
            <label>
              <span>Username or email</span>
              <div className="auth-input-wrap"><i><MailIcon/></i><input type="text" name="identity" placeholder="Enter your username or email" autoComplete="username" /></div>
            </label>
            <label>
              <span>Password</span>
              <div className="auth-input-wrap"><i><LockIcon/></i><input type="password" name="password" placeholder="Enter your password" autoComplete="current-password" /></div>
            </label>

            <div className="auth-form-meta">
              <label className="auth-check"><input type="checkbox"/><span>Remember me</span></label>
              <a href="#forgot-password">Forgot password?</a>
            </div>

            <button type="button" className="auth-submit">Log In</button>

            <div className="auth-divider"><span>New to ESB Games?</span></div>

            <Link href="/signup" className="auth-secondary-action">Create an ESB Games account</Link>

            <div className="auth-safety-card">
              <span className="auth-safety-icon"><ShieldIcon/></span>
              <div><strong>Keep your account safe</strong><p>Enable two-factor authentication after signing in to protect your account and creations.</p></div>
              <button type="button">Learn more</button>
            </div>
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
