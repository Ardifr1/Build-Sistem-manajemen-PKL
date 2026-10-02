function StatCard({ label, value, hint, hintClassName = "", children, style }) {
  return (
    <div className="card" style={style}>
      {label && <div className="stat-label">{label}</div>}
      {value !== undefined && value !== null && <div className="stat-value">{value}</div>}
      {hint && <div className={hintClassName || "muted"}>{hint}</div>}
      {children}
    </div>
  );
}
export default StatCard;
