# Changelog

All notable changes to this project are documented here. Versions follow **frontend npm** (`frontend/package.json`) and **backend Maven** (`backend/pom.xml`) in tandem for this repository.

## [2.1.0] — 2026-04-14

### Frontend

- **Document title:** centralized React Helmet titles for `/login`, `/register`, and `/forgot-password` in `App.jsx` so the browser tab always matches the current route (fixes a stale “Register” title on the login page after navigation).

### Documentation

- Added **authentication** UI reference set: login (Student, Faculty, Admin) and register (Student, Faculty) under `docs/Authentication/images/`.
- Consolidated **student**, **faculty**, and **admin** screenshot folders under `docs/` with README indexes; root README embeds a full visual tour of the React UI.
- Repository README includes a **version table** and expanded **UI screenshots** (auth → student → faculty → admin).

### Versioning

- Frontend: `2.1.0` (from `2.0.0`).
- Backend: `2.1.0-SNAPSHOT` (from `0.0.1-SNAPSHOT`).

---

Earlier history: see git history for feature work prior to this documentation release.
