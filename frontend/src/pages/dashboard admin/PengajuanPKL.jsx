import { useEffect, useState } from "react";
import { applicationsApi, placementsApi, usersApi, companiesApi, periodsApi } from "../../api/index.js";
import "./admin-pages.css";

function Persetujuan({ onMeta }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [appsRes, usersRes, companiesRes] = await Promise.all([
        applicationsApi.index({ status: "accepted" }),
        usersApi.index(),
        companiesApi.index(),
      ]);
      const apps = Array.isArray(appsRes.data) ? appsRes.data : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const companies = Array.isArray(companiesRes.data) ? companiesRes.data : [];
      const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
      const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));
      setRows(
        apps.map((a) => ({
          ...a,
          siswa: userMap[a.student_id] || `Siswa #${a.student_id}`,
          perusahaan: companyMap[a.company_id] || `Perusahaan #${a.company_id}`,
        }))
      );
    } catch (err) {
      setError(err?.message || "Gagal memuat persetujuan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    onMeta?.({ title: "Persetujuan Sekolah", subtitle: "Diterima perusahaan → resmi • butuh ACC" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setujui = async (row) => {
    setActing(row.id);
    setError("");
    try {
      await applicationsApi.update(row.id, { status: "approved" });
      try {
        const periodRes = await periodsApi.show(row.pkl_period_id);
        const p = periodRes.data || {};
        await placementsApi.store({
          student_id: row.student_id,
          company_id: row.company_id,
          pkl_period_id: row.pkl_period_id,
          application_id: row.id,
          start_date: p.start_date,
          end_date: p.end_date,
          status: "active",
        });
      } catch (e) {
        setError(e?.message || "Lamaran disetujui, tetapi penempatan resmi gagal dibuat.");
      }
      load();
    } catch (err) {
      setError(err?.message || "Gagal menyetujui lamaran.");
    } finally {
      setActing(null);
    }
  };

  const tolak = async (row) => {
    setActing(row.id);
    setError("");
    try {
      await applicationsApi.update(row.id, { status: "rejected" });
      load();
    } catch (err) {
      setError(err?.message || "Gagal menolak lamaran.");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="zip-page">
      {error && <div className="zip-error">{error}</div>}
      {loading ? (
        <p className="zip-muted">Memuat persetujuan…</p>
      ) : rows.length === 0 ? (
        <p className="zip-muted">Tidak ada lamaran yang menunggu persetujuan sekolah.</p>
      ) : (
        <div className="zip-list">
          {rows.map((r) => (
            <div className="zip-row" key={r.id}>
              <span className="zip-row-text">
                {r.siswa} → {r.perusahaan} — menunggu persetujuan
              </span>
              <span className="zip-row-actions">
                <button
                  type="button"
                  className="zip-btn zip-btn-outline"
                  disabled={acting === r.id}
                  onClick={() => tolak(r)}
                >
                  Tolak
                </button>
                <button
                  type="button"
                  className="zip-btn zip-btn-success"
                  disabled={acting === r.id}
                  onClick={() => setujui(r)}
                >
                  {acting === r.id ? "Memproses…" : "Setujui → Resmi"}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Persetujuan;
