import { useEffect, useState } from "react";
import { applicationsApi } from "../../api/index.js";

/* Halaman Seleksi & Interview — jadwal + hasil + form jadwalkan.
   Backend interviews: tabel sudah ada; endpoint menyusul (sementara data jadwal dari aplikasi berstatus interview). */
function SeleksiInterview({ onMeta }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student: "", mode: "Online (Google Meet)", date: "", time: "", link: "", pewawancara: "" });

  useEffect(() => {
    onMeta?.({ title: "Seleksi & Interview", subtitle: "Jadwal interview • hasil penilaian" });
    (async () => {
      try {
        const r = await applicationsApi.index();
        const a = Array.isArray(r) ? r : r?.data || [];
        const iv = a.filter((x) => x.status === "interview");
        setItems(iv);
        if (iv[0]) setSelected(iv[0]);
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="zip-page">
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-cols2">
        <div className="zip-card">
          <h3 className="zip-card-title" style={{ marginTop: 0 }}>Jadwal Interview</h3>
          {items.length === 0 && <div className="zip-muted">Belum ada jadwal interview.</div>}
          {items.map((x) => (
            <div key={x.id} className={`zip-iv${selected?.id === x.id ? " active" : ""}`} onClick={() => setSelected(x)}>
              <span className="zip-badge b-blue" style={{ float: "right" }}>Interview</span>
              <div className="time">{x.interview_time || "—"}</div>
              <div className="nm">{x.student?.name || "-"}</div>
              <div className="meta">{x.position || "-"} • {x.interview_mode || "Online"}</div>
            </div>
          ))}
        </div>
        <div className="zip-card">
          <h3 className="zip-card-title" style={{ marginTop: 0 }}>Hasil Interview{selected ? ` — ${selected.student?.name}` : ""}</h3>
          {!selected && <div className="zip-muted">Pilih jadwal di kiri.</div>}
          {selected && (
            <>
              <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 6 }}>
                {selected.interview_date || ""} • {selected.interview_time || ""} • {selected.interview_mode || ""}
              </div>
              {(selected.scores || [
                { label: "Komunikasi", value: selected.score_communication ?? "-" },
                { label: "Teknis / Skill", value: selected.score_technical ?? "-" },
                { label: "Sikap & Motivasi", value: selected.score_attitude ?? "-" },
              ]).map((s) => (
                <div className="zip-score" key={s.label}>
                  <div className="lab"><span>{s.label}</span><span>{s.value}</span></div>
                  <div className="zip-progress"><div style={{ width: `${Number(s.value) || 0}%` }} /></div>
                </div>
              ))}
              {selected.interview_note && (
                <div className="zip-note">💬 <strong>Catatan:</strong> {selected.interview_note}</div>
              )}
              <div className="zip-actions">
                <button type="button" className="zip-btn-success" onClick={() => applicationsApi.update(selected.id, { status: "accepted" })}>✓ Terima</button>
                <button type="button" className="zip-btn-danger" onClick={() => applicationsApi.update(selected.id, { status: "rejected" })}>✕ Tolak</button>
                <button type="button" className="zip-btn-outline">Jadwal Ulang</button>
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="zip-card-title">Jadwalkan Interview Baru</h3>
      <div className="zip-card" style={{ maxWidth: "none" }}>
        <div className="zip-form-grid">
          <label className="zip-field"><span>Nama Siswa</span><input value={form.student} onChange={set("student")} placeholder="Nama siswa" /></label>
          <label className="zip-field"><span>Mode</span>
            <select value={form.mode} onChange={set("mode")}><option>Online (Google Meet)</option><option>Onsite</option></select>
          </label>
          <label className="zip-field"><span>Tanggal</span><input type="date" value={form.date} onChange={set("date")} /></label>
          <label className="zip-field"><span>Jam</span><input type="time" value={form.time} onChange={set("time")} /></label>
          <label className="zip-field"><span>Link meeting / lokasi</span><input value={form.link} onChange={set("link")} placeholder="Link / alamat" /></label>
          <label className="zip-field"><span>Pewawancara</span><input value={form.pewawancara} onChange={set("pewawancara")} placeholder="cth: H. Wijaya" /></label>
        </div>
        <div className="zip-form-actions">
          <button type="button" className="zip-btn-primary">Simpan Jadwal</button>
        </div>
      </div>
    </div>
  );
}

export default SeleksiInterview;
