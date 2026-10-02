const STATUS_MAP = {
  menunggu: "pill-warning",
  "menunggu penempatan": "pill-warning",
  "menunggu persetujuan": "pill-primary",
  diproses: "pill-primary",
  diterima: "pill-success",
  aktif: "pill-success",
  "disetujui sekolah": "pill-success",
  "pembimbing aktif": "pill-success",
  ditolak: "pill-danger",
  nonaktif: "pill-danger",
  penuh: "pill-danger",
  "belum ditugaskan": "pill-warning",
  selesai: "pill-gray",
  arsip: "pill-gray",
};

function StatusBadge({ status, variant, small = false, children }) {
  const label = children || status || "";
  const key = String(label).toLowerCase().trim();
  const cls = variant ? `pill-${variant}` : STATUS_MAP[key] || "pill-gray";
  return <span className={`pill ${cls} ${small ? "pill-sm" : ""}`.trim()}>{label}</span>;
}
export default StatusBadge;
