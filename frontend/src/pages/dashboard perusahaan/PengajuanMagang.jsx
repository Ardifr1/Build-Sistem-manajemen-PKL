import { useEffect, useState } from "react";
import { applicationsApi, placementsApi, supervisorsApi } from "../../api/index.js";

const TABS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "interview", label: "Diproses" },
  { key: "accepted", label: "Diterima" },
];

function PengajuanMagang({ onMeta }) {
  const [apps, setApps] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [selSup, setSelSup] = useState(null);

  const load = async () => {
    try {
      const r = await applicationsApi.index();
      setApps(Array.isArray(r) ? r : r?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onMeta?.({ title: "Pengajuan Magang", subtitle: "Review lamaran • dikelompokkan per sekolah" });
    load();
  }, [onMeta]);

  const filtered = apps.filter((a) => tab === "all" || a.status === tab);

  const groups = {};
  filtered.forEach((a) => {
    const sch = a.student?.school?.name || a.school_name || "Sekolah";
    if (!groups[sch]) groups[sch] = [];
    groups[sch].push(a);
  });

  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    interview: apps.filter((a) => a.status === "interview").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
  };

  const act = async (a, status) => {
    try {
      await applicationsApi.update(a.id, { status });
      load();
    } catch (e) {
      alert(e?.message || "Gagal memperbarui status.");
    }
  };

  const openAssign = async (a) => {
    setAssigning(a);
    setSelSup(null);
    try {
      const r = await supervisorsApi.index();
      setSupervisors(Array.isArray(r) ? r : r?.data || []);
    } catch {
      setSupervisors([]);
    }
  };

  const doAssign = async () => {
    if (!assigning || !selSup) return;
    try {
      await placementsApi.update(assigning.placement_id || assigning.id, { supervisor_id: selSup });
      setAssigning("done");
    } catch (e) {
      alert(e?.message || "Gagal menugaskan pembimbing.");
    }
  };

  const badge = (s) =>
    s === "accepted" ? "b-green" : s === "interview" ? "b-blue" : s === "rejected" ? "b-red" : "b-amber";
  const badgeLabel = (s) =>
    s === "accepted" ? "Diterima" : s === "interview" ? "Interview" : s === "rejected" ? "Ditolak" : "Menunggu";

  return (
    <div className="zip-page">
      <div className="zip-tabs">
        {TABS.map((t) => (
          <button key={t.key} type="button" className={`zip-tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>
      {loading && <div className="zip-muted">Memuat…</div>}
      {Object.entries(groups).map(([sch, list]) => (
        <div key={sch} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            🏫 {sch} <span className="zip-count">{list.length} pengajuan</span>
          </div>
          <div className="zip-grid2">
            {list.map((a) => (
              <div className="zip-app-card" key={a.id}>
                <span className={`zip-badge ${badge(a.status)}`} style={{ float: "right" }}>{badgeLabel(a.status)}</span>
                <div className="nm">{a.student?.name || "-"}</div>
                <div className="meta">{a.student?.class || ""} • Rata-rata {a.student?.gpa || "-"} • Lamar: {a.position || a.division || "-"}</div>
                {(a.student?.skills || []).length > 0 && (
                  <div style={{ marginBottom: 6 }}>{a.student.skills.map((s) => <span className="zip-tag" key={s}>{s}</span>)}</div>
                )}
                <div className="zip-actions">
                  {a.status === "pending" && (
                    <>
                      <button type="button" className="zip-btn-primary" onClick={() => act(a, "interview")}>Jadwalkan Interview</button>
                      <button type="button" className="zip-btn-success" onClick={() => act(a, "accepted")}>Terima</button>
                      <button type="button" className="zip-btn-danger" onClick={() => act(a, "rejected")}>Tolak</button>
                    </>
                  )}
                  {a.status === "interview" && (
                    <>
                      <button type="button" className="zip-btn-outline">Lihat Hasil Interview</button>
                      <button type="button" className="zip-btn-success" onClick={() => act(a, "accepted")}>Terima</button>
                      <button type="button" className="zip-btn-danger" onClick={() => act(a, "rejected")}>Tolak</button>
                    </>
                  )}
                  {a.status === "accepted" && (
                    <button type="button" className="zip-btn-outline" onClick={() => openAssign(a)}>Tugaskan Pembimbing →</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {!loading && filtered.length === 0 && <div className="zip-muted">Belum ada pengajuan.</div>}

      {/* Modal tugaskan pembimbing */}
      {assigning && assigning !== "done" && (
        <div className="zip-modal-overlay" onClick={() => setAssigning(null)}>
          <div className="zip-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Tugaskan Pembimbing</h2>
            <div className="sub">Pilih pembimbing industri untuk siswa yang diterima</div>
            <div className="zip-popt" style={{ cursor: "default", marginBottom: 18 }}>
              <div><div className="nm">{assigning.student?.name || "-"} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({assigning.position || "-"})</span></div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{assigning.student?.class || ""} • Diterima</div></div>
            </div>
            <div className="zip-label" style={{ marginBottom: 8 }}>Pembimbing Industri</div>
            {supervisors.map((s) => (
              <div key={s.id} className={`zip-popt${selSup === s.id ? " sel" : ""}`} onClick={() => setSelSup(s.id)}>
                <div><div className="nm">{s.name}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{s.position || s.jabatan || ""}</div></div>
                <span className="zip-count">{s.students_count ?? "?"} siswa</span>
              </div>
            ))}
            {supervisors.length === 0 && <div className="zip-muted">Belum ada pembimbing. Tambahkan di menu Pembimbing.</div>}
            <div className="zip-actions" style={{ justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" className="zip-btn-outline" onClick={() => setAssigning(null)}>Batal</button>
              <button type="button" className="zip-btn-primary" disabled={!selSup} onClick={doAssign}>Tugaskan</button>
            </div>
          </div>
        </div>
      )}

      {/* Sukses */}
      {assigning === "done" && (
        <div className="zip-modal-overlay" onClick={() => setAssigning(null)}>
          <div className="zip-modal" style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2>Berhasil Ditugaskan!</h2>
            <div className="sub">Pembimbing dapat langsung memverifikasi jurnal & memberi evaluasi.</div>
            <div className="zip-actions" style={{ justifyContent: "center" }}>
              <button type="button" className="zip-btn-primary" onClick={() => { setAssigning(null); load(); }}>Kembali ke Daftar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PengajuanMagang;
