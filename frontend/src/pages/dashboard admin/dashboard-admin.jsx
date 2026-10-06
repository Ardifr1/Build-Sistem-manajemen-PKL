import { useState } from "react";
import AdminLayout from "../../layouts/admin layout/admin";
import "./admin-pages.css";
import Dashboard from "./Dashboard.jsx";
import Pengguna from "./AkunPengguna.jsx";
import PerusahaanPartner from "./PerusahaanMitra.jsx";
import PeriodePKL from "./PeriodePKL.jsx";
import Persetujuan from "./PengajuanPKL.jsx";

const PAGES = {
  dashboard: Dashboard,
  pengguna: Pengguna,
  perusahaan: PerusahaanPartner,
  periode: PeriodePKL,
  persetujuan: Persetujuan,
};

function DashboardAdmin() {
  const [active, setActive] = useState("dashboard");
  const [meta, setMeta] = useState({});
  const Page = PAGES[active] || Dashboard;

  const navigate = (key) => {
    setMeta({});
    setActive(key);
  };

  return (
    <AdminLayout
      active={active}
      onNavigate={navigate}
      title={meta.title}
      subtitle={meta.subtitle !== undefined ? meta.subtitle : undefined}
    >
      <Page onNavigate={navigate} onMeta={setMeta} />
    </AdminLayout>
  );
}

export default DashboardAdmin;
