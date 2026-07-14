import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="brand" aria-label="ESB Games home">
      <span className="brand-mark" aria-hidden="true">E</span>
      <span className="brand-copy">
        <strong>ESB GAMES</strong>
        <small>PLAY · CREATE · CONNECT</small>
      </span>
    </Link>
  );
}
