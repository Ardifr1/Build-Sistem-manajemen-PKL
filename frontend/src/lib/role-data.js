/**
 * Helper data bersama untuk halaman guru & industri.
 * Menggabungkan penempatan + nama siswa + nama perusahaan di sisi klien,
 * karena backend me-return relasi nested hanya di mode live.
 */
import {
  placementsApi,
  journalsApi,
  usersApi,
  companiesApi,
  authApi,
} from "../api/index.js";

const arr = (res) => res?.data ?? [];

/** Penempatan + relasi student & company (pakai nested bila ada). */
export async function getEnrichedPlacements() {
  const rows = arr(await placementsApi.index());

  const needUsers = rows.some((p) => !p.student);
  const needCompanies = rows.some((p) => !p.company);

  let users = {};
  let companies = {};

  if (needUsers) {
    try {
      const uRes = await usersApi.index({ role: "student" });
      users = Object.fromEntries(arr(uRes).map((u) => [u.id, u]));
    } catch {
      /* mode live non-admin: pakai relasi nested saja */
    }
  }

  if (needCompanies) {
    try {
      const cRes = await companiesApi.index();
      companies = Object.fromEntries(arr(cRes).map((c) => [c.id, c]));
    } catch {
      /* abaikan */
    }
  }

  return rows.map((p) => ({
    ...p,
    student: p.student || users[p.student_id] || { name: `Siswa #${p.student_id}` },
    company: p.company || companies[p.company_id] || { name: "-" },
  }));
}

/** Semua jurnal dari daftar penempatan (backend butuh placement_id per panggilan). */
export async function getJournalsForPlacements(placements) {
  const all = [];
  for (const p of placements) {
    try {
      const res = await journalsApi.index({ placement_id: p.id });
      for (const j of arr(res)) all.push({ ...j, placement: p });
    } catch {
      /* abaikan penempatan yang gagal dimuat */
    }
  }
  return all.sort((a, b) =>
    String(b.journal_date || "").localeCompare(String(a.journal_date || ""))
  );
}

/** company_id milik user industri yang sedang login (via company-supervisors). */
export async function getMyCompanyId() {
  const user = authApi.currentUser();
  if (!user) return null;
  try {
    const res = await companiesApi.supervisorsApi.index();
    const sup = arr(res).find((s) => String(s.user_id) === String(user.id));
    return sup?.company_id ?? null;
  } catch {
    return null;
  }
}

export const STATUS_LABEL = {
  draft: "Draft",
  submitted: "Menunggu",
  verified: "Disetujui",
  needs_revision: "Revisi",
  active: "AKTIF",
  completed: "SELESAI",
  cancelled: "Batal",
};

export function statusLabel(s) {
  return STATUS_LABEL[s] || s || "-";
}

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** "2026-08-01T00:00:00.000000Z" -> "1 Agu 2026" */
export function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2026-08-01" -> "1 Agu" (ala mockup: "18 Jun") */
export function formatDateShort(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return `${d.getDate()} ${BULAN[d.getMonth()]}`;
}
