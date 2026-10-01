import { useState } from "react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">
      {/* ============ LEFT PANEL ============ */}
      <aside className="login-left">
        <div className="login-left-decor" aria-hidden="true">
          <span className="decor decor-1" />
          <span className="decor decor-2" />
          <span className="decor decor-3" />
          <span className="decor decor-4" />
        </div>

        <div className="login-left-inner">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-left">
              <span className="login-logo">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                  <rect x="2.5" y="7" width="19" height="13" rx="2.5" stroke="#2454D8" strokeWidth="2" />
                  <path
                    d="M8.5 7V5.8C8.5 4.2 9.7 3 11.3 3h1.4C14.3 3 15.5 4.2 15.5 5.8V7"
                    stroke="#2454D8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M2.5 12.5h19" stroke="#2454D8" strokeWidth="2" />
                </svg>
              </span>
              <span className="login-brand-text">
                <strong>SIM PKL</strong>
                <small>Sistem Informasi Manajemen PKL</small>
              </span>
            </div>
            <span className="login-version">v2.0</span>
          </div>

          {/* Universal badge */}
          <div className="login-universal-badge">
            <span className="dot" />
            LOGIN UNIVERSAL &nbsp;•&nbsp; SEMUA ROLE
          </div>

          <h1 className="login-left-title">
            Satu pintu masuk untuk seluruh ekosistem PKL.
          </h1>
          <p className="login-left-desc">
            Tak perlu pilih role. Masuk dengan akun Anda — sistem membaca role
            dari akun dan mengarahkan ke dashboard Admin, Siswa, Guru, atau
            Perusahaan. Tanpa login khusus admin/perusahaan.
          </p>

          {/* Role badges */}
          <div className="login-roles">
            <span className="role-chip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 19.5c1.2-3.2 3.9-4.8 7-4.8s5.8 1.6 7 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Admin
            </span>
            <span className="role-chip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M12 4 3 8.5 12 13l9-4.5L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M6 11v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Siswa
            </span>
            <span className="role-chip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M4 19V6a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 19h16M8 9h8M8 12.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Guru
            </span>
            <span className="role-chip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3.5 10.5h17M7 7.5V5.8A1.3 1.3 0 0 1 8.3 4.5h7.4A1.3 1.3 0 0 1 17 5.8v1.7" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Perusahaan
            </span>
          </div>

          {/* Info cards */}
          <div className="login-left-cards">
            <div className="left-card">
              <span className="left-card-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3.5 19c1-3 3.4-4.5 6.5-4.5 1.4 0 2.7.3 3.8.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="m15.5 16.5 1.8 1.8 3.2-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="left-card-text">
                <strong>Tanpa Pilih Role</strong>
                <small>NIS, NIP, atau email resmi perusahaan langsung dikenali otomatis.</small>
              </span>
            </div>
            <div className="left-card">
              <span className="left-card-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M12 3 5 5.8v5.4c0 4.4 2.9 7.6 7 9.3 4.1-1.7 7-4.9 7-9.3V5.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="m9.2 11.6 2 2 3.6-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="left-card-text">
                <strong>Aman &amp; Terverifikasi</strong>
                <small>Enkripsi session + verifikasi berlapis untuk semua akun.</small>
              </span>
            </div>
            <div className="left-card">
              <span className="left-card-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M4 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="m12 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="left-card-text">
                <strong>Redirect Otomatis</strong>
                <small>Langsung masuk ke dashboard sesuai hak akses Anda.</small>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="login-stats">
            <div className="stat">
              <strong>4</strong>
              <small>Role Terintegrasi</small>
            </div>
            <span className="stat-divider" />
            <div className="stat">
              <strong>12K+</strong>
              <small>Pengguna Aktif</small>
            </div>
            <span className="stat-divider" />
            <div className="stat">
              <strong>99.9%</strong>
              <small>Uptime Aman</small>
            </div>
          </div>

          <p className="login-trusted">
            <span className="trusted-dot" />
            Dipercaya 120+ sekolah &amp; 800 perusahaan mitra
          </p>
        </div>
      </aside>

      {/* ============ RIGHT PANEL ============ */}
      <main className="login-right">
        <div className="login-form-wrap">
          <div className="login-top-badge">
            <span className="pulse-dot" />
            LOGIN UNIVERSAL • TANPA PILIH ROLE
          </div>

          <h2 className="login-title">Masuk</h2>
          <p className="login-subtitle">
            Satu halaman login untuk semua role. Cukup masuk — sistem mengenali
            Anda sebagai Admin, Siswa, Guru, atau Perusahaan. Akun dibuat &amp;
            dikelola Admin Sekolah.
          </p>

          {/* Auto detect card */}
          <div className="login-auto-card">
            <span className="auto-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" stroke="#2454D8" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="#2454D8" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="0.6" fill="#2454D8" />
                <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2" stroke="#2454D8" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="auto-text">
              <strong>Role terdeteksi otomatis</strong>
              <small>Tak perlu pilih role manual. Sistem membaca role dari akun Anda.</small>
            </span>
            <span className="auto-badge">OTOMATIS</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-email">Email Sekolah / Resmi</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="nama@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <div className="label-row">
                <label htmlFor="login-password">Kata Sandi</label>
                <span className="label-hint">Min. 8 karakter</span>
              </div>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M8 10V7.8C8 5.7 9.8 4 12 4s4 1.7 4 3.8V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <circle cx="12" cy="15" r="1.4" fill="currentColor" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      <path d="M10.6 5.2A9.8 9.8 0 0 1 12 5c5 0 8.7 4.3 9.5 7-.3 1-1.1 2.3-2.4 3.5M6.6 6.6C4.2 8.1 2.8 10.9 2.5 12c.8 2.7 4.5 7 9.5 7 1.4 0 2.7-.3 3.8-.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                      <path d="M2.5 12S6.2 5 12 5s9.5 7 9.5 7-3.7 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  )}
                  <span>{showPassword ? "Sembunyi" : "Lihat"}</span>
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkmark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Ingat saya
              </label>
              <a className="forgot" href="/login">
                Lupa kata sandi?
              </a>
            </div>

            <button type="submit" className="btn-primary">
              Masuk ke Dashboard
              <span aria-hidden="true">→</span>
            </button>

            <p className="secure-note">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 10V7.8C8 5.7 9.8 4 12 4s4 1.7 4 3.8V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Login aman &amp; terenkripsi • Sesi dipantau
            </p>
          </form>

          <div className="help-divider">
            <span />
            butuh bantuan?
            <span />
          </div>

          <div className="help-card">
            <span className="help-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="#2454D8" strokeWidth="1.8" />
                <path d="M9.8 9.6c.3-1.3 1.2-2 2.3-2 1.3 0 2.3.9 2.3 2 0 1.9-2.6 2-2.4 3.7" stroke="#2454D8" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16.6" r="1.1" fill="#2454D8" />
              </svg>
            </span>
            <span className="help-text">
              <strong>Tidak bisa masuk?</strong>
              <small>Hubungi admin sekolah / operator PKL</small>
            </span>
            <a className="help-link" href="/login">
              Hubungi <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
