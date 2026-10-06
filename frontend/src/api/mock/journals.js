/**
 * mock/journals.js — apiResource journals (+ POST /journals/{id}/submit)
 * dan apiResource journal-recommendations.
 * Kolom journals backend: placement_id, journal_date, activity, ai_suggestion,
 *   revised_activity, status (draft/submitted/verified/needs_revision),
 *   teacher_note, company_note, submitted_at, verified_at.
 * Kolom journal-recommendations: journal_id, recommendation, is_selected,
 *   is_applied.
 */
import { delay, ok, nextId } from "./_shared.js";

const db = [
  {
    id: 1, placement_id: 1, journal_date: "2026-09-28",
    activity: "Membuat endpoint API data siswa dengan Laravel.",
    ai_suggestion: "Tambahkan detail versi framework dan hasil pengujian.",
    revised_activity: "Membuat endpoint API data siswa menggunakan Laravel 11; diuji dengan Postman, seluruh endpoint mengembalikan 200 OK.",
    status: "verified", teacher_note: "Bagus.", company_note: "",
    submitted_at: "2026-09-28 16:00:00", verified_at: "2026-09-29 09:00:00",
  },
  {
    id: 2, placement_id: 1, journal_date: "2026-09-29",
    activity: "Deploy API stok ke server staging, ada error sedikit tapi sudah dibenerin.",
    ai_suggestion: "Sebutkan alat yang dipakai dan kendala yang dihadapi.",
    revised_activity: "",
    status: "draft", teacher_note: "", company_note: "",
    submitted_at: null, verified_at: null,
  },
  {
    id: 3, placement_id: 2, journal_date: "2026-09-28",
    activity: "Konfigurasi VLAN dan monitoring jaringan.",
    ai_suggestion: "", revised_activity: "",
    status: "submitted", teacher_note: "", company_note: "",
    submitted_at: "2026-09-28 17:00:00", verified_at: null,
  },
];

const recommendations = [
  { id: 1, journal_id: 2, recommendation: "Ubah kalimat pasif menjadi aktif", is_selected: true, is_applied: false },
  { id: 2, journal_id: 2, recommendation: "Tambahkan detail teknologi yang dipakai", is_selected: true, is_applied: false },
  { id: 3, journal_id: 2, recommendation: "Pisahkan kendala & solusi lebih jelas", is_selected: true, is_applied: false },
];

export async function index(params = {}) {
  await delay();
  let rows = [...db];
  for (const k of ["placement_id", "status"]) {
    if (params[k] !== undefined) rows = rows.filter((r) => String(r[k]) === String(params[k]));
  }
  return ok("Data jurnal berhasil diambil.", rows);
}

export async function show(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Jurnal tidak ditemukan."), { status: 404 });
  return ok("Data jurnal berhasil diambil.", row);
}

export async function store(payload) {
  await delay();
  const row = {
    id: nextId(), ai_suggestion: "", revised_activity: "",
    status: "draft", teacher_note: "", company_note: "",
    submitted_at: null, verified_at: null, ...payload,
  };
  db.push(row);
  return ok("Jurnal berhasil ditambahkan.", row);
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Jurnal tidak ditemukan."), { status: 404 });
  Object.assign(row, payload);
  return ok("Jurnal berhasil diperbarui.", row);
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => r.id === Number(id));
  if (i < 0) throw Object.assign(new Error("Jurnal tidak ditemukan."), { status: 404 });
  db.splice(i, 1);
  return ok("Jurnal berhasil dihapus.", null);
}

export async function submit(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Jurnal tidak ditemukan."), { status: 404 });
  if (row.status !== "draft") {
    const err = new Error("Jurnal hanya dapat dikirim dari status draft.");
    err.status = 422;
    throw err;
  }
  row.status = "submitted";
  row.submitted_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  return ok("Jurnal berhasil dikirim untuk diverifikasi.", row);
}

// --- journal-recommendations ---

export const recommendationsApi = {
  async index(params = {}) {
    await delay();
    let rows = [...recommendations];
    if (params.journal_id !== undefined) rows = rows.filter((r) => String(r.journal_id) === String(params.journal_id));
    return ok("Data rekomendasi AI berhasil diambil.", rows);
  },
  async show(id) {
    await delay();
    const row = recommendations.find((r) => r.id === Number(id));
    if (!row) throw Object.assign(new Error("Rekomendasi tidak ditemukan."), { status: 404 });
    return ok("Data rekomendasi AI berhasil diambil.", row);
  },
  async store(payload) {
    await delay();
    const row = { id: nextId(), is_selected: false, is_applied: false, ...payload };
    recommendations.push(row);
    return ok("Rekomendasi AI berhasil ditambahkan.", row);
  },
  async update(id, payload) {
    await delay();
    const row = recommendations.find((r) => r.id === Number(id));
    if (!row) throw Object.assign(new Error("Rekomendasi tidak ditemukan."), { status: 404 });
    Object.assign(row, payload);
    return ok("Rekomendasi AI berhasil diperbarui.", row);
  },
  async destroy(id) {
    await delay();
    const i = recommendations.findIndex((r) => r.id === Number(id));
    if (i < 0) throw Object.assign(new Error("Rekomendasi tidak ditemukan."), { status: 404 });
    recommendations.splice(i, 1);
    return ok("Rekomendasi AI berhasil dihapus.", null);
  },
};
