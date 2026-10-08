import { useEffect, useState } from "react";
import { companiesApi } from "../../api/index.js";

/**
 * Daftar perusahaan mitra. Prop `readonly` dipakai untuk arsip fase 2.
 */
function PerusahaanPartnerSiswa({ onMeta, readonly = false }) {
  const [companies, setCompanies] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Perusahaan Partner", subtitle: readonly ? "Arsip — read only" : "Daftar perusahaan mitra sekolah" });
    (async () => {
      try {
        const res = await companiesApi.index({ is_partner: true }).catch(() => ({ data: [] }));
        setCompanies(res?.data ?? []);
      } finally { setLoading(false); }
    })();
  }, [onMeta, readonly]);

  const list = companies.filter((c) =>
    !q || c.name?.toLowerCase().includes(q.toLowerCase()) || c.industry?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      {readonly && (
        <div className="siswa-banner gray">
          <span className="b-ic"><i className="fa-solid fa-lock"></i></span>
          <div>PKL-mu sudah aktif. Daftar perusahaan dikunci sebagai arsip.</div>
        </div>
      )}
      <div className="siswa-card">
        <div className="siswa-between" style={{ marginBottom: 16 }}>
          <h3 className="siswa-card-title">{companies.length} Perusahaan Mitra</h3>
          <span style={{ position: "relative" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: 14, top: 13, color: "#94a3b8", fontSize: 13 }}></i>
            <input className="siswa-input" style={{ paddingLeft: 36, width: 240 }} placeholder="Cari perusahaan…"
              value={q} onChange={(e) => setQ(e.target.value)} />
          </span>
        </div>
        {loading ? <p className="siswa-muted">Memuat…</p> : list.length === 0 ? (
          <div className="siswa-empty"><i className="fa-solid fa-building"></i>Tidak ada perusahaan ditemukan.</div>
        ) : (
          <div className="siswa-grid2">
            {list.map((c) => {
              const pct = c.student_quota ? Math.round(((c._terisi || 0) / c.student_quota) * 100) : 0;
              return (
                <div key={c.id} style={{ border: "1px solid #eef2f7", borderRadius: 14, padding: 18 }}>
                  <div className="siswa-co" style={{ marginBottom: 10 }}>
                    <span className="siswa-co-logo">{String(c.name || "?").charAt(0)}</span>
                    <div className="siswa-co-tx">
                      <b>{c.name}</b>
                      <small>{c.industry} • {c.address}</small>
                    </div>
                  </div>
                  <div className="siswa-muted" style={{ fontSize: 12 }}>
                    Kuota: {c._terisi || 0}/{c.student_quota || "—"}
                    {c.required_skills ? ` • ${c.required_skills}` : ""}
                  </div>
                  <div className="siswa-quota"><i style={{ width: `${Math.min(pct, 100)}%` }}></i></div>
                  <div className="siswa-mt">
                    <span className={`siswa-badge ${pct >= 100 ? "s-badge-red" : "s-badge-green"}`}>
                      <span className="dot"></span>{pct >= 100 ? "Penuh" : "Tersedia"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PerusahaanPartnerSiswa;
