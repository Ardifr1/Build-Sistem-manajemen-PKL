/** Helper tampilan tabel pengguna: avatar inisial + badge peran + badge status. */

const AVATAR_COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0ea5e9", "#be185d", "#475569"];

export function avatarColor(name) {
  let h = 0;
  for (const c of String(name || "?")) h = (h * 31 + c.charCodeAt(0)) % 997;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserCell({ name, email }) {
  return (
    <span className="zip-user-cell">
      <span className="zip-avatar" style={{ background: avatarColor(name) }}>{initials(name)}</span>
      <span>
        <div className="zip-user-name">{name}</div>
        <div className="zip-user-email">{email}</div>
      </span>
    </span>
  );
}

const ROLE_CLASS = {
  student: "r-siswa",
  teacher: "r-guru",
  company: "r-industri",
  admin: "r-admin",
  supervisor: "r-pembimbing",
};

const ROLE_LABEL_ID = {
  student: "Siswa",
  teacher: "Guru",
  company: "Industri",
  admin: "Admin",
  supervisor: "Pembimbing",
};

export function RoleBadge({ role }) {
  return (
    <span className={`zip-role ${ROLE_CLASS[role] || "r-siswa"}`}>
      <span className="dot" />{ROLE_LABEL_ID[role] || role}
    </span>
  );
}

export function StatusBadge({ active }) {
  return active
    ? <span className="zip-status s-aktif"><span className="dot" />Aktif</span>
    : <span className="zip-status s-nonaktif"><span className="dot" />Nonaktif</span>;
}
