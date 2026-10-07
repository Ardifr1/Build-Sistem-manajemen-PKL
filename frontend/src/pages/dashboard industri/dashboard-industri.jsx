import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import RoleLayout from "../../layouts/role/role.jsx";
import "../dashboard admin/admin-pages.css";
import "./industri-pages.css";
import Dashboard from "./IndustriDashboard.jsx";
import SiswaIndustri from "./SiswaIndustri.jsx";
import VerifikasiJurnal from "./VerifikasiJurnal.jsx";
import EvaluasiIndustri from "./EvaluasiIndustri.jsx";
import SiswaDetailRoute from "../../components/role/siswa-detail-route.jsx";

const MENUS = [
  { key: "dashboard", label: "Dashboard", path: "/industri" },
  { key: "siswa", label: "Siswa Bimbingan", path: "/industri/siswa" },
  { key: "jurnal", label: "Verifikasi Jurnal", path: "/industri/jurnal" },
  { key: "evaluasi", label: "Evaluasi", path: "/industri/evaluasi" },
];

const META = {
  dashboard: { title: "Dashboard Industri", subtitle: "" },
  siswa: { title: "Siswa Bimbingan", subtitle: "" },
  jurnal: { title: "Verifikasi Jurnal", subtitle: "Setujui / Minta Revisi + catatan" },
  evaluasi: { title: "Evaluasi Siswa", subtitle: "Disiplin • sikap • kompetensi • feedback" },
};

function activeKey(pathname) {
  if (pathname.startsWith("/industri/siswa")) return "siswa";
  if (pathname.startsWith("/industri/jurnal")) return "jurnal";
  if (pathname.startsWith("/industri/evaluasi")) return "evaluasi";
  return "dashboard";
}

function DashboardIndustri() {
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
      roleLabel="INDUSTRI"
      orgLabel="PT Solusi Digital"
      active={key}
      onNavigate={goMenu}
      title={meta.title || base.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : base.subtitle}
    >
      <Routes>
        <Route index element={<Dashboard onMeta={setMeta} />} />
        <Route path="siswa" element={<SiswaIndustri onMeta={setMeta} />} />
        <Route
          path="siswa/:id"
          element={<SiswaDetailRoute variant="industri" listPath="/industri/siswa" onMeta={setMeta} />}
        />
        <Route path="jurnal" element={<VerifikasiJurnal onMeta={setMeta} />} />
        <Route path="evaluasi" element={<EvaluasiIndustri onMeta={setMeta} />} />
        <Route path="*" element={<Navigate to="/industri" replace />} />
      </Routes>
    </RoleLayout>
  );
}

export default DashboardIndustri;
