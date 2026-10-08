import { useEffect, useRef, useState } from "react";
import { attendancesApi } from "../../api/index.js";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function monthStr() {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

/**
 * Absensi siswa ala mockup: 4 kartu stat + absen masuk/pulang + lokasi real-time.
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
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ t: "", ok: true });
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    onMeta?.({
      title: "Absensi",
      subtitle: `Kehadiran PKL • ${monthStr()} • ${placement?.company?.name || "—"}`,
    });

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

    loadRiwayat();

    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      stopCam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement?.id]);

  const loadRiwayat = async () => {
    try {
      const res = await attendancesApi.index({ placement_id: placement?.id }).catch(() => ({ data: [] }));
      setRiwayat((res?.data ?? []).slice().sort((a, b) => String(b.attendance_date).localeCompare(String(a.attendance_date))));
    } catch { /* abaikan */ }
  };

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = s;
      setCamOn(true);
    } catch {
      setMsg({ t: "Kamera tidak bisa diakses.", ok: false });
    }
  };

  useEffect(() => {
    if (camOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [camOn]);

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

  // --- statistik bulan ini ---
  const bulanIni = riwayat.filter((r) => String(r.attendance_date || "").startsWith(todayStr().slice(0, 7)));
  const hadir = bulanIni.filter((r) => r.status === "present").length;
  const terlambat = bulanIni.filter((r) => r.status === "late").length;
  const izin = bulanIni.filter((r) => ["permission", "sick"].includes(r.status)).length;
  const total = bulanIni.length || 1;
  const persen = Math.round(((hadir + terlambat) / total) * 100);

  const absenHariIni = riwayat.find((r) => r.attendance_date === todayStr());
  const sudahMasuk = !!absenHariIni?.check_in;
  const sudahPulang = !!absenHariIni?.check_out;

  const kirim = async (tipe) => {
    if (!foto) { setMsg({ t: "Ambil foto selfie dulu ya.", ok: false }); return; }
    if (!gps) { setMsg({ t: "Tunggu lokasi GPS terdeteksi dulu.", ok: false }); return; }
    setSaving(true);
    setMsg({ t: "", ok: true });
    try {
      const now = new Date().toTimeString().slice(0, 8);
      if (tipe === "masuk") {
        await attendancesApi.store({
          placement_id: placement?.id,
          attendance_date: todayStr(),
          check_in: now,
          status: "present",
          photo_path: foto,
          latitude: gps.lat,
          longitude: gps.lng,
          location_accuracy: gps.acc,
        });
        setMsg({ t: "Absen masuk tercatat. Selamat bekerja!", ok: true });
      } else {
        await attendancesApi.update(absenHariIni.id, {
          check_out: now,
          latitude: gps.lat,
          longitude: gps.lng,
          location_accuracy: gps.acc,
        });
        setMsg({ t: "Absen pulang tercatat. Hati-hati di jalan!", ok: true });
      }
      setFoto(null);
      loadRiwayat();
    } catch (e) {
      setMsg({ t: e?.message || "Gagal menyimpan absen.", ok: false });
    } finally { setSaving(false); }
  };

  const stats = [
    { label: "Kehadiran", value: `${persen}%`, hint: monthStr(), icon: "fa-circle-check", bg: "#dcfce7", color: "#15803d" },
    { label: "Hadir", value: hadir, hint: `Hari • ${monthStr()}`, icon: "fa-clock", bg: "#dbeafe", color: "#1d4ed8" },
    { label: "Terlambat", value: terlambat, hint: `Kali • ${monthStr()}`, icon: "fa-triangle-exclamation", bg: "#fef3c7", color: "#b45309" },
    { label: "Izin", value: izin, hint: `Hari • ${monthStr()}`, icon: "fa-calendar", bg: "#f1f5f9", color: "#64748b" },
  ];

  const judulAbsen = !sudahMasuk ? "Absen Masuk" : sudahPulang ? "Absen Selesai" : "Absen Pulang";
  const subAbsen = absenHariIni
    ? `${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" })} • Masuk ${String(absenHariIni.check_in || "").slice(0, 5)}${sudahPulang ? ` • Pulang ${String(absenHariIni.check_out || "").slice(0, 5)}` : " (Tepat waktu)"}`
    : new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      {/* kartu statistik */}
      <div className="siswa-stats">
        {stats.map((s) => (
          <div className="siswa-stat" key={s.label}>
            <div className="siswa-stat-top">
              <span className="siswa-stat-label">{s.label}</span>
              <span className="siswa-stat-ic" style={{ background: s.bg, color: s.color }}>
                <i className={`fa-solid ${s.icon}`}></i>
              </span>
            </div>
            <div className="siswa-stat-val">{s.value}</div>
            <div className="siswa-stat-hint">{s.hint}</div>
          </div>
        ))}
      </div>

      {/* kartu absen */}
      <div className="siswa-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h3 className="siswa-card-title" style={{ margin: 0 }}>{judulAbsen}</h3>
            <div className="siswa-sub">{subAbsen}</div>
          </div>
          {gps && (
            <span className="siswa-badge s-badge-green"><span className="dot"></span>Lokasi aktif</span>
          )}
        </div>

        <div className="siswa-absen-grid">
          {/* viewfinder */}
          <div>
            <div className="siswa-viewfinder">
              <span className="vf-corner tl"></span>
              <span className="vf-corner tr"></span>
              <span className="vf-corner bl"></span>
              <span className="vf-corner br"></span>
              {foto ? (
                <img src={foto} alt="Selfie absen" />
              ) : camOn ? (
                <video ref={videoRef} playsInline muted autoPlay />
              ) : (
                <div className="vf-ph">
                  <i className="fa-solid fa-camera"></i>
                  <b>Arahkan wajah ke kamera</b>
                  <small>Foto selfie menjadi bukti kehadiran</small>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {!foto && !camOn && (
                <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-block" onClick={startCam}>
                  <i className="fa-solid fa-camera"></i> Ambil Foto
                </button>
              )}
              {camOn && (
                <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-block" onClick={ambilFoto}>
                  <i className="fa-solid fa-circle-dot"></i> Jepret
                </button>
              )}
              {foto && (
                <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-block" onClick={() => setFoto(null)}>
                  <i className="fa-solid fa-rotate-left"></i> Ulangi Foto
                </button>
              )}
            </div>
          </div>

          {/* lokasi */}
          <div>
            <div className="siswa-loc-title">Lokasi Terkini • Real-time</div>
            <div className="siswa-loc-row">
              <span>Koordinat</span>
              <b>{gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : "—"}</b>
            </div>
            <div className="siswa-loc-row">
              <span>Akurasi</span>
              {gps ? (
                <span className="siswa-badge s-badge-green"><span className="dot"></span>± {gps.acc} meter</span>
              ) : <b>—</b>}
            </div>
            <div className="siswa-loc-row">
              <span>Alamat</span>
              <b style={{ textAlign: "right", maxWidth: "60%" }}>
                {gpsErr ? gpsErr : "Mendeteksi…"}
              </b>
            </div>
            <p className="siswa-sub" style={{ marginTop: 12 }}>
              Lokasi diperbarui otomatis selama halaman ini terbuka.
            </p>
          </div>
        </div>

        {msg.t && <div className={msg.ok ? "siswa-ok" : "siswa-err"} style={{ marginTop: 12 }}>{msg.t}</div>}

        <button
          type="button"
          className="siswa-btn siswa-btn-primary siswa-btn-block siswa-btn-lg"
          style={{ marginTop: 12 }}
          disabled={saving || sudahPulang || !placement}
          onClick={() => kirim(sudahMasuk ? "pulang" : "masuk")}
        >
          {saving ? "Mengirim…" : sudahPulang ? "Absen Hari Ini Selesai" : `Ambil Foto & Kirim Absen ${sudahMasuk ? "Pulang" : "Masuk"}`}
        </button>
      </div>

      {/* riwayat */}
      <div className="siswa-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="siswa-card-title" style={{ margin: 0 }}>Riwayat Absensi</h3>
          <span className="siswa-sub">{monthStr()}</span>
        </div>
        {riwayat.length === 0 ? (
          <p className="siswa-muted">Belum ada riwayat absen.</p>
        ) : riwayat.slice(0, 10).map((r) => (
          <div key={r.id} className="siswa-doc">
            <span className="siswa-doc-ic"><i className="fa-solid fa-calendar-check"></i></span>
            <div className="siswa-doc-tx">
              <b>{r.attendance_date}</b>
              <small>Masuk {String(r.check_in || "—").slice(0, 5)}{r.check_out ? ` • Pulang ${String(r.check_out).slice(0, 5)}` : ""}</small>
            </div>
            <span className={`siswa-badge ${r.status === "present" ? "s-badge-green" : r.status === "late" ? "s-badge-amber" : "s-badge-red"}`}>
              <span className="dot"></span>
              {r.status === "present" ? "Hadir" : r.status === "late" ? "Terlambat" : r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AbsenSiswa;
