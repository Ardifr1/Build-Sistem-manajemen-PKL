import { useEffect, useState } from "react";
import { usePolling } from "../../lib/use-polling.js";
import { useNavigate } from "react-router-dom";
import {
  getEnrichedPlacements,
  getJournalsForPlacements,
  getMyCompanyId,
} from "../../lib/role-data.js";
import { initials, avatarColor } from "../../components/admin/user-table.jsx";

function IndustriDashboard({ onMeta }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [menungguList, setMenungguList] = useState([]);
  const [sepiIds, setSepiIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  usePolling(() => setRefreshKey((k) => k + 1), 15000);

  useEffect(() => {
    (async () => {
      try {
        const companyId = await getMyCompanyId();
        let pls = await getEnrichedPlacements();
        if (companyId) {
          pls = pls.filter((p) => String(p.company_id) === String(companyId));
        }
        const active = pls.filter((p) => p.status === "active");
        const journals = await getJournalsForPlacements(active);

        const menunggu = journals
          .filter((j) => j.status === "submitted")
          .sort((a, b) => String(b.journal_date || "").localeCompare(String(a.journal_date || "")));
        const disetujui = journals.filter((j) => j.status === "verified").length;
        const revisi = journals.filter((j) => j.status === "needs_revision").length;

        // Tandai siswa yang 3 hari terakhir tidak mengisi jurnal.
        const batas = Date.now() - 3 * 864e5;
        const sepi = new Set();
        for (const p of active) {
          const js = journals.filter((j) => String(j.placement_id) === String(p.id));
          const terakhir = js[0]?.journal_date;
          if (!terakhir || new Date(terakhir).getTime() < batas) sepi.add(p.id);
        }

        onMeta?.({
          title: "Dashboard Pembimbing",
          subtitle: `${active.length} siswa • ${menunggu.length} menunggu verifikasi`,
        });
        setStats({ siswa: active.length, menunggu: menunggu.length, disetujui, revisi });
        setPlacements(active);
        setMenungguList(menunggu.slice(0, 5));
        setSepiIds(sepi);
      } catch {
        setStats({ siswa: 0, menunggu: 0, disetujui: 0, revisi: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [onMeta, refreshKey]);

  const cards = [
    { label: "Siswa Dibimbing", value: stats?.siswa ?? "…", hint: "aktif" },
    { label: "Menunggu Verifikasi", value: stats?.menunggu ?? "…", hint: "tindakan" },
    { label: "Disetujui", value: stats?.disetujui ?? "…", hint: "jurnal" },
    { label: "Perlu Revisi", value: stats?.revisi ?? "…", hint: "terkirim" },
  ];

  return (
    <div className="zip-page">
      <div className="zip-stats">
        {cards.map((c) => (
          <div className="zip-stat" key={c.label}>
            <div className="zip-stat-label">{c.label}</div>
            <div className="zip-stat-value">{loading ? "…" : c.value}</div>
            <div className="zip-stat-hint">{c.hint}</div>
          </div>
        ))}
      </div>

      <div className="zip-cols2" style={{ marginTop: 18 }}>
        {/* Jurnal menunggu verifikasi */}
        <div className="zip-card" style={{ maxWidth: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 className="zip-card-title" style={{ margin: 0 }}>Jurnal Menunggu Verifikasi</h3>
            {menungguList.length > 0 && (
              <button type="button" className="zip-btn-outline" onClick={() => navigate("/pembimbing/jurnal")}>
                Lihat semua <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
          {loading && <div className="zip-muted">Memuat…</div>}
          {!loading && menungguList.length === 0 && (
            <div className="zip-empty">
              <i className="fa-solid fa-circle-check"></i>
              <div>Belum ada jurnal menunggu verifikasi.</div>
              <small>Semua jurnal siswa sudah ditangani.</small>
            </div>
          )}
          <div className="zip-list">
            {menungguList.map((j) => (
              <div className="zip-row" key={j.id}>
                <span className="zip-row-text">
                  <strong>{j.placement?.student?.name || "Siswa"}</strong>
                  <span className="zip-sub"> • {j.journal_date || "-"}</span>
                  <br />
                  <span className="zip-muted">{(j.revised_activity || j.activity || "").slice(0, 60)}</span>
                </span>
                <span className="zip-row-actions">
                  <button type="button" className="zip-btn-primary" onClick={() => navigate("/pembimbing/jurnal")}>
                    Periksa
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Siswa bimbingan */}
        <div className="zip-card" style={{ maxWidth: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 className="zip-card-title" style={{ margin: 0 }}>Siswa Bimbingan</h3>
            {placements.length > 0 && (
              <button type="button" className="zip-btn-outline" onClick={() => navigate("/pembimbing/siswa")}>
                Lihat semua <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
          {loading && <div className="zip-muted">Memuat…</div>}
          {!loading && placements.length === 0 && (
            <div className="zip-empty">
              <i className="fa-solid fa-users"></i>
              <div>Belum ada siswa bimbingan.</div>
              <small>Siswa akan muncul setelah penempatan disetujui.</small>
            </div>
          )}
          <div className="zip-list">
            {placements.slice(0, 5).map((p) => (
              <div className="zip-row" key={p.id}>
                <span className="zip-user-cell">
                  <span className="zip-avatar" style={{ background: avatarColor(p.student?.name) }}>
                    {initials(p.student?.name)}
                  </span>
                  <span>
                    <div className="zip-user-name">{p.student?.name}</div>
                    <div className="zip-user-email">{p.company?.name || "-"}</div>
                  </span>
                </span>
                <span className="zip-row-actions">
                  <span className="zip-badge b-green">PKL Aktif</span>
                  {sepiIds.has(p.id) && (
                    <span className="zip-badge b-red" title="Belum mengisi jurnal 3 hari terakhir">
                      <i className="fa-solid fa-triangle-exclamation"></i> Jurnal sepi
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndustriDashboard;
