import { useEffect, useState } from "react";
import { feedbacksApi, authApi } from "../../api/index.js";

const ASPEK = [
  ["lingkungan", "Lingkungan Kerja", "Kenyamanan dan fasilitas tempat PKL"],
  ["pembimbing", "Pembimbing Industri", "Bimbingan dan perhatian pembimbing"],
  ["kesesuaian", "Kesesuaian Bidang", "Kesesuaian pekerjaan dengan jurusan"],
  ["pengalaman", "Pengalaman Belajar", "Ilmu dan keterampilan yang didapat"],
];

function Bintang({ nilai, onPilih, disabled }) {
  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={disabled}
          onClick={() => onPilih(n)}
          style={{
            background: "none", border: 0, cursor: disabled ? "default" : "pointer",
            fontSize: 26, color: n <= nilai ? "#f59e0b" : "#e2e8f0", padding: 2,
          }}
          aria-label={`${n} bintang`}>
          <i className="fa-solid fa-star"></i>
        </button>
      ))}
    </span>
  );
}

function FeedbackSiswa({ onMeta, placement }) {
  const [nilai, setNilai] = useState({ lingkungan: 0, pembimbing: 0, kesesuaian: 0, pengalaman: 0 });
  const [catatan, setCatatan] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ t: "", ok: true });
  const [terkirim, setTerkirim] = useState(false);

  useEffect(() => {
    onMeta?.({ title: "Feedback Perusahaan", subtitle: "Penilaianmu terhadap tempat PKL" });
    (async () => {
      try {
        const res = await feedbacksApi.index({ placement_id: placement?.id }).catch(() => ({ data: [] }));
        if ((res?.data ?? []).length > 0) setTerkirim(true);
      } catch { /* abaikan */ }
    })();
  }, [onMeta, placement?.id]);

  const terkunci = placement?.status !== "completed";

  const kirim = async () => {
    if (Object.values(nilai).some((v) => v === 0)) {
      setMsg({ t: "Isi semua aspek penilaian dulu ya.", ok: false });
      return;
    }
    setSaving(true);
    try {
      await feedbacksApi.store({
        placement_id: placement?.id,
        student_id: authApi.currentUser()?.id,
        ...nilai,
        note: catatan.trim(),
        status: "pending",
      });
      setTerkirim(true);
      setMsg({ t: "Terima kasih! Feedback-mu terkirim dan menunggu review sekolah.", ok: true });
    } catch (e) {
      setMsg({ t: e?.message || "Gagal mengirim feedback.", ok: false });
    } finally { setSaving(false); }
  };

  if (terkunci) {
    return (
      <div className="siswa-card" style={{ maxWidth: 640, textAlign: "center", padding: "48px 24px" }}>
        <span className="siswa-modal-ic" style={{ background: "#f1f5f9", color: "#94a3b8", margin: "0 auto 14px" }}>
          <i className="fa-solid fa-lock"></i>
        </span>
        <h3 className="siswa-card-title" style={{ marginBottom: 8 }}>Feedback Belum Dibuka</h3>
        <p className="siswa-muted">
          Feedback perusahaan dapat diisi setelah PKL selesai
          {placement?.end_date ? <> (<b>{new Date(placement.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</b>)</> : ""}.
        </p>
      </div>
    );
  }

  if (terkirim && !msg.t) {
    return (
      <div className="siswa-card" style={{ maxWidth: 640, textAlign: "center", padding: "48px 24px" }}>
        <span className="siswa-modal-ic green" style={{ margin: "0 auto 16px" }}>
          <i className="fa-solid fa-check"></i>
        </span>
        <h3 className="siswa-card-title">Feedback Terkirim</h3>
        <p className="siswa-muted">Terima kasih atas penilaianmu!</p>
      </div>
    );
  }

  return (
    <div className="siswa-card" style={{ maxWidth: 720 }}>
      <h3 className="siswa-card-title">Nilai Pengalaman PKL-mu</h3>
      <p className="siswa-sub" style={{ marginBottom: 20 }}>
        Penilaianmu membantu sekolah memilih perusahaan mitra yang lebih baik.
      </p>
      {msg.t && <div className={msg.ok ? "siswa-ok" : "siswa-err"}>{msg.t}</div>}
      {ASPEK.map(([k, label, desc]) => (
        <div key={k} className="siswa-between" style={{ padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div>
            <b style={{ display: "block", fontSize: 14, color: "#0f172a" }}>{label}</b>
            <small className="siswa-muted">{desc}</small>
          </div>
          <Bintang nilai={nilai[k]} onPilih={(n) => setNilai((v) => ({ ...v, [k]: n }))} />
        </div>
      ))}
      <label className="siswa-field siswa-mt">
        <span>Cerita Pengalaman (opsional)</span>
        <textarea className="siswa-textarea" value={catatan} onChange={(e) => setCatatan(e.target.value)}
          placeholder="Ceritakan pengalaman PKL-mu…" />
      </label>
      <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-block" disabled={saving} onClick={kirim}>
        <i className="fa-solid fa-paper-plane"></i> {saving ? "Mengirim…" : "Kirim Feedback"}
      </button>
    </div>
  );
}

export default FeedbackSiswa;
