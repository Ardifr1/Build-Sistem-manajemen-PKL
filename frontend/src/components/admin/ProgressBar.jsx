function ProgressBar({ value = 0, variant = "blue", onDark = false, style }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const variantClass = ["blue", "green", "yellow"].includes(variant) ? variant : "blue";

  if (onDark) {
    // for dark blue cards: track translucent white, bar white/blue/yellow via inline
    const barColor =
      variant === "green"
        ? "#34D399"
        : variant === "yellow"
        ? "#FDE68A"
        : variant === "white"
        ? "#fff"
        : "#93C5FD";
    return (
      <div
        className="progress"
        style={{ background: "rgba(255,255,255,.25)", ...style }}
      >
        <span style={{ width: `${pct}%`, background: barColor }} />
      </div>
    );
  }

  return (
    <div className={`progress ${variantClass}`} style={style}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
export default ProgressBar;
