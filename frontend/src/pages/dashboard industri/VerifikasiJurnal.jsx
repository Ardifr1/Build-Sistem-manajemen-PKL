import { useEffect, useState } from "react";
import { journalsApi } from "../../api/index.js";
import {
  getEnrichedPlacements,
  getJournalsForPlacements,
  getMyCompanyId,
  statusLabel,
} from "../../lib/role-data.js";

function VerifikasiJurnal({ onMeta }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // "verified" | "needs_revision"

  const reload = async () => {
    const companyId = await getMyCompanyId();
    let placements = await getEnrichedPlacements();
    if (companyId) {
      placements = placements.filter((p) => String(p.company_id) === String(companyId));
    }
    return getJournalsForPlacements(placements);
  };

  useEffect(() => {
    onMeta?.({ title: "Verifikasi Jurnal", subtitle: "Setujui / Minta Revisi + catatan" });
    (async () => {
      try {
        setJournals(await reload());
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const openDetail = (j) => {
    setDetail(j);
    setNote(j.company_note || "");
    setError("");
    setDone(null);
  };

  const closeDetail = async (refresh) => {
    setDetail(null);
    if (refresh) {
      setLoading(true);
      try {
        setJournals(await reload());
      } finally {
        setLoading(false);
      }
    }
  };

  const verify = async (action) => {
    if (!detail) return;
    setError("");
    setProcessing(true);
    try {
      const res = await journalsApi.verify(detail.id, {
        action,
        company_note: note.trim() || null,
      });
      setDone(action);
      setDetail({ ...detail, ...(res?.data ?? {}), status: action });
    } catch (err) {
      setError(err?.message || "Gagal memverifikasi jurnal.");
    } finally {
      setProcessing(false);
    }
  };

  if (detail) {
    const j = detail;
    const menunggu = j.status === "submitted" && !done;
    return (
      <div className="zip-page">
        <div className="zip-toolbar">
          <button
            type="button"
            className="zip-btn-outline"
            onClick={() => closeDetail(!!done)}
          >
            ← Kembali
          </button>
        </div>
        <div className="zip-card">
          <h3>
            {j.placement?.student?.name} • {j.journal_date}
          </h3>
          <div className="guru-detail-grid">
            <label className="zip-field">
              <span>Aktivitas</span>
              <div>{j.revised_activity || j.activity || "-"}</div>
            </label>
            <label className="zip-field">
              <span>Status</span>
              <div>{statusLabel(done || j.status)}</div>
            </label>
          </div>

          {error && <div className="zip-error">{error}</div>}

          {done === "verified" && (
            <div className="industri-success">
              Jurnal <strong>disetujui</strong>. Siswa bisa lanjut ke jurnal berikutnya.
            </div>
          )}
          {done === "needs_revision" && (
            <div className="industri-success">
              Jurnal <strong>dikembalikan untuk direvisi</strong> beserta catatan di bawah.
            </div>
          )}

          {menunggu && (
            <>
              <label className="zip-field">
                <span>Catatan untuk siswa</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="cth Tambahkan detail kendala yang dihadapi"
                  rows={3}
                />
              </label>
              <div className="zip-form-actions">
                <button
                  type="button"
                  className="zip-btn-primary"
                  disabled={processing}
                  onClick={() => verify("verified")}
                >
                  {processing ? "Memproses…" : "Setujui"}
                </button>
                <button
                  type="button"
                  className="zip-btn-outline"
                  disabled={processing}
                  onClick={() => verify("needs_revision")}
                >
                  Minta Revisi
                </button>
              </div>
            </>
          )}

          {!menunggu && !done && j.company_note && (
            <label className="zip-field">
              <span>Catatan terkirim</span>
              <div>{j.company_note}</div>
            </label>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="zip-page">
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-list">
        {journals.map((j) => (
          <div className="zip-row" key={j.id}>
            <span className="zip-row-text">
              {j.placement?.student?.name} • {j.journal_date} •{" "}
              {(j.revised_activity || j.activity || "").slice(0, 30)} — {statusLabel(j.status)}
            </span>
            <span className="zip-row-actions">
              <button type="button" className="zip-btn-primary" onClick={() => openDetail(j)}>
                Periksa
              </button>
            </span>
          </div>
        ))}
      </div>
      {!loading && journals.length === 0 && (
        <div className="zip-muted">Belum ada jurnal untuk diverifikasi.</div>
      )}
    </div>
  );
}

export default VerifikasiJurnal;
