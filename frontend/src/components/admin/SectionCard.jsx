function SectionCard({ title, subtitle, children, dark = false, style, className = "", padding }) {
  const st = {
    ...(dark ? { background: "#1E3A8A", color: "#fff", borderColor: "#1E3A8A" } : {}),
    ...(padding !== undefined ? { padding } : {}),
    ...style,
  };
  return (
    <div className={`card ${className}`.trim()} style={st}>
      {title && <div className="section-title" style={dark ? { color: "#fff" } : undefined}>{title}</div>}
      {subtitle && (
        <div className="muted" style={dark ? { color: "#BFDBFE", marginTop: -6, marginBottom: 8 } : { marginTop: -6, marginBottom: 8 }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
}
export default SectionCard;
