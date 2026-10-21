# FUTURE SKILLS FOR KIDS — Status vs Master Prompt

Stack: React 18 + Vite, `localStorage` adapter (Supabase adapter siap, nonaktif tanpa config).
Cek: `npm test` (engine adaptif + sesi/analitik) · `npm run quality` (Phase 27 otomatis → `quality-report.json`) · `npm run build`.

## Sudah ada (dipulihkan dari arsip + ditambah sesi ini)
| Phase | Status |
|---|---|
| 0 Arsitektur / 28 Database | Layer service + adapter koleksi (students, sessions, answers, progress, class_summaries). Belum: tabel teachers/classes/parents/projects/rubrics/reflections/recommendations |
| 1–2 Domain & Skill | **12 dari 19 domain**, 118 skill. Baru: **Belajar Cara Belajar** (LHL, 8 skill × 100) |
| 3–5 100 aktivitas/skill | **118 skill × 100 = 11.800 aktivitas**, semuanya tepat 100 dan terbagi 5 fase A–E. Tipe: mcq, tf, order, classify, open. Belum: matching, fill-blank, short answer, drag-drop, scenario/decision/creative/reflection terstruktur |
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
1. ~~Domain tersisa~~ ketujuh domain (Systems Thinking, Decision Making, Leadership, Resilience, Media & Information Literacy, Life Skills, Ethics/Character) selesai — lihat "Ronde 9". Masih: pemetaan ulang domain gabungan (WEL→SEL+Resilience, CIV→Civic & Global). Learning How to Learn sudah selesai.
2. ~~Taksonomi micro-skill~~ selesai (lihat atas); tinggal tinjau age_level/prerequisite per skill.
3. **Penempatan usia/mastery** (Age A–E) dan kembali ke fondasi untuk anak yang belum kuat.
4. ~~Sesi guru~~ selesai di mode lokal. **Batas penting:** data tersimpan di localStorage satu browser, jadi siswa di perangkat lain belum bisa memakai kode sesi. Itu butuh backend Supabase (adapter sudah ada; skema tabel + RLS + migrasi belum ditulis). PIN guru bukan autentikasi sungguhan.
5. ~~Profil siswa, badge, dasbor orang tua~~ selesai (mode lokal; parent code hanya bekerja di browser yang sama sampai ada backend).
6. ~~Mission, Boss, Project, Reflection~~ selesai untuk 4 misi + 1 boss + 11 project. Kurang: lebih banyak misi/boss (kini hanya 5 total), misi per kelompok usia, dan refleksi di akhir fase biasa.
7. **Content generator + workflow GENERATE→VALIDATE→REVIEW→APPROVE→PUBLISH** (butuh backend/LLM; quality-check di atas jadi tahap VALIDATE).
8. Tipe aktivitas tambahan (lihat Phase 5).
9. Review 140 aktivitas bertanda; bundle ±6,5 MB perlu code-splitting per skill.

## Temuan kualitas penting (sesi ini)

**Petunjuk panjang-opsi pada konten lama.** Pada soal pilihan ganda berisi kalimat, opsi benar adalah yang terpanjang di **97%** soal (kebetulan ≈33%). Anak bisa menjawab tanpa memahami. `npm run quality` kini menandainya sebagai `length-cue` (**4.591 aktivitas** konten lama). Konten baru (LHL, 800 aktivitas) lolos aturan ini dengan sebaran posisi jawaban merata. Perbaikan konten lama = menulis ulang pengecoh; kandidat pekerjaan berikutnya (alat `scripts/patch-distractors.mjs` + `normalize-file.mjs` sudah siap pakai).

Alat penulisan skill baru: `scripts/check-file.mjs` (validasi per file), `patch-distractors.mjs` (ganti pengecoh, jawaban benar tetap), `normalize-file.mjs` (putar posisi jawaban n%3, format kanonik). Tambah skill = 1 file aktivitas + 1 baris di `src/data/activities/lhl/index.js` (domain lain: salin pola ini).

## Length-cue cleanup (legacy MCQs) — selesai
- 4.591 → 12 item ditandai. Sisa 12 ada di FIN-02..06/09: opsi benar sudah melewati batas panjang checker, jadi distraktor tidak bisa disamakan panjangnya.
- ~80 distraktor (FIN, COL) diperpanjang dengan klausa pengisi generik (mis. ", tanpa dicek lagi"); DIG/WEL banyak distraktor wordy dan belum ditinjau satu per satu. Layak ditinjau manusia bila ada waktu.
- Agen WEL berhenti karena rate limit; `stats` menunjukkan WEL tidak ada flag tersisa, tetapi kualitas bacaannya belum diperiksa.

## Perapian cue pengecoh DIG & WEL (ronde 2)
- Checker kini punya aturan `short-cue` (jawaban benar unik terpendek, kebalikan `length-cue`) dan `absolute-word` (opsi benar tanpa kata mutlak sementara >=2 pengecoh memuatnya: selalu/pasti/sama sekali/...). `scripts/legacy-fix.mjs stats|show` memakai ketiga aturan.
- DIG-01..08 dan WEL-01..08 (sekitar 1.150 soal pilihan ganda) ditulis ulang: pengecoh berupa kesalahpahaman yang masuk akal, panjang sebanding dengan jawaban benar, tanpa klausa pengisi.
- Hasil ukur (jawaban benar terpendek / terpanjang / kata mutlak di opsi salah): DIG 69%/22%/61% -> 17%/35%/13%; WEL 67%/25%/53% -> 21%/35%/15%.
- Belum disentuh: domain lain (CT, M, PS, AI, FIN, COM, COL, CRE, CIV) masih punya sekitar 1.100+ item yang terflag aturan baru, plus 12 item FIN lama. Tidak ada tinjauan manusia atas teks baru.

## Perapian cue pengecoh CIV, COL & COM (ronde 3)
- Metode sama seperti DIG/WEL: aturan `length-cue`/`short-cue`/`absolute-word` dipakai sebagai daftar sasaran, lalu pengecoh ditulis ulang manual (jawaban benar dan posisinya tidak diubah). CIV-01..08, COL-01..08, COM-01..08 selesai (sekitar 1.700 soal pilihan ganda).
- Hasil ukur (jawaban benar terpendek / terpanjang / kata mutlak di opsi salah): CIV 57%/-/38% -> 17%/33%/14%; COL 43%/-/ -> 21%/43%/14%; COM 45%/43%/38% -> 23%/43%/5%.
- Checker: semua 24 skill di atas bersih dari `length-cue`/`short-cue`/`absolute-word` (`npm run quality`: NEEDS REVIEW 1.057, turun dari 1.671).
- Masih tersisa: CT, M, PS, AI, FIN, CRE (kebanyakan `short-cue`, `option-long`) dan 12 item FIN lama. Teks baru belum ditinjau manusia; sebagian pengecoh mungkin masih terasa dibuat-buat.

## Perapian cue pengecoh CRE & FIN (ronde 4)
- Metode sama: pengecoh ditulis ulang manual untuk soal yang terflag `length-cue`/`short-cue`/`absolute-word`; jawaban benar dan posisinya tidak diubah. CRE-01..08 dan FIN-01..09 selesai.
- Hasil ukur (jawaban benar terpendek / terpanjang / kata mutlak di opsi salah): CRE 23%/43%/11%; FIN 27%/61%/43% -> 19%/50%/13%.
- `npm test` lolos; `npm run quality`: NEEDS REVIEW 731 (turun dari 1.057): absolute-word 373, short-cue 278, option-long 261, too-long 23, hint-leak 2 (sisa terutama di CT, M, PS, AI dan konten LHL; domain yang sudah dikerjakan tidak lagi kena tiga aturan cue).
- Masih tersisa: CT, M, PS, AI. Teks baru belum ditinjau manusia; sebagian pengecoh mungkin masih terasa dibuat-buat atau terlalu seragam.

## Perapian cue pengecoh CT, M, PS & AI (ronde 5)
- Metode sama; dikerjakan lima sub-agen paralel (pengecoh ditulis manual per soal, jawaban benar dan posisinya tidak diubah): CT-01..08, M-02..29, PS-01..08, AI-01..08 (sekitar 1.400 soal).
- Hasil ukur (benar terpendek / terpanjang / kata mutlak di opsi salah): CT 15%/45%/6%; M 12%/25%/7%; PS 20%/54%/13%; AI 19%/48%/16%.
- `npm test` lolos. `npm run quality`: NEEDS REVIEW 209 (dari 731): absolute-word 21, short-cue 37 (keduanya hanya di konten LHL baru), option-long 256, too-long 23, hint-leak 2. Semua domain lama bersih dari `length-cue`/`short-cue`/`absolute-word`.
- Perbaikan data: PS-03 #18 (solutionStrategies.js) kuncinya salah (`answer:2` padahal opsi 0 yang benar) -> `answer:0` dan pengecoh ditulis ulang. M-14 #34: pengecoh lama ("90 + 30 kotak") ternyata ikut benar (=120), diganti.
- Teks baru belum ditinjau manusia; sebagian pengecoh mungkin masih terasa dibuat-buat atau seragam. Sisa: flag LHL (cue), `option-long`, `too-long`, `hint-leak`.

## Perapian cue pengecoh LHL (ronde 6)
- 58 soal LHL-01..08 (short-cue/absolute-word) ditulis ulang pengecohnya lewat `scripts/patch-distractors.mjs` + `normalize-file.mjs` (posisi jawaban dirotasi ulang).
- `npm test` lolos; `npm run quality`: NEEDS REVIEW 152 (dari 209) — hanya `option-long` (flag per-opsi, 256 opsi), `too-long` 23, `hint-leak` 2. Tidak ada lagi flag `length-cue`/`short-cue`/`absolute-word` di seluruh konten.
- Teks baru belum ditinjau manusia.

## Ronde 7: opsi/pertanyaan panjang, hint-leak, dan mesin gerbang konten
- `option-long` (256 opsi), `too-long` (23) dan `hint-leak` (2) dibereskan: teks diringkas tanpa mengubah indeks `answer`; pengecoh disesuaikan agar tidak muncul cue baru. `npm run quality`: NEEDS REVIEW **0** dari 11.800 aktivitas.
- Temuan: setelah cue per-soal bersih, jawaban benar masih opsi TERPANJANG di 50-70% soal pada ~33 skill (peluang 33%). Ini ditandai mesin baru dan diturunkan ke 37-40% dengan memperpanjang SATU pengecoh (klausa keliru yang substantif) di ~10-24 soal per skill; kata mutlak yang hanya muncul di pengecoh LHL/M juga dibersihkan.
- **Mesin penjaga (untuk domain berikutnya):**
  - `scripts/lib/skillBalance.mjs` - metrik per skill: `position-skew` (satu slot jawaban, mis. A, melebihi jatah wajar +12%), `position-run` (>=4 soal berturut-turut slot sama), `longest-skew` (benar = terpanjang > peluang +17%), `shortest-skew` (+12%), `absolute-skew` (kata mutlak hanya di pengecoh, neto, >12%). Batas = peluang + margin sehingga 2/3/4 opsi sama-sama ditangani.
  - `scripts/gate.mjs` (`npm run gate`, ikut `npm test`): gagal bila ada flag per-soal apa pun ATAU pelanggaran per-skill. `scripts/lib/balance-baseline.json` (opsional, ratchet) memungkinkan skill lama tetap di skew tercatat tapi tidak memburuk; skill baru wajib memenuhi batas penuh. Saat ini baseline kosong: seluruh 118 skill lolos batas penuh.
  - `scripts/check-file.mjs` (validasi saat menulis skill baru) kini juga gagal pada pelanggaran per-skill.
  - `scripts/balance-targets.mjs ID` - daftar soal yang perlu diubah + jumlah yang dibutuhkan; `scripts/legacy-edit.mjs show|apply` - edit q/hint/explain/options tanpa mengubah `answer`.
  - `test/balance.test.mjs` menguji mesin sendiri (slot A, jawaban-terpanjang, mutlak, kasus seimbang, ratchet).
- Catatan jujur: mesin hanya menangkap pola statistik yang bisa diukur; kualitas pengecoh (masuk akal, jelas salah, usia) tetap butuh tinjauan manusia, dan teks baru sejak ronde 2 belum ditinjau manusia. Pada soal numerik pendek (M-25/27/29) beberapa pengecoh diberi anotasi singkat (mis. "5 (nilai c)") agar panjang sebanding; mungkin terasa ganjil.

### Tinjauan sampel (ronde 7b)
- Sampel acak 72 soal (6 per domain, 12 domain) dibaca manual: tidak ada pengecoh yang ikut benar; beberapa pengecoh terasa "kartun" (mis. LHL-02#61 "jam dinding berputar lebih cepat") tapi tidak salah. Sampel 0,6% - bukan jaminan.
- **Temuan baru (tell yang dibuat oleh gaya penulisan pengecoh):** klausa alasan (`karena/sebab/supaya/sehingga/agar`) muncul di 23-72% opsi SALAH tetapi hanya 6-14% opsi BENAR (mis. DIG 72% vs 12%, COL 71% vs 10%, FIN 65% vs 13%, PS 60% vs 11%). Anak bisa memilih opsi tanpa "karena...". Metrik `rationale-skew` ditambahkan ke mesin (batas 25 poin untuk skill baru).
- 72 skill lama melanggar batas ini; dicatat di `scripts/lib/balance-baseline.json` sebagai ratchet (tidak boleh memburuk), BELUM diperbaiki. Perbaikannya: buang klausa alasan dari sebagian pengecoh dan/atau beri alasan pada opsi benar, sambil menjaga panjang tetap seimbang (kalau tidak, longest-skew kembali). Itu ronde tersendiri.

### Ronde 8: klausa alasan (rationale-skew)
- 12 sub-agen menulis ulang pengecoh di 72 skill (CT-06/08, PS, FIN, AI-02..08, COM, COL, CRE, DIG, WEL, CIV-02..08): pengecoh yang memuat `karena/sebab/supaya/sehingga/agar` ditulis ulang jadi klaim salah langsung (kalimat utuh, bukan potongan), sebagian kecil opsi benar diberi alasan singkat. Menghapus klausa memendekkan pengecoh dan sempat menaikkan `longest-skew`; itu diperbaiki per skill dengan memperpanjang pengecoh secara substantif.
- Selisih (% opsi salah berklausa - % opsi benar berklausa) turun dari 30-74 poin menjadi sekitar -4..+16 poin. Metrik kini dua arah (nilai absolut), supaya tidak berbalik jadi tell sebaliknya; batas 25 poin.
- `balance-baseline.json` dikosongkan: seluruh 118 skill lolos batas penuh. Empat skill yang tadinya dekat batas (AI-01 dan WEL-06 25, CIV-01 22, CT-05 21) dirapikan ke 9-13 poin.
- `npm test` (termasuk gate) lolos; `npm run quality`: NEEDS REVIEW 0 dari 11.800.
- Catatan jujur: ribuan pengecoh ditulis ulang oleh sub-agen tanpa tinjauan manusia; pola penulisan baru ("klaim; alasan", "dianggap", "jadi") bisa menjadi tell baru yang belum terukur. Rekomendasi: tinjauan manusia atas sampel acak per domain dan uji coba dengan anak.

## Ronde 9: tujuh domain baru (56 skill, 5.600 aktivitas)
- Ditambahkan: SYS Berpikir Sistem, DEC Pengambilan Keputusan, LDR Kepemimpinan, RES Ketangguhan, MIL Literasi Media & Informasi, LIF Keterampilan Hidup, ETH Etika & Karakter (masing-masing 8 skill x 100 aktivitas, fase A-E, 10 micro-skill per skill). Total sekarang **19 domain, 174 skill, 17.400 aktivitas**; `npm test` (termasuk gerbang konten) lolos, `npm run quality` NEEDS REVIEW 0, build Vite sukses.
- Cara kerja: tiap skill ditulis satu sub-agen di bawah aturan mesin gerbang (BRIEF dengan batas panjang opsi, posisi jawaban, kata mutlak, klausa alasan), lalu `normalize-file.mjs` + `check-file.mjs` sampai bersih; pendaftaran lewat `scripts/add-domain.mjs <spec.json>` (domains.js, skillContent.js, projects.js, taxonomy). Tiap domain punya satu project baru (p_sys, p_dec, p_ldr, p_res, p_mil, p_lif, p_eth).
- Mesin diperluas: tell terbalik (`longest-low`/`shortest-low`), `legacyFiles` mendukung domain bergaya direktori, `balance-targets` dan `legacy-edit` bekerja untuk semua domain.
- **Perlu verifikasi manusia (fakta):** nomor darurat Indonesia di LIF-07 (112 diyakini akurat; 110, 113, 119 belum diverifikasi ke sumber resmi), layanan SAPA 129 di RES-05 (soal 76 dan 99), fakta kesehatan/keselamatan LIF-01/03/04/05 (cuci tangan, fluoride, P3K, lalu lintas). Konten ETH (nilai, budaya, dilema) perlu tinjauan kurikulum dan kepekaan budaya.
- **Insiden:** seorang sub-agen menjalankan `git checkout -- .` sehingga LIF-01 dan LIF-05 sempat kembali ke draf; dikerjakan ulang dan diverifikasi. Seluruh brief kini melarang perintah git bagi sub-agen.
- Seperti ronde sebelumnya: seluruh teks ditulis AI tanpa tinjauan manusia; gerbang hanya menangkap pola statistik, bukan mutu pedagogis, akurasi, atau kecocokan usia. Bundel JS membesar (semua konten diimpor langsung); code-splitting per skill tetap disarankan.
