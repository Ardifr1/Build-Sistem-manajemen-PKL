import { useEffect, useState } from "react";
import { periodsApi } from "../../api/index.js";
import "./admin-pages.css";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fmtDate = (iso) => {
  if (!iso) return "-";
  const s = String(iso).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d || !BULAN[m - 1]) return s;
  return `${d} ${BULAN[m - 1]} ${y}`;
};

function statusOf(p) {
  if (p.is_active) return "AKTIF";
  const today = new Date().toISOString().slice(0, 10);
  if (p.end_date && p.end_date < today) return "SELESAI";
  return "DRAFT";
}

function PeriodeForm({ initial, onCancel, onSaved, inline }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    start_date: initial?.start_date || "",
    end_date: initial?.end_date || "",
    is_active: initial ? !!initial.is_active : false,
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
    <form className={`zip-card zip-form${inline ? " zip-form-inline" : ""}`} onSubmit={submit}>
      {error && <div className="zip-error">{error}</div>}
      <label className="zip-field">
        <span>Nama</span>
        <input value={form.name} onChange={set("name")} placeholder="cth PKL 2026" />
      </label>
      <label className="zip-field">
        <span>Tanggal mulai</span>
        <input type="date" value={form.start_date} onChange={set("start_date")} />
      </label>
      <label className="zip-field">
        <span>Tanggal selesai</span>
        <input type="date" value={form.end_date} onChange={set("end_date")} />
      </label>
      <label className="zip-field">
        <span>Status</span>
        <select
          value={form.is_active ? "AKTIF" : "DRAFT"}
          onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === "AKTIF" }))}
        >
          <option value="DRAFT">DRAFT</option>
          <option value="AKTIF">AKTIF</option>
        </select>
      </label>
      <div className="zip-form-actions">
        <button type="button" className="zip-btn zip-btn-outline" onClick={onCancel}>Batal</button>
        <button type="submit" className="zip-btn zip-btn-primary" disabled={saving}>
          {saving ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}

function PeriodePKL({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({ name: "list" }); // list | edit | tambah-inline
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    periodsApi
      .index()
      .then((res) => setRows(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err?.message || "Gagal memuat periode."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    onMeta?.({ title: "Periode PKL", subtitle: "DRAFT • AKTIF • SELESAI" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backToList = () => {
    setView({ name: "list" });
    setShowForm(false);
    onMeta?.({ title: "Periode PKL", subtitle: "DRAFT • AKTIF • SELESAI" });
    load();
  };

  if (view.name === "edit") {
    return (
      <div className="zip-page">
        <PeriodeForm initial={view.row} onCancel={backToList} onSaved={backToList} />
      </div>
    );
  }

  return (
    <div className="zip-page">
      {error && <div className="zip-error">{error}</div>}
      {loading ? (
        <p className="zip-muted">Memuat periode…</p>
      ) : (
        <div className="zip-list">
          {rows.map((p) => {
            const st = statusOf(p);
            return (
              <div className={`zip-row${st === "AKTIF" ? " highlight" : ""}`} key={p.id}>
                <span className="zip-row-text">
                  <strong>{p.name}</strong> • {st}
                </span>
                <span className="zip-row-actions" style={{ flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span className="zip-sub">{fmtDate(p.start_date)} – {fmtDate(p.end_date)}</span>
                  <span>
                    <button type="button" onClick={() => { setView({ name: "edit", row: p }); onMeta?.({ title: "Detail / Edit Periode", subtitle: "Nama • tanggal • status" }); }}>Detail</button>
                    <i>•</i>
                    <button type="button" onClick={() => { setView({ name: "edit", row: p }); onMeta?.({ title: "Detail / Edit Periode", subtitle: "Nama • tanggal • status" }); }}>Edit</button>
                  </span>
                </span>
              </div>
            );
          })}
          {rows.length === 0 && <p className="zip-muted">Belum ada periode.</p>}
        </div>
      )}
      {showForm ? (
        <PeriodeForm inline onCancel={() => setShowForm(false)} onSaved={backToList} />
      ) : (
        <button type="button" className="zip-btn zip-btn-primary" onClick={() => setShowForm(true)}>
          + Tambah Periode
        </button>
      )}
    </div>
  );
}

export default PeriodePKL;
