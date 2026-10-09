import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applicationsApi, companiesApi, documentsApi, reviewsApi } from "../../api/index.js";
import { SkelCards } from "../../components/role/skeleton.jsx";

const STATUS_BADGE = {
  draft: ["s-badge-gray", "Draf"],
  submitted: ["s-badge-blue", "Diajukan"],
  pending: ["s-badge-blue", "Diajukan"],
  seleksi: ["s-badge-purple", "Dalam Seleksi"],
  reviewed: ["s-badge-amber", "Diproses"],
  interview: ["s-badge-amber", "Interview"],
  accepted: ["s-badge-green", "Diterima"],
  rejected: ["s-badge-red", "Ditolak"],
};

function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch { return d; }
}

/* ================= DAFTAR PENGAJUAN ================= */
function Pengajuan({ onMeta }) {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Pengajuan PKL", subtitle: "Status pengajuan ke perusahaan" });
    (async () => {
      try {
        const [aRes, cRes] = await Promise.all([
          applicationsApi.index().catch(() => ({ data: [] })),
          companiesApi.index().catch(() => ({ data: [] })),
        ]);
        setApps(aRes?.data ?? []);
        setCompanies(cRes?.data ?? []);
      } finally { setLoading(false); }
    })();
  }, [onMeta]);

  const co = (id) => companies.find((c) => c.id === Number(id));

  // Jadwal interview: pengajuan yang sedang diproses dianggap ada jadwal
  const interview = apps.filter((a) => a.status === "reviewed");

  return (
    <div>
      <div className="siswa-banner blue">
        <span className="b-ic"><i className="fa-solid fa-circle-info"></i></span>
        <div>
          Pantau status pengajuanmu di sini. Perusahaan akan menghubungi lewat sekolah
          jika kamu lolos ke tahap interview.
        </div>
      </div>

      <div className="siswa-table-wrap">
        <table className="siswa-table">
          <thead>
            <tr><th>Perusahaan</th><th>Tgl Pengajuan</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr>
          </thead>
          <tbody>
            {apps.map((a) => {
              const [cls, lb] = STATUS_BADGE[a.status] || ["s-badge-gray", a.status];
              return (
                <tr key={a.id}>
                  <td>
                    <b>{co(a.company_id)?.name || "—"}</b>
                    <div className="siswa-muted" style={{ fontSize: 12 }}>{co(a.company_id)?.industry || ""}</div>
                  </td>
                  <td>{fmtDate(a.created_at || a.submitted_at)}</td>
                  <td><span className={`siswa-badge ${cls}`}><span className="dot"></span>{lb}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm"
                      onClick={() => navigate(`/siswa/pengajuan/${a.id}`)}>
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && apps.length === 0 && (
          <div className="siswa-empty">
            <i className="fa-solid fa-paper-plane"></i>
            Belum ada pengajuan. Pilih perusahaan dulu yuk!
            <div className="siswa-mt">
              <button type="button" className="siswa-btn siswa-btn-primary siswa-btn-sm" onClick={() => navigate("/siswa/pilih")}>
                Pilih Perusahaan
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="siswa-card">
        <h3 className="siswa-card-title">Jadwal Interview</h3>
        <p className="siswa-sub" style={{ marginBottom: 14 }}>Undangan interview dari perusahaan.</p>
        {interview.length === 0 ? (
          <p className="siswa-muted">Belum ada jadwal interview.</p>
        ) : interview.map((a) => (
          <div key={a.id} className="siswa-doc">
            <span className="siswa-doc-ic"><i className="fa-solid fa-video"></i></span>
            <div className="siswa-doc-tx">
              <b>Interview — {co(a.company_id)?.name}</b>
              <small>Hubungi wali kelas untuk detail waktu & tempat</small>
            </div>
            <span className="siswa-badge s-badge-amber"><span className="dot"></span>Terjadwal</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= DETAIL PENGAJUAN ================= */
export function PengajuanDetail({ onMeta }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [company, setCompany] = useState(null);
  const [docs, setDocs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onMeta?.({ title: "Detail Pengajuan", subtitle: "" });
    (async () => {
      try {
        const aRes = await applicationsApi.show(id).catch(() => null);
        const a = aRes?.data || null;
        setApp(a);
        if (a) {
          const [cRes, dRes, rRes] = await Promise.all([
            companiesApi.show(a.company_id).catch(() => null),
            documentsApi.index({ application_id: a.id }).catch(() => ({ data: [] })),
            reviewsApi.index({ application_id: a.id }).catch(() => ({ data: [] })),
          ]);
          setCompany(cRes?.data || null);
          setDocs(dRes?.data ?? []);
          setReviews(rRes?.data ?? []);
        }
      } finally { setLoading(false); }
    })();
  }, [id, onMeta]);

  if (loading) return <SkelCards n={3} />;
  if (!app) return <div className="siswa-empty"><i className="fa-solid fa-circle-exclamation"></i>Pengajuan tidak ditemukan.</div>;

  const [cls, lb] = STATUS_BADGE[app.status] || ["s-badge-gray", app.status];
  const steps = [
    { t: "Pengajuan dikirim", done: true, now: false },
    { t: "Diproses perusahaan", done: ["reviewed", "accepted", "rejected"].includes(app.status), now: app.status === "reviewed" },
    { t: app.status === "rejected" ? "Ditolak" : "Diterima perusahaan", done: ["accepted", "rejected"].includes(app.status), now: ["accepted", "rejected"].includes(app.status) },
  ];

  return (
    <div>
      <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" style={{ marginBottom: 16 }}
        onClick={() => navigate("/siswa/pengajuan")}>
        <i className="fa-solid fa-arrow-left"></i> Kembali
      </button>

      <div className="siswa-grid2">
        <div className="siswa-card">
          <div className="siswa-co" style={{ marginBottom: 16 }}>
            <span className="siswa-co-logo"><i className="fa-solid fa-building"></i></span>
            <div className="siswa-co-tx">
              <b style={{ fontSize: 17 }}>{company?.name || "—"}</b>
              <small>{company?.industry || ""} • {company?.address || ""}</small>
            </div>
          </div>
          <div className="siswa-kv"><span>Status</span><span className={`siswa-badge ${cls}`}><span className="dot"></span>{lb}</span></div>
          <div className="siswa-kv"><span>Tanggal Pengajuan</span><b>{fmtDate(app.created_at)}</b></div>
          <div className="siswa-kv"><span>Catatanmu</span><b>{app.student_note || "—"}</b></div>
          {company?.description && <p className="siswa-muted" style={{ marginTop: 12 }}>{company.description}</p>}
        </div>

        <div>
          <div className="siswa-card">
            <h3 className="siswa-card-title" style={{ marginBottom: 12 }}>Timeline Status</h3>
            <div className="siswa-timeline">
              {steps.map((s, i) => (
                <div key={i} className={`siswa-tl-item ${s.done ? "done" : ""} ${s.now ? "now" : ""}`}>
                  <b>{s.t}</b>
                  <small>{s.done ? "Selesai" : "Menunggu"}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="siswa-card">
            <h3 className="siswa-card-title" style={{ marginBottom: 12 }}>Persyaratan Dokumen</h3>
            {docs.length === 0 ? <p className="siswa-muted">Tidak ada dokumen terlampir.</p> :
              docs.map((d) => (
                <div key={d.id} className="siswa-doc">
                  <span className="siswa-doc-ic"><i className="fa-solid fa-file-lines"></i></span>
                  <div className="siswa-doc-tx">
                    <b>{d.document_name}</b>
                    <small>{d.document_type}</small>
                  </div>
                  <span className={`siswa-badge ${d.status === "verified" ? "s-badge-green" : "s-badge-amber"}`}>
                    <span className="dot"></span>{d.status === "verified" ? "Terpenuhi" : "Diperiksa"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="siswa-card">
          <h3 className="siswa-card-title" style={{ marginBottom: 12 }}>Catatan Perusahaan</h3>
          {reviews.map((r) => (
            <div key={r.id} className="siswa-banner gray" style={{ marginBottom: 10 }}>
              <span className="b-ic"><i className="fa-solid fa-quote-left"></i></span>
              <div>{r.note || "—"}<div className="siswa-muted" style={{ marginTop: 4 }}>{fmtDate(r.reviewed_at)}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= RIWAYAT (arsip read-only) ================= */
export function RiwayatPengajuan({ onMeta }) {
  const [apps, setApps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    onMeta?.({ title: "Riwayat Pengajuan", subtitle: "Arsip — read only" });
    (async () => {
      try {
        const [aRes, cRes] = await Promise.all([
          applicationsApi.index().catch(() => ({ data: [] })),
          companiesApi.index().catch(() => ({ data: [] })),
        ]);
        setApps(aRes?.data ?? []);
        setCompanies(cRes?.data ?? []);
      } finally { setLoading(false); }
    })();
  }, [onMeta]);

  const coName = (id) => companies.find((c) => c.id === Number(id))?.name || "—";

  const ringkas = {
    total: apps.length,
    menunggu: apps.filter((a) => a.status === "submitted").length,
    diproses: apps.filter((a) => a.status === "reviewed").length,
    diterima: apps.filter((a) => a.status === "accepted").length,
    ditolak: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div>
      <div className="siswa-banner gray">
        <span className="b-ic"><i className="fa-solid fa-lock"></i></span>
        <div>PKL-mu sudah aktif. Riwayat pengajuan dikunci sebagai arsip dan tidak bisa diubah.</div>
      </div>
      <div className="siswa-table-wrap riwayat-table">
        <table className="siswa-table">
          <thead><tr><th>Perusahaan</th><th>Tgl Pengajuan</th><th>Status Akhir</th></tr></thead>
          <tbody>
            {apps.map((a) => {
              const [cls, lb] = STATUS_BADGE[a.status] || ["s-badge-gray", a.status];
              return (
                <tr key={a.id}>
                  <td><b>{coName(a.company_id)}</b></td>
                  <td>{fmtDate(a.created_at)}</td>
                  <td><span className={`siswa-badge ${cls}`}><span className="dot"></span>{lb}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {apps.length > 0 && (
        <div className="riwayat-summary">
          <div className="riwayat-sum"><b>{ringkas.total}</b><span>Total</span></div>
          <div className="riwayat-sum"><b>{ringkas.menunggu}</b><span>Menunggu</span></div>
          <div className="riwayat-sum"><b>{ringkas.diproses}</b><span>Diproses</span></div>
          <div className="riwayat-sum"><b>{ringkas.diterima}</b><span>Diterima</span></div>
          <div className="riwayat-sum"><b>{ringkas.ditolak}</b><span>Ditolak</span></div>
        </div>
      )}
      <div className="riwayat-cards">
        {apps.map((a) => {
          const [cls, lb] = STATUS_BADGE[a.status] || ["s-badge-gray", a.status];
          return (
            <div className="riwayat-card" key={a.id}>
              <div className="riwayat-card-top">
                <span className="riwayat-card-ic"><i className="fa-solid fa-building"></i></span>
                <div className="riwayat-card-tx">
                  <b>{coName(a.company_id)}</b>
                  <small><i className="fa-regular fa-calendar"></i> Diajukan {fmtDate(a.created_at)}</small>
                  {a.updated_at && a.updated_at !== a.created_at && (
                    <small><i className="fa-regular fa-clock"></i> Diperbarui {fmtDate(a.updated_at)}</small>
                  )}
                </div>
                <span className={`siswa-badge ${cls}`}><span className="dot"></span>{lb}</span>
              </div>
              <button type="button" className="riwayat-detail-btn" onClick={() => setDetail(a)}>
                Lihat Detail <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          );
        })}
      </div>
      {!loading && apps.length === 0 && (
        <div className="siswa-empty riwayat-empty">
          <i className="fa-solid fa-box-archive"></i>
          <b>Belum Ada Riwayat Pengajuan</b>
          <p>Riwayat pengajuan akan muncul di sini setelah kamu mengajukan PKL ke perusahaan.</p>
        </div>
      )}
      {detail && (() => {
        const [cls, lb] = STATUS_BADGE[detail.status] || ["s-badge-gray", detail.status];
        return (
          <div className="siswa-modal-ov" onClick={() => setDetail(null)}>
            <div className="siswa-modal" onClick={(e) => e.stopPropagation()}>
              <div className="siswa-between" style={{ marginBottom: 12 }}>
                <h3 className="siswa-card-title" style={{ margin: 0 }}>Detail Pengajuan</h3>
                <button type="button" className="siswa-btn siswa-btn-outline siswa-btn-sm" onClick={() => setDetail(null)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="riwayat-detail-row">
                <span>Perusahaan</span><b>{coName(detail.company_id)}</b>
              </div>
              <div className="riwayat-detail-row">
                <span>Status</span><span className={`siswa-badge ${cls}`}><span className="dot"></span>{lb}</span>
              </div>
              <div className="riwayat-detail-row">
                <span>Tanggal Pengajuan</span><b>{fmtDate(detail.created_at)}</b>
              </div>
              <div className="riwayat-detail-row">
                <span>Terakhir Diperbarui</span><b>{fmtDate(detail.updated_at)}</b>
              </div>
              {detail.choice_order && (
                <div className="riwayat-detail-row">
                  <span>Urutan Pilihan</span><b>Pilihan ke-{detail.choice_order}</b>
                </div>
              )}
              {detail.student_note && (
                <div className="riwayat-detail-note">
                  <span>Catatanmu</span><p>{detail.student_note}</p>
                </div>
              )}
              {detail.company_note && (
                <div className="riwayat-detail-note">
                  <span>Catatan Perusahaan</span><p>{detail.company_note}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default Pengajuan;
