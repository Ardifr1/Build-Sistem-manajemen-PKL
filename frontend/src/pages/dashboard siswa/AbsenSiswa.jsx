import { useEffect, useRef, useState } from "react";
import { attendancesApi } from "../../api/index.js";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Absen siswa: foto selfie (kamera / file) + lokasi GPS real-time.
 */
function AbsenSiswa({ onMeta, placement }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const watchRef = useRef(null);
  const [camOn, setCamOn] = useState(false);
  const [foto, setFoto] = useState(null);
  const [gps, setGps] = useState(null);
  const [gpsErr, setGpsErr] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ t: "", ok: true });
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    onMeta?.({ title: "Absensi Harian", subtitle: "Catat kehadiranmu setiap hari kerja" });

    // GPS real-time
    if ("geolocation" in navigator) {
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: Math.round(pos.coords.accuracy || 0),
        }),
        () => setGpsErr("Izin lokasi ditolak. Aktifkan GPS untuk absen."),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    } else {
      setGpsErr("Perangkat tidak mendukung GPS.");
    }

    (async () => {
      try {
        const res = await attendancesApi.index({ placement_id: placement?.id }).catch(() => ({ data: [] }));
        setRiwayat((res?.data ?? []).slice().sort((a, b) => String(b.attendance_date).localeCompare(String(a.attendance_date))).slice(0, 7));
      } catch { /* abaikan */ }
    })();

    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      stopCam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement?.id]);

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play().catch(() => {});
      }
      setCamOn(true);
    } catch {
      setMsg({ t: "Kamera tidak bisa diakses. Pakai tombol pilih file sebagai gantinya.", ok: false });
    }
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamOn(false);
  };

  const ambilFoto = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
    setFoto(c.toDataURL("image/jpeg", 0.85));
    stopCam();
  };

  const pilihFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setFoto(r.result);
    r.readAsDataURL(f);
  };

  const simpan = async () => {
    if (!foto) { setMsg({ t: "Ambil foto selfie dulu ya.", ok: false }); return; }
    if (!gps) { setMsg({ t: "Tunggu lokasi GPS terdeteksi dulu.", ok: false }); return; }
    setSaving(true);
    setMsg({ t: "", ok: true });
    try {
      const now = new Date();
      await attendancesApi.store({
        placement_id: placement?.id,
        attendance_date: todayStr(),
        check_in: now.toTimeString().slice(0, 8),
        status: "present",
        note,
        photo_path: foto,
        latitude: gps.lat,
        longitude: gps.lng,
        location_accuracy: gps.acc,
      });
      setMsg({ t: "Absen berhasil dicatat. Semangat PKL hari ini!", ok: true });
      setFoto(null);
      setNote("");
      const res = await attendancesApi.index({ placement_id: placement?.id }).catch(() => ({ data: [] }));
      setRiwayat((res?.data ?? []).slice().sort((a, b) => String(b.attendance_date).localeCompare(String(a.attendance_date))).slice(0, 7));
    } catch (e) {
      setMsg({ t: e?.message || "Gagal menyimpan absen.", ok: false });
    } finally { setSaving(false); }
  };

  const sudahAbsen = riwayat.some((r) => r.attendance_date === todayStr());

  return (
    <div>
      {!placement && (
        <div className="siswa-banner amber">
          <span className="b-ic"><i className="fa-solid fa-triangle-exclamation"></i></span>
          <div>Belum ada penempatan PKL aktif. Absen tersedia setelah PKL dimulai.</div>
        </div>
      )}

      <div className="siswa-grid2">
        <div className="siswa-card">
          <h3 className="siswa-card-title" style={{ marginBottom: 4 }}>Absen Hari Ini</h3>
          <p className="siswa-sub" style={{ marginBottom: 16 }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="siswa-cam">
            {foto ? (
              <img src={foto} alt="Selfie absen" />
            ) : camOn ? (
              <video ref={videoRef} playsInline muted />
            ) : (
              <div className="siswa-cam-ph">
                <i className="fa-solid fa-camera"></i>
                <div>Belum ada foto</div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {!foto && !camOn && (
              <>
                <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-sm" onClick={startCam}>
                  <i className="fa-solid fa-camera"></i> Buka Kamera
                </button>
                <label className="siswa-btn siswa-btn-outline siswa-btn-sm" style={{ cursor: "pointer" }}>
                  <i className="fa-solid fa-image"></i> Pilih File
                  <input type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={pilihFile} />
                </label>
              </>
            )}
            {camOn && (
              <>
                <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-sm" onClick={ambilFoto}>
                  <i className="fa-solid fa-circle-dot"></i> Ambil Foto
                </button>
                <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" onClick={stopCam}>Tutup</button>
              </>
            )}
            {foto && (
              <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" onClick={() => setFoto(null)}>
                <i className="fa-solid fa-rotate-left"></i> Ulangi
              </button>
            )}
          </div>

          <div className="siswa-gps">
            <i className={`fa-solid ${gps ? "fa-location-dot" : "fa-spinner fa-spin"}`}></i>
            {gps ? (
              <span>Lokasi terdeteksi: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)} (±{gps.acc} m)</span>
            ) : (
              <span>{gpsErr || "Mendeteksi lokasi…"}</span>
            )}
          </div>

          <label className="siswa-field siswa-mt">
            <span>Catatan (opsional)</span>
            <input className="siswa-input" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="cth: datang terlambat 5 menit karena macet" />
          </label>

          {msg.t && <div className={msg.ok ? "siswa-ok" : "siswa-err"}>{msg.t}</div>}

          <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-block"
            disabled={saving || sudahAbsen || !placement} onClick={simpan}>
            <i className="fa-solid fa-fingerprint"></i>
            {saving ? "Menyimpan…" : sudahAbsen ? "Sudah Absen Hari Ini" : "Catat Kehadiran"}
          </button>
        </div>

        <div className="siswa-card">
          <h3 className="siswa-card-title" style={{ marginBottom: 12 }}>Riwayat 7 Hari Terakhir</h3>
          {riwayat.length === 0 ? (
            <p className="siswa-muted">Belum ada riwayat absen.</p>
          ) : riwayat.map((r) => (
            <div key={r.id} className="siswa-doc">
              <span className="siswa-doc-ic"><i className="fa-solid fa-calendar-check"></i></span>
              <div className="siswa-doc-tx">
                <b>{r.attendance_date}</b>
                <small>Masuk {String(r.check_in || "—").slice(0, 5)}{r.check_out ? ` • Pulang ${String(r.check_out).slice(0, 5)}` : ""}</small>
              </div>
              <span className={`siswa-badge ${r.status === "present" ? "s-badge-green" : r.status === "sick" ? "s-badge-amber" : r.status === "permission" ? "s-badge-blue" : "s-badge-red"}`}>
                <span className="dot"></span>
                {r.status === "present" ? "Hadir" : r.status === "sick" ? "Sakit" : r.status === "permission" ? "Izin" : "Alpa"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AbsenSiswa;
