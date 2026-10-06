# SiMagang — Sistem Informasi Magang

Aplikasi manajemen PKL (Praktik Kerja Lapangan) untuk sekolah: dari pengajuan,
penempatan, jurnal harian, monitoring, sampai penilaian akhir — dalam satu tempat.

> **Status:** V1 — fokus satu sekolah (sesuai PRD V1.2).

## Fitur

**Admin Sekolah**
- Dashboard ringkasan (siswa, guru, perusahaan, pengajuan, penempatan, jurnal)
- Kelola pengguna (tambah / edit / detail / hapus, 4 role)
- Kelola perusahaan partner (kuota, bidang, status)
- Kelola periode PKL (DRAFT • AKTIF • SELESAI)
- Persetujuan sekolah: lamaran yang diterima perusahaan disetujui → resmi jadi penempatan

**Siswa**
- Profil & dokumen (CV, portofolio, sertifikat)
- Lihat perusahaan partner & pilih maks. 3 perusahaan (terkunci setelah dikirim)
- Pengajuan PKL + pilih perusahaan final
- Jurnal harian + AI Assistant, absensi foto + GPS
- Status perkembangan & feedback ke perusahaan

**Guru Pembimbing**
- Dashboard & siswa bimbingan
- Monitoring jurnal, penilaian, nilai akhir

**Pembimbing Industri** (gratis, didaftarkan sekolah)
- Review lamaran (terima / tolak / jadwalkan interview)
- Verifikasi jurnal (setujui / minta revisi)
- Evaluasi siswa (skala 1–5 + catatan)

## Teknologi

| Lapisan  | Teknologi                     |
|----------|-------------------------------|
| Backend  | Laravel 13 + Sanctum (API)    |
| Frontend | React 19 + Vite               |
| Database | MySQL                         |
| Auth     | Token Bearer (login universal, tanpa pilih role) |

## Prasyarat

- PHP 8.2+, Composer
- MySQL (buat database `simagang`)
- Node.js 18+, npm

## Instalasi

**Backend**
```bash
cd backend
copy .env.example .env        # Windows (Git Bash: cp .env.example .env)
composer install
php artisan key:generate
```

Isi `.env` untuk database:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simagang
DB_USERNAME=root
DB_PASSWORD=
```

Lalu:
```bash
php artisan config:publish cors
# tambahkan http://localhost:5173 ke 'allowed_origins' di config/cors.php
php artisan migrate
php artisan db:seed      # bikin akun test (lihat tabel di bawah)
php artisan serve         # jalan di http://localhost:8000
```

**Frontend**
```bash
cd frontend
npm install
```

Buat file `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api
```

Pastikan `USE_MOCK = false` di `frontend/src/api/index.js` (mode live), lalu:
```bash
npm run dev              # jalan di http://localhost:5173
```

> **Cara cepat (Windows):** double-click `start-dev.bat` di folder utama —
> backend + frontend langsung jalan di dua jendela terpisah.

## Akun Test

Setelah `php artisan db:seed` (bisa login pakai email **atau** username):

| Role      | Email              | Username   | Password    |
|-----------|--------------------|------------|-------------|
| Admin     | admin@smk.sch.id   | admin      | admin123    |
| Guru      | guru@smk.sch.id    | guru       | guru123     |
| Siswa     | siswa@smk.sch.id   | siswa      | siswa123    |
| Industri  | industri@smk.sch.id| industri   | industri123 |

## Struktur Proyek

```
├── backend/                 # Laravel API
│   ├── app/Http/Controllers # Auth, Admin, Student, Teacher, Company
│   ├── app/Models           # User, Company, PklApplication, Journal, dsb.
│   ├── database/migrations  # 22 migration
│   └── routes/api.php       # 19 resource + auth
├── frontend/                # React + Vite
│   └── src/
│       ├── api/             # Lapisan API: mock/ & live/, flag USE_MOCK
│       ├── pages/           # Login + halaman admin
│       ├── components/      # Sidebar, Topbar, dsb.
│       └── layouts/
└── start-dev.bat            # Jalankan backend + frontend sekaligus
```

## API

Base URL: `http://localhost:8000/api` — format respons `{ message, data }`.

- `POST /login`, `POST /logout` (Bearer token)
- `users`, `companies`, `company-supervisors`, `pkl-periods`
- `pkl-applications`, `application-documents`, `application-reviews`
- `pkl-placements`, `journals`, `journal-recommendations`, `attendances`
- `progress-records`, `feedbacks`, `assessments`, `final-assessments`
- `student-profiles`, `teacher-profiles`, `assessment-components`

## Roadmap

- **V1** (berjalan): satu sekolah, semua role, sesuai PRD V1.2
- **V2** (rencana): multi-sekolah, notifikasi realtime (WebSocket)

## Catatan

- Jangan pernah push file `.env` ke GitHub.
- Desain acuan: `revisi_mockup.zip` (milik sekolah).
