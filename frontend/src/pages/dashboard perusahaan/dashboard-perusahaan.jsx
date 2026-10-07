import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import RoleLayout from "../../layouts/role/role.jsx";
import "../dashboard admin/admin-pages.css";
import "./perusahaan-pages.css";
import Dashboard from "./PerusahaanDashboard.jsx";
import ProfilPerusahaan from "./ProfilPerusahaan.jsx";
import PengajuanMagang from "./PengajuanMagang.jsx";
import SeleksiInterview from "./SeleksiInterview.jsx";
import PembimbingKelola from "./PembimbingKelola.jsx";
import EvaluasiPerusahaan from "./EvaluasiPerusahaan.jsx";

const MENUS = [
  { key: "dashboard", label: "Dashboard", path: "/perusahaan" },
  { key: "profil", label: "Profil Perusahaan", path: "/perusahaan/profil" },
  { key: "pengajuan", label: "Pengajuan Magang", path: "/perusahaan/pengajuan" },
  { key: "interview", label: "Seleksi & Interview", path: "/perusahaan/interview" },
  { key: "pembimbing", label: "Pembimbing", path: "/perusahaan/pembimbing" },
  { key: "evaluasi", label: "Evaluasi", path: "/perusahaan/evaluasi" },
];

const META = {
  dashboard: { title: "Dashboard Perusahaan", subtitle: "" },
  profil: { title: "Profil Perusahaan", subtitle: "" },
  pengajuan: { title: "Pengajuan Magang", subtitle: "Review lamaran • dikelompokkan per sekolah" },
  interview: { title: "Seleksi & Interview", subtitle: "Jadwal interview • hasil penilaian" },
  pembimbing: { title: "Pembimbing Industri", subtitle: "Buat akun pembimbing • tugaskan siswa" },
  evaluasi: { title: "Evaluasi", subtitle: "Nilai siswa magang" },
};

function activeKey(pathname) {
  if (pathname.startsWith("/perusahaan/profil")) return "profil";
  if (pathname.startsWith("/perusahaan/pengajuan")) return "pengajuan";
  if (pathname.startsWith("/perusahaan/interview")) return "interview";
  if (pathname.startsWith("/perusahaan/pembimbing")) return "pembimbing";
  if (pathname.startsWith("/perusahaan/evaluasi")) return "evaluasi";
  return "dashboard";
}

function DashboardPerusahaan() {
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
      roleLabel="PERUSAHAAN"
      orgLabel="PT Maju Digital"
      active={key}
      onNavigate={goMenu}
      title={meta.title || base.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : base.subtitle}
    >
      <Routes>
        <Route index element={<Dashboard onMeta={setMeta} />} />
        <Route path="profil" element={<ProfilPerusahaan onMeta={setMeta} />} />
        <Route path="pengajuan" element={<PengajuanMagang onMeta={setMeta} />} />
        <Route path="interview" element={<SeleksiInterview onMeta={setMeta} />} />
        <Route path="pembimbing" element={<PembimbingKelola onMeta={setMeta} />} />
        <Route path="evaluasi" element={<EvaluasiPerusahaan onMeta={setMeta} />} />
        <Route path="*" element={<Navigate to="/perusahaan" replace />} />
      </Routes>
    </RoleLayout>
  );
}

export default DashboardPerusahaan;
