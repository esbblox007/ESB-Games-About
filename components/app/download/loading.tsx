export default function DownloadLoading() {
  return (
    <div className="route-loading-page" role="status" aria-live="polite">
      <div className="route-loading-inner">
        <span className="route-loading-line wide" />
        <span className="route-loading-line medium" />
        <div className="route-loading-grid"><i /><i /></div>
        <span className="sr-only">Loading download information…</span>
      </div>
    </div>
  );
}
