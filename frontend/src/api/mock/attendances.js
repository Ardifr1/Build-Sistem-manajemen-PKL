/**
 * mock/attendances.js — apiResource attendances
 * Kolom backend: placement_id, attendance_date, check_in, check_out,
 *   status, note.
 * Field tambahan mock (revisi absen: selfie + GPS real-time): photo_path,
 *   latitude, longitude.
 */
import { delay, ok, nextId } from "./_shared.js";

const db = [
  {
    id: 1, placement_id: 1, attendance_date: "2026-10-05",
    check_in: "07:58:00", check_out: "16:02:00", status: "hadir",
    note: "", photo_path: "/storage/absen/1-20261005.jpg",
    latitude: -6.2088, longitude: 106.8456,
  },
  {
    id: 2, placement_id: 1, attendance_date: "2026-10-06",
    check_in: "08:01:00", check_out: null, status: "hadir",
    note: "", photo_path: "/storage/absen/1-20261006.jpg",
    latitude: -6.2088, longitude: 106.8456,
  },
  {
    id: 3, placement_id: 2, attendance_date: "2026-10-05",
    check_in: "07:55:00", check_out: "16:05:00", status: "hadir",
    note: "", photo_path: "/storage/absen/2-20261005.jpg",
    latitude: -6.9175, longitude: 107.6191,
  },
];

export async function index(params = {}) {
  await delay();
  let rows = [...db];
  for (const k of ["placement_id", "status", "attendance_date"]) {
    if (params[k] !== undefined) rows = rows.filter((r) => String(r[k]) === String(params[k]));
  }
  return ok("Data absensi berhasil diambil.", rows);
}

export async function show(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Absensi tidak ditemukan."), { status: 404 });
  return ok("Data absensi berhasil diambil.", row);
}

export async function store(payload) {
  await delay();
  const row = { id: nextId(), check_out: null, status: "hadir", note: "", ...payload };
  db.push(row);
  return ok("Absensi berhasil dicatat.", row);
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Absensi tidak ditemukan."), { status: 404 });
  Object.assign(row, payload);
  return ok("Absensi berhasil diperbarui.", row);
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => r.id === Number(id));
  if (i < 0) throw Object.assign(new Error("Absensi tidak ditemukan."), { status: 404 });
  db.splice(i, 1);
  return ok("Absensi berhasil dihapus.", null);
}
