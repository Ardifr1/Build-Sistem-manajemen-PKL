/**
 * mock/periods.js — apiResource pkl-periods
 * Kolom backend: name, start_date, end_date, is_active.
 */
import { delay, ok, nextId } from "./_shared.js";

const db = [
  { id: 1, name: "Ganjil 2026", start_date: "2026-07-01", end_date: "2026-12-31", is_active: true },
  { id: 2, name: "Genap 2026", start_date: "2026-01-01", end_date: "2026-06-30", is_active: false },
  { id: 3, name: "Ganjil 2025", start_date: "2025-07-01", end_date: "2025-12-31", is_active: false },
];

export async function index() {
  await delay();
  return ok("Data periode PKL berhasil diambil.", [...db]);
}

export async function show(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Periode tidak ditemukan."), { status: 404 });
  return ok("Data periode PKL berhasil diambil.", row);
}

export async function store(payload) {
  await delay();
  const row = { id: nextId(), is_active: false, ...payload };
  db.push(row);
  return ok("Periode PKL berhasil ditambahkan.", row);
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Periode tidak ditemukan."), { status: 404 });
  Object.assign(row, payload);
  return ok("Periode PKL berhasil diperbarui.", row);
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => r.id === Number(id));
  if (i < 0) throw Object.assign(new Error("Periode tidak ditemukan."), { status: 404 });
  db.splice(i, 1);
  return ok("Periode PKL berhasil dihapus.", null);
}
