function SectionCard({ title, subtitle, children, dark = false, style, className = "" }) {
  const darkStyle = dark
    ? { background: "#1E3A8A", color: "#fff", borderColor: "#1E3A8A" }
    : {};
  return (
    <div className={`card ${className}`.trim()} style={{ ...darkStyle, ...style }}>
      {title && (
        <div
          className="section-title"
          style={dark ? { color: "#fff" } : undefined}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          className="muted"
          style={dark ? { color: "#DBEAFE", marginTop: -6, marginBottom: 8 } : { marginTop: -6, marginBottom: 8 }}
        >
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
}
export default SectionCard;
