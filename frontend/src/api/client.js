/**
 * client.js
 * Fetch wrapper siap pakai untuk backend Laravel asli.
 *
 * - baseURL dari import.meta.env.VITE_API_URL, fallback 'http://localhost:8000/api'
 * - Header Authorization: Bearer <token> diambil dari localStorage 'simagang_token'
 * - Menangani 401 (sesi habis), 403 (otorisasi), 422 (validasi)
 *
 * PENTING: file ini BELUM dipakai halaman mana pun selama USE_MOCK = true.
 * Untuk menghubungkan backend asli: set USE_MOCK = false di index.js lalu
 * implementasikan ulang tiap fungsi mock memakai client ini + endpoints.js
 * tanpa mengubah signature fungsinya.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const TOKEN_KEY = "simagang_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* abaikan */
  }
}

class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.message || `Request gagal (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
    // payload.errors berisi detail validasi saat 422, sesuai format Laravel
    this.validationErrors = payload?.errors || null;
  }
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content
  if (res.status === 204) return { message: "Berhasil.", data: null };

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (res.status === 401) {
    setToken(null);
    throw new ApiError(401, { message: "Sesi berakhir. Silakan masuk kembali.", ...payload });
  }

  if (!res.ok) {
    throw new ApiError(res.status, payload || { message: "Terjadi kesalahan." });
  }

  // Format backend: { message, data }
  return payload;
}

export const client = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export { ApiError };
export default client;
