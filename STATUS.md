# FUTURE SKILLS FOR KIDS — Status vs Master Prompt

Stack: React 18 + Vite, `localStorage` adapter (Supabase adapter siap, nonaktif tanpa config).
Cek: `npm test` (engine adaptif) · `npm run quality` (Phase 27 otomatis → `quality-report.json`) · `npm run build`.

## Sudah ada (dipulihkan dari arsip + ditambah sesi ini)
| Phase | Status |
|---|---|
| 0 Arsitektur / 28 Database | Layer service + adapter koleksi (students, sessions, answers, progress, class_summaries). Belum: tabel teachers/classes/parents/projects/rubrics/reflections/recommendations |
| 1–2 Domain & Skill | 11 domain (bukan 19), 110 skill |
| 3–5 100 aktivitas/skill | **110 skill × 100 = 11.000 aktivitas**, semuanya tepat 100 dan terbagi 5 fase A–E. Tipe: mcq, tf, order, classify, open. Belum: matching, fill-blank, short answer, drag-drop, scenario/decision/creative/reflection terstruktur |
| 8–10 Mastery, adaptif, no random jump | **Baru:** `engine/adaptive.js` (advance setelah 3 benar-pertama, support setelah 2 salah, tidak pernah masuk fase terkunci), mastery dihitung dari percobaan pertama (retry memberi XP kecil, tidak menaikkan mastery), tombol "Coba lagi" |
| 22 Session / join code | Kode 6 digit per skill (demo, 1 sesi terbuka per skill); siswa masuk dengan nama |
| 23 Dashboard guru | Ringkasan kelas per skill (XP, streak, akurasi, fase). Belum: detail siswa, analitik soal, mistakes |
| 27 Quality check | **Baru:** `scripts/quality-check.mjs` — 0 duplikat, 0 opsi kembar, 0 jawaban di luar rentang; **140 aktivitas NEEDS REVIEW** (teks panjang, 2 hint membocorkan jawaban) |

## Belum ada (urutan pengerjaan yang disarankan)
1. **8 domain tersisa** dari 19: Creative Thinking (sebagian di CRE), Learning How to Learn, Systems Thinking, Decision Making, Leadership, Resilience, Media & Information Literacy, Life Skills, Ethics/Character — dan pemetaan ulang domain yang digabung (WEL→SEL+Resilience, CIV→Civic & Global).
2. **Taksonomi micro-skill nyata** (saat ini `micro` hanya label bebas per soal, ±10.000 nilai unik) + mastery per micro-skill + metadata lengkap (age_level, cognitive_load, prerequisite, estimated_time).
3. **Penempatan usia/mastery** (Age A–E) dan kembali ke fondasi untuk anak yang belum kuat.
4. **Sesi guru sungguhan** (guru membuat sesi + join code per kelas, daftar siswa, student code), detail siswa, analitik soal.
5. **Profil siswa "MY FUTURE SKILLS"**, badge, level per skill, dashboard orang tua + rekomendasi.
6. **Mission, Boss Challenge, Project + rubric, Reflection.**
7. **Content generator + workflow GENERATE→VALIDATE→REVIEW→APPROVE→PUBLISH** (butuh backend/LLM; quality-check di atas jadi tahap VALIDATE).
8. Tipe aktivitas tambahan (lihat Phase 5).
9. Review 140 aktivitas bertanda; bundle ±6,5 MB perlu code-splitting per skill.
