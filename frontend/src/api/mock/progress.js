/**
 * mock/progress.js — apiResource progress-records
 * Kolom backend: placement_id, recorded_by, recorded_by_role,
 *   development, note, recorded_date.
 */
import { delay, ok, nextId } from "./_shared.js";

const db = [
  {
    id: 1, placement_id: 1, recorded_by: 2, recorded_by_role: "teacher",
    development: "Siswa sudah mampu membuat REST API dasar secara mandiri.",
    note: "Tingkatkan dokumentasi kode.", recorded_date: "2026-09-15",
  },
  {
    id: 2, placement_id: 1, recorded_by: 4, recorded_by_role: "company",
    development: "Adaptasi lingkungan kerja sangat baik.",
    note: "", recorded_date: "2026-09-30",
  },
];

export async function index(params = {}) {
  await delay();
  let rows = [...db];
  if (params.placement_id !== undefined) rows = rows.filter((r) => String(r.placement_id) === String(params.placement_id));
  rows.sort((a, b) => (a.recorded_date < b.recorded_date ? 1 : -1));
  return ok("Data perkembangan PKL berhasil diambil.", rows);
}

export async function show(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Catatan perkembangan tidak ditemukan."), { status: 404 });
  return ok("Data perkembangan PKL berhasil diambil.", row);
}

export async function store(payload) {
  await delay();
  const row = { id: nextId(), ...payload };
  db.push(row);
  return ok("Catatan perkembangan PKL berhasil ditambahkan.", row);
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Catatan perkembangan tidak ditemukan."), { status: 404 });
  Object.assign(row, payload);
  return ok("Catatan perkembangan PKL berhasil diperbarui.", row);
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => r.id === Number(id));
  if (i < 0) throw Object.assign(new Error("Catatan perkembangan tidak ditemukan."), { status: 404 });
  db.splice(i, 1);
  return ok("Catatan perkembangan PKL berhasil dihapus.", null);
}
