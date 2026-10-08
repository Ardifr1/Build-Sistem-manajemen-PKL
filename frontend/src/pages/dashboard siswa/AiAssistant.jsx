import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { journalsApi, authApi } from "../../api/index.js";

/* ---------- analisis sederhana (client-side) ---------- */
function analisisDraf(teks) {
  const t = teks.toLowerCase();
  const saran = [];
  const pasif = ["dibenerin", "dibenerkan", "dikerjain", "dilakuin"].filter((w) => t.includes(w));
  const adaPasif = pasif.length > 0 || /sudah di\w+/.test(t);
  if (adaPasif) {
    saran.push({
      id: "pasif",
      judul: "Ubah kalimat pasif menjadi aktif",
      desc: `${pasif.length || 1} kata terdeteksi — mis. "${pasif[0] || "sudah dibenerin"}" → "saya perbaiki"`,
      on: true,
    });
  }
  saran.push({
    id: "teknologi",
    judul: "Tambahkan detail teknologi yang dipakai",
    desc: "Sebutkan versi framework dan tools pengujian endpoint",
    on: true,
  });
  if (/error|kendala|masalah|tapi|namun|galat/i.test(teks)) {
    saran.push({
      id: "kendala",
      judul: "Pisahkan kendala & solusi lebih jelas",
      desc: "Saat ini tercampur dalam satu kalimat",
      on: true,
    });
  }
  saran.push({
    id: "ringkas",
    judul: "Ringkas bagian hasil (maks 2 kalimat)",
    desc: "Draf saat ini cukup singkat — opsional",
    on: false,
  });
  return saran;
}

function terapkanRevisi(teks, ids) {
  let out = teks.trim();
  const pakai = new Set(ids);
  if (pakai.has("pasif")) {
    out = out
      .replace(/sudah dibenerin/gi, "berhasil saya perbaiki")
      .replace(/dibenerin/gi, "diperbaiki")
      .replace(/dikerjain/gi, "dikerjakan")
      .replace(/dilakuin/gi, "dilakukan");
  }
  if (pakai.has("kendala")) {
    out = out
      .replace(/ada error sedikit tapi/gi, "Sempat terjadi galat kecil, namun")
      .replace(/ada error tapi/gi, "Sempat terjadi galat, namun")
      .replace(/\btapi\b/gi, "namun");
  }
  // kapitalisasi awal kalimat
  out = out.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());
  out = out.replace(/\bapi\b/g, "API").replace(/\bnya\b/g, "nya");
  if (pakai.has("teknologi") && !/laravel|postman|react|vue|mysql/i.test(out)) {
    out += " (Teknologi: Laravel • Postman)";
  }
  return out;
}

/* ================= LANGKAH 1: input draf ================= */
function InputDraf({ draf, setDraf, onAnalisis }) {
  const [dianalisis, setDianalisis] = useState(false);
  return (
    <div className="siswa-ai-grid">
      <div className="siswa-card">
        <div className="siswa-between" style={{ marginBottom: 12 }}>
          <h3 className="siswa-card-title">Draf Jurnal</h3>
          <span className="siswa-badge s-badge-gray"><span className="dot"></span>{dianalisis ? "Sudah dianalisis" : "Belum dianalisis"}</span>
        </div>
        <textarea className="siswa-textarea" style={{ minHeight: 220 }} value={draf}
          onChange={(e) => { setDraf(e.target.value); setDianalisis(false); }}
          placeholder="Tulis draf jurnalmu di sini…" />
        <p className="siswa-muted" style={{ margin: "12px 0 16px" }}>
          Tulis apa adanya — AI membantu merapikan, bukan mengganti isinya.
        </p>
        <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-block"
          disabled={!draf.trim()} onClick={() => { setDianalisis(true); onAnalisis(); }}>
          <i className="fa-solid fa-wand-magic-sparkles"></i> Analisis dengan AI
        </button>
      </div>
      <div>
        <div className="siswa-card">
          <h3 className="siswa-card-title" style={{ marginBottom: 6 }}>Cara Kerja</h3>
          {[
            ["Tulis draf", "Ceritakan kegiatan harianmu apa adanya"],
            ["AI menganalisis", "Struktur, kejelasan, dan kelengkapan draf"],
            ["Pilih rekomendasi", "Centang saran yang sesuai dengan kenyataan"],
            ["Terapkan & kirim", "Hasil revisi singkat, kamu yang memutuskan"],
          ].map(([t, d], i) => (
            <div className="siswa-langkah" key={i}>
              <span className="siswa-langkah-n">{i + 1}</span>
              <div><b>{t}</b><small>{d}</small></div>
            </div>
          ))}
        </div>
        <div className="siswa-banner gray">
          <span className="b-ic"><i className="fa-solid fa-circle-info"></i></span>
          <div><b>AI hanya merapikan bahasa.</b> Tidak mengarang kegiatan, tidak menentukan nilai.</div>
        </div>
      </div>
    </div>
  );
}

/* ================= LANGKAH 2: rekomendasi ================= */
function Rekomendasi({ saran, toggleSaran, onTerapkan, tanggalLabel }) {
  const navigate = useNavigate();
  const terpilih = saran.filter((s) => s.on);
  return (
    <div className="siswa-card" style={{ maxWidth: 760 }}>
      <div className="siswa-between" style={{ marginBottom: 4 }}>
        <h3 className="siswa-card-title">Hasil Analisis AI</h3>
        <span className="siswa-badge s-badge-blue"><span className="dot"></span>{saran.length} saran</span>
      </div>
      <p className="siswa-sub" style={{ marginBottom: 18 }}>Draf jurnal {tanggalLabel} — pilih saran yang sesuai kenyataan</p>
      {saran.map((s) => (
        <div key={s.id} className={`siswa-saran ${s.on ? "on" : ""}`} onClick={() => toggleSaran(s.id)}>
          <span className="siswa-check">{s.on && <i className="fa-solid fa-check"></i>}</span>
          <div><b>{s.judul}</b><small>{s.desc}</small></div>
        </div>
      ))}
      <p className="siswa-muted" style={{ margin: "6px 0 18px" }}>
        Hanya centang yang benar-benar terjadi. AI tidak boleh mengarang kegiatan.
      </p>
      <div className="siswa-form-actions">
        <button type="button" className="siswa-btn siswa-btn-outline" onClick={() => navigate("/siswa/ai")}>
          Kembali
        </button>
        <button type="button" className="siswa-btn siswa-btn-primary" disabled={terpilih.length === 0} onClick={onTerapkan}>
          <i className="fa-solid fa-wand-magic-sparkles"></i> Terapkan Revisi Terpilih ({terpilih.length})
        </button>
      </div>
    </div>
  );
}

/* ================= LANGKAH 3: hasil revisi ================= */
function HasilRevisi({ draf, revisi, onEditManual, onKirim }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="siswa-compare">
        <div className="siswa-card">
          <div className="siswa-between" style={{ marginBottom: 12 }}>
            <h3 className="siswa-card-title">Versi Asli</h3>
            <span className="siswa-badge s-badge-gray"><span className="dot"></span>Drafmu</span>
          </div>
          <p>{draf}</p>
        </div>
        <div className="siswa-card">
          <div className="siswa-between" style={{ marginBottom: 12 }}>
            <h3 className="siswa-card-title">Versi Revisi AI</h3>
            <span className="siswa-badge s-badge-green"><span className="dot"></span>Siap dikirim</span>
          </div>
          <p>{revisi}</p>
        </div>
      </div>
      <div className="siswa-banner amber siswa-mt">
        <span className="b-ic"><i className="fa-solid fa-triangle-exclamation"></i></span>
        <div style={{ flex: 1 }}>
          Jika ada bagian yang <b>tidak sesuai kenyataan</b>, pilih <b>Edit Manual</b> sebelum mengirim.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" onClick={onEditManual}>
            Edit Manual
          </button>
          <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-sm" onClick={onKirim}>
            Kirim Jurnal
          </button>
        </div>
      </div>
      <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" onClick={() => navigate("/siswa/ai/rekomendasi")}>
        <i className="fa-solid fa-arrow-left"></i> Kembali ke Rekomendasi
      </button>
    </div>
  );
}

/* ================= LANGKAH 4: konfirmasi kirim ================= */
function KonfirmasiKirim({ revisi, placement, tanggal, onKembali }) {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const kirim = async () => {
    setSending(true);
    setErr("");
    try {
      await journalsApi.store({
        placement_id: placement?.id,
        student_id: authApi.currentUser()?.id,
        journal_date: tanggal,
        kegiatan: revisi.slice(0, 120),
        activity: revisi,
        ai_suggestion: "Diterapkan",
        revised_activity: revisi,
        status: "submitted",
        submitted_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
      navigate("/siswa/jurnal");
    } catch (e) {
      setErr(e?.message || "Gagal mengirim jurnal.");
    } finally { setSending(false); }
  };

  const tglFmt = new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="siswa-card">
        <div className="siswa-between" style={{ marginBottom: 4 }}>
          <h3 className="siswa-card-title">Ringkasan Jurnal</h3>
          <span className="siswa-badge s-badge-blue"><span className="dot"></span>Revisi AI diterapkan</span>
        </div>
        <p className="siswa-sub" style={{ marginBottom: 8 }}>{tglFmt} • {placement?.company_name || "Perusahaan PKL"}</p>
        <div className="siswa-kv"><span>Tanggal</span><b>{tglFmt}</b></div>
        <div className="siswa-kv"><span>Kegiatan</span><b>{revisi.slice(0, 80)}{revisi.length > 80 ? "…" : ""}</b></div>
        <div className="siswa-kv"><span>Isi Jurnal</span><b style={{ fontWeight: 400, maxWidth: "60%" }}>{revisi.slice(0, 160)}{revisi.length > 160 ? "…" : ""}</b></div>
      </div>

      <div className="siswa-banner blue">
        <span className="b-ic"><i className="fa-solid fa-square-check"></i></span>
        <div>
          Jurnal akan dikirim untuk <b>diverifikasi oleh {placement?.supervisor_name || "Pembimbing Industri"}</b> (Pembimbing Industri).
        </div>
      </div>

      {err && <div className="siswa-err">{err}</div>}

      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" className="siswa-btn siswa-btn-outline" disabled={sending} onClick={onKembali}>
          Kembali
        </button>
        <button type="button" className="siswa-btn siswa-btn-primary" style={{ flex: 1 }} disabled={sending} onClick={kirim}>
          <i className="fa-solid fa-paper-plane"></i> {sending ? "Mengirim…" : "Kirim Sekarang"}
        </button>
      </div>
    </div>
  );
}

/* ================= PARENT ================= */
function AiAssistant({ onMeta, placement }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [draf, setDraf] = useState("");
  const [saran, setSaran] = useState([]);
  const [revisi, setRevisi] = useState("");
  const [tanggal] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const awal = location.state?.drafAwal;
    if (awal && !draf) setDraf(awal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const tanggalLabel = useMemo(
    () => new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    [tanggal]
  );

  const metaFor = (p) => {
    if (p.includes("rekomendasi")) onMeta?.({ title: "Rekomendasi AI", subtitle: "Pilih saran yang sesuai dengan kegiatan sebenarnya" });
    else if (p.includes("hasil")) onMeta?.({ title: "Hasil Revisi AI", subtitle: "Periksa kembali — pastikan sesuai kegiatan sebenarnya" });
    else if (p.includes("konfirmasi")) onMeta?.({ title: "Konfirmasi Kirim", subtitle: "Periksa ringkasan jurnal sebelum dikirim" });
    else onMeta?.({ title: "AI Journal Assistant", subtitle: "Rapikan draf jurnal sebelum dikirim ke pembimbing industri" });
  };

  useEffect(() => { metaFor(location.pathname); /* eslint-disable-next-line */ }, [location.pathname]);

  const onAnalisis = () => {
    setSaran(analisisDraf(draf));
    navigate("/siswa/ai/rekomendasi");
  };
  const toggleSaran = (id) => setSaran((s) => s.map((x) => (x.id === id ? { ...x, on: !x.on } : x)));
  const onTerapkan = () => {
    const ids = saran.filter((s) => s.on).map((s) => s.id);
    setRevisi(terapkanRevisi(draf, ids));
    navigate("/siswa/ai/hasil");
  };

  return (
    <Routes>
      <Route index element={<InputDraf draf={draf} setDraf={setDraf} onAnalisis={onAnalisis} />} />
      <Route path="rekomendasi" element={
        saran.length === 0
          ? <Navigate to="/siswa/ai" replace />
          : <Rekomendasi saran={saran} toggleSaran={toggleSaran} onTerapkan={onTerapkan} tanggalLabel={tanggalLabel} />
      } />
      <Route path="hasil" element={
        !revisi
          ? <Navigate to="/siswa/ai" replace />
          : <HasilRevisi draf={draf} revisi={revisi}
              onEditManual={() => { setDraf(revisi); navigate("/siswa/ai"); }}
              onKirim={() => navigate("/siswa/ai/konfirmasi")} />
      } />
      <Route path="konfirmasi" element={
        !revisi
          ? <Navigate to="/siswa/ai" replace />
          : <KonfirmasiKirim revisi={revisi} placement={placement} tanggal={tanggal}
              onKembali={() => navigate("/siswa/ai/hasil")} />
      } />
      <Route path="*" element={<Navigate to="/siswa/ai" replace />} />
    </Routes>
  );
}

export default AiAssistant;
