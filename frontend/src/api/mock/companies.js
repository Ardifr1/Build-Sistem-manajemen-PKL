/**
 * mock/companies.js — apiResource companies & company-supervisors
 * Kolom companies backend: name, industry, address, phone, email, description,
 *   student_quota, required_skills, required_documents, is_partner, is_active.
 * Kolom company-supervisors: company_id, user_id, position, phone.
 */
import { delay, ok, nextId, PERUSAHAAN } from "./_shared.js";

const db = PERUSAHAAN.map((p, i) => ({
  id: i + 1,
  name: p.nama,
  industry: p.industri,
  address: `Jl. Industri No.${10 + i}, Jakarta`,
  phone: `021-55${String(1000 + i)}`,
  email: `hrd@${p.nama.toLowerCase().replace(/[^a-z]/g, "")}.id`,
  description: `Perusahaan mitra bidang ${p.industri}.`,
  student_quota: p.kuota,
  required_skills: p.bidang.join(", "),
  required_documents: "CV, Portofolio",
  is_partner: true,
  is_active: true,
  _terisi: p.terisi,
  _bidang: p.bidang,
}));

const supervisors = [
  { id: 1, company_id: 1, user_id: 4, position: "HRD Manager", phone: "0812-0001" },
  { id: 2, company_id: 2, user_id: 5, position: "Koordinator Magang", phone: "0812-0002" },
];

export async function index(params = {}) {
  await delay();
  let rows = [...db];
  if (params.is_partner !== undefined) rows = rows.filter((r) => r.is_partner === !!params.is_partner);
  return ok("Data perusahaan berhasil diambil.", rows);
}

export async function show(id) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Perusahaan tidak ditemukan."), { status: 404 });
  return ok("Data perusahaan berhasil diambil.", row);
}

export async function store(payload) {
  await delay();
  const row = { id: nextId(), is_partner: false, is_active: true, _terisi: 0, _bidang: [], ...payload };
  db.push(row);
  return ok("Perusahaan berhasil ditambahkan.", row);
}

export async function update(id, payload) {
  await delay();
  const row = db.find((r) => r.id === Number(id));
  if (!row) throw Object.assign(new Error("Perusahaan tidak ditemukan."), { status: 404 });
  Object.assign(row, payload);
  return ok("Perusahaan berhasil diperbarui.", row);
}

export async function destroy(id) {
  await delay();
  const i = db.findIndex((r) => r.id === Number(id));
  if (i < 0) throw Object.assign(new Error("Perusahaan tidak ditemukan."), { status: 404 });
  db.splice(i, 1);
  return ok("Perusahaan berhasil dihapus.", null);
}

// --- company-supervisors ---

export const supervisorsApi = {
  async index(params = {}) {
    await delay();
    let rows = [...supervisors];
    if (params.company_id) rows = rows.filter((r) => r.company_id === Number(params.company_id));
    return ok("Data pembimbing industri berhasil diambil.", rows);
  },
  async show(id) {
    await delay();
    const row = supervisors.find((r) => r.id === Number(id));
    if (!row) throw Object.assign(new Error("Pembimbing tidak ditemukan."), { status: 404 });
    return ok("Data pembimbing industri berhasil diambil.", row);
  },
  async store(payload) {
    await delay();
    const row = { id: nextId(), ...payload };
    supervisors.push(row);
    return ok("Pembimbing industri berhasil ditambahkan.", row);
  },
  async update(id, payload) {
    await delay();
    const row = supervisors.find((r) => r.id === Number(id));
    if (!row) throw Object.assign(new Error("Pembimbing tidak ditemukan."), { status: 404 });
    Object.assign(row, payload);
    return ok("Pembimbing industri berhasil diperbarui.", row);
  },
  async destroy(id) {
    await delay();
    const i = supervisors.findIndex((r) => r.id === Number(id));
    if (i < 0) throw Object.assign(new Error("Pembimbing tidak ditemukan."), { status: 404 });
    supervisors.splice(i, 1);
    return ok("Pembimbing industri berhasil dihapus.", null);
  },
};
