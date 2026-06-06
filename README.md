<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/brain-circuit.svg" alt="StudySync Logo" width="120" height="120" />
  
  # StudySync 🎓✨

  **Platform Koordinasi Study Group dengan AI Schedule Optimizer**

  [![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=black)](#)
  [![Vite](https://img.shields.io/badge/Vite-PWA_Ready-646CFF?logo=vite&logoColor=white)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?logo=tailwind-css&logoColor=white)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](#)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](#)
  [![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socketdotio&logoColor=white)](#)
</div>

<br />

> **StudySync** adalah platform inovatif yang dirancang untuk mengatasi masalah umum mahasiswa: *kesulitan dalam berkoordinasi untuk membentuk kelompok belajar dan menentukan jadwal diskusi*. Dengan pendekatan modern dan algoritma heuristik kecerdasan buatan, platform ini memberikan solusi *end-to-end* mulai dari pencarian kelompok, optimalisasi jadwal pertemuan, hingga penyediaan ruang diskusi virtual.

---

## 👥 Tim Pengembang (Kelompok 4)

Proyek ini dikembangkan oleh mahasiswa sebagai bagian dari tugas mata kuliah Pemrograman Web Lanjutan:

| Nama | NIM | Peran |
| :--- | :--- | :--- |
| **Muh. Hanif Nurmahdin** | `H071241033` | Fullstack Engineer & AI Integrator |
| **Imam Dzaqhoir** | `H071241048` | Frontend Developer & UI/UX Designer |
| **Haris** | `H071241070` | Backend Developer & Database Architect |

---

## ✨ Fitur Unggulan

### 🤖 AI-Powered Matching & Schedule Optimizer
Tidak ada lagi perdebatan menentukan jadwal atau kelompok.
- **Smart Group Matching**: Algoritma heuristik otomatis merekomendasikan grup belajar yang paling cocok berdasarkan *Learning Style* (gaya belajar) dan kecocokan *Timezone* (zona waktu) pengguna.
- **AI Schedule Optimizer**: Sistem penjadwalan cerdas yang menganalisis irisan ketersediaan anggota untuk mengusulkan waktu diskusi terbaik secara instan.

### 🎥 Terintegrasi Virtual Room (Jitsi Meet)
Koordinasi tanpa berpindah aplikasi.
- Saat sesi belajar dimulai, pengguna dapat bergabung ke dalam **Virtual Room** dengan satu klik.
- *Video call* terintegrasi secara mulus di dalam aplikasi tanpa perlu membagikan tautan eksternal seperti Zoom atau Google Meet.

### 🎮 Sistem Gamifikasi (Learn & Earn)
Tingkatkan motivasi belajar dengan elemen permainan.
- Dapatkan **Experience Points (EXP)** untuk setiap menit Anda berpartisipasi dalam diskusi.
- Naikkan **Level** Anda dan kumpulkan berbagai **Badges** eksklusif.
- Bersaing secara sehat dengan teman-teman di halaman **Leaderboard** global.

### ⚡ Real-Time Collaboration
Tetap terhubung tanpa hambatan.
- **Live Group Chat**: Diskusi langsung dengan anggota grup tanpa perlu memuat ulang halaman (*powered by Socket.io*).
- **Push Notifications**: Dapatkan pemberitahuan *real-time* (*in-app bell notification*) seketika saat ada jadwal baru dibuat, undangan ke grup belajar, atau grup terbentuk.

### 📱 Progressive Web App (PWA) Offline-Ready
Akses kapan saja, di mana saja.
- Instal langsung ke layar beranda HP atau Desktop Anda (seperti aplikasi *native*).
- Caching materi cerdas yang memungkinkan akses data ringan secara mulus meskipun Anda sedang *offline*.

---

## 🛠️ Tech Stack & Arsitektur

Platform ini dibangun menggunakan teknologi *full-stack* modern berskala industri:

| Bagian | Teknologi | Deskripsi |
| --- | --- | --- |
| **Frontend** | React 19, TypeScript, Vite | UI yang sangat responsif, *fast refresh*, dan *strongly typed*. |
| **Styling** | Tailwind CSS v4 | Desain *premium dark-mode*, *glassmorphism*, dan animasi transisi. |
| **Backend** | Node.js, Express.js | Arsitektur RESTful API yang ringan dan terukur. |
| **Database** | PostgreSQL, Prisma ORM | Relasi data yang kompleks dengan migrasi otomatis. |
| **Realtime** | Socket.io | Arsitektur *event-driven* dua arah untuk pesan dan notifikasi. |
| **Integrations**| Jitsi React SDK, Cloudinary | Komunikasi video dan penyimpanan aset media berbasis *cloud*. |

---

## 🚀 Cara Menjalankan Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan **StudySync** di mesin lokal Anda.

### Persyaratan Sistem
- [Node.js](https://nodejs.org/) (v18 atau lebih baru disarankan)
- [PostgreSQL](https://www.postgresql.org/) (berjalan lokal atau di awan, misal: Supabase/Neon)

### 1. Kloning Repositori
```bash
git clone https://github.com/ShinZeleo/StudyCircle.git
cd StudyCircle
```

### 2. Pengaturan Backend
```bash
cd backend
npm install

# Buat file .env dan sesuaikan konfigurasi Anda
cp .env.example .env

# Jalankan migrasi Prisma untuk membangun skema database
npx prisma db push

# (Opsional) Isi database dengan data sampel
npx prisma db seed

# Jalankan server (Mode Development)
npm run dev
```

### 3. Pengaturan Frontend
Buka terminal baru:
```bash
cd frontend
npm install

# Jalankan server frontend
npm run dev
```
Kunjungi `http://localhost:5173` untuk melihat hasilnya!

---

<div align="center">
  <p>Dibuat dengan 💻 dan ☕ untuk meningkatkan kualitas pendidikan. <br />
  &copy; StudySync Team (Kelompok 4). Hak Cipta Dilindungi.</p>
</div>
