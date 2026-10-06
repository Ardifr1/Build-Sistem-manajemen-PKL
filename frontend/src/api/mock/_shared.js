/**
 * _shared.js
 * Util internal untuk mock API. Tidak diekspor ke index.js.
 */

// Simulasi latensi jaringan agar pola loading di halaman tetap realistis.
export const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

// Format respons persis seperti backend Laravel: { message, data }.
export const ok = (message, data = null) => ({ message, data });

let seq = 1000;
export const nextId = () => ++seq;

// --- Data pool realistis konteks SMK Indonesia ---

export const SISWA = [
  { nama: "Rina Amelia", nis: "2425001", kelas: "XII RPL 1", jurusan: "RPL" },
  { nama: "Bagas Pratama", nis: "2425002", kelas: "XII TKJ 2", jurusan: "TKJ" },
  { nama: "Sinta Dewi", nis: "2425003", kelas: "XII RPL 2", jurusan: "RPL" },
  { nama: "Dimas Saputra", nis: "2425004", kelas: "XII MM 1", jurusan: "MM" },
  { nama: "Putri Ayu", nis: "2425005", kelas: "XII AKL 1", jurusan: "AKL" },
  { nama: "Ahmad Fauzi", nis: "2425006", kelas: "XII RPL 1", jurusan: "RPL" },
];

export const GURU = [
  { nama: "Hartono, S.Kom", mapel: "RPL", nip: "198501012010011001" },
  { nama: "Sari Wulandari, S.T.", mapel: "TKJ", nip: "198803152011012002" },
  { nama: "Budi Santoso, S.Kom", mapel: "MM", nip: "197912202005021003" },
  { nama: "Ani Lestari, S.E.", mapel: "AKL", nip: "198207102008012004" },
];

export const PERUSAHAAN = [
  { nama: "PT Maju Jaya Abadi", industri: "Manufaktur", bidang: ["RPL", "TKJ"], kuota: 20, terisi: 18 },
  { nama: "PT Telkom Akses", industri: "Telekomunikasi", bidang: ["TKJ", "RPL"], kuota: 30, terisi: 30 },
  { nama: "CV Kreatif Digital", industri: "Desain", bidang: ["MM", "RPL"], kuota: 12, terisi: 5 },
  { nama: "PT Solusi Digital Nusantara", industri: "Teknologi Informasi", bidang: ["RPL"], kuota: 15, terisi: 9 },
  { nama: "Bank Daerah Syariah", industri: "Perbankan", bidang: ["AKL", "MM"], kuota: 10, terisi: 4 },
];

export const initials = (nama) =>
  nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
