# 🧠 Brainstorming BioLearn

> Dokumen ide pengembangan lanjutan. Tujuannya menampung gagasan fitur, lalu menyaringnya berdasarkan **nilai untuk siswa** vs **biaya implementasi**, dengan tetap menghormati batasan demo: **100% offline, tanpa database eksternal, state via Zustand, kompatibel Expo Go SDK 54**.

---

## 1. Konteks Singkat
- **Status:** MVP selesai (login peran, dashboard siswa, modul, detail + mock video, kuis, hasil, progress, reset demo).
- **Pengguna:** Siswa SMA kelas 10–12, persiapan ujian & seleksi kuliah.
- **Filosofi:** Belajar efisien, evaluasi cerdas (KKM 70), rekomendasi adaptif.
- **Batasan keras:** Demo presentasi klien harus mulus tanpa jaringan/backend.

---

## 2. Kumpulan Ide (Divergen)

### 🎓 Pengalaman Belajar Siswa
- **Flashcard istilah biologi** per bab (tap untuk balik kartu), bagus untuk hafalan cepat.
- **Mode "Belajar Kilat 5 menit"**: 1 ringkasan + 3 soal acak, untuk sesi belajar singkat.
- **Glosarium biologi** yang dapat dicari (sel, mitosis, fotosintesis, dll).
- **Bookmark/Simpan ringkasan** favorit agar mudah ditinjau ulang.
- **Catatan pribadi** per modul (teks bebas, disimpan di store).
- **Highlight poin kunci** pada ringkasan materi.

### 📝 Kuis & Evaluasi
- **Bank soal lebih besar + pengacakan** soal dan urutan opsi tiap percobaan.
- **Mode latihan vs mode ujian** (latihan: feedback instan; ujian: feedback di akhir + timer).
- **Timer kuis** opsional untuk simulasi ujian sungguhan.
- **Riwayat percobaan kuis** per bab (skor tertinggi, tren naik/turun).
- **Tipe soal baru**: benar/salah, isian singkat, mencocokkan (matching).
- **Pembahasan video pendek** yang tertaut langsung ke soal yang salah.

### 🧭 Rekomendasi Adaptif (penguatan diferensiasi produk)
- **Skor "kesiapan ujian" per kelas** (gabungan progress video + rata-rata kuis).
- **Daftar remedial cerdas**: urutkan bab di bawah KKM berdasarkan jarak ke 70.
- **"Lanjutkan dari terakhir"**: deep-link ke modul/video yang belum selesai.
- **Saran bab berikutnya** berbasis prasyarat (mis. Sel → Jaringan → Organ).

### 🏆 Motivasi & Retensi
- **Streak belajar harian** (mock, berbasis tanggal di store).
- **Badge pencapaian**: "Tuntas Kelas 10", "Nilai Sempurna", "5 Hari Beruntun".
- **Progress ring** animatif di dashboard (reanimated sudah tersedia).
- **Pesan selamat** kontekstual saat lulus KKM.

### 👨‍🏫 Peran Guru & Admin (saat ini masih dummy)
- **Dashboard Guru**: ringkasan progress kelas (data seed/mock siswa).
- **Admin Konten**: form tambah/edit modul & soal (in-memory, reset saat restart).
- **Pratinjau "sebagai siswa"** dari akun guru.

### 🎨 UI/UX & Polish
- **Animasi transisi antar halaman** (Roadmap v0.2) via reanimated/expo-router.
- **Skeleton loading** singkat untuk kesan responsif premium.
- **Dark mode** penuh (tema adaptif sudah ada fondasinya).
- **Haptics** pada aksi penting (expo-haptics sudah terpasang): jawab benar/salah, lulus kuis.
- **Empty states** yang ramah saat progress masih kosong.

### ♿ Aksesibilitas & Lokalisasi
- **Ukuran font yang dapat diperbesar** + label aksesibilitas pada tombol/opsi.
- **Kontras warna** memenuhi standar dasar WCAG.
- Konten tetap **Bahasa Indonesia**; siapkan struktur i18n bila perlu EN nanti.

---

## 3. Penyaringan (Konvergen) — Matriks Dampak vs Usaha

| Ide | Dampak Belajar | Usaha | Risiko Demo | Prioritas |
|---|---|---|---|---|
| Pengacakan soal + bank lebih besar | Tinggi | Rendah | Rendah | **P0** |
| Mode latihan vs ujian + timer | Tinggi | Sedang | Rendah | **P0** |
| Riwayat percobaan kuis | Sedang | Rendah | Rendah | **P1** |
| Streak + badge pencapaian | Sedang | Rendah | Rendah | **P1** |
| Flashcard / Belajar Kilat | Tinggi | Sedang | Rendah | **P1** |
| Skor kesiapan ujian + remedial cerdas | Tinggi | Sedang | Rendah | **P1** |
| Animasi transisi + haptics + progress ring | Sedang | Rendah | Rendah | **P1** |
| Catatan & bookmark | Sedang | Rendah | Rendah | **P2** |
| Dashboard Guru (mock) | Tinggi | Tinggi | Sedang | **P2** |
| Admin Konten (CRUD in-memory) | Sedang | Tinggi | Sedang | **P3** |
| Dark mode penuh | Rendah | Sedang | Rendah | **P3** |

> P0 = kandidat berikutnya yang paling untung secara biaya/manfaat dan paling aman untuk demo.

---

## 4. Rekomendasi Iterasi Berikutnya (v0.2 — "Evaluasi Lebih Tajam")
Fokus memperkuat pembeda utama produk (evaluasi & rekomendasi) tanpa keluar dari batasan offline:

1. **Pengacakan soal & opsi** + perbesar bank soal di `data/seedQuestions.ts`.
2. **Mode latihan vs ujian** dengan **timer** opsional di `app/quiz.tsx`.
3. **Riwayat & skor tertinggi per bab** di `store/useLearningStore.ts`, ditampilkan di `app/progress.tsx`.
4. **Skor kesiapan ujian** + **daftar remedial cerdas** (urut jarak ke KKM 70) di dashboard.
5. **Polish demo**: animasi transisi halaman, progress ring animatif, haptics jawaban benar/salah.

**Kriteria selesai:** `npx tsc --noEmit` bersih, `npx expo install --check` selaras SDK 54, alur demo di README tetap mulus, tombol **Reset Demo** mengembalikan semua state baru ke kondisi awal.

---

## 5. Catatan Teknis & Batasan
- **Tetap offline**: semua data dari `data/seed*.ts`; tanpa SQLite/Supabase/Firebase/AsyncStorage selama fase demo.
- **State efemeral**: progress hidup di Zustand dan **hilang saat app ditutup** — ini sesuai kebutuhan demo berulang. Persistensi (`AsyncStorage`) ditunda ke Roadmap v0.3.
- **Reset Demo** wajib mengosongkan **semua** field state baru agar presentasi dapat diulang bersih.
- **Mock video** memakai `expo-video`; hindari ketergantungan jaringan untuk aset (pakai aset lokal/placeholder).
- **Typed routes** Expo Router aktif — perbarui tipe rute saat menambah halaman.

---

## 6. Pertanyaan Terbuka (perlu keputusan)
- Apakah perlu **persistensi ringan** lebih awal (mis. hanya streak), atau tetap 100% efemeral sampai v0.3?
- Berapa **jumlah soal ideal** per bab untuk demo (cukup 3, atau perbanyak agar pengacakan terasa)?
- Apakah **Dashboard Guru** masuk lingkup demo klien berikutnya, atau tetap dummy dulu?
- Perlukah **timer kuis** ditampilkan saat demo, atau hanya tersedia sebagai opsi?

---

## 7. Ide "Suatu Saat" (Parkir)
- Sinkronisasi cloud & multi-user riil (Roadmap v1.0).
- AI Tutor & adaptive learning berbasis pola kesalahan (Roadmap v2.0).
- Leaderboard antar siswa, mode kompetisi kelas.
- Ekspor rapor progress ke PDF.
- Notifikasi pengingat belajar (butuh keluar dari Expo Go murni).
