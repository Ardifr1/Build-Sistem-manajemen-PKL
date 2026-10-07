import { useEffect, useMemo, useState } from "react";
import { periodsApi, applicationsApi, placementsApi, companiesApi } from "../../api/index.js";
import "./admin-pages.css";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fmtDate = (iso) => {
  if (!iso) return "-";
  const s = String(iso).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d || !BULAN[m - 1]) return s;
  return `${d} ${BULAN[m - 1]} ${y}`;
};
const fmtShort = (iso) => {
  if (!iso) return "-";
  const s = String(iso).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d || !BULAN[m - 1]) return s;
  return `${d} ${BULAN[m - 1]}`;
};

function statusOf(p) {
  if (p.is_active) return "AKTIF";
  const today = new Date().toISOString().slice(0, 10);
  if (p.end_date && String(p.end_date).slice(0, 10) < today) return "SELESAI";
  return "DRAFT";
}

function PeriodeForm({ initial, onCancel, onSaved, inline }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    start_date: initial?.start_date ? String(initial.start_date).slice(0, 10) : "",
    end_date: initial?.end_date ? String(initial.end_date).slice(0, 10) : "",
    is_active: initial ? !!initial.is_active : false,
    description: initial?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.start_date || !form.end_date) {
      setError("Nama, tanggal mulai, dan tanggal selesai wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: form.is_active,
        description: form.description.trim() || null,
      };
      if (initial?.id) await periodsApi.update(initial.id, payload);
      else await periodsApi.store(payload);
      onSaved?.();
    } catch (err) {
      setError(err?.message || "Gagal menyimpan periode.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={`zip-card zip-form${inline ? " zip-form-inline" : ""}`} onSubmit={submit} style={{ marginBottom: 16 }}>
      {error && <div className="zip-error">{error}</div>}
      <label className="zip-field">
        <span>Nama Periode</span>
        <input value={form.name} onChange={set("name")} placeholder="cth: PKL 2026" />
      </label>
      <div className="zip-form-grid">
        <label className="zip-field">
          <span>Tanggal Mulai</span>
          <input type="date" value={form.start_date} onChange={set("start_date")} />
        </label>
        <label className="zip-field">
          <span>Tanggal Selesai</span>
          <input type="date" value={form.end_date} onChange={set("end_date")} />
        </label>
      </div>
      {!inline && (
        <label className="zip-field">
          <span>Status</span>
          <select value={form.is_active ? "aktif" : "draft"} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "aktif" }))}>
            <option value="aktif">AKTIF</option>
            <option value="draft">DRAFT</option>
          </select>
        </label>
      )}
      <label className="zip-field">
        <span>Deskripsi</span>
        <textarea
          value={form.description}
          onChange={set("description")}
          placeholder="cth: Periode Praktik Kerja Lapangan tahun ajaran 2026/2027 untuk kelas XI semua jurusan."
          rows={3}
        />
      </label>
      <label className="zip-check">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
        <span>Jadikan periode aktif</span>
      </label>
      <div className="zip-form-actions">
        <button type="button" className="zip-btn-outline" onClick={onCancel}>Batal</button>
        <button type="submit" className="zip-btn-primary" disabled={saving}>{saving ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Simpan"}</button>
      </div>
    </form>
  );
}

function PeriodePKL({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [apps, setApps] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState({ name: "list", row: null });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [pRes, aRes, plRes, cRes] = await Promise.all([
        periodsApi.index().catch(() => ({ data: [] })),
        applicationsApi.index().catch(() => ({ data: [] })),
        placementsApi.index().catch(() => ({ data: [] })),
        companiesApi.index().catch(() => ({ data: [] })),
      ]);
      setRows(pRes?.data ?? pRes ?? []);
      setApps(aRes?.data ?? aRes ?? []);
      setPlacements(plRes?.data ?? plRes ?? []);
      setCompanies(cRes?.data ?? cRes ?? []);
    } catch (e) {
      setError(e?.message || "Gagal memuat periode.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onMeta?.({ title: "Periode PKL", subtitle: "Kelola jadwal PKL tahunan sekolah" });
    load();
  }, [onMeta]);

  const active = useMemo(() => rows.find((p) => p.is_active) || rows[0], [rows]);

  const progress = useMemo(() => {
    if (!active?.start_date || !active?.end_date) return { pct: 0, elapsed: 0, remaining: 0 };
    const start = new Date(String(active.start_date).slice(0, 10));
    const end = new Date(String(active.end_date).slice(0, 10));
    const now = new Date();
    const total = Math.max(1, Math.round((end - start) / 86400000));
    const elapsed = Math.min(total, Math.max(0, Math.round((now - start) / 86400000)));
    return { pct: Math.round((elapsed / total) * 100), elapsed, remaining: Math.max(0, total - elapsed) };
  }, [active]);

  const stats = useMemo(() => ({
    pengajuan: apps.length,
    penempatan: placements.length,
    menunggu: apps.filter((a) => a.status === "pending" || a.status === "submitted").length,
    aktif: placements.filter((p) => p.status === "active").length,
  }), [apps, placements]);

  const backToList = () => { setView({ name: "list", row: null }); setShowForm(false); load(); };

  const tutupPeriode = async (row) => {
    if (!window.confirm(`Tutup periode "${row.name}"? Seluruh aktivitas PKL (pengajuan, jurnal, absensi) akan dihentikan. Data arsip tetap tersimpan.`)) return;
    try {
      await periodsApi.update(row.id, { is_active: false });
      backToList();
    } catch (e) {
      setError(e?.message || "Gagal menutup periode.");
    }
  };

  if (view.name === "edit" && view.row) {
    const p = view.row;
    const st = statusOf(p);
    const pct = (() => {
      const start = new Date(String(p.start_date).slice(0, 10));
      const end = new Date(String(p.end_date).slice(0, 10));
      const now = new Date();
      const total = Math.max(1, Math.round((end - start) / 86400000));
      const elapsed = Math.min(total, Math.max(0, Math.round((now - start) / 86400000)));
      return Math.round((elapsed / total) * 100);
    })();
    return (
      <div className="zip-page">
        <div className="zip-toolbar">
          <button type="button" className="zip-btn-outline" onClick={backToList}>← Kembali</button>
        </div>
        {error && <div className="zip-error">{error}</div>}
        <div className="zip-cols2">
          <div>
            <div className="zip-card">
              <h3 className="zip-card-title" style={{ marginTop: 0 }}>Edit Periode</h3>
            </div>
            <PeriodeForm initial={p} onCancel={backToList} onSaved={backToList} />
          </div>
          <div>
            <div className="zip-card" style={{ marginBottom: 16 }}>
              <h3 className="zip-card-title" style={{ marginTop: 0 }}>Statistik Periode</h3>
              <div className="zip-kv"><span>Siswa terdaftar</span><strong>{stats.penempatan + stats.menunggu}</strong></div>
              <div className="zip-kv"><span>Penempatan resmi</span><strong>{stats.penempatan}</strong></div>
              <div className="zip-kv"><span>Progres</span><strong>{pct}%</strong></div>
              <div className="zip-progress" style={{ margin: "8px 0 0" }}>
                <div style={{ width: `${pct}%`, background: "#2563eb" }} />
              </div>
            </div>
            <div className="zip-card zip-danger">
              <h3 className="zip-card-title" style={{ marginTop: 0 }}>Zona Berbahaya</h3>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Tutup periode</div>
              <p className="zip-sub" style={{ margin: "0 0 14px", lineHeight: 1.6 }}>
                Menutup periode menghentikan seluruh aktivitas PKL: pengajuan, jurnal, dan absensi. Data arsip tetap tersimpan.
              </p>
              <button type="button" className="zip-btn-danger" onClick={() => tutupPeriode(p)}>
                Tutup Periode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zip-page">
      {error && <div className="zip-error">{error}</div>}
      {showForm && <PeriodeForm inline onCancel={() => setShowForm(false)} onSaved={backToList} />}

      {loading ? (
        <p className="zip-muted">Memuat periode…</p>
      ) : (
        <>
          <div className="zip-cols2" style={{ marginBottom: 16 }}>
            {/* Periode Aktif */}
            <div className="zip-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 className="zip-card-title" style={{ margin: 0 }}>Periode Aktif</h3>
                {active && (
                  statusOf(active) === "AKTIF"
                    ? <span className="zip-status s-aktif"><span className="dot" />AKTIF</span>
                    : <span className="zip-status s-nonaktif"><span className="dot" />{statusOf(active)}</span>
                )}
              </div>
              {active ? (
                <>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{active.name}</div>
                  <div className="zip-sub" style={{ margin: "4px 0 14px" }}>
                    {stats.aktif} siswa • {companies.length} perusahaan mitra
                  </div>
                  <div className="zip-kv"><span>Tanggal mulai</span><strong>{fmtDate(active.start_date)}</strong></div>
                  <div className="zip-kv"><span>Tanggal selesai</span><strong>{fmtDate(active.end_date)}</strong></div>
                  <div className="zip-kv"><span>Progres periode</span><strong>{progress.pct}%</strong></div>
                  <div className="zip-progress" style={{ margin: "8px 0" }}>
                    <div style={{ width: `${progress.pct}%`, background: "#2563eb" }} />
                  </div>
                  <div className="zip-sub">{progress.elapsed} hari berjalan • {progress.remaining} hari tersisa</div>
                </>
              ) : (
                <div className="zip-muted">Belum ada periode.</div>
              )}
            </div>

            {/* Ringkasan */}
            <div className="zip-card">
              <h3 className="zip-card-title" style={{ marginTop: 0 }}>Ringkasan Periode Ini</h3>
              <div className="zip-kv"><span>Pengajuan masuk</span><strong>{stats.pengajuan}</strong></div>
              <div className="zip-kv"><span>Penempatan resmi</span><strong>{stats.penempatan}</strong></div>
              <div className="zip-kv"><span>Menunggu persetujuan</span><strong style={{ color: "#b45309" }}>{stats.menunggu}</strong></div>
              <div className="zip-kv"><span>Siswa sudah PKL aktif</span><strong style={{ color: "#15803d" }}>{stats.aktif}</strong></div>
            </div>
          </div>

          {/* Riwayat */}
          <div className="zip-card" style={{ maxWidth: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <h3 className="zip-card-title" style={{ margin: 0 }}>Riwayat Periode</h3>
                <div className="zip-sub">Arsip jadwal PKL tahun-tahun sebelumnya</div>
              </div>
              {!showForm && (
                <button type="button" className="zip-btn-primary" onClick={() => setShowForm(true)}>
                  + Buat Periode
                </button>
              )}
            </div>
            <div className="zip-table-wrap" style={{ boxShadow: "none" }}>
              <table className="zip-table">
                <thead>
                  <tr>
                    <th>Periode</th>
                    <th>Jadwal</th>
                    <th>Siswa</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => {
                    const st = statusOf(p);
                    return (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td><span className="zip-sub">{fmtShort(p.start_date)} – {fmtDate(p.end_date)}</span></td>
                        <td><span className="zip-sub">-</span></td>
                        <td>
                          {st === "AKTIF"
                            ? <span className="zip-status s-aktif"><span className="dot" />AKTIF</span>
                            : st === "SELESAI"
                              ? <span className="zip-status s-nonaktif"><span className="dot" />SELESAI</span>
                              : <span className="zip-badge b-amber">DRAFT</span>}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="zip-act zip-act-detail"
                            onClick={() => { setView({ name: "edit", row: p }); onMeta?.({ title: "Detail / Edit Periode", subtitle: "Nama • tanggal • status" }); }}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && <p className="zip-muted">Belum ada periode.</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default PeriodePKL;
