# Institutional Data Center

A university-grade centralized data management platform for Vaagdevi College of Engineering, built with a modern React + Spring Boot stack.  
The system manages student, faculty, and administrative operations with JWT security, role-based access, analytics, approvals workflow, and Excel exports.

| | Version |
|---|--:|
| Frontend (npm) | `2.1.0` |
| Backend (Maven) | `2.1.0-SNAPSHOT` |

Release notes: [CHANGELOG.md](CHANGELOG.md).

**Visual documentation:** PNG screenshots for **authentication** (login/register), plus **student**, **faculty**, and **admin** UIs, live under `docs/` (see [UI screenshots](#ui-screenshots-reference)). They are committed so anyone browsing the repository on GitHub/GitLab—or after `git pull`—can see **what the frontend looks like** without running the stack, which helps reviewers, new contributors, and readers of the project understand the product at a glance.

## Highlights

- Production-ready full stack architecture (React 19 + Vite, Spring Boot 4, MySQL)
- Secure authentication and authorization with JWT + Spring Security
- Role-driven UX for Student, Faculty, and Admin users
- Admin control center with CRUD operations, analytics, and approval workflow
- Export-ready reporting for student and faculty datasets

## Technology Stack

### Frontend

- React 19 (Vite 6)
- React Router DOM 6.x
- Axios
- React Toastify
- React Helmet Async
- jwt-decode

### Backend

- Spring Boot 4.0.5 (Spring Framework 7 / Security 7)
- Spring Data JPA + Hibernate 7
- MySQL
- JWT (`jjwt` 0.12.6)
- Apache POI 5.5.1 (Excel export)
- SpringDoc OpenAPI (`/swagger-ui.html`)

## Architecture Overview

- `frontend` consumes REST APIs exposed by `backend`.
- `backend` enforces authentication/authorization and persists data in MySQL.
- JWT token flow:
  1. `POST /auth/login`
  2. token stored on client
  3. token sent in `Authorization: Bearer <token>` for protected endpoints
- Admin pages aggregate data from multiple resource endpoints for list, filter, analytics, and workflow operations.

## Repository Structure

```text
Institutional-Data-Center/
├── backend/                  # Spring Boot API (Java 17)
├── frontend/                 # React + Vite client
├── docs/
│   ├── Authentication/       # Login & register screenshots (`images/`)
│   ├── Students/             # Student UI reference screenshots (`images/`)
│   ├── Faculty/              # Faculty UI screenshots (`Images/`)
│   ├── Admin/                # Admin panel reference screenshots (`images/`)
│   └── SMOKE_TESTS.md
├── docker-compose.yml        # Local backend + database orchestration
├── CHANGELOG.md              # Version history
└── README.md
```

## Functional Modules

### Student Module

- Profile dashboard and data sections (projects, skills, certifications, internships)
- Password management
- Resource-level API integration

### Faculty Module

- Faculty profile workflows
- Experience, papers, certifications, documents, social links
- Password management

### Admin Module

- Student management: add/edit/delete, filters, pagination, Excel export
- Faculty management: add/edit/delete, filters, pagination, Excel export
- User/Role management (`/admin/users`)
- Analytics dashboard (`/admin/analytics`)
- Approval workflow panel (`/admin/approvals`)

## Admin Routes

- `/admin/student` - student control panel
- `/admin/faculty` - faculty control panel
- `/admin/users` - user/role management
- `/admin/analytics` - operational analytics
- `/admin/approvals` - approval queue management

## Key API Endpoints

### Authentication

- `POST /auth/login`
- `GET /user/get-user-object`

### Admin Operations

- `GET /admin/analytics/overview`
- `GET /admin/approvals`
- `POST /admin/approvals/request`
- `PUT /admin/approvals/{id}/review`

### User Management

- `GET /user/all`
- `PUT /user/role/{userName}`
- `DELETE /user/{userName}`

### Student CRUD

- `POST /student/add-student`
- `PUT /student/update-student/{studentId}`
- `DELETE /student/delete-student/{studentId}`
- `GET /student/excel`

### Faculty CRUD

- `POST /faculty/add-faculty`
- `PUT /faculty/update-faculty/{facultyId}`
- `DELETE /faculty/delete-faculty/{facultyId}`
- `GET /faculty/excel`

## Local Development Setup

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Git

### 1) Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend base URL: [http://localhost:9000](http://localhost:9000)  
Swagger: [http://localhost:9000/swagger-ui.html](http://localhost:9000/swagger-ui.html)

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend base URL: [http://localhost:3000](http://localhost:3000)

### 3) Docker (optional backend + DB)

```bash
docker compose up --build
```

## Environment Configuration

### Backend

| Variable | Default | Purpose |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/institutional_data_center...` | JDBC connection URL |
| `DB_USERNAME` | `root` | DB username |
| `DB_PASSWORD` | `Admin@123` | DB password |
| `JWT_SECRET` | built-in fallback | JWT signing key |
| `JWT_EXPIRATION` | `3600` | token lifetime (seconds) |
| `CORS_ORIGINS` | localhost + deployed origin | allowed frontend origins |

### Frontend

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:9000` | backend API base URL |

## Build & Packaging

```bash
# Frontend production bundle
cd frontend && npm run build

# Backend package
cd backend && ./mvnw package -DskipTests
```

## UI screenshots (reference)

These images are **documentation only** (not bundled into the app). Keeping them in git means the README and the `docs/*` screenshot folders stay a **truthful, visual brief** of the React UI after every pull or commit—so viewers can judge layout, flows, and scope before cloning or running locally.

**Where files live**

| Area | Folder | Index |
|------|--------|--------|
| Login & registration | [`docs/Authentication/images/`](docs/Authentication/images/) | [`docs/Authentication/README.md`](docs/Authentication/README.md) |
| Student portal | [`docs/Students/images/`](docs/Students/images/) | [`docs/Students/README.md`](docs/Students/README.md) |
| Faculty portal | [`docs/Faculty/Images/`](docs/Faculty/Images/) | [`docs/Faculty/README.md`](docs/Faculty/README.md) |
| Admin panel | [`docs/Admin/images/`](docs/Admin/images/) | [`docs/Admin/README.md`](docs/Admin/README.md) |

### Login & registration (Chrome, `localhost`)

**Sign in** (`/login`) — role tabs (Student / Faculty / Admin)

![Login — Student role](docs/Authentication/images/login-student.png)

![Login — Faculty role](docs/Authentication/images/login-faculty.png)

![Login — Admin role](docs/Authentication/images/login-admin.png)

**Create account** (`/register`)

![Register — Student](docs/Authentication/images/register-student.png)

![Register — Faculty](docs/Authentication/images/register-faculty.png)

### Student portal (Chrome, `localhost`)

**Profile and sections**

![Student home — profile header, contact, and portfolio sections](docs/Students/images/student-home-profile.png)

![Student home — achievements, projects, skills, internships cards](docs/Students/images/student-home-sections.png)

![Edit profile — form with contact and social URLs](docs/Students/images/student-edit-profile.png)

**Add modals**

![Add achievement](docs/Students/images/student-add-achievement.png)

![Add project](docs/Students/images/student-add-project.png)

![Add skill](docs/Students/images/student-add-skill.png)

![Add internship](docs/Students/images/student-add-internship.png)

**Header menu**

![User menu — change password and logout](docs/Students/images/student-menu-dropdown.png)

### Faculty portal (`/faculty`, `localhost`)

**Home and navigation**

![Faculty home — profile and accordion sections](docs/Faculty/Images/01-faculty-home-overview.png)

![Faculty home — user menu](docs/Faculty/Images/02-faculty-home-user-menu.png)

**Profile and social / research links**

![Edit faculty profile modal](docs/Faculty/Images/03-modal-edit-faculty-profile.png)

![Social and research profiles modal](docs/Faculty/Images/04-modal-social-research-profiles.png)

**Add / edit modals**

![Add certification](docs/Faculty/Images/05-modal-add-certification.png)

![Add research paper](docs/Faculty/Images/06-modal-add-research-paper.png)

![Add experience](docs/Faculty/Images/07-modal-add-experience.png)

![Add project](docs/Faculty/Images/08-modal-add-project.png)

![Professional license](docs/Faculty/Images/09-modal-professional-license.png)

![Research grant / funding](docs/Faculty/Images/10-modal-research-grant-funding.png)

![Personal documents](docs/Faculty/Images/11-modal-personal-documents.png)

### Admin panel (`/admin/*`, Chrome, `localhost`)

**Students and faculty management**

![Admin — student list, filters, and navigation](docs/Admin/images/01-admin-students-list-filters.png)

![Admin — add student form](docs/Admin/images/02-admin-students-add-form.png)

![Admin — faculty list and filters](docs/Admin/images/03-admin-faculty-list-filters.png)

![Admin — add faculty form](docs/Admin/images/04-admin-faculty-add-form.png)

**Users, analytics, approvals**

![Admin — user and role management](docs/Admin/images/05-admin-users-role-management.png)

![Admin — analytics dashboard](docs/Admin/images/06-admin-analytics-dashboard.png)

![Admin — approvals workflow (pending items) and audit](docs/Admin/images/07-admin-approvals-pending-workflow.png)

![Admin — approvals (empty queue) and audit timeline](docs/Admin/images/08-admin-approvals-empty-audit.png)

**Updating captures:** add or replace PNGs under the folders above, then reference them here (or only in each folder’s `README.md`) so the repo overview stays accurate for the next push.

## Quality Notes

- Frontend and backend compile/build successfully.
- API contracts are aligned with role-based route access.
- Admin workflows are implemented with clear UI actions and toast-based feedback.
- Documentation includes setup, architecture, routes, and **authentication + student + faculty + admin UI screenshots** under `docs/Authentication/images/`, `docs/Students/images/`, `docs/Faculty/Images/`, and `docs/Admin/images/` (see [UI screenshots](#ui-screenshots-reference)).
- Pre-release smoke checklist: [docs/SMOKE_TESTS.md](docs/SMOKE_TESTS.md)
