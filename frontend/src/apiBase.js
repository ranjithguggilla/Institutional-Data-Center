/** Backend origin — must match Spring Boot (default 9000). Trailing slash stripped. */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:9000";
