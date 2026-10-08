import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import AppShell from "../../components/role/app-shell.jsx";
import { authApi } from "../../api/index.js";
import "../dashboard admin/admin-pages.css";
import "./guru-pages.css";
import Dashboard from "./GuruDashboard.jsx";
import SiswaBimbingan from "./SiswaBimbingan.jsx";
import Absensi from "./Absensi.jsx";
import MonitoringJurnal from "./MonitoringJurnal.jsx";
import Penilaian from "./Penilaian.jsx";
import ProfilGuru from "./ProfilGuru.jsx";
import SiswaDetailRoute from "../../components/role/siswa-detail-route.jsx";

const MENUS = [
  { title: "Menu Utama", items: [
    { key: "dashboard", label: "Dashboard", icon: "fa-table-cells-large", path: "/guru" },
    { key: "siswa", label: "Siswa Bimbingan", icon: "fa-users", path: "/guru/siswa" },
    { key: "absensi", label: "Absensi", icon: "fa-calendar-check", path: "/guru/absensi" },
    { key: "jurnal", label: "Monitoring Jurnal", icon: "fa-book-open", path: "/guru/jurnal" },
    { key: "penilaian", label: "Penilaian", icon: "fa-award", path: "/guru/penilaian" },
  ]},
];

const META = {
  dashboard: { title: "Dashboard Guru", subtitle: "" },
  siswa: { title: "Siswa Bimbingan", subtitle: "" },
  absensi: { title: "Absensi Siswa Bimbingan", subtitle: "Rekap kehadiran" },
  jurnal: { title: "Monitoring Jurnal", subtitle: "Read-only • filter siswa & status" },
  penilaian: { title: "Penilaian Detail", subtitle: "Rekap • nilai akhir setelah SELESAI" },
  profil: { title: "Profil Saya", subtitle: "Data diri guru pembimbing" },
};

const HIDDEN = { profil: "/guru/profil" };

function activeKey(pathname) {
  if (pathname.startsWith("/guru/siswa")) return "siswa";
  if (pathname.startsWith("/guru/absensi")) return "absensi";
  if (pathname.startsWith("/guru/jurnal")) return "jurnal";
  if (pathname.startsWith("/guru/penilaian")) return "penilaian";
  if (pathname.startsWith("/guru/profil")) return "profil";
  return "dashboard";
}

function DashboardGuru() {
  const navigate = useNavigate();
  const location = useLocation();
  const [meta, setMeta] = useState({});
  const key = activeKey(location.pathname);
  const base = META[key] || META.dashboard;
  const user = authApi.currentUser();

  const goMenu = (menuKey) => {
    setMeta({});
    const m = MENUS[0].items.find((x) => x.key === menuKey);
    if (m) { navigate(m.path); return; }
    if (HIDDEN[menuKey]) navigate(HIDDEN[menuKey]);
  };

  return (
    <AppShell
      roleLabel="GURU"
      menus={MENUS}
      active={key}
      onNavigate={goMenu}
      user={user}
      userSub="Guru Pembimbing"
      profileKey="profil"
      title={meta.title || base.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : base.subtitle}
    >
      <Routes>
        <Route index element={<Dashboard onMeta={setMeta} />} />
        <Route path="siswa" element={<SiswaBimbingan onMeta={setMeta} />} />
        <Route
          path="siswa/:id"
          element={<SiswaDetailRoute variant="guru" listPath="/guru/siswa" onMeta={setMeta} />}
        />
        <Route path="jurnal" element={<MonitoringJurnal onMeta={setMeta} />} />
        <Route path="absensi" element={<Absensi onMeta={setMeta} />} />
        <Route path="penilaian" element={<Penilaian onMeta={setMeta} />} />
        <Route path="profil" element={<ProfilGuru onMeta={setMeta} />} />
        <Route path="*" element={<Navigate to="/guru" replace />} />
      </Routes>
    </AppShell>
  );
}

export default DashboardGuru;
