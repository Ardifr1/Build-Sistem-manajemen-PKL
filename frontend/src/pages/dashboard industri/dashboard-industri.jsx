import { useState } from "react";
import RoleLayout from "../../layouts/role/role.jsx";
import "../dashboard admin/admin-pages.css";
import "./industri-pages.css";
import Dashboard from "./IndustriDashboard.jsx";
import SiswaIndustri from "./SiswaIndustri.jsx";
import VerifikasiJurnal from "./VerifikasiJurnal.jsx";
import EvaluasiIndustri from "./EvaluasiIndustri.jsx";

const MENUS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "siswa", label: "Siswa Bimbingan" },
  { key: "jurnal", label: "Verifikasi Jurnal" },
  { key: "evaluasi", label: "Evaluasi" },
];

const PAGES = {
  dashboard: Dashboard,
  siswa: SiswaIndustri,
  jurnal: VerifikasiJurnal,
  evaluasi: EvaluasiIndustri,
};

const META = {
  dashboard: { title: "Dashboard Industri", subtitle: "" },
  siswa: { title: "Siswa Bimbingan", subtitle: "" },
  jurnal: { title: "Verifikasi Jurnal", subtitle: "Setujui / Minta Revisi + catatan" },
  evaluasi: { title: "Evaluasi Siswa", subtitle: "Disiplin • sikap • kompetensi • feedback" },
};

function DashboardIndustri() {
  const [active, setActive] = useState("dashboard");
  const [meta, setMeta] = useState({});
  const Page = PAGES[active] || Dashboard;
  const base = META[active] || META.dashboard;

  const navigate = (key) => {
    setMeta({});
    setActive(key);
  };

  return (
    <RoleLayout
      menus={MENUS}
      roleLabel="INDUSTRI"
      orgLabel="PT Solusi Digital"
      active={active}
      onNavigate={navigate}
      title={meta.title || base.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : base.subtitle}
    >
      <Page onNavigate={navigate} onMeta={setMeta} />
    </RoleLayout>
  );
}

export default DashboardIndustri;
