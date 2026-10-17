/* One project per domain. Projects are not scored right/wrong: the child self-rates and
   the teacher rates on the same six-dimension rubric (3 friendly levels). */
export const RUBRIC = [
  { id: "understanding", name: "Pemahaman", levels: ["Aku mulai memahami idenya", "Aku paham sebagian besar ide utamanya", "Aku paham dan bisa menjelaskannya dengan kata-kataku"] },
  { id: "reasoning", name: "Penalaran", levels: ["Aku memberi jawaban tanpa alasan", "Aku memberi satu alasan", "Aku memberi alasan dan bukti yang jelas"] },
  { id: "creativity", name: "Kreativitas", levels: ["Aku memakai ide yang biasa", "Aku menambahkan satu ide baru", "Aku punya ide yang berbeda dan menarik"] },
  { id: "application", name: "Penerapan", levels: ["Aku baru menyebutkan idenya", "Aku mencoba memakainya dalam situasi nyata", "Aku memakainya dengan tepat dalam situasi nyata"] },
  { id: "communication", name: "Komunikasi", levels: ["Karyaku masih sulit dipahami", "Karyaku cukup jelas", "Karyaku jelas dan runtut untuk orang lain"] },
  { id: "reflection", name: "Refleksi", levels: ["Aku belum menceritakan apa yang kupelajari", "Aku menceritakan satu hal yang kupelajari", "Aku menceritakan yang kupelajari, yang sulit, dan rencana berikutnya"] },
];

export const REFLECTION_QUESTIONS = [
  { id: "learned", q: "Apa yang kamu pelajari?" },
  { id: "hardest", q: "Apa yang paling sulit?" },
  { id: "next", q: "Apa yang akan kamu coba lain kali?" },
  { id: "why", q: "Apa yang membuat jawabanmu benar (atau perlu diperbaiki)?" },
];

export const PROJECTS = [
  { id: "p_math", domain: "MATH", icon: "◆", title: "Toko Mini Kelasku", brief: "Buka toko mini bayangan di kelas. Tentukan barang, harga, lalu layani pembeli.",
    prompts: ["Tulis 5 barang dan harganya.", "Tiga pembeli membeli barang berbeda. Tulis pesanan masing-masing dan hitung total serta kembaliannya.", "Bagaimana kamu memeriksa bahwa hitunganmu benar?"] },
  { id: "p_ct", domain: "CT", icon: "◇", title: "Detektif Pengamat", brief: "Amati satu benda atau tempat selama 10 menit seperti seorang detektif.",
    prompts: ["Tulis 5 hal yang kamu amati (gunakan semua inderamu yang aman).", "Bandingkan dua hal yang kamu amati: apa yang sama dan apa yang berbeda?", "Adakah pola yang kamu temukan?", "Tarik satu kesimpulan dan sebutkan buktinya."] },
  { id: "p_ps", domain: "PS", icon: "◈", title: "Masalah di Sekitarku", brief: "Pilih satu masalah kecil di rumah atau sekolah dan selesaikan langkah demi langkah.",
    prompts: ["Apa masalahnya dan siapa yang terdampak?", "Tulis 3 kemungkinan solusi.", "Solusi mana yang kamu pilih dan mengapa?", "Coba solusinya. Apa hasilnya, dan apa yang akan kamu perbaiki?"] },
  { id: "p_ai", domain: "AI", icon: "✦", title: "Aturan Bijak Memakai AI", brief: "Buat panduan singkat untuk teman-temanmu tentang memakai AI dengan aman. Lakukan percobaan bersama orang dewasa.",
    prompts: ["Tulis 5 aturan memakai AI dengan bijak.", "Bersama orang dewasa, ajukan satu pertanyaan ke AI. Apa jawabannya?", "Periksa jawaban itu dengan sumber lain. Apa yang benar, apa yang kurang tepat?", "Mengapa kita tidak boleh memberikan data pribadi ke AI?"] },
  { id: "p_fin", domain: "FIN", icon: "◉", title: "Bisnis Kecilku", brief: "Rancang usaha kecil yang bisa dijalankan anak seusiamu.",
    prompts: ["Apa yang kamu jual dan untuk siapa?", "Berapa modalnya, harga jualnya, dan keuntungan tiap satuan?", "Apa risikonya dan bagaimana mengurangi risiko itu?", "Berapa bagian keuntungan yang akan kamu tabung atau bagikan, dan mengapa?"] },
  { id: "p_com", domain: "COM", icon: "◐", title: "Presentasi 1 Menit", brief: "Siapkan presentasi satu menit tentang hobi atau hal yang kamu sukai.",
    prompts: ["Tulis poin-poin yang akan kamu sampaikan (pembuka, isi, penutup).", "Latihan di depan satu orang. Apa umpan balik yang kamu terima?", "Apa yang kamu perbaiki setelah umpan balik itu?"] },
  { id: "p_col", domain: "COL", icon: "◑", title: "Misi Tim", brief: "Rencanakan sebuah tugas kelompok kecil (misalnya membersihkan sudut kelas).",
    prompts: ["Tulis tujuan tim dan peran setiap anggota.", "Tuliskan 3 kesepakatan tim.", "Bagaimana tim menyelesaikan perbedaan pendapat?", "Setelah selesai: apa yang berjalan baik dan apa yang diperbaiki lain kali?"] },
  { id: "p_cre", domain: "CRE", icon: "✺", title: "Prototipe Ide", brief: "Rancang benda sederhana yang bermanfaat untuk sekolah atau rumah.",
    prompts: ["Apa masalah yang ingin dibantu oleh bendamu?", "Gambarkan atau jelaskan rancangannya.", "Uji bendamu (atau modelnya). Apa yang terjadi?", "Perbaikan apa yang kamu buat setelah uji coba?"] },
  { id: "p_dig", domain: "DIG", icon: "⬡", title: "Paket Aman Online Keluarga", brief: "Buat paket keamanan online untuk keluargamu.",
    prompts: ["Tulis 5 aturan online keluarga.", "Bagaimana membuat kata sandi yang kuat? Tulis contoh cara (jangan tulis kata sandi aslimu).", "Apa saja yang tidak boleh dibagikan di internet?", "Apa yang dilakukan keluargamu kalau menemukan sesuatu yang mencurigakan?"] },
  { id: "p_wel", domain: "WEL", icon: "♡", title: "Peta Perasaan & Kebiasaan", brief: "Selama 3 hari, perhatikan perasaanmu dan kebiasaan sehatmu.",
    prompts: ["Tulis perasaan yang kamu rasakan tiap hari dan penyebabnya.", "Cara apa yang membantumu tenang saat perasaan sulit?", "Pilih satu kebiasaan sehat (tidur, gerak, makan) dan rencana menjalankannya.", "Kepada siapa kamu bisa meminta bantuan bila perlu?"] },
  { id: "p_lhl", domain: "LHL", icon: "❂", title: "Rencana Belajarku", brief: "Pilih satu hal baru yang ingin kamu pelajari dan rancang cara belajarnya.",
    prompts: ["Apa yang ingin kamu pelajari dan mengapa?", "Cara belajar apa yang akan kamu pakai (melihat, mendengar, mencoba, menjelaskan)? Mengapa cocok?", "Tulis jadwal belajar kecil selama satu minggu.", "Bagaimana kamu akan mengecek bahwa kamu makin bisa?"] },
  { id: "p_civ", domain: "CIV", icon: "❖", title: "Aksi Peduli Lingkungan", brief: "Rencanakan satu aksi nyata untuk lingkungan sekitarmu.",
    prompts: ["Aksi apa yang kamu pilih dan mengapa penting?", "Langkah-langkah apa yang kamu lakukan?", "Siapa yang kamu ajak, dan bagaimana caranya?", "Apa dampaknya, dan bagaimana kamu mengukurnya?"] },
];
