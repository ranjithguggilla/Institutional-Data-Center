/**
 * API origin.
 * - Prefer same-origin "/api" in dev and when the app is opened from localhost (incl. `vite preview`),
 *   so vite.config proxy can forward to Spring on :9000.
 * - If VITE_API_BASE_URL points at http://localhost:9000 or http://127.0.0.1:9000, ignore it (stale .env
 *   was forcing the browser to call 9000 directly and bypass the proxy).
 * - Remote / production hosts: use VITE_API_BASE_URL or fall back to http://127.0.0.1:9000.
 */
const rawEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "").trim();

function pointsAtLocalSpring9000(url) {
  if (!url?.startsWith("http")) return false;
  try {
    const u = new URL(url);
    return (
      u.port === "9000" &&
      (u.hostname === "127.0.0.1" || u.hostname === "localhost")
    );
  } catch {
    return false;
  }
}

export const API_BASE = (() => {
  if (rawEnv && !pointsAtLocalSpring9000(rawEnv)) {
    return rawEnv;
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") {
      return "/api";
    }
  }
  return "http://127.0.0.1:9000";
})();
