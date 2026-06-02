# 🎓 StudyCircle

[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg?style=for-the-badge&logo=vite)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?style=for-the-badge&logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg?style=for-the-badge&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue.svg?style=for-the-badge&logo=postgresql)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg?style=for-the-badge&logo=docker)](https://www.docker.com)

> **StudyCircle** is a modern, smart study group coordination platform built specifically for university students. It empowers students to find, join, and collaborate in the perfect study groups based on subject compatibility, learning styles, and schedule matches.

---

## ✨ Features Highlight

*   **🧠 Smart Learning Styles**: Supports tracking individual study preferences (Visual, Auditory, Reading, Kinesthetic) and maps matches with group learning dynamics.
*   **🤝 Compatibility Engine**: Shows a precise match percentage indicating how well a user fits with a study group's profile.
*   **📅 Session Scheduling & Attendance**: Create virtual or physical study sessions, track user attendance, calculate study hours, and monitor progress automatically.
*   **📂 Group Materials Sharing (CRUD)**: Share resources like PDFs, slides, and docs with group members, featuring fully integrated creation, read, and delete permissions.
*   **📊 Integrated Progress Dashboard**: Monitor your study consistency, total hours spent learning, and automatically level up your subject mastery (Beginner, Intermediate, Advanced).
*   **🔮 Premium Glassmorphic UI/UX**: Designed with vibrant neon/dark themes, radial glow gradients, glass panels, and interactive micro-animations.

---

## 🛠️ Technology Stack

### Frontend
- **React 19 & Vite**: Ultra-fast hot-reloading development environment and light bundles.
- **TypeScript**: Full type safety across API calls, state, and UI components.
- **Tailwind CSS v4**: Modern CSS utilities with glassmorphic cards, custom radial glow effects, and modern button animations.
- **Lucide React**: Clean and consistent modern iconography.
- **Axios & React Router DOM**: Robust routing and declarative API client.

### Backend
- **Node.js & Express**: Clean, modular MVC-like routing and controllers.
- **Prisma ORM**: Modern database schema design and automatic query generation.
- **PostgreSQL**: Hosted on Supabase, featuring relational constraints.
- **JWT (JSON Web Tokens)**: Secure token-based user authentication.
- **Multer**: Secure local multipart/form-data upload management.

---

## 🚀 Quick Start (Recommended with Docker)

The fastest way to spin up the entire stack is with **Docker Compose**, which runs both the backend server and frontend client concurrently with hot-reload support.

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your system.

### Steps
1.  **Clone the Repository** and navigate to the project directory.
2.  **Environment Setup**: Make sure you have a `.env` file in the `backend/` directory configured correctly (see `backend/.env.example`).
3.  **Launch Docker**:
    ```bash
    docker compose up --build
    ```
4.  **Access the Applications**:
    *   **Frontend Web App**: [http://localhost:4173](http://localhost:4173)
    *   **Backend REST API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

---

## 💻 Local Development Setup

If you prefer to run the client and server locally on your system without Docker:

### 1. Database & Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Setup your local environment variables
cp .env.example .env

# Generate Prisma Client & push schema to database
npx prisma generate
npx prisma db push

# Start backend server in development mode
npm run dev
```
*The backend API will run on **`http://localhost:5000`***

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*The frontend web app will run on **`http://localhost:5173`***

---

## 📚 Database Architecture (ERD Highlight)

The Postgres database structure includes 9 core tables managing the platform's features:

1.  **`USERS`**: User credentials, profiles, academic semester, and system roles.
2.  **`LEARNING_STYLES`**: Individual VARK preferences linked one-to-one with users.
3.  **`SUBJECTS`**: System subject catalogs (e.g. *Advanced Web Programming*, *Database Systems*).
4.  **`STUDY_GROUPS`**: Groups created by users with membership capacity controls.
5.  **`MEMBERS`**: Many-to-many relationship mapping user memberships and roles (Admin/Member) in study groups.
6.  **`SESSIONS`**: Scheduled study meetups with status controls (`scheduled`, `active`, `completed`).
7.  **`SESSION_ATTENDANCES`**: Tracks user attendance, durations, and entry/exit timestamps.
8.  **`MATERIALS`**: References and sizes of shared PDF/document resources within a group.
9.  **`PROGRESS`**: Aggregated learning metrics, hours spent studying, and estimated subject mastery.

Detailed database documentation can be viewed in [docs/ERD.md](file:///docs/ERD.md).

---

## ⚡ API Endpoint Catalog

All requests use `/api/v1` as the prefix. Protected routes require `Authorization: Bearer <JWT_TOKEN>` in the headers.

| Category | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Register a new user | Public |
| **Auth** | `POST` | `/auth/login` | Log in and receive 7-day JWT | Public |
| **Auth** | `GET` | `/auth/me` | Rehydrate logged in user state | Protected |
| **Profile**| `PUT` | `/users/profile` | Update profile information | Protected |
| **Profile**| `PUT` | `/users/learning-style` | Update learning style (VARK) | Protected |
| **Group** | `GET` | `/study-groups` | Retrieve public study groups | Public |
| **Group** | `POST`| `/study-groups` | Create a new study group | Protected |
| **Group** | `DELETE`| `/study-groups/:id` | Disband a study group | Admin Only |
| **Group** | `POST`| `/study-groups/:id/join` | Join a study group | Protected |
| **Session**| `POST`| `/sessions` | Schedule a new session | Admin Only |
| **Session**| `POST`| `/sessions/:id/join` | Check-in/Join session | Protected |
| **Session**| `POST`| `/sessions/:id/leave`| Check-out and log study time | Protected |
| **Material**| `POST`| `/materials` | Upload group learning materials | Protected |
| **Material**| `DELETE`| `/materials/:id` | Delete group learning materials | Uploader/Admin|
| **Progress**| `GET` | `/progress` | View personal dashboard statistics| Protected |

Full specs are detailed in [docs/API_SPEC.md](file:///docs/API_SPEC.md).
