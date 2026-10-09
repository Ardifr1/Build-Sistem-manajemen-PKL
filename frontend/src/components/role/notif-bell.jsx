import { useEffect, useRef, useState } from "react";
import { getNotifications } from "../../lib/notifications.js";
import "./notif-bell.css";

/**
 * NotifBell — tombol bell + dropdown notifikasi sederhana.
 * @param {string} role      student | teacher | company | supervisor | admin
 * @param {Object} ctx       { user, placement } — diteruskan ke getNotifications
 * @param {string} btnClass  kelas tombol (mis. "siswa-bell" / "shell-bell")
 */
function NotifBell({ role, ctx = {}, btnClass = "siswa-bell", onNavigate }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasNew, setHasNew] = useState(false);
  const wrapRef = useRef(null);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  const load = async () => {
    setLoading(true);
    try {
      const list = await getNotifications(role, ctxRef.current);
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    const fetchNotifs = async (silent = false) => {
      try {
        const list = await getNotifications(role, ctxRef.current);
        if (alive) {
          setItems(Array.isArray(list) ? list : []);
          // Tandai ada yang baru (untuk animasi/badge)
          if (!silent && list.length > 0) {
            setHasNew(true);
            setTimeout(() => alive && setHasNew(false), 3000);
          }
        }
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchNotifs();
    // Polling realtime tiap 30 detik
    const timer = setInterval(() => fetchNotifs(true), 30000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open ]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load(); // segarkan tiap dibuka
  };

  const count = items.length;

  return (
    <div className="notif-bell" ref={wrapRef}>
      <button type="button" className={`${btnClass}${hasNew ? " notif-new" : ""}`} aria-label="Notifikasi" onClick={toggle}>
        <i className="fa-regular fa-bell"></i>
        {count > 0 && (
          <span className="notif-count">{count > 9 ? "9+" : count}</span>
        )}
      </button>
      {open && (
        <div className="notif-drop" role="menu">
          <div className="notif-drop-head">Notifikasi</div>
          <div className="notif-drop-body">
            {loading ? (
              <div className="notif-empty">Memuat…</div>
            ) : items.length === 0 ? (
              <div className="notif-empty">
                <i className="fa-regular fa-bell"></i>
                <span>Tidak ada notifikasi baru</span>
              </div>
            ) : (
              items.map((n, i) => (
                <button
                  type="button"
                  className={`notif-item${n.to ? " clickable" : ""}`}
                  key={i}
                  onClick={() => {
                    if (n.to && onNavigate) {
                      setOpen(false);
                      onNavigate(n.to);
                    }
                  }}
                  disabled={!n.to}
                >
                  <span className={`notif-ic tone-${n.tone || "blue"}`}>
                    <i className={`fa-solid ${n.icon || "fa-bell"}`}></i>
                  </span>
                  <span className="notif-tx">
                    <span>{n.text}</span>
                    {n.time && <small>{n.time}</small>}
                  </span>
                  {n.to && <i className="fa-solid fa-chevron-right notif-go"></i>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotifBell;
