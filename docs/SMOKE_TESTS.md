# Smoke test checklist (latest build)

Run before tagging a release or demo. Adjust URLs if your `VITE_API_BASE_URL` or backend port differs.

## Preconditions

- MySQL running with `institutional_data_center` schema
- Backend: `cd backend && ./mvnw spring-boot:run` (default `http://127.0.0.1:9000`)
- Frontend: `cd frontend && npm run dev` (default `http://localhost:5173` or `http://localhost:3000`)

## Student

- [ ] Login as student → lands on `/student`
- [ ] Phone opens dialer (`tel:`), email opens mail client (`mailto:`)
- [ ] LinkedIn/GitHub icons open URLs when saved (or appear disabled when empty)
- [ ] **Edit Profile** saves and persists after refresh
- [ ] Add skill/project/achievement/internship → appears in list
- [ ] **Edit** / **Delete** on each portfolio card works; list updates without full reload
- [ ] Change password modal works; logout returns to `/login`

## Faculty

- [ ] Login as faculty → `/faculty`
- [ ] Phone/email clickable
- [ ] Social links: **Add Social** or **Edit Links** persists LinkedIn/GitHub
- [ ] Certification / research / experience / project cards: **Edit** / **Delete** works
- [ ] Project and research reference URLs open in new tab (with `https://` auto-prefix when omitted)

## Admin

- [ ] Login as admin → `/admin/student` or analytics routes load
- [ ] Student CRUD in admin still works; new student fields **LinkedIn URL** / **GitHub URL** save
- [ ] **Approvals** page shows **Audit Timeline** and refreshes after create/review actions

## API sanity (optional)

- [ ] `GET /swagger-ui.html` loads
- [ ] Unauthenticated `GET /student/get-all-students` returns **401**
- [ ] `POST /auth/login` with bad password returns **401**
