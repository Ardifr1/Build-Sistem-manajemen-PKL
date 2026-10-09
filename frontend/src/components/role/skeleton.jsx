// Skeleton loading generik — dipakai semua role
export function SkelLines({ n = 3, widths = [] }) {
  return (
    <div className="skel skel-block" aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={`skel-line ${widths[i] || "w90"}`} />
      ))}
    </div>
  );
}

export function SkelCards({ n = 3 }) {
  return (
    <div className="skel" aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skel-card">
          <div className="skel-row">
            <div className="skel-avatar" />
            <div style={{ flex: 1 }}>
              <div className="skel-line w60" />
              <div className="skel-line w40" style={{ marginBottom: 0 }} />
            </div>
          </div>
          <div className="skel-line w90" style={{ marginBottom: 0 }} />
        </div>
      ))}
    </div>
  );
}

export function SkelTable({ cols = 3, rows = 4 }) {
  return (
    <div className="skel skel-card" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="skel-row" style={{ marginBottom: r < rows - 1 ? 14 : 0 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skel-line" style={{ flex: 1, marginBottom: 0 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
