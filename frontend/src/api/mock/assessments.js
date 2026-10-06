/**
 * mock/assessments.js — apiResource assessment-components, assessments,
 * final-assessments.
 * Kolom assessment-components: name, description, weight, is_active.
 * Kolom assessments: placement_id, component_id, score, note.
 * Kolom final-assessments: placement_id, final_score, status, finalized_by,
 *   finalized_at.
 */
import { delay, ok, nextId } from "./_shared.js";

const components = [
  { id: 1, name: "Kedisiplinan", description: "Kehadiran dan ketepatan waktu", weight: 20, is_active: true },
  { id: 2, name: "Keterampilan Teknis", description: "Penguasaan kompetensi jurusan", weight: 40, is_active: true },
  { id: 3, name: "Sikap & Kerja Sama", description: "Etika dan kolaborasi tim", weight: 20, is_active: true },
  { id: 4, name: "Laporan & Jurnal", description: "Kelengkapan dokumentasi", weight: 20, is_active: true },
];

const assessments = [
  { id: 1, placement_id: 3, component_id: 1, score: 90, note: "Selalu tepat waktu" },
  { id: 2, placement_id: 3, component_id: 2, score: 85, note: "Baik" },
  { id: 3, placement_id: 3, component_id: 3, score: 88, note: "" },
  { id: 4, placement_id: 3, component_id: 4, score: 82, note: "" },
];

const finals = [
  { id: 1, placement_id: 3, final_score: 86.25, status: "finalized", finalized_by: 2, finalized_at: "2026-04-02 09:00:00" },
];

function crud(store, singular, plural) {
  return {
    async index(params = {}) {
      await delay();
      let rows = [...store];
      for (const k of ["placement_id", "component_id", "status", "is_active"]) {
        if (params[k] !== undefined) rows = rows.filter((r) => String(r[k]) === String(params[k]));
      }
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

export const componentsApi = crud(components, "Komponen penilaian", "komponen penilaian");
export const { index, show, store, update, destroy } = crud(assessments, "Penilaian", "penilaian");
export const finalsApi = crud(finals, "Nilai akhir", "nilai akhir");
