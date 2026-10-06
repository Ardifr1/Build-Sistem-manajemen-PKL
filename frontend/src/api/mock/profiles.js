/**
 * mock/profiles.js — apiResource student-profiles & teacher-profiles.
 * Kolom student-profiles: user_id, student_number (NIS), class, major,
 *   phone, address.
 * Kolom teacher-profiles: user_id, nip, subject, phone.
 */
import { delay, ok, nextId, SISWA, GURU } from "./_shared.js";

const students = SISWA.map((s, i) => ({
  id: i + 1,
  user_id: 10 + i,
  student_number: s.nis,
  class: s.kelas,
  major: s.jurusan,
  phone: `0812-3456-78${String(10 + i)}`,
  address: `Jl. Pendidikan No.${5 + i}, Jakarta`,
  _nama: s.nama,
}));

const teachers = GURU.map((g, i) => ({
  id: i + 1,
  user_id: 20 + i,
  nip: g.nip,
  subject: g.mapel,
  phone: `0813-1111-22${String(10 + i)}`,
  _nama: g.nama,
}));

function crud(store, singular, plural) {
  return {
    async index(params = {}) {
      await delay();
      let rows = [...store];
      if (params.user_id !== undefined) rows = rows.filter((r) => String(r.user_id) === String(params.user_id));
      return ok(`Data ${plural} berhasil diambil.`, rows);
    },
    async show(id) {
      await delay();
      const row = store.find((r) => r.id === Number(id));
      if (!row) throw Object.assign(new Error(`${singular} tidak ditemukan.`), { status: 404 });
      return ok(`Data ${singular} berhasil diambil.`, row);
    },
    async store(payload) {
      await delay();
      const row = { id: nextId(), ...payload };
      store.push(row);
      return ok(`${singular} berhasil ditambahkan.`, row);
    },
    async update(id, payload) {
      await delay();
      const row = store.find((r) => r.id === Number(id));
      if (!row) throw Object.assign(new Error(`${singular} tidak ditemukan.`), { status: 404 });
      Object.assign(row, payload);
      return ok(`${singular} berhasil diperbarui.`, row);
    },
    async destroy(id) {
      await delay();
      const i = store.findIndex((r) => r.id === Number(id));
      if (i < 0) throw Object.assign(new Error(`${singular} tidak ditemukan.`), { status: 404 });
      store.splice(i, 1);
      return ok(`${singular} berhasil dihapus.`, null);
    },
  };
}

export const { index, show, store, update, destroy } = crud(students, "Profil siswa", "profil siswa");
export const teachersApi = crud(teachers, "Profil guru", "profil guru");
