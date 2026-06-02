# Data Dummy StudyCircle

Dokumen ini berisi daftar data dummy yang dimasukkan (seeded) ke dalam database untuk keperluan pengembangan, pengujian, dan demonstrasi aplikasi StudyCircle. Semua password default untuk pengguna dummy adalah **`password123`**.

---

## 1. Daftar Pengguna (Users & Profiles)

Berikut adalah daftar pengguna terdaftar beserta semester dan gaya belajar mereka (learning style):

| Username | Nama Lengkap | Email | Semester | Gaya Belajar | Password Default |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **zeleo** | Zeleo Mahasiswa | `zeleo@studycircle.ac.id` | 4 | Visual | `password123` |
| **imam** | Imam Dzaqhoir | `imam@studycircle.ac.id` | 2 | Auditory | `password123` |
| **haris** | Haris Kurniawan | `haris@studycircle.ac.id` | 6 | Kinesthetic | `password123` |
| **hanif** | Hanif Ibrahim | `hanif@studycircle.ac.id` | 4 | Reading/Writing | `password123` |
| **siti** | Siti Aminah | `siti@studycircle.ac.id` | 4 | Visual | `password123` |

---

## 2. Daftar Mata Kuliah (Subjects)

Berikut adalah daftar mata kuliah yang tersedia di platform StudyCircle:

| Kode Matkul | Nama Mata Kuliah | Deskripsi |
| :--- | :--- | :--- |
| **IF-101** | Introduction to Programming | Basic programming concepts using Python. |
| **IF-102** | Calculus I | Differential and integral calculus fundamentals. |
| **IF-201** | Advanced Web Programming | Modern web development with React and Node.js. |
| **IF-202** | Data Structures and Algorithms | Core data structures and algorithmic complexity. |
| **IF-301** | Database Systems | Relational database design and SQL. |
| **IF-302** | Software Engineering | Software development life cycles and methodologies. |
| **IF-401** | Artificial Intelligence | Introduction to AI and Machine Learning. |
| **IF-402** | Computer Networks | Network protocols and architecture. |

---

## 3. Matrikulasi Progress (Mata Kuliah yang Diikuti / Enrollments)

Mata kuliah yang sedang dipelajari oleh masing-masing pengguna (dengan tingkat pemahaman awal: `Beginner`):

| Username | Mata Kuliah yang Diikuti (Kode) |
| :--- | :--- |
| **zeleo** | IF-201 (Advanced Web Programming), IF-202 (Data Structures and Algorithms) |
| **imam** | IF-101 (Introduction to Programming), IF-102 (Calculus I) |
| **haris** | IF-301 (Database Systems), IF-302 (Software Engineering), IF-401 (Artificial Intelligence) |
| **hanif** | IF-201 (Advanced Web Programming), IF-301 (Database Systems) |
| **siti** | IF-201 (Advanced Web Programming), IF-202 (Data Structures and Algorithms) |

---

## 4. Grup Belajar (Study Groups)

Grup belajar yang dibuat serta anggota awalnya:

| Nama Grup | Mata Kuliah | Pembuat (Admin) | Kuota Anggota | Deskripsi Grup | Anggota Awal |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Web Dev Diagram Masters** | IF-201 | siti | 5 | We draw architecture diagrams and mindmaps for Advanced Web Programming. | siti (Admin), hanif (Member) |
| **IF-201 Discussion & Podcast** | IF-201 | imam | 10 | We learn by discussing and listening to coding podcasts. | imam (Admin) |
| **Algo Practice Squad** | IF-202 | haris | 4 | Hands-on practice and building real mini-projects for Data Structures. | haris (Admin) |
| **Database Textbook Readers** | IF-301 | hanif | 8 | Reading SQL textbooks, writing notes, and sharing articles. | hanif (Admin) |
