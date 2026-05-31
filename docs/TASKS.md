# TASKS.md

# StudyCircle Master Task Checklist

---

## Phase 1: Workspace & Workspace Foundation
- [ ] **1.1 Database Engine Installation**
  - Setup local PostgreSQL database engine instance.
  - Setup environment variable credentials in backend `.env` configuration.
- [ ] **1.2 Prisma ORM Setup**
  - Construct detailed `prisma/schema.prisma` file with all 9 core models, unique composite mappings, cascade constraints, and relation maps.
  - Execute `npx prisma migrate dev --name init` to apply the database schema.
  - Seed database catalog with core subjects using `prisma/seed.ts`.
- [ ] **1.3 Backend Setup**
  - Initialize Node.js TypeScript project.
  - Configure Express routing structure, CORS, and unified global error handlers.
- [ ] **1.4 Frontend Setup**
  - Initialize React + Vite + TypeScript application in `frontend/`.
  - Install Tailwind CSS and verify the build configuration.

---

## Phase 2: Authentication Core
- [ ] **2.1 Backend Auth Logic**
  - Implement secure account registration with Zod schemas and bcrypt hashing.
  - Implement login route returning 7-day signed JWT tokens.
  - Implement `/auth/me` endpoint to fetch profile data of verified sessions.
  - Build `auth.middleware.ts` to gate private routing layers.
- [ ] **2.2 Frontend Auth Core**
  - Build React `AuthContext` with custom token lookup inside `localStorage`.
  - Setup Axios request interceptors to append `Authorization: Bearer <token>` to outbound requests.
  - Setup Axios response interceptors to automatically flush tokens on 401 exceptions.
  - Implement typesafe `ProtectedRoute.tsx` wrapper for client routes.

---

## Phase 3: Profile Management
- [ ] **3.1 Backend Profiles**
  - Develop `GET /users/profile` and `PUT /users/profile` endpoints.
  - Build `PUT /users/learning-style` endpoint supporting upsert database flows.
- [ ] **3.2 Frontend Profiles**
  - Build Profile Page containing editable personal metadata inputs.
  - Create interactive Learning Style selector dashboard.

---

## Phase 4: Study Groups Management
- [ ] **4.1 Backend Groups**
  - Develop `GET /study-groups` (public) and `GET /study-groups/:id` endpoints.
  - Develop group creation endpoint (`POST /study-groups`) with automatic group creator to Admin role mapping.
  - Develop `PUT /study-groups/:id` and `DELETE /study-groups/:id` (restricted to Group Admins).
  - Develop membership actions: join (capacity checks), leave, list members, and kick member.
  - Construct group member checking middleware wrappers.
- [ ] **4.2 Frontend Groups**
  - Build Group Explorer with subject filter dropdown menus.
  - Build Group Details Page showcasing info widgets, member tables, and schedule lists.
  - Build typesafe Group Creation Form dialog modal.

---

## Phase 5: Learning Sessions & Attendance
- [ ] **5.1 Backend Sessions**
  - Develop CRUD endpoints for sessions (restricted to Group Admins).
  - Develop `/sessions/:id/join` to initialize a user's active attendance log.
  - Develop `/sessions/:id/leave` to record departure, compute session attendance metrics, and trigger progress updates.
- [ ] **5.2 Frontend Sessions**
  - Build Sessions Calendar/Scheduler view.
  - Build Session Creation/Modification panel (admin only).
  - Implement responsive Join/Leave attendance tracker buttons.

---

## Phase 6: Material Sharing
- [ ] **6.1 Backend Materials**
  - Setup `multer` file upload configuration on backend.
  - Develop file uploading endpoint (`POST /materials`) scoped per group membership validation.
  - Develop resource deletion endpoint (`DELETE /materials/:id`) restricted to **uploader** OR **Group Admin**.
- [ ] **6.2 Frontend Materials**
  - Build interactive Material Library view for each study circle.
  - Build file upload modal with progress indicators.

---

## Phase 7: Progress Analytics Dashboard
- [ ] **7.1 Backend Progress**
  - Build progress stats aggregation service using automated triggers.
  - Develop `GET /progress` to retrieve user statistics across groups.
- [ ] **7.2 Frontend Progress**
  - Build Progress Dashboard Page displaying sessions completed, total hours, and Mastery Badge level.
  - Design premium visual stats cards.

---

## Phase 8: Integration & Deployment Preparation
- [ ] **8.1 Verification Audit**
  - Run comprehensive API collection tests.
  - Run full UX responsive design audit.
- [ ] **8.2 Deployment Config**
  - Configure Docker container configurations for production runs.