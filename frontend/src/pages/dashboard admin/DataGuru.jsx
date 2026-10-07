import { useEffect, useMemo, useState } from "react";
import { usersApi, placementsApi } from "../../api/index.js";
import { statusLabel } from "../../lib/role-data.js";

/**
 * Admin > Data Guru — lihat data guru & siswa bimbingannya (read-only).
 * Kelola akun tetap di menu Pengguna.
 */
function DataGuru({ onMeta }) {
  const [teachers, setTeachers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, pRes, sRes] = await Promise.all([
          usersApi.index({ role: "teacher" }).catch(() => ({ data: [] })),
          placementsApi.index().catch(() => ({ data: [] })),
          usersApi.index({ role: "student" }).catch(() => ({ data: [] })),
        ]);
        const list = (tRes?.data ?? []).filter((u) => u.role === "teacher");
        setTeachers(list);
        setPlacements(pRes?.data ?? []);
        setStudents((sRes?.data ?? []).filter((u) => u.role === "student"));
        onMeta?.({ title: "Data Guru", subtitle: `${list.length} guru terdaftar` });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const studentById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s])),
    [students]
  );

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return teachers
      .map((t) => ({
        ...t,
        bimbingan: placements.filter((p) => String(p.teacher_id) === String(t.id)),
      }))
      .filter((r) => !query || r.name.toLowerCase().includes(query));
  }, [teachers, placements, q]);

  if (detail) {
    return (
      <div className="zip-page">
        <div className="zip-toolbar">
          <button type="button" className="zip-btn-outline" onClick={() => setDetail(null)}>
            ← Kembali
          </button>
        </div>
        <div className="zip-card">
          <h3 className="zip-card-title">{detail.name}</h3>
          <div className="zip-detail-grid">
            <div><span className="zip-label">Email</span><div>{detail.email}</div></div>
            <div><span className="zip-label">Siswa Bimbingan</span><div>{detail.bimbingan.length} siswa</div></div>
          </div>
        </div>
        <div className="zip-card">
          <h4 className="zip-card-title">Daftar Siswa Bimbingan</h4>
          <div className="zip-list">
            {detail.bimbingan.map((p) => (
              <div className="zip-row" key={p.id}>
                <span className="zip-row-text">
                  {studentById[p.student_id]?.name || `Siswa #${p.student_id}`} •{" "}
                  {statusLabel(p.status)}
                </span>
              </div>
            ))}
          </div>
          {detail.bimbingan.length === 0 && (
            <div className="zip-muted">Belum ada siswa bimbingan.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="zip-page">
      <div className="zip-toolbar">
        <input
          className="zip-input"
          placeholder="Cari nama guru…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading && <div className="zip-muted">Memuat…</div>}
      <div className="zip-list">
        {rows.map((r) => (
          <div className="zip-row" key={r.id}>
            <span className="zip-row-text">
              <strong>{r.name}</strong> • {r.bimbingan.length} siswa bimbingan
            </span>
            <span className="zip-row-actions">
              <button type="button" className="zip-btn-outline" onClick={() => setDetail(r)}>
                Detail
              </button>
            </span>
          </div>
        ))}
      </div>
      {!loading && rows.length === 0 && (
        <div className="zip-muted">Tidak ada data guru.</div>
      )}
    </div>
  );
}

export default DataGuru;
