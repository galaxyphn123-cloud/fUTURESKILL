# FUTURE SKILLS FOR KIDS — Status vs Master Prompt

Stack: React 18 + Vite, `localStorage` adapter (Supabase adapter siap, nonaktif tanpa config).
Cek: `npm test` (engine adaptif + sesi/analitik) · `npm run quality` (Phase 27 otomatis → `quality-report.json`) · `npm run build`.

## Sudah ada (dipulihkan dari arsip + ditambah sesi ini)
| Phase | Status |
|---|---|
| 0 Arsitektur / 28 Database | Layer service + adapter koleksi (students, sessions, answers, progress, class_summaries). Belum: tabel teachers/classes/parents/projects/rubrics/reflections/recommendations |
| 1–2 Domain & Skill | 11 domain (bukan 19), 110 skill |
| 3–5 100 aktivitas/skill | **110 skill × 100 = 11.000 aktivitas**, semuanya tepat 100 dan terbagi 5 fase A–E. Tipe: mcq, tf, order, classify, open. Belum: matching, fill-blank, short answer, drag-drop, scenario/decision/creative/reflection terstruktur |
| 8–10 Mastery, adaptif, no random jump | **Baru:** `engine/adaptive.js` (advance setelah 3 benar-pertama, support setelah 2 salah, tidak pernah masuk fase terkunci), mastery dihitung dari percobaan pertama (retry memberi XP kecil, tidak menaikkan mastery), tombol "Coba lagi" |
| 22 Session / join code | **Baru:** guru (PIN lokal) → kelas + roster dengan student code 4 karakter → sesi per kelas+skill dengan kode 6 digit unik di antara sesi terbuka → siswa gabung dengan kode sesi + student code (atau nama, otomatis terdaftar). Setiap attempt (termasuk retry) tersimpan dengan session_id, pilihan jawaban, waktu |
| 23 Dashboard guru | **Baru:** konsol guru (Kelas / Sesi / Laporan): overview kelas (terdaftar, aktif, selesai, akurasi, fase, terakhir aktif), detail siswa (mastery micro-skill + jawaban yang meleset beserta pilihan anak), analitik soal (tersulit/termudah + kesalahan terbanyak). Belum: badge/project/reflection di detail siswa |
| 0/2 Taksonomi & metadata | **Baru:** `src/data/taxonomy.js` (110 skill × 10 micro-skill = 1.100, dibangkitkan oleh `scripts/build-taxonomy.mjs`) dan `engine/metadata.js` yang menurunkan metadata Phase 0 lengkap per aktivitas (age_level, difficulty 1–10, cognitive_load, estimated_time, prerequisite_skill, mastery_requirement). **Mastery per micro-skill** (butuh ≥5 percobaan pertama; ≥80% = TUNTAS) tampil sebagai "Peta micro-skill" di layar siswa. `age_level` dan `prerequisite_skill` masih heuristik — perlu ditinjau pemilik kurikulum |
| 17 Mission | **Baru:** 4 misi bercerita (The Smart Shopper, Kebun Sekolah, Aman di Dunia Online, Detektif Fakta), masing-masing 7 langkah lintas 3+ skill. Terkunci sampai fondasi skill terkait dikerjakan (≥5–10 aktivitas). Hasil tiap langkah dicatat per skill (`mission_answers.skill_id`) tanpa mengubah progres 100 aktivitas |
| 18 Boss Challenge | **Baru:** "Rencanakan Pesta Mini" (anggaran, hitung, keputusan, rencana tertulis, penyesuaian). Terbuka setelah 2 misi selesai |
| 19 Project + rubric | **Baru:** 11 project (satu per domain), rubrik 6 dimensi × 3 level bahasa anak; siswa menilai diri, guru menilai di tab "Karya" (komentar + skor), karya terkunci setelah dinilai |
| 20 Reflection | **Baru:** 4 pertanyaan (apa yang dipelajari / tersulit / dicoba lain kali / apa yang membuat benar) setelah misi, boss, dan project; disimpan dan terlihat oleh guru |
| 21 Profil siswa / badge | **Baru:** layar "MY FUTURE SKILLS" (`ProfileView`): level per domain (1 + ⌊micro-skill tuntas ÷ 3⌋) dan per skill (1 + tuntas), skill yang sedang dijalani, "Yang sudah kuat" / "Sedang dibangun", rekomendasi berikutnya, 11 lencana berbasis usaha/pertumbuhan (tanpa ranking) dengan toast saat diraih, aktivitas terakhir |
| 24 Dashboard orang tua | **Baru:** orang tua masuk dengan kode orang tua 6 karakter (ditampilkan di roster guru), melihat progres, skill berkembang, aktivitas terakhir, kekuatan, area yang sedang dibangun, dan saran latihan di rumah — bahasa non-diagnosis |
| 27 Quality check | **Baru:** `scripts/quality-check.mjs` — 0 duplikat, 0 opsi kembar, 0 jawaban di luar rentang; **140 aktivitas NEEDS REVIEW** (teks panjang, 2 hint membocorkan jawaban) |

## Belum ada (urutan pengerjaan yang disarankan)
1. **8 domain tersisa** dari 19: Creative Thinking (sebagian di CRE), Learning How to Learn, Systems Thinking, Decision Making, Leadership, Resilience, Media & Information Literacy, Life Skills, Ethics/Character — dan pemetaan ulang domain yang digabung (WEL→SEL+Resilience, CIV→Civic & Global).
2. ~~Taksonomi micro-skill~~ selesai (lihat atas); tinggal tinjau age_level/prerequisite per skill.
3. **Penempatan usia/mastery** (Age A–E) dan kembali ke fondasi untuk anak yang belum kuat.
4. ~~Sesi guru~~ selesai di mode lokal. **Batas penting:** data tersimpan di localStorage satu browser, jadi siswa di perangkat lain belum bisa memakai kode sesi. Itu butuh backend Supabase (adapter sudah ada; skema tabel + RLS + migrasi belum ditulis). PIN guru bukan autentikasi sungguhan.
5. ~~Profil siswa, badge, dasbor orang tua~~ selesai (mode lokal; parent code hanya bekerja di browser yang sama sampai ada backend).
6. ~~Mission, Boss, Project, Reflection~~ selesai untuk 4 misi + 1 boss + 11 project. Kurang: lebih banyak misi/boss (kini hanya 5 total), misi per kelompok usia, dan refleksi di akhir fase biasa.
7. **Content generator + workflow GENERATE→VALIDATE→REVIEW→APPROVE→PUBLISH** (butuh backend/LLM; quality-check di atas jadi tahap VALIDATE).
8. Tipe aktivitas tambahan (lihat Phase 5).
9. Review 140 aktivitas bertanda; bundle ±6,5 MB perlu code-splitting per skill.
