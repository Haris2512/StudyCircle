# PRD.md

# StudyCircle: Product Requirements Document

**Version:** 1.1  
**Lead Architect:** Antigravity  
**Status:** Approved for Implementation  

---

## 1. Product Overview
StudyCircle is a dedicated, collaborative learning platform designed to help university students organize peer-to-peer study groups, schedule structural learning sessions, upload shared academic resources, and objectively track and visualize their personal learning consistency. 

By prioritizing structured, measurable, and highly accessible collaborative learning over standard generic chat apps, StudyCircle ensures study sessions are organized, progress is transparent, and resources are unified.

---

## 2. Key Problem Solved
1. **Unstructured Environments:** Standard messaging applications lack structural tools for setting dedicated schedules or tracking cumulative milestones.
2. **Resource Fragmentation:** Learning materials shared in social chat spaces are easily buried under text threads.
3. **Collaboration Barriers:** Difficulty in finding suitable study partners in specific academic courses.
4. **Lack of Motivation:** A lack of immediate feedback loops makes keeping study routines consistent challenging for students.

---

## 3. Core Product Goals
* **Discoverability:** Empower students to browse and join target study circles centered around specific subject codes.
* **Consistency:** Drive active peer engagement through structured, scheduled learning sessions with precise timing checks.
* **Resource Preservation:** Centralize uploaded resources (files, folders) grouped per study circle.
* **Objective Tracking:** Calculate accurate mastery levels (Beginner, Intermediate, Advanced) dynamically derived from real session durations.

---

## 4. Target User Persona & Contextual Roles

### 4.1 System-Wide Role
* **Student:** Every registered account is systematically categorized as a student. This level allows users to edit profiles, manage preferences, browse subjects, join study circles, attend study sessions, and upload resources.

### 4.2 Group-Level Contextual Roles
* **Group Member (`member`):** Regular student who joins a study group. Inherits basic course participant rights.
* **Group Admin (`admin`):** The student who creates the group is automatically assigned Group Admin. They maintain absolute control over the circle's metadata, membership, scheduling, and admin features.

---

## 5. Functional Requirements (FR)

### FR-01: Authentication & Access Control
* The system must allow guest users to register an account with a unique username, unique email, password, full name, and semester indicator.
* The system must verify credentials at login and return a secure JSON Web Token (JWT) with a 7-day expiration.
* Private routes must be strictly gated; the system must check the JWT on all custom API transactions.

### FR-02: Profiles & Learning Style Customization
* Students must be able to view their profile dashboard and modify personal attributes (e.g., display name, semester).
* The system must allow users to select a **Primary Learning Style** (Visual, Auditory, Reading/Writing, Kinesthetic) and an optional **Secondary Learning Style** to assist with future group matchmaking.

### FR-03: Subjects Catalog
* Read-only catalog seeded at project setup containing academic modules (Subject Code, Subject Name, Description).
* Every created study group must be explicitly associated with exactly one catalog subject.

### FR-04: Study Circles Management
* Public browser allowing users to view all available groups, search by name, or filter by academic subject.
* The system must prevent users from joining a group once membership hits its server-enforced `max_members` ceiling.
* Group Admins have exclusive rights to modify group details, remove members, or disband the circle.

### FR-05: Learning Sessions Scheduler
* Group Admins can schedule sessions with descriptive titles, start times, and end times.
* Sessions progress through lifecycle states: `scheduled` → `active` (session starts) → `completed` / `cancelled`.

### FR-06: Precise Attendance Logging
* When a student enters an active session, the system must generate a `session_attendances` entry with status `active` and timestamp `joined_at`.
* When a student leaves, the system logs `left_at`, computes `duration_minutes` synchronously, updates progress, and marks the attendance status as `completed`.

### FR-07: Material Library Sharing
* Authorized group members can upload resources (PDFs, docs, images, archives) scoped strictly to their group.
* Resource metadata must track the uploader, upload timestamp, file type, and file size in bytes.
* Deletion is strictly restricted to: **the original uploader** OR **the corresponding Group Admin**.

### FR-08: Progress Tracking & Mastery Levels
* Progress is aggregated per user, per study group.
* **Progress Recalculation Trigger:** On session leave, the system must atomically increment total attended counts, add computed hours to `total_study_hours`, and evaluate the updated **Mastery Level**:
  * **0 – 4 hours:** `Beginner`
  * **5 – 14 hours:** `Intermediate`
  * **15+ hours:** `Advanced`

---

## 6. Non-Functional Requirements (NFR)
* **Performance:** Maximum page rendering time under 3 seconds; backend API endpoints must complete requests in under 500ms.
* **Security:** Secure password hashing via bcrypt (10 rounds); SQL injection protection via Prisma ORM parameterized queries; strict CORS handling.
* **Usability:** High-fidelity, mobile-responsive user interface styled with premium dark mode/glassmorphism aesthetics.
* **Reliability:** Relational integrity via PostgreSQL cascade deletes for session and membership cleanup.
