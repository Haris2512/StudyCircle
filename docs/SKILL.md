# SKILL.md

# Lead Architect Role & Engineering Standards

This document establishes the official engineering guidelines, architectural values, and strict coding standards for the StudyCircle development cycle.

---

## 1. Architectural Philosophy

### 1.1 Simple over Complex
Avoid over-engineering. Do not introduce microservices, custom cache syncs (e.g., Redis), or external message brokers (e.g., RabbitMQ) unless explicitly justified. A clean, single-instance monolith structured around layered folders matches our MVP goals.

### 1.2 Data Source of Truth
We enforce data integrity in our PostgreSQL relational database layer first:
* Always apply relational cascade deletes (`onDelete: Cascade`) for junction rows (`members`, `session_attendances`).
* Maintain clean database normalization rules; do not duplicate data rows across tables.
* Keep composite indexes applied on heavy query paths (e.g., `(study_group_id, user_id)` lookup indexes).

---

## 2. API Design & Security Standards

* **Resource URI Conventions:** Use plural nouns and standard HTTP verbs:
  * `GET /api/v1/study-groups` (browse)
  * `POST /api/v1/study-groups` (create)
  * `DELETE /api/v1/study-groups/:id` (delete)
* **JWT Access Control Rules:**
  * Transport JWT inside the standard authorization header: `Authorization: Bearer <token>`.
  * Store keys safely in `.env` configurations; never commit credentials.
  * Systematically reject requests with 401 (Unauthorized) or 403 (Forbidden) error status codes.
* **Credentials Security:**
  * Encrypt passwords immediately using `bcryptjs` before committing to storage.
  * Never return the hashed password in JSON responses; exclude it in queries.

---

## 3. Frontend Principles

* **TypeScript-First Codebase:** Maintain high typesafe standard. Ensure components, hooks, responses, and inputs map to clean TypeScript interfaces.
* **Atomic Component Design:** Organize components cleanly:
  * **Common Elements:** Primitives like `Button.tsx`, `Input.tsx`, `Badge.tsx`, and `Modal.tsx`.
  * **Feature Components:** Domain-scoped layouts like `GroupCard.tsx` or `UploadForm.tsx`.
* **State Management Strategy:**
  * Keep context providers thin (`AuthContext`).
  * Scrape server-side tables locally inside routes using custom Hooks.
  * Handle data validation UI alerts gracefully.

---

## 4. UI/UX Brand Guidelines

To create a premium academic collaborative platform, developers must follow these UI styling metrics:

### 4.1 Aesthetic Concept
* **Academic Tech:** Dark backgrounds mixed with frosted-glass containers (glassmorphism), high contrast typography, and custom active indicators.
* **Colors:** Sleek dark background (#0B0F19), indigo primary controls, emerald success states, and amber alerts. No basic/generic CSS colors.
* **Typography:** Modern fonts (e.g., Inter, Outfit, or Roboto) loaded from Google Fonts.

### 4.2 Accessibility Metrics
* Responsive styling designed for seamless scaling across standard desktop, tablet, and mobile screens.
* Clear visual states for interactive actions (transitions, shadows, and subtle scale changes).
