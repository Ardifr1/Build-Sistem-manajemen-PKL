import { useState } from "react";
import RoleLayout from "../../layouts/role/role.jsx";
import "../dashboard admin/admin-pages.css";
import "./guru-pages.css";
import Dashboard from "./GuruDashboard.jsx";
import SiswaBimbingan from "./SiswaBimbingan.jsx";
import MonitoringJurnal from "./MonitoringJurnal.jsx";
import Penilaian from "./Penilaian.jsx";

const MENUS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "siswa", label: "Siswa Bimbingan" },
  { key: "jurnal", label: "Monitoring Jurnal" },
  { key: "penilaian", label: "Penilaian" },
];

const PAGES = {
  dashboard: Dashboard,
  siswa: SiswaBimbingan,
  jurnal: MonitoringJurnal,
  penilaian: Penilaian,
};

const META = {
  dashboard: { title: "Dashboard Guru", subtitle: "" },
  siswa: { title: "Siswa Bimbingan", subtitle: "" },
  jurnal: { title: "Monitoring Jurnal", subtitle: "Read-only • filter siswa & status" },
  penilaian: { title: "Penilaian Detail", subtitle: "Rekap • nilai akhir setelah SELESAI" },
};

function DashboardGuru() {
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
      roleLabel="GURU"
      orgLabel="SMKN 1"
      active={active}
      onNavigate={navigate}
      title={meta.title || base.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : base.subtitle}
    >
      <Page onNavigate={navigate} onMeta={setMeta} />
    </RoleLayout>
  );
}

export default DashboardGuru;
