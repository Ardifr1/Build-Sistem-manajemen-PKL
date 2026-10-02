const STATUS_MAP = {
  menunggu: "pill-yellow",
  "menunggu penempatan": "pill-yellow",
  "menunggu persetujuan": "pill-blue",
  diproses: "pill-blue",
  diterima: "pill-green",
  aktif: "pill-green",
  "disetujui sekolah": "pill-green",
  "pembimbing aktif": "pill-green",
  ditolak: "pill-red",
  nonaktif: "pill-red",
  penuh: "pill-red",
  "belum ditugaskan": "pill-yellow",
  selesai: "pill-gray",
  arsip: "pill-gray",
};

function StatusBadge({ status, children, className = "" }) {
  const label = children || status || "";
  const key = String(label).toLowerCase().trim();
  const mapped = STATUS_MAP[key] || "pill-gray";
  // if caller passes explicit pill-* in className, respect it
  const cls = className.includes("pill-") ? className : mapped;
  return <span className={`pill ${cls}`.trim()}>{label}</span>;
}

export default StatusBadge;
