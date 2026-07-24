export default function NewsLoading() {
  return (
    <div className="route-loading-page" role="status" aria-live="polite">
      <div className="route-loading-inner">
        <span className="route-loading-line wide" />
        <span className="route-loading-line medium" />
        <div className="route-loading-grid"><i /><i /><i /></div>
        <span className="sr-only">Loading ESB Games news…</span>
      </div>
    </div>
  );
}
