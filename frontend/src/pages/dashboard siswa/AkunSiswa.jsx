import { useEffect, useState } from "react";
import { authApi, profilesApi, documentsApi, applicationsApi } from "../../api/index.js";

function initials(name) {
  const p = String(name || "?").trim().split(/\s+/);
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

/* ================= PROFIL SAYA ================= */
export function ProfilSiswa({ onMeta }) {
  const user = authApi.currentUser();
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    onMeta?.({ title: "Profil Saya", subtitle: "Data diri siswa" });
    (async () => {
      try {
        const res = await profilesApi.index({ user_id: user?.id }).catch(() => ({ data: [] }));
        setProfil((res?.data ?? [])[0] || null);
      } catch { /* abaikan */ }
    })();
  }, [onMeta, user?.id]);

  const rows = [
    ["Nama Lengkap", user?.name || "—"],
    ["NIS", profil?.nis || user?.nis || "—"],
    ["Kelas", profil?.kelas || user?.kelas || "—"],
    ["Jurusan", profil?.jurusan || "—"],
    ["Email", user?.email || "—"],
    ["No. HP", profil?.phone || user?.phone || "—"],
    ["Alamat", profil?.address || "—"],
  ];

  return (
    <div className="siswa-card" style={{ maxWidth: 720 }}>
      <div className="siswa-profil-head">
        <span className="siswa-profil-av">{initials(user?.name)}</span>
        <div>
          <h3 className="siswa-card-title" style={{ fontSize: 19 }}>{user?.name || "Siswa"}</h3>
          <p className="siswa-sub">{profil?.kelas || user?.kelas || "Siswa"} • SiMagang</p>
          <span className="siswa-badge s-badge-green siswa-mt"><span className="dot"></span>Aktif</span>
        </div>
      </div>
      <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: "18px 0" }} />
      <dl className="siswa-dl">
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: "contents" }}>
            <dt>{k}</dt><dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="siswa-muted siswa-mt">
        <i className="fa-solid fa-circle-info"></i> Data profil dikelola oleh sekolah. Hubungi TU jika ada yang perlu diperbaiki.
      </p>
    </div>
  );
}

/* ================= DOKUMEN ================= */
export function DokumenSiswa({ onMeta }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    onMeta?.({ title: "Dokumen", subtitle: "Berkas persyaratan PKL" });
    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMeta]);

  const muat = async () => {
    setLoading(true);
    try {
      const aRes = await applicationsApi.index().catch(() => ({ data: [] }));
      const apps = aRes?.data ?? [];
      const semua = [];
      for (const a of apps) {
        const dRes = await documentsApi.index({ application_id: a.id }).catch(() => ({ data: [] }));
        semua.push(...(dRes?.data ?? []));
      }
      setDocs(semua);
    } finally { setLoading(false); }
  };

  const upload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setMsg("");
    try {
      const aRes = await applicationsApi.index().catch(() => ({ data: [] }));
      const appId = (aRes?.data ?? [])[0]?.id;
      await documentsApi.store({
        application_id: appId,
        document_name: f.name,
        document_type: "lainnya",
        file_path: `/storage/${f.name}`,
        status: "pending",
      });
      setMsg("Dokumen berhasil diunggah.");
      muat();
    } catch (err) {
      setMsg(err?.message || "Gagal mengunggah dokumen.");
    } finally { setUploading(false); }
  };

  const ikon = (t) => {
    if (/cv/i.test(t)) return "fa-id-card";
    if (/portofolio/i.test(t)) return "fa-briefcase";
    if (/sertifikat/i.test(t)) return "fa-award";
    return "fa-file-lines";
  };

  return (
    <div className="siswa-card" style={{ maxWidth: 760 }}>
      <div className="siswa-between" style={{ marginBottom: 8 }}>
        <div>
          <h3 className="siswa-card-title">Dokumen Persyaratan</h3>
          <p className="siswa-sub">CV, portofolio, dan berkas pendukung lainnya</p>
        </div>
        <label className="siswa-btn siswa-btn-primary siswa-btn-sm" style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-upload"></i> {uploading ? "Mengunggah…" : "Unggah"}
          <input type="file" style={{ display: "none" }} onChange={upload} disabled={uploading} />
        </label>
      </div>
      {msg && <div className="siswa-ok">{msg}</div>}
      {loading ? <p className="siswa-muted">Memuat…</p> : docs.length === 0 ? (
        <div className="siswa-empty">
          <i className="fa-solid fa-folder-open"></i>
          Belum ada dokumen. Unggah CV dan portofoliomu!
        </div>
      ) : docs.map((d) => (
        <div className="siswa-doc" key={d.id}>
          <span className="siswa-doc-ic"><i className={`fa-solid ${ikon(d.document_type)}`}></i></span>
          <div className="siswa-doc-tx">
            <b>{d.document_name}</b>
            <small>{d.document_type}</small>
          </div>
          <span className={`siswa-badge ${d.status === "verified" ? "s-badge-green" : d.status === "rejected" ? "s-badge-red" : "s-badge-amber"}`}>
            <span className="dot"></span>
            {d.status === "verified" ? "Terverifikasi" : d.status === "rejected" ? "Ditolak" : "Menunggu"}
          </span>
        </div>
      ))}
    </div>
  );
}
