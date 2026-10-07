/**
 * live/_shared.js — Helper untuk implementasi live (backend Laravel asli).
 * Dipakai oleh semua file di src/api/live/.
 */
import { client } from "../client.js";

export const q = (params = {}) => {
  const s = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return s ? `?${s}` : "";
};

/** Bangun objek CRUD live standar dari definisi endpoint. */
export const liveCrud = (eps) => ({
  index: (params = {}) => client.get(eps.index + q(params)),
  show: (id) => client.get(eps.show(id)),
  store: (payload) => client.post(eps.store, payload),
  update: (id, payload) => client.put(eps.update(id), payload),
  destroy: (id) => client.del(eps.destroy(id)),
});

/** Ambil .data dari respons { message, data }, aman untuk array. */
export const dataOf = (res) => res?.data ?? null;
export const arrOf = (res) => (Array.isArray(res?.data) ? res.data : []);

/** live schools API. */
