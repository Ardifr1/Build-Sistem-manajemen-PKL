/**
 * mock/feedbacks.js — apiResource feedbacks (+ POST /feedbacks/{id}/review)
 * Kolom backend: placement_id, student_id, company_id,
 *   lingkungan_kerja, pembimbing_industri, kesesuaian_bidang,
 *   pengalaman_belajar, kenyamanan, kesempatan_belajar (skala 1-5),
 *   komentar, status (pending/approved/rejected),
 *   reviewed_by, reviewed_at.
 */
import { delay, ok, nextId } from "./_shared.js";

const db = [
  {
    id: 1, placement_id: 3, student_id: 8, company_id: 5,
    lingkungan_kerja: 5, pembimbing_industri: 4, kesesuaian_bidang: 4,
    pengalaman_belajar: 5, kenyamanan: 4, kesempatan_belajar: 5,
    komentar: "Lingkungan kerja nyaman, pembimbing sabar menjelaskan.",
    status: "approved", reviewed_by: 1, reviewed_at: "2026-04-05 10:00:00",
  },
  {
    id: 2, placement_id: 1, student_id: 3, company_id: 1,
    lingkungan_kerja: 4, pembimbing_industri: 5, kesesuaian_bidang: 5,
    pengalaman_belajar: 4, kenyamanan: 4, kesempatan_belajar: 4,
    komentar: "Banyak belajar workflow tim backend profesional.",
    status: "pending", reviewed_by: null, reviewed_at: null,
  },
];

export async function index(params = {}) {
  await delay();
  let rows = [...db];
  for (const k of ["placement_id", "student_id", "company_id", "status"]) {
    if (params[k] !== undefined) rows = rows.filter((r) => String(r[k]) === String(params[k]));
  }
  return ok("Data feedback berhasil diambil.", rows);
}

export async function show(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Feedback tidak ditemukan."), { status: 404 });
  return ok("Data feedback berhasil diambil.", row);
}

export async function store(payload) {
  await delay();
  const row = {
    id: nextId(), komentar: "", status: "pending",
    reviewed_by: null, reviewed_at: null, ...payload,
  };
  db.push(row);
  return ok("Feedback berhasil dikirim dan menunggu review sekolah.", row);
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Feedback tidak ditemukan."), { status: 404 });
  Object.assign(row, payload);
  return ok("Feedback berhasil diperbarui.", row);
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => r.id === Number(id));
  if (i < 0) throw Object.assign(new Error("Feedback tidak ditemukan."), { status: 404 });
  db.splice(i, 1);
  return ok("Feedback berhasil dihapus.", null);
}

export async function review(id, { status } = {}) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Feedback tidak ditemukan."), { status: 404 });
  if (!["approved", "rejected"].includes(status)) {
    const err = new Error("Status review tidak valid.");
    err.status = 422;
    throw err;
  }
  row.status = status;
  row.reviewed_by = 1;
  row.reviewed_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  return ok(
    status === "approved" ? "Feedback disetujui dan dapat dijadikan referensi." : "Feedback ditolak.",
    row
  );
}
