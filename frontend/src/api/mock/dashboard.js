/**
 * mock/dashboard.js — Agregat untuk dashboard admin.
 * Backend tidak punya endpoint khusus dashboard; data dirakit dari
 * beberapa resource (users, companies, pkl-applications, journals).
 * Fungsi-fungsi di sini meniru hasil agregat tersebut.
 */
import { delay, ok, SISWA, PERUSAHAAN, GURU } from "./_shared.js";

export async function adminSummary() {
  await delay();
  return ok("Ringkasan dashboard berhasil diambil.", {
    total_siswa: 1240,
    total_guru: 84,
    total_perusahaan: 126,
    pengajuan_aktif: 486,
    pengajuan_menunggu: 68,
    siswa_ditempatkan: 812,
    kuota_total: 1480,
    kuota_terisi: 1102,
  });
}

export async function adminRecentApplications() {
  await delay();
  return ok("Pengajuan terbaru berhasil diambil.", [
    { id: 1, siswa: "Rina Amelia", kelas: "XII RPL 1", perusahaan: "PT Maju Jaya Abadi", status: "submitted", label: "Menunggu" },
    { id: 2, siswa: "Bagas Pratama", kelas: "XII TKJ 2", perusahaan: "PT Telkom Akses", status: "reviewed", label: "Diproses" },
    { id: 3, siswa: "Sinta Dewi", kelas: "XII RPL 2", perusahaan: "2 perusahaan", status: "accepted", label: "Diterima" },
    { id: 4, siswa: "Dimas Saputra", kelas: "XII MM 1", perusahaan: "CV Kreatif Digital", status: "rejected", label: "Ditolak" },
  ]);
}

export async function adminPipeline() {
  await delay();
  return ok("Alur PKL berhasil diambil.", [
    { label: "Pengajuan → Seleksi", pct: 67 },
    { label: "Penempatan disetujui", pct: 55 },
    { label: "Jurnal terverifikasi", pct: 43 },
  ]);
}

export async function adminMonitoringStages() {
  await delay();
  return ok("Tahapan monitoring berhasil diambil.", [
    { label: "Pengajuan", value: "486", pct: 78, text: "78% selesai" },
    { label: "Seleksi", value: "312", pct: 64, text: "64% selesai" },
    { label: "Penempatan", value: "812", pct: 65, text: "65% selesai" },
    { label: "Jurnal Aktif", value: "2.140", pct: 52, text: "52% selesai" },
    { label: "Nilai Akhir", value: "640", pct: 41, text: "41% selesai" },
  ]);
}

export async function adminMonitoringRows() {
  await delay();
  return ok("Data monitoring siswa berhasil diambil.", [
    { id: 1, siswa: "Rina Amelia", tahap: "Disetujui Sekolah", progres: "Absen 96% • Jurnal 12/12", aksi: "Lihat" },
    { id: 2, siswa: "Bagas Pratama", tahap: "Menunggu Penempatan", progres: "Absen 88% • Jurnal 8/12", aksi: "Ingatkan" },
    { id: 3, siswa: "Sinta Dewi", tahap: "Perlu Perbaikan (2)", progres: "Revisi AI dipakai", aksi: "Lihat" },
    { id: 4, siswa: "Dimas Saputra", tahap: "Interview 24 Sep", progres: "Tes lolos", aksi: "Kirim" },
  ]);
}

export async function adminNotifications() {
  await delay();
  return ok("Notifikasi berhasil diambil.", [
    { id: 1, bg: "#FEF3C7", title: "Pengajuan PKL baru • Rina → PT Maju Jaya", desc: "Perlu disposisi admin • sudah menunggu 3 hari" },
    { id: 2, bg: "#FEE2E2", title: "Status penempatan berubah • Sinta pilih final", desc: "Menunggu persetujuan • 2 perusahaan diterima" },
    { id: 3, bg: "#DBEAFE", title: "2 jurnal perlu tindakan guru", desc: "Sinta & Ahmad • verifikasi maks 2×24 jam" },
  ]);
}

export async function adminTeacherOverview() {
  await delay();
  return ok("Ikhtisar guru berhasil diambil.", {
    total_pembimbing: 42,
    total_industri: 38,
    belum_tugas: 12,
    daftar: [
      { id: 3, nama: "Hartono, S.Kom", mapel: "RPL", jumlah_siswa: 20, status: "aktif" },
      { id: 4, nama: "Sari Wulandari, S.T.", mapel: "TKJ", jumlah_siswa: 18, status: "aktif" },
      { id: 9, nama: "Budi Santoso, S.Kom", mapel: "MM", jumlah_siswa: 0, status: "belum" },
      { id: 10, nama: "Ani Lestari, S.E.", mapel: "AKL", jumlah_siswa: 15, status: "aktif" },
    ],
    pemetaan: [
      "Hartono → PT Maju Jaya Abadi (12)",
      "Sari → PT Telkom Akses (18)",
      "Budi → CV Kreatif Digital (8)",
      "Ani → Bank Daerah Syariah (15)",
    ],
  });
}

export async function schoolSettings() {
  await delay();
  return ok("Pengaturan sekolah berhasil diambil.", {
    nama_sekolah: "SMKN 1 Jakarta",
    tahun_ajaran: "2026 Ganjil",
    batas_pilihan: "Maks 3 perusahaan / siswa",
    bobot_nilai: "Industri 40% + Guru 40% + Jurnal 20%",
  });
}

// Baris tabel Data Siswa (gabungan profil + penempatan + perusahaan).
export async function adminStudentRows() {
  await delay();
  const status = [
    { perusahaan: 0, pembimbing: `${GURU[0].nama.split(",")[0]} / Andi Pratama`, status: "Disetujui Sekolah", variant: "success" },
    { perusahaan: 1, pembimbing: `${GURU[1].nama.split(",")[0]} / Rani Wijaya`, status: "Menunggu Penempatan", variant: "warning" },
    { perusahaan: -1, pembimbing: `${GURU[0].nama.split(",")[0]} / —`, status: "Menunggu Persetujuan", variant: "primary" },
    { perusahaan: 2, pembimbing: `${GURU[3].nama.split(",")[0]} / Joko Susilo`, status: "Diproses", variant: "primary" },
  ];
  const rows = SISWA.slice(0, 4).map((s, i) => ({
    id: i + 1,
    name: `${s.nis} • ${s.nama} • ${s.kelas.replace(" ", "")}`,
    perusahaan: status[i].perusahaan >= 0 ? PERUSAHAAN[status[i].perusahaan].nama : "— Belum ada —",
    pembimbing: status[i].pembimbing,
    status: status[i].status,
    variant: status[i].variant,
  }));
  return ok("Data siswa berhasil diambil.", rows);
}

// Baris + hitungan tab halaman Pengajuan PKL.
export async function adminApplicationRows() {
  await delay();
  const rows = [
    { id: 1, name: "Rina Amelia • XII RPL 1 → PT Maju Jaya Abadi", pilihan: "1 dari 3", status: "Menunggu", variant: "warning" },
    { id: 2, name: "Bagas Pratama • XII TKJ 2 → PT Telkom Akses", pilihan: "2 dari 3", status: "Diproses", variant: "primary" },
    { id: 3, name: "Sinta Dewi • XII RPL 2 → 2 Diterima", pilihan: "Final: CV Kreatif Digital", status: "Diterima", variant: "success" },
    { id: 4, name: "Dimas Saputra • XII MM 1 → CV Kreatif Digital", pilihan: "1 dari 2", status: "Ditolak", variant: "danger" },
    { id: 5, name: "Putri Ayu • XII AKL 1 → Bank Daerah Syariah", pilihan: "Menunggu Persetujuan", status: "Disetujui Sekolah", variant: "success" },
  ];
  const tabs = [
    { key: "semua", label: "Semua (486)" },
    { key: "menunggu", label: "Menunggu (68)" },
    { key: "diproses", label: "Diproses (142)" },
    { key: "diterima", label: "Diterima (210)" },
    { key: "ditolak", label: "Ditolak (66)" },
  ];
  return ok("Data pengajuan berhasil diambil.", { rows, tabs });
}
