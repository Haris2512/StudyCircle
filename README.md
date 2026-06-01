# 🎓 StudyCircle

StudyCircle is a modern, smart study group coordination platform built specifically for university students. It helps students find and form the perfect study groups based on subject compatibility and learning styles.

## ✨ Key Features

- **Smart Group Recommendations**: Recommends the best study groups based on your unique learning style and subject preferences.
- **Compatibility Scoring**: See a detailed percentage breakdown of how well you match with a group.
- **Learning Style Insights**: Visual representation of your learning preferences (Visual, Auditory, Reading, Kinesthetic) combined with group dynamics.
- **Modern Premium UI**: Built with a sleek, glassmorphism-inspired design, dynamic radial gradients, and fluid micro-animations for an exceptional user experience.
- **Real-time Synchronization**: Powered by a robust backend using Express and Prisma connected to a Supabase PostgreSQL database.

## 🛠️ Technology Stack

**Frontend:**
- React 19 + Vite
- TypeScript
- Tailwind CSS v4 (Glassmorphism & Custom Animations)
- Lucide React (Icons)
- React Router DOM
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (via Supabase)
- JWT Authentication

## 🚀 Quick Start (Recommended)

The easiest way to run the entire application (Frontend + Backend) is using Docker. You do not need to install Node.js manually.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Steps
1. Clone the repository.
2. Ensure you have the `.env` file in the `backend` directory (check `.env.example`).
3. Run the following command in the root directory:
   ```bash
   docker compose up --build
   ```
4. Open your browser:
   - Frontend: [http://localhost:4173](http://localhost:4173)
   - Backend API: `http://localhost:5000`

---

## 💻 Local Development Setup

If you prefer to run the application without Docker:

### 1. Backend Setup
```bash
cd backend
npm install
# Set up your .env file based on .env.example
npx prisma generate
npm run dev
```
*Backend will run on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on `http://localhost:5173`*

## 📚 Documentation
Additional project documentation such as PRD, ERD, API Specs, and UI plans can be found in the `docs` folder or requested from the project team.
