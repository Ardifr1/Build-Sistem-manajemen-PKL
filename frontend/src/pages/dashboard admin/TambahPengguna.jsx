import ProgressBar from "../../components/admin/ProgressBar.jsx";

function TambahPengguna({ onNavigate }) {
  const goBack = () => onNavigate?.("akun");
  const checks = [
    { ok: true, label: "Nama lengkap terisi" },
    { ok: true, label: "Email valid & unik" },
    { ok: true, label: "NIS + Kelas dipilih" },
    { ok: false, label: "Password ≥ 8 karakter" },
    { ok: true, label: "Role Siswa terkunci" },
  ];
  return (
    <div className="admin-page gap-14">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-white" onClick={goBack}>‹&nbsp; Kembali</button>
        <span style={{ fontSize: 12, color: "#64748B" }}>Akun Pengguna&nbsp; /&nbsp; Tambah Pengguna</span>
        <span style={{ flex: 1 }} />
        <span className="badge-top">● Draft • Belum tersimpan</span>
      </div>

      <div className="grid-form">
        <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Tambah Pengguna Baru</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                Buat satu akun atau undang banyak sekaligus. Password sementara dikirim otomatis via email.
              </div>
            </div>
            <span className="btn btn-primary" style={{ padding: "8px 12px", fontSize: 11 }}>● Single</span>
            <span className="btn btn-white" style={{ padding: "8px 12px", fontSize: 11 }}>⇪ Import Bulk</span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px" }}>
            <span className="chip active">● 1 • Data Akun</span>
            <span className="chip">○ 2 • Role &amp; Akses</span>
            <span className="chip">○ 3 • Konfirmasi</span>
          </div>

          <div style={{ height: 1, background: "#E2E8F0" }} />

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Pilih Role&nbsp;&nbsp;•&nbsp;&nbsp;menentukan field &amp; akses otomatis</div>
            <div className="role-grid">
              <div className="role-card active">
                <div className="role-icon">🎓</div>
                <div className="role-name">Siswa</div>
                <div className="role-desc">NIS • Kelas • Jurusan</div>
              </div>
              <div className="role-card">
                <div className="role-icon">🧑‍🏫</div>
                <div className="role-name">Guru</div>
                <div className="role-desc">NIP • Mapel • Pembimbing</div>
              </div>
              <div className="role-card">
                <div className="role-icon">🏢</div>
                <div className="role-name">Industri</div>
                <div className="role-desc">PIC • Perusahaan • Kuota</div>
              </div>
              <div className="role-card">
                <div className="role-icon">🛡️</div>
                <div className="role-name">Admin TU</div>
                <div className="role-desc">Akses penuh • Verifikasi</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Data Identitas</div>
            <div className="form-grid2">
              <div>
                <label className="f-label">Nama Lengkap *</label>
                <input className="input" placeholder="cth: Rina Amelia" />
              </div>
              <div>
                <label className="f-label">Email Aktif *</label>
                <input className="input" placeholder="cth: rina@smkn1.sch.id" />
              </div>
              <div>
                <label className="f-label">No. WhatsApp</label>
                <input className="input" placeholder="cth: 0812-xxxx-xxxx" />
              </div>
              <div>
                <label className="f-label">Username (otomatis)</label>
                <input className="input input-readonly" value="rina.amelia" readOnly />
              </div>
            </div>
            <div className="form-grid3" style={{ marginTop: 12 }}>
              <div>
                <label className="f-label">NIS *</label>
                <input className="input" placeholder="cth: 2425001" />
              </div>
              <div>
                <label className="f-label">Kelas / Rombel ▾</label>
                <input className="input" value="XII RPL 1 ▾" readOnly />
              </div>
              <div>
                <label className="f-label">Jurusan ▾</label>
                <input className="input" value="RPL ▾" readOnly />
              </div>
            </div>
            <div className="hint-box" style={{ marginTop: 10 }}>
              ✓ NIS valid • Kelas terdeteksi • Akun siswa otomatis terhubung ke data Dapodik
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Keamanan &amp; Status Akun</div>
            <div className="form-grid2">
              <div>
                <label className="f-label">Password Sementara *</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="input" placeholder="Auto: Pkl#2026-xxxx" style={{ flex: 1 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8" }}>↻</span>
                </div>
              </div>
              <div>
                <label className="f-label">Konfirmasi Password *</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="input" placeholder="Ketik ulang password" style={{ flex: 1 }} />
                  <span style={{ fontSize: 12 }} title="Tampilkan password">👁</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <div className="toggle-box">
                <span className="switch-pen">● ON</span>
                <span>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 700 }}>Aktif langsung</span>
                  <span style={{ display: "block", fontSize: 10, color: "#64748B" }}>Akun bisa login setelah disimpan</span>
                </span>
              </div>
              <div className="toggle-box">
                <span className="switch-pen">● ON</span>
                <span>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 700 }}>Kirim undangan email</span>
                  <span style={{ display: "block", fontSize: 10, color: "#64748B" }}>Password + link aktivasi via email</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#64748B", flex: 1, minWidth: 200 }}>
              Dengan menyimpan, sistem membuat username + mengirim undangan.
            </span>
            <button type="button" className="btn btn-white" onClick={goBack}>Batal</button>
            <button type="button" className="btn btn-lightgray">Simpan Draft</button>
            <button type="button" className="btn btn-primary" onClick={goBack}>✓ Simpan Akun</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Pratinjau Akun</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="avatar-pen" style={{ width: 44, height: 44, borderRadius: 22, fontSize: 14 }}>RA</span>
              <span>
                <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>Rina Amelia</span>
                <span style={{ display: "block", fontSize: 11, color: "#64748B" }}>rina@smkn1.sch.id • XII RPL 1</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>🎓 Siswa</span>
              <span className="tag" style={{ background: "#DCFCE7", color: "#16A34A" }}>● Aktif</span>
            </div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>Kredensial sementara</span>
              <span style={{ fontSize: 11 }}>username : rina.amelia</span>
              <span style={{ fontSize: 11 }}>password : Pkl#2026-xxxx&nbsp;&nbsp;•&nbsp;&nbsp;kirim via email</span>
            </div>
          </div>

          <div className="dark-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>✓ Kelengkapan Form</div>
            {checks.map((c) => (
              <div key={c.label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.ok ? "#4ADE80" : "#93C5FD" }}>{c.ok ? "✓" : "○"}</span>
                <span style={{ fontSize: 11, color: "#fff" }}>{c.label}</span>
              </div>
            ))}
            <div style={{ background: "#0F2A6B", borderRadius: 8, padding: "8px 10px", marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#93C5FD", marginBottom: 6 }}>4 dari 5 • 80% lengkap</div>
              <ProgressBar percent={80} barColor="#4ADE80" trackColor="#334155" height={6} />
            </div>
          </div>

          <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800 }}>Butuh banyak akun?</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Upload CSV / Excel berisi Nama, Email, NIS. Template tersedia.</div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: 12, fontSize: 11, fontWeight: 700, color: "#1D4ED8" }}>
              ⇪&nbsp; Seret file / Klik • Unduh template
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TambahPengguna;
