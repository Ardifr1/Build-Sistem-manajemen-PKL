import { useEffect, useMemo, useState } from "react";
import { attendancesApi } from "../../api/index.js";
import { getEnrichedPlacements } from "../../lib/role-data.js";
import { SkelCards } from "../../components/role/skeleton.jsx";

const STATUS = {
  present: { label: "Hadir", cls: "b-green" },
  permission: { label: "Izin", cls: "b-amber" },
  sick: { label: "Sakit", cls: "b-blue" },
  absent: { label: "Alpa", cls: "b-red" },
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function Absensi({ onMeta }) {
  const [placements, setPlacements] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState("all");

  useEffect(() => {
    onMeta?.({ title: "Absensi Siswa Bimbingan", subtitle: "Rekap kehadiran" });
    (async () => {
      try {
        const pls = await getEnrichedPlacements();
        setPlacements(pls);
        const atts = await attendancesApi.index();
        setRows(Array.isArray(atts) ? atts : atts?.data || []);
        onMeta?.({ title: "Absensi Siswa Bimbingan", subtitle: `Rekap kehadiran • ${pls.length} siswa` });
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta]);

  const studentName = useMemo(() => {
    const m = {};
    placements.forEach((p) => {
      m[p.id] = p.student?.name || `Siswa #${p.student_id}`;
    });
    return m;
  }, [placements]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const nm = (studentName[r.placement_id] || "").toLowerCase();
      if (qq && !nm.includes(qq)) return false;
      const d = r.attendance_date || r.date;
      if (date && d && String(d).slice(0, 10) !== date) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [rows, q, date, status, studentName]);

  const counts = useMemo(() => {
    const c = { present: 0, permission: 0, sick: 0, absent: 0 };
    filtered.forEach((r) => { if (c[r.status] !== undefined) c[r.status]++; });
    return c;
  }, [filtered]);

  const rate = useMemo(() => {
    const total = counts.present + counts.permission + counts.sick + counts.absent;
    return total ? Math.round(((counts.present + counts.permission + counts.sick) / total) * 100) : 0;
  }, [counts]);

  const alpaToday = rows.filter((r) => {
    const d = r.attendance_date || r.date;
    return r.status === "absent" && (!date || !d || String(d).slice(0, 10) === date);
  });

  const cards = [
    { bg: "#f0fdf4", ic: "#16a34a", label: "Hadir", num: counts.present, trend: "hari ini", svg: <polyline points="20 6 9 17 4 12" /> },
    { bg: "#eff6ff", ic: "#2563eb", label: "Izin / Sakit", num: counts.permission + counts.sick, trend: "ada keterangan", svg: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
    { bg: "#fef2f2", ic: "#dc2626", label: "Alpa", num: counts.absent, trend: "perlu perhatian", svg: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></> },
    { bg: "#faf5ff", ic: "#9333ea", label: "Kehadiran", num: `${rate}%`, trend: "rata-rata", svg: <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></> },
  ];

  return (
    <div className="zip-page">
      <div className="zip-toolbar">
        <span className="zip-search" style={{ maxWidth: 340 }}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input className="zip-input" placeholder="Cari nama siswa…" value={q} onChange={(e) => setQ(e.target.value)} />
        </span>
        <span style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <input type="date" className="zip-input" value={date} onChange={(e) => setDate(e.target.value)} />
          <select className="zip-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="present">Hadir</option>
            <option value="permission">Izin</option>
            <option value="sick">Sakit</option>
            <option value="absent">Alpa</option>
          </select>
        </span>
      </div>

      <div className="zip-stats">
        {cards.map((c) => (
          <div className="zip-stat" key={c.label} style={{ background: c.bg }}>
            <div className="zip-stat-top">
              <span className="zip-stat-ic" style={{ background: c.ic }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{c.svg}</svg>
              </span>
              <span className="zip-stat-lab">{c.label}</span>
            </div>
            <div className="zip-stat-num">{c.num}</div>
            <div className="zip-stat-trend" style={{ color: c.ic }}>{c.trend}</div>
          </div>
        ))}
      </div>

      {!loading && alpaToday.length > 0 && (
        <div className="zip-warn">
          ⚠️ <strong>{alpaToday.length} siswa alpa</strong> hari ini — belum ada keterangan.
        </div>
      )}

      {loading && <SkelCards n={3} />}
      <div className="zip-list">
        {filtered.map((r) => {
          const st = STATUS[r.status] || STATUS.present;
          const nm = studentName[r.placement_id] || `Penempatan #${r.placement_id}`;
          const tgl = r.attendance_date || r.date || "";
          return (
            <div className="zip-row" key={r.id}>
              <span className="zip-row-text">
                <strong>{nm}</strong>
                <span className="zip-sub"> • {tgl ? String(tgl).slice(0, 10) : ""} • {r.check_in ? String(r.check_in).slice(0, 5) : ""}{r.note ? ` • ${r.note}` : ""}</span>
              </span>
              <span className={`zip-badge ${st.cls}`}>{st.label}</span>
            </div>
          );
        })}
      </div>
      {!loading && filtered.length === 0 && (
        <div className="zip-muted">Tidak ada data absensi yang cocok.</div>
      )}
    </div>
  );
}

export default Absensi;
