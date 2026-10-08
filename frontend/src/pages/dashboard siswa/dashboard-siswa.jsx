import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { authApi, placementsApi, periodsApi, companiesApi } from "../../api/index.js";
import NotifBell from "../../components/role/notif-bell.jsx";
import "./siswa-pages.css";
import DashboardSiswa from "./DashboardSiswa.jsx";
import Pengajuan, { PengajuanDetail, RiwayatPengajuan } from "./Pengajuan.jsx";
import PilihPerusahaan, { PilihFinal } from "./PilihPerusahaan.jsx";
import AbsenSiswa from "./AbsenSiswa.jsx";
import JurnalSiswa, { TulisJurnal } from "./JurnalSiswa.jsx";
import AiAssistant from "./AiAssistant.jsx";
import StatusPerkembangan from "./StatusPerkembangan.jsx";
import { ProfilSiswa, DokumenSiswa } from "./AkunSiswa.jsx";
import PerusahaanPartnerSiswa from "./PerusahaanPartnerSiswa.jsx";
import FeedbackSiswa from "./FeedbackSiswa.jsx";

function initials(name) {
  const p = String(name || "?").trim().split(/\s+/);
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

/* ---------- sidebar ---------- */
function SiswaSidebar({ menus, active, onNavigate, user, fase, onLogout, open, onClose }) {
  return (
    <>
      <div
        className={`siswa-overlay ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`siswa-sidebar ${open ? "open" : ""}`}>
      <div className="siswa-brand">
        <span className="siswa-brand-mark">
          <img src="/logo-simagang.png" alt="SiMagang" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        </span>
        <span className="siswa-brand-text">
          <strong>SiMagang</strong>
          <small>SISWA</small>
        </span>
      </div>
      <nav className="siswa-nav">
        {menus.map((sec) => (
          <div key={sec.title}>
            <div className="siswa-nav-sec">{sec.title}</div>
            {sec.items.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`siswa-nav-item ${active === m.key ? "active" : ""}`}
                onClick={() => onNavigate(m.key)}
              >
                <i className={`fa-solid ${m.icon}`}></i>
                <span>{m.label}</span>
                {m.locked && <i className="fa-solid fa-lock lock"></i>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="siswa-user">
        <span className="siswa-user-av">{initials(user?.name)}</span>
        <span className="siswa-user-tx">
          <strong>{user?.name || "Siswa"}</strong>
          <small>{user?.kelas || "Siswa"}{fase === 2 ? " • PKL Aktif" : ""}</small>
        </span>
      </div>
      <button type="button" className="siswa-logout" onClick={onLogout}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Keluar</span>
      </button>
    </aside>
    </>
  );
}

/* ---------- topbar ---------- */
function SiswaTopbar({ title, subtitle, periodeLabel, fase, user, placement, onMenu }) {
  const logout = () => {
    authApi.logout().catch(() => {});
    try {
      localStorage.removeItem("simagang_token");
      localStorage.removeItem("simagang_user");
    } catch { /* abaikan */ }
    window.location.href = "/login";
  };
  return (
    <header className="siswa-topbar">
      <button type="button" className="siswa-hamburger" onClick={onMenu} aria-label="Menu">
        <i className="fa-solid fa-bars"></i>
      </button>
      <div className="siswa-topbar-tx">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="siswa-topbar-right">
        {fase === 2 && periodeLabel && (
          <span className="siswa-periode"><span className="dot"></span>{periodeLabel} • AKTIF</span>
        )}
        <NotifBell role="student" ctx={{ user, placement }} btnClass="siswa-bell" />
        <span className="siswa-avatar" title="Keluar" onClick={logout}>{initials(user?.name)}</span>
      </div>
    </header>
  );
}

/* ---------- menu per fase ---------- */
function buildMenus(fase) {
  if (fase === 2) {
    return [
      { title: "Menu Utama", items: [
        { key: "dashboard", label: "Dashboard", icon: "fa-table-cells-large", path: "/siswa" },
        { key: "absen", label: "Absen", icon: "fa-clock", path: "/siswa/absen" },
        { key: "jurnal", label: "Jurnal PKL", icon: "fa-book", path: "/siswa/jurnal" },
        { key: "ai", label: "AI Assistant", icon: "fa-wand-magic-sparkles", path: "/siswa/ai" },
        { key: "status", label: "Status & Perkembangan", icon: "fa-chart-line", path: "/siswa/status" },
        { key: "feedback", label: "Feedback", icon: "fa-message", path: "/siswa/feedback" },
      ]},
      { title: "Akun", items: [
        { key: "profil", label: "Profil Saya", icon: "fa-user", path: "/siswa/profil" },
        { key: "dokumen", label: "Dokumen", icon: "fa-file-lines", path: "/siswa/dokumen" },
      ]},
      { title: "Arsip Pengajuan", items: [
        { key: "arsip-perusahaan", label: "Perusahaan Partner", icon: "fa-building", path: "/siswa/arsip/perusahaan", locked: true },
        { key: "riwayat", label: "Riwayat Pengajuan", icon: "fa-paper-plane", path: "/siswa/arsip/riwayat", locked: true },
      ]},
    ];
  }
  return [
    { title: "Menu Utama", items: [
      { key: "dashboard", label: "Dashboard", icon: "fa-table-cells-large", path: "/siswa" },
      { key: "perusahaan", label: "Perusahaan Partner", icon: "fa-building", path: "/siswa/perusahaan" },
      { key: "pilih", label: "Pilih Perusahaan", icon: "fa-hand-pointer", path: "/siswa/pilih" },
      { key: "pengajuan", label: "Pengajuan", icon: "fa-paper-plane", path: "/siswa/pengajuan" },
      { key: "final", label: "Pilih Final", icon: "fa-list-check", path: "/siswa/final" },
    ]},
    { title: "Akun", items: [
      { key: "profil", label: "Profil Saya", icon: "fa-user", path: "/siswa/profil" },
      { key: "dokumen", label: "Dokumen", icon: "fa-file-lines", path: "/siswa/dokumen" },
    ]},
  ];
}

const META = {
  dashboard: { title: "Dashboard", subtitle: "" },
  absen: { title: "Absensi Harian", subtitle: "Catat kehadiranmu setiap hari kerja" },
  jurnal: { title: "Jurnal PKL", subtitle: "" },
  "tulis-jurnal": { title: "Tulis Jurnal", subtitle: "Ceritakan kegiatan PKL hari ini" },
  ai: { title: "AI Journal Assistant", subtitle: "Rapikan draf jurnal sebelum dikirim ke pembimbing industri" },
  rekomendasi: { title: "Rekomendasi AI", subtitle: "Pilih saran yang sesuai dengan kegiatan sebenarnya" },
  "hasil-revisi": { title: "Hasil Revisi AI", subtitle: "Periksa kembali — pastikan sesuai kegiatan sebenarnya" },
  konfirmasi: { title: "Konfirmasi Kirim", subtitle: "Periksa ringkasan jurnal sebelum dikirim" },
  status: { title: "Status & Perkembangan", subtitle: "" },
  feedback: { title: "Feedback Perusahaan", subtitle: "Penilaianmu terhadap tempat PKL" },
  profil: { title: "Profil Saya", subtitle: "Data diri siswa" },
  dokumen: { title: "Dokumen", subtitle: "Berkas persyaratan PKL" },
  perusahaan: { title: "Perusahaan Partner", subtitle: "Daftar perusahaan mitra sekolah" },
  "arsip-perusahaan": { title: "Perusahaan Partner", subtitle: "Arsip — read only" },
  pilih: { title: "Pilih Perusahaan", subtitle: "Tentukan tempat PKL impianmu" },
  pengajuan: { title: "Pengajuan PKL", subtitle: "Status pengajuan ke perusahaan" },
  "detail-pengajuan": { title: "Detail Pengajuan", subtitle: "" },
  riwayat: { title: "Riwayat Pengajuan", subtitle: "Arsip pengajuan — read only" },
  final: { title: "Pilih Final", subtitle: "Tentukan satu perusahaan pilihan terakhirmu" },
};

function activeKey(pathname) {
  if (pathname.startsWith("/siswa/absen")) return "absen";
  if (pathname.startsWith("/siswa/jurnal/tulis")) return "tulis-jurnal";
  if (pathname.startsWith("/siswa/jurnal")) return "jurnal";
  if (pathname.startsWith("/siswa/ai/rekomendasi")) return "rekomendasi";
  if (pathname.startsWith("/siswa/ai/hasil")) return "hasil-revisi";
  if (pathname.startsWith("/siswa/ai/konfirmasi")) return "konfirmasi";
  if (pathname.startsWith("/siswa/ai")) return "ai";
  if (pathname.startsWith("/siswa/status")) return "status";
  if (pathname.startsWith("/siswa/feedback")) return "feedback";
  if (pathname.startsWith("/siswa/profil")) return "profil";
  if (pathname.startsWith("/siswa/dokumen")) return "dokumen";
  if (pathname.startsWith("/siswa/arsip/perusahaan")) return "arsip-perusahaan";
  if (pathname.startsWith("/siswa/arsip/riwayat")) return "riwayat";
  if (pathname.startsWith("/siswa/perusahaan")) return "perusahaan";
  if (pathname.startsWith("/siswa/pilih")) return "pilih";
  if (pathname.startsWith("/siswa/pengajuan/")) return "detail-pengajuan";
  if (pathname.startsWith("/siswa/pengajuan")) return "pengajuan";
  if (pathname.startsWith("/siswa/final")) return "final";
  return "dashboard";
}

function DashboardSiswaShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [meta, setMeta] = useState({});
  const [fase, setFase] = useState(1);
  const [placement, setPlacement] = useState(null);
  const [periodeLabel, setPeriodeLabel] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const user = authApi.currentUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await placementsApi.index({ student_id: user?.id, status: "active" }).catch(() => ({ data: [] }));
        let aktif = (res?.data ?? [])[0] || null;
        if (aktif?.company_id) {
          const cRes = await companiesApi.show(aktif.company_id).catch(() => null);
          if (cRes?.data) aktif = { ...aktif, company_name: cRes.data.name };
        }
        setPlacement(aktif);
        setFase(aktif ? 2 : 1);
        if (aktif?.pkl_period_id) {
          const p = await periodsApi.show(aktif.pkl_period_id).catch(() => null);
          if (p?.data?.name) setPeriodeLabel(p.data.name.replace("PKL ", ""));
        }
      } catch { /* tetap fase 1 */ }
    })();
  }, [user?.id]);

  const menus = buildMenus(fase);
  const key = activeKey(location.pathname);
  const base = META[key] || META.dashboard;
  const flat = menus.flatMap((s) => s.items);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);
  const goMenu = (menuKey) => {
    setMeta({});
    setNavOpen(false);
    const m = flat.find((x) => x.key === menuKey);
    if (m) navigate(m.path);
  };

  const subtitle =
    meta.subtitle !== undefined ? meta.subtitle :
    key === "dashboard" && placement?.company_name ? `${placement.company_name} • Periode ${periodeLabel || "PKL"}` :
    key === "jurnal" && placement?.company_name ? `${placement.company_name} • Periode ${periodeLabel || "PKL"}` :
    key === "status" && placement?.company_name ? `${placement.company_name} • Periode ${periodeLabel || "PKL"}` :
    base.subtitle;

  return (
    <div className="siswa-layout">
      <SiswaSidebar menus={menus} active={key} onNavigate={goMenu} user={user} fase={fase} open={navOpen} onClose={() => setNavOpen(false)} onLogout={() => {
        authApi.logout().catch(() => {});
        try {
          localStorage.removeItem("simagang_token");
          localStorage.removeItem("simagang_user");
        } catch { /* abaikan */ }
        window.location.href = "/login";
      }} />
      <div className="siswa-main">
        <SiswaTopbar
          title={meta.title || base.title}
          subtitle={subtitle}
          periodeLabel={periodeLabel}
          fase={fase}
          user={user}
          placement={placement}
          onMenu={() => setNavOpen(true)}
        />
        <main className="siswa-content">
          <Routes>
            <Route index element={<DashboardSiswa onMeta={setMeta} fase={fase} placement={placement} />} />
            {fase === 1 && (
              <>
                <Route path="perusahaan" element={<PerusahaanPartnerSiswa onMeta={setMeta} />} />
                <Route path="pilih" element={<PilihPerusahaan onMeta={setMeta} />} />
                <Route path="pengajuan" element={<Pengajuan onMeta={setMeta} />} />
                <Route path="pengajuan/:id" element={<PengajuanDetail onMeta={setMeta} />} />
                <Route path="final" element={<PilihFinal onMeta={setMeta} />} />
              </>
            )}
            {fase === 2 && (
              <>
                <Route path="absen" element={<AbsenSiswa onMeta={setMeta} placement={placement} />} />
                <Route path="jurnal" element={<JurnalSiswa onMeta={setMeta} placement={placement} />} />
                <Route path="jurnal/tulis" element={<TulisJurnal onMeta={setMeta} placement={placement} />} />
                <Route path="ai/*" element={<AiAssistant onMeta={setMeta} placement={placement} />} />
                <Route path="status" element={<StatusPerkembangan onMeta={setMeta} placement={placement} />} />
                <Route path="feedback" element={<FeedbackSiswa onMeta={setMeta} placement={placement} />} />
                <Route path="arsip/perusahaan" element={<PerusahaanPartnerSiswa onMeta={setMeta} readonly />} />
                <Route path="arsip/riwayat" element={<RiwayatPengajuan onMeta={setMeta} />} />
              </>
            )}
            <Route path="profil" element={<ProfilSiswa onMeta={setMeta} />} />
            <Route path="dokumen" element={<DokumenSiswa onMeta={setMeta} />} />
            <Route path="*" element={<Navigate to="/siswa" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardSiswaShell;
