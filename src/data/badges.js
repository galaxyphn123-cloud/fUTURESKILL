/* Badges reward effort and growth, never rank. `test` receives the profile from engine/profile.js. */
export const BADGES = [
  { id: "first_step", icon: "🌱", name: "Langkah Pertama", desc: "Mengerjakan aktivitas pertamamu.", test: p => p.totals.done >= 1 },
  { id: "steady_10", icon: "🧱", name: "Fondasi Kokoh", desc: "Menyelesaikan 10 aktivitas.", test: p => p.totals.done >= 10 },
  { id: "steady_50", icon: "🏗️", name: "Terus Membangun", desc: "Menyelesaikan 50 aktivitas.", test: p => p.totals.done >= 50 },
  { id: "streak_5", icon: "🔥", name: "Lagi Lancar", desc: "5 jawaban tepat berturut-turut pada percobaan pertama.", test: (p, s) => (s.streak || 0) >= 5 },
  { id: "try_again", icon: "💪", name: "Pantang Menyerah", desc: "Mencoba lagi dan berhasil pada 3 aktivitas.", test: p => p.totals.retriesFixed >= 3 },
  { id: "micro_1", icon: "⭐", name: "Satu Langkah Tuntas", desc: "Menuntaskan 1 micro-skill.", test: p => p.totals.mastered >= 1 },
  { id: "micro_5", icon: "🌟", name: "Lima Langkah Tuntas", desc: "Menuntaskan 5 micro-skill.", test: p => p.totals.mastered >= 5 },
  { id: "phase_c", icon: "🧭", name: "Siap Menerapkan", desc: "Membuka fase Penerapan di sebuah skill.", test: p => p.skills.some(s => "CDE".includes(s.phase)) },
  { id: "explorer", icon: "🗺️", name: "Penjelajah", desc: "Mencoba 3 skill berbeda.", test: p => p.totals.skillsStarted >= 3 },
  { id: "all_rounder", icon: "🌈", name: "Serba Bisa", desc: "Mencoba 3 domain berbeda.", test: p => p.totals.domainsStarted >= 3 },
  { id: "skill_done", icon: "🏅", name: "Satu Skill Selesai", desc: "Menyelesaikan 100 aktivitas dalam satu skill.", test: p => p.skills.some(s => s.done >= 100) },
  { id: "mission_1", icon: "🧭", name: "Penyelesai Misi", desc: "Menyelesaikan 1 misi.", test: p => p.totals.missionsCompleted >= 1 },
  { id: "boss_done", icon: "🏆", name: "Penakluk Boss", desc: "Menyelesaikan sebuah Boss Challenge.", test: p => p.totals.bossCompleted >= 1 },
  { id: "project_1", icon: "🎨", name: "Pembuat Karya", desc: "Mengumpulkan 1 proyek.", test: p => p.totals.projectsSubmitted >= 1 },
  { id: "reflect_1", icon: "💭", name: "Pemikir Reflektif", desc: "Menulis refleksi tentang belajarmu.", test: p => p.totals.reflections >= 1 },
];
