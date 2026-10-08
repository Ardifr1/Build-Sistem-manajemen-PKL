import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import AppShell from "../../components/role/app-shell.jsx";
import { authApi } from "../../api/index.js";
import "../dashboard admin/admin-pages.css";
import "./industri-pages.css";
import Dashboard from "./IndustriDashboard.jsx";
import SiswaIndustri from "./SiswaIndustri.jsx";
import VerifikasiJurnal from "./VerifikasiJurnal.jsx";
import EvaluasiIndustri from "./EvaluasiIndustri.jsx";
import ProfilPembimbing from "./ProfilPembimbing.jsx";
import SiswaDetailRoute from "../../components/role/siswa-detail-route.jsx";

const MENUS = [
  { title: "Menu Utama", items: [
    { key: "dashboard", label: "Dashboard", icon: "fa-table-cells-large", path: "/pembimbing" },
    { key: "siswa", label: "Siswa Bimbingan", icon: "fa-users", path: "/pembimbing/siswa" },
    { key: "jurnal", label: "Verifikasi Jurnal", icon: "fa-clipboard-check", path: "/pembimbing/jurnal" },
    { key: "evaluasi", label: "Evaluasi", icon: "fa-star", path: "/pembimbing/evaluasi" },
  ]},
];

const META = {
  dashboard: { title: "Dashboard Pembimbing", subtitle: "" },
  siswa: { title: "Siswa Bimbingan", subtitle: "" },
  jurnal: { title: "Verifikasi Jurnal", subtitle: "Setujui / Minta Revisi + catatan" },
  evaluasi: { title: "Evaluasi Siswa", subtitle: "Disiplin • sikap • kompetensi • feedback" },
  profil: { title: "Profil Saya", subtitle: "Data diri pembimbing industri" },
};

const HIDDEN = { profil: "/pembimbing/profil" };

function activeKey(pathname) {
  if (pathname.startsWith("/pembimbing/siswa")) return "siswa";
  if (pathname.startsWith("/pembimbing/jurnal")) return "jurnal";
  if (pathname.startsWith("/pembimbing/evaluasi")) return "evaluasi";
  if (pathname.startsWith("/pembimbing/profil")) return "profil";
  return "dashboard";
}

function DashboardIndustri() {
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
      roleLabel="PEMBIMBING"
      menus={MENUS}
      active={key}
      onNavigate={goMenu}
      user={user}
      userSub="Pembimbing Industri"
      profileKey="profil"
      title={meta.title || base.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : base.subtitle}
    >
      <Routes>
        <Route index element={<Dashboard onMeta={setMeta} />} />
        <Route path="siswa" element={<SiswaIndustri onMeta={setMeta} />} />
        <Route
          path="siswa/:id"
          element={<SiswaDetailRoute variant="industri" listPath="/pembimbing/siswa" onMeta={setMeta} />}
        />
        <Route path="jurnal" element={<VerifikasiJurnal onMeta={setMeta} />} />
        <Route path="evaluasi" element={<EvaluasiIndustri onMeta={setMeta} />} />
        <Route path="profil" element={<ProfilPembimbing onMeta={setMeta} />} />
        <Route path="*" element={<Navigate to="/pembimbing" replace />} />
      </Routes>
    </AppShell>
  );
}

export default DashboardIndustri;
