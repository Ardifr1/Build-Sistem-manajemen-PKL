function TambahPengguna(){
  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <div className="page-kicker">Admin 03b — Tambah Pengguna</div>
          <div className="page-title">Tambah Pengguna Baru</div>
          <div className="page-sub">Form akun baru • Undangan email otomatis • Draft • Belum tersimpan</div>
        </div>
        <span className="badge-top">Draft • Belum tersimpan</span>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <span className="chip active">1 • Data Akun</span>
        <span className="chip">2 • Role & Akses</span>
        <span className="chip">3 • Konfirmasi</span>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Pilih Role • menentukan field & akses otomatis</div>
          <div className="role-grid">
            <div className="role-card active"><b>Siswa</b><div className="muted">NIS • Kelas • Jurusan</div></div>
            <div className="role-card"><b>Guru</b><div className="muted">NIP • Mapel • Pembimbing</div></div>
            <div className="role-card"><b>Industri</b><div className="muted">PIC • Perusahaan • Kuota</div></div>
            <div className="role-card"><b>Admin TU</b><div className="muted">Kelola data • Verifikasi</div></div>
          </div>

          <div className="section-title" style={{marginTop:18}}>Data Identitas</div>
          <div className="form-grid">
            <div><label className="f-label">Nama Lengkap *</label><input className="input" placeholder="cth: Rina Amelia" defaultValue="Rina Amelia"/></div>
            <div><label className="f-label">Email Aktif *</label><input className="input" placeholder="cth: rina@smkn1.sch.id" defaultValue="rina@smkn1.sch.id"/></div>
            <div><label className="f-label">No. WhatsApp</label><input className="input" placeholder="cth: 0812-xxxx-xxxx"/></div>
            <div><label className="f-label">Username (otomatis)</label><input className="input" defaultValue="rina.amelia" readOnly/></div>
            <div><label className="f-label">NIS *</label><input className="input" placeholder="cth: 2425001" defaultValue="2425001"/></div>
            <div><label className="f-label">Kelas / Rombel *</label><select className="select"><option>XII RPL 1</option><option>XII RPL 2</option></select></div>
            <div><label className="f-label">Jurusan *</label><select className="select"><option>RPL</option><option>TKJ</option><option>MM</option></select></div>
          </div>
          <p className="muted" style={{marginTop:8}}>✓ NIS valid • Kelas terdeteksi • Akun siswa terhubung ke data Dapodik</p>

          <div className="section-title" style={{marginTop:18}}>Keamanan & Status Akun</div>
          <div className="form-grid">
            <div><label className="f-label">Password Sementara *</label><input className="input" defaultValue="Auto: PKM2026-xxxx" readOnly/></div>
            <div><label className="f-label">Konfirmasi Password *</label><input className="input" placeholder="Ketik ulang password"/></div>
          </div>
          <div style={{display:"flex",gap:18,marginTop:12,flexWrap:"wrap"}}>
            <span><span className="switch on"/> <b style={{marginLeft:8}}>Aktif langsung</b><div className="muted">Akun bisa login setelah disimpan</div></span>
            <span><span className="switch on"/> <b style={{marginLeft:8}}>Kirim undangan email</b><div className="muted">Password + link aktivasi via email</div></span>
          </div>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18,flexWrap:"wrap"}}>
            <button className="btn btn-ghost">Batal</button>
            <button className="btn btn-light">Simpan Draft</button>
            <button className="btn btn-primary">✓ Simpan Akun</button>
          </div>
        </div>

        <div style={{display:"grid",gap:14,alignContent:"start"}}>
          <div className="card">
            <div className="section-title">Pratinjau Akun</div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span className="avatar" style={{width:52,height:52,fontSize:18}}>RA</span>
              <div><b>Rina Amelia</b><div className="muted">rina@smkn1.sch.id • XII RPL 1</div><div style={{marginTop:6}}><span className="pill pill-blue">Siswa</span> <span className="pill pill-green" style={{marginLeft:6}}>Aktif</span></div></div>
            </div>
            <div className="muted" style={{marginTop:12}}>Kredensial sementara<br/>username: rina.amelia<br/>password: PKM2026-xxxx • kirim via email</div>
          </div>
          <div className="card" style={{background:"#1E3A8A",color:"#fff",borderColor:"#1E3A8A"}}>
            <div className="section-title" style={{color:"#fff"}}>✓ Kelengkapan Form</div>
            <ul style={{margin:0,paddingLeft:18,lineHeight:1.9,fontSize:13.5}}>
              <li>Nama lengkap terisi</li><li>Email valid & unik</li><li>NIS + Kelas dipilih</li><li>Password ≥ 8 karakter</li><li>Role Siswa terkunci</li>
            </ul>
            <div className="muted" style={{color:"#DBEAFE",marginTop:8}}>4 dari 5 • 80% lengkap</div>
            <div className="progress" style={{marginTop:8,background:"rgba(255,255,255,.25)"}}><span style={{width:"80%",background:"#fff"}}/></div>
          </div>
          <div className="card">
            <div className="section-title">Butuh banyak akun?</div>
            <p className="muted">Upload CSV / Excel berisi Nama, Email, NIS. Template tersedia.</p>
            <button className="btn btn-light" style={{width:"100%",marginTop:8}}>Seret file / Klik • Unduh template</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TambahPengguna;
