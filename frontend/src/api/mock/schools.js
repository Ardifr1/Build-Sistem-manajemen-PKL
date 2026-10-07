/**
 * mock/schools.js — data sekolah contoh (fondasi pengelompokan per sekolah).
 */
import { delay, ok, nextId } from "./_shared.js";

const db = [
  { id: 1, name: "SMKN 1", npsn: "20100101", address: "Jl. Pendidikan No. 1", phone: "021-5550001", is_active: true },
];

export async function index() {
  await delay();
  return ok("Data sekolah berhasil diambil.", db.map((r) => ({ ...r })));
}

export async function show(id) {
  await delay();
  const row = db.find((r) => String(r.id) === String(id));
  if (!row) throw new Error("Sekolah tidak ditemukan.");
  return ok("Data sekolah berhasil diambil.", { ...row });
}

export async function store(payload) {
  await delay();
  const row = { id: nextId(db), is_active: true, ...payload };
  db.push(row);
  return ok("Sekolah berhasil ditambahkan.", { ...row });
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => String(r.id) === String(id));
  if (!row) throw new Error("Sekolah tidak ditemukan.");
  Object.assign(row, payload);
  return ok("Data sekolah berhasil diperbarui.", { ...row });
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => String(r.id) === String(id));
  if (i < 0) throw new Error("Sekolah tidak ditemukan.");
  db.splice(i, 1);
  return ok("Sekolah berhasil dihapus.");
}
