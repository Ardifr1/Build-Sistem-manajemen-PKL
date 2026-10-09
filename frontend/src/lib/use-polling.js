import { useEffect, useRef } from "react";

/**
 * usePolling — jalankan callback berkala untuk realtime (polling).
 * @param {Function} cb — fungsi async yang dipanggil tiap interval
 * @param {number} ms — interval dalam ms (default 15000)
 * @param {Array} deps — dependency untuk restart polling
 */
export function usePolling(cb, ms = 15000, deps = []) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      try {
        await cbRef.current();
      } catch {
        // abaikan error polling
      }
    };
    // Jangan panggil langsung — biarkan pemanggil yang load awal
    const timer = setInterval(tick, ms);
    return () => {
      alive = false;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default usePolling;
