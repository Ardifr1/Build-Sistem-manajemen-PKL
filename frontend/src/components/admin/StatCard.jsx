function StatCard({ label, value, hint, hintColor, valueSize = 24, children, style }) {
  return (
    <div className="card kpi-card" style={style}>
      {label && <div className="kpi-label">{label}</div>}
      {value !== undefined && value !== null && (
        <div className="kpi-value" style={{ fontSize: valueSize }}>{value}</div>
      )}
      {hint && (
        <div className="kpi-hint" style={hintColor ? { color: hintColor } : undefined}>{hint}</div>
      )}
      {children}
    </div>
  );
}
export default StatCard;
