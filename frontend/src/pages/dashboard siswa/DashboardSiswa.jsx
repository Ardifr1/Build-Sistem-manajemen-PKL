import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  applicationsApi, companiesApi, journalsApi, attendancesApi,
} from "../../api/index.js";

const STATUS_BADGE = {
  submitted: ["s-badge-blue", "Menunggu"],
  reviewed: ["s-badge-amber", "Diproses"],
  accepted: ["s-badge-green", "Diterima"],
  rejected: ["s-badge-red", "Ditolak"],
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function DashboardSiswa({ onMeta, fase, placement }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [journals, setJournals] = useState([]);
  const [absenHariIni, setAbsenHariIni] = useState(null);

  useEffect(() => {
    onMeta?.({ title: "Dashboard", subtitle: "" });
    (async () => {
      try {
        const [aRes, cRes] = await Promise.all([
          applicationsApi.index().catch(() => ({ data: [] })),
          companiesApi.index({ is_partner: true }).catch(() => ({ data: [] })),
        ]);
        setApps(aRes?.data ?? []);
        setCompanies(cRes?.data ?? []);
        if (placement?.id) {
          const [jRes, abRes] = await Promise.all([
            journalsApi.index({ placement_id: placement.id }).catch(() => ({ data: [] })),
            attendancesApi.index({ placement_id: placement.id, attendance_date: todayStr() }).catch(() => ({ data: [] })),
          ]);
          setJournals(jRes?.data ?? []);
          setAbsenHariIni((abRes?.data ?? [])[0] || null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta, placement?.id]);

  const coName = (id) => companies.find((c) => c.id === Number(id))?.name || "—";

  /* ---------------- FASE 1 : pra-PKL ---------------- */
  if (fase === 1) {
    const diterima = apps.find((a) => a.status === "accepted");
    return (
      <div>
        <div className="siswa-banner blue">
          <span className="b-ic"><i className="fa-solid fa-circle-info"></i></span>
          <div>
            <strong>Selamat datang di SiMagang!</strong><br />
            Selesaikan 3 langkah ini untuk memulai PKL: pilih perusahaan, ajukan lamaran,
            lalu tentukan pilihan finalmu.
          </div>
        </div>

        <div className="siswa-grid3">
          {[
            { n: "1", t: "Pilih Perusahaan", d: "Jelajahi perusahaan mitra", icon: "fa-hand-pointer", bg: "#dbeafe", fg: "#1d4ed8", to: "/siswa/pilih" },
            { n: "2", t: "Pengajuan", d: `${apps.length} pengajuan terkirim`, icon: "fa-paper-plane", bg: "#fef3c7", fg: "#b45309", to: "/siswa/pengajuan" },
            { n: "3", t: "Pilih Final", d: diterima ? `Diterima: ${coName(diterima.company_id)}` : "Belum ada yang diterima", icon: "fa-list-check", bg: "#dcfce7", fg: "#15803d", to: "/siswa/final" },
          ].map((s) => (
            <div className="siswa-stat" key={s.n}>
              <div>
                <div className="siswa-stat-lb">Langkah {s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "6px 0 2px" }}>{s.t}</div>
                <div className="siswa-stat-hint">{s.d}</div>
                <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm siswa-mt" onClick={() => navigate(s.to)}>
                  Buka <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
              <span className="siswa-stat-ic" style={{ background: s.bg, color: s.fg }}>
                <i className={`fa-solid ${s.icon}`}></i>
              </span>
            </div>
          ))}
        </div>

        <div className="siswa-card">
          <div className="siswa-between" style={{ marginBottom: 12 }}>
            <h3 className="siswa-card-title">Pengajuan Terakhir</h3>
            <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" onClick={() => navigate("/siswa/pengajuan")}>
              Lihat Semua
            </button>
          </div>
          {loading ? <p className="siswa-muted">Memuat…</p> : apps.length === 0 ? (
            <div className="siswa-empty">
              <i className="fa-solid fa-paper-plane"></i>
              Belum ada pengajuan. Yuk pilih perusahaan dulu!
            </div>
          ) : (
            <div className="siswa-table-wrap" style={{ boxShadow: "none", margin: 0 }}>
              <table className="siswa-table">
                <thead><tr><th>Perusahaan</th><th>Status</th></tr></thead>
                <tbody>
                  {apps.slice(0, 3).map((a) => {
                    const [cls, lb] = STATUS_BADGE[a.status] || ["s-badge-gray", a.status];
                    return (
                      <tr key={a.id}>
                        <td><b>{coName(a.company_id)}</b></td>
                        <td><span className={`siswa-badge ${cls}`}><span className="dot"></span>{lb}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- FASE 2 : PKL aktif ---------------- */
  const mingguIni = journals.filter((j) => {
    const d = new Date(j.journal_date);
    const now = new Date();
    const diff = (now - d) / 86400000;
    return diff >= 0 && diff < 7;
  }).length;
  const perluRevisi = journals.filter((j) => j.status === "needs_revision").length;

  const cards = [
    { lb: "Absen Hari Ini", vl: absenHariIni ? "Sudah" : "Belum", hint: absenHariIni ? `Check-in ${String(absenHariIni.check_in || "").slice(0, 5)}` : "Jangan lupa absen ya", icon: "fa-clock", bg: "#dbeafe", fg: "#1d4ed8", to: "/siswa/absen" },
    { lb: "Jurnal Minggu Ini", vl: String(mingguIni), hint: "entri terkirim", icon: "fa-book", bg: "#dcfce7", fg: "#15803d", to: "/siswa/jurnal" },
    { lb: "Perlu Revisi", vl: String(perluRevisi), hint: "segera perbaiki", icon: "fa-triangle-exclamation", bg: "#fef3c7", fg: "#b45309", to: "/siswa/jurnal" },
    { lb: "Total Jurnal", vl: String(journals.length), hint: "entri", icon: "fa-layer-group", bg: "#f3e8ff", fg: "#7c3aed", to: "/siswa/jurnal" },
  ];

  return (
    <div>
      <div className="siswa-grid3" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {cards.map((c) => (
          <div className="siswa-stat" key={c.lb} style={{ cursor: "pointer" }} onClick={() => navigate(c.to)}>
            <div>
              <div className="siswa-stat-lb">{c.lb}</div>
              <div className="siswa-stat-vl">{c.vl}</div>
              <div className="siswa-stat-hint">{c.hint}</div>
            </div>
            <span className="siswa-stat-ic" style={{ background: c.bg, color: c.fg }}>
              <i className={`fa-solid ${c.icon}`}></i>
            </span>
          </div>
        ))}
      </div>

      <div className="siswa-grid2">
        <div className="siswa-card">
          <h3 className="siswa-card-title">Aksi Cepat</h3>
          <p className="siswa-sub" style={{ marginBottom: 16 }}>Kegiatan harianmu, satu klik.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="siswa-btn siswa-btn-primary" onClick={() => navigate("/siswa/absen")}>
              <i className="fa-solid fa-clock"></i> Absen Sekarang
            </button>
            <button type="button" className="siswa-btn siswa-btn-outline" onClick={() => navigate("/siswa/jurnal/tulis")}>
              <i className="fa-solid fa-pen"></i> Tulis Jurnal
            </button>
            <button type="button" className="siswa-btn siswa-btn-outline" onClick={() => navigate("/siswa/ai")}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> AI Assistant
            </button>
          </div>
        </div>
        <div className="siswa-card">
          <h3 className="siswa-card-title">Jurnal Terakhir</h3>
          <p className="siswa-sub" style={{ marginBottom: 8 }}>&nbsp;</p>
          {loading ? <p className="siswa-muted">Memuat…</p> : journals.length === 0 ? (
            <p className="siswa-muted">Belum ada jurnal. Mulai tulis jurnal pertamamu!</p>
          ) : (
            journals.slice(0, 3).map((j) => (
              <div key={j.id} className="siswa-jurnal-row" style={{ padding: "10px 0" }}>
                <div className="siswa-jurnal-tx">
                  <b>{String(j.activity || "").slice(0, 48)}{String(j.activity || "").length > 48 ? "…" : ""}</b>
                  <small>{j.journal_date}</small>
                </div>
                <span className={`siswa-badge ${j.status === "verified" ? "s-badge-green" : j.status === "needs_revision" ? "s-badge-amber" : j.status === "submitted" ? "s-badge-blue" : "s-badge-gray"}`}>
                  <span className="dot"></span>
                  {j.status === "verified" ? "Disetujui" : j.status === "needs_revision" ? "Revisi" : j.status === "submitted" ? "Menunggu" : "Draf"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardSiswa;
