const BAR_COLORS = {
  primary: "#1D4ED8",
  accent: "#0EA5E9",
  sky: "#38BDF8",
  success: "#16A34A",
  green: "#16A34A",
  warning: "#D97706",
  yellow: "#D97706",
  danger: "#DC2626",
  white: "#FFFFFF",
  bright: "#4ADE80",
};

function ProgressBar({ value = 0, percent, variant = "primary", barColor, trackColor, height = 8, onDark = false, style }) {
  const pct = Math.max(0, Math.min(100, Number(percent !== undefined ? percent : value) || 0));
  const bar = barColor || BAR_COLORS[variant] || "#1D4ED8";
  const track = trackColor || (onDark ? "#0F2A6B" : "#F1F5F9");
  return (
    <div className="progress" style={{ background: track, height, ...style }}>
      <span style={{ width: `${pct}%`, background: bar, height }} />
    </div>
  );
}
export default ProgressBar;
