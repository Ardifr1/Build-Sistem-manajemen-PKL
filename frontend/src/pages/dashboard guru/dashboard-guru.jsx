import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import RoleLayout from "../../layouts/role/role.jsx";
import "../dashboard admin/admin-pages.css";
import "./guru-pages.css";
import Dashboard from "./GuruDashboard.jsx";
import SiswaBimbingan from "./SiswaBimbingan.jsx";
import Absensi from "./Absensi.jsx";
import MonitoringJurnal from "./MonitoringJurnal.jsx";
import Penilaian from "./Penilaian.jsx";
import SiswaDetailRoute from "../../components/role/siswa-detail-route.jsx";

const MENUS = [
  { key: "dashboard", label: "Dashboard", path: "/guru" },
  { key: "siswa", label: "Siswa Bimbingan", path: "/guru/siswa" },
  { key: "absensi", label: "Absensi", path: "/guru/absensi" },
  { key: "jurnal", label: "Monitoring Jurnal", path: "/guru/jurnal" },
  { key: "penilaian", label: "Penilaian", path: "/guru/penilaian" },
];

const META = {
  dashboard: { title: "Dashboard Guru", subtitle: "" },
  siswa: { title: "Siswa Bimbingan", subtitle: "" },
  absensi: { title: "Absensi Siswa Bimbingan", subtitle: "Rekap kehadiran" },
  jurnal: { title: "Monitoring Jurnal", subtitle: "Read-only • filter siswa & status" },
  penilaian: { title: "Penilaian Detail", subtitle: "Rekap • nilai akhir setelah SELESAI" },
};

function activeKey(pathname) {
  if (pathname.startsWith("/guru/siswa")) return "siswa";
  if (pathname.startsWith("/guru/absensi")) return "absensi";
  if (pathname.startsWith("/guru/jurnal")) return "jurnal";
  if (pathname.startsWith("/guru/penilaian")) return "penilaian";
  return "dashboard";
}

function DashboardGuru() {
  const navigate = useNavigate();
  const location = useLocation();
  const [meta, setMeta] = useState({});
  const key = activeKey(location.pathname);
  const base = META[key] || META.dashboard;

  const goMenu = (menuKey) => {
    setMeta({});
    const m = MENUS.find((x) => x.key === menuKey);
    if (m) navigate(m.path);
  };

  return (
    <RoleLayout
      menus={MENUS}
      roleLabel="GURU"
      orgLabel="SMKN 1"
      active={key}
      onNavigate={goMenu}
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
        <Route path="*" element={<Navigate to="/guru" replace />} />
      </Routes>
    </RoleLayout>
  );
}

export default DashboardGuru;
