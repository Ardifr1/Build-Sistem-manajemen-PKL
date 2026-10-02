import { useState } from "react";
import AdminLayout from "../../layouts/admin layout/admin";
import "./admin-pages.css";
import Dashboard from "./Dashboard.jsx";
import AkunPengguna from "./AkunPengguna.jsx";
import TambahPengguna from "./TambahPengguna.jsx";
import DataSiswa from "./DataSiswa.jsx";
import DataGuru from "./DataGuru.jsx";
import PerusahaanMitra from "./PerusahaanMitra.jsx";
import PeriodePKL from "./PeriodePKL.jsx";
import PengajuanPKL from "./PengajuanPKL.jsx";
import Monitoring from "./Monitoring.jsx";
import Pengaturan from "./Pengaturan.jsx";

const PAGES = {
  dashboard: Dashboard,
  akun: AkunPengguna,
  "tambah-akun": TambahPengguna,
  siswa: DataSiswa,
  guru: DataGuru,
  mitra: PerusahaanMitra,
  periode: PeriodePKL,
  pengajuan: PengajuanPKL,
  monitoring: Monitoring,
  pengaturan: Pengaturan,
};

function DashboardAdmin() {
  const [active, setActive] = useState("dashboard");
  const Page = PAGES[active] || Dashboard;
  return (
    <AdminLayout active={active} onNavigate={setActive}>
      <Page onNavigate={setActive} />
    </AdminLayout>
  );
}

export default DashboardAdmin;
