/**
 * mock/interviews.js — interviews.
 * Kolom: application_id, scheduled_at, place, mode (offline|online),
 *   status (scheduled|done|cancelled), result (passed|failed), note.
 */
import { delay, ok, nextId } from "./_shared.js";

const interviews = [
  {
    id: 1,
    application_id: 1,
    scheduled_at: "2026-10-10 09:00:00",
    place: "Ruang Meeting Lt. 2",
    mode: "offline",
    status: "scheduled",
    result: null,
    note: "Bawa CV cetak",
  },
];

function crud(store, singular, plural) {
  return {
    async index(params = {}) {
      await delay();
      let rows = [...store];
      for (const k of ["application_id", "status", "mode"]) {
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
      const row = { id: nextId(), status: "scheduled", mode: "offline", ...payload };
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

export const { index, show, store, update, destroy } = crud(interviews, "Interview", "interview");
