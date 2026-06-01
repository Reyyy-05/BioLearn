import { LearningModule } from '@/types';

export const seedModules: LearningModule[] = [
  // ── 1. Sel dan Organel ──────────────────────────────────────
  {
    id: 'mod-001',
    title: 'Sel dan Organel',
    grade: 11,
    chapter: 1,
    difficulty: 'Mudah',
    estimatedMinutes: 25,
    instructorId: 'inst-001',
    videoTitle: 'Mengenal Sel: Unit Terkecil Kehidupan',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoThumbnail: 'https://picsum.photos/seed/sel/640/360',
    videoDuration: 596,
    summary:
      'Sel adalah unit struktural dan fungsional terkecil dari makhluk hidup. Setiap sel memiliki organel dengan fungsi spesifik, mulai dari nukleus sebagai pusat kendali, mitokondria sebagai pembangkit energi, hingga ribosom sebagai pabrik protein.',
    keyPoints: [
      'Sel prokariotik tidak memiliki membran inti, sedangkan sel eukariotik memilikinya.',
      'Nukleus menyimpan materi genetik (DNA) dan mengendalikan aktivitas sel.',
      'Mitokondria menghasilkan ATP melalui respirasi seluler.',
      'Retikulum endoplasma terdiri dari RE kasar (sintesis protein) dan RE halus (sintesis lipid).',
      'Badan Golgi berperan dalam modifikasi, pengemasan, dan distribusi protein.',
    ],
    example:
      'Sel darah merah manusia tidak memiliki nukleus agar lebih banyak ruang untuk hemoglobin yang mengangkut oksigen. Ini menunjukkan bahwa struktur sel beradaptasi sesuai fungsinya.',
    icon: '🔬',
  },

  // ── 2. Sistem Pernapasan Manusia ────────────────────────────
  {
    id: 'mod-002',
    title: 'Sistem Pernapasan Manusia',
    grade: 11,
    chapter: 5,
    difficulty: 'Sedang',
    estimatedMinutes: 30,
    instructorId: 'inst-002',
    videoTitle: 'Bagaimana Kita Bernapas? Mekanisme Inspirasi & Ekspirasi',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoThumbnail: 'https://picsum.photos/seed/napas/640/360',
    videoDuration: 653,
    summary:
      'Sistem pernapasan manusia terdiri dari saluran udara (hidung, faring, laring, trakea, bronkus) dan paru-paru. Pertukaran gas terjadi di alveolus melalui proses difusi. Pernapasan diatur oleh pusat pernapasan di medula oblongata.',
    keyPoints: [
      'Pernapasan dada menggunakan otot antar tulang rusuk, pernapasan perut menggunakan diafragma.',
      'Alveolus memiliki dinding tipis dan dikelilingi kapiler untuk memaksimalkan pertukaran gas.',
      'O₂ berdifusi dari alveolus ke darah, CO₂ berdifusi dari darah ke alveolus.',
      'Volume tidal adalah volume udara yang keluar-masuk saat bernapas normal (~500 ml).',
      'Gangguan pernapasan meliputi asma, bronkitis, dan pneumonia.',
    ],
    example:
      'Saat kita berolahraga, kebutuhan O₂ meningkat sehingga frekuensi napas bertambah. Ini diatur oleh kemoreseptor yang mendeteksi peningkatan CO₂ dalam darah.',
    icon: '🫁',
  },

  // ── 3. Sistem Peredaran Darah ───────────────────────────────
  {
    id: 'mod-003',
    title: 'Sistem Peredaran Darah',
    grade: 11,
    chapter: 4,
    difficulty: 'Sedang',
    estimatedMinutes: 35,
    instructorId: 'inst-001',
    videoTitle: 'Jantung & Pembuluh Darah: Perjalanan Darah dalam Tubuh',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: 'https://picsum.photos/seed/darah/640/360',
    videoDuration: 720,
    summary:
      'Sistem peredaran darah manusia adalah sistem peredaran ganda dan tertutup. Jantung memiliki 4 ruang yang memompa darah ke seluruh tubuh melalui pembuluh arteri, vena, dan kapiler.',
    keyPoints: [
      'Peredaran darah besar: jantung → seluruh tubuh → jantung.',
      'Peredaran darah kecil: jantung → paru-paru → jantung.',
      'Arteri membawa darah dari jantung, vena membawa darah menuju jantung.',
      'Darah terdiri dari plasma, sel darah merah, sel darah putih, dan trombosit.',
      'Golongan darah ditentukan oleh antigen pada permukaan eritrosit (sistem ABO dan Rhesus).',
    ],
    example:
      'Pada proses donor darah, golongan darah O disebut donor universal karena eritrositnya tidak memiliki antigen A maupun B, sehingga tidak menimbulkan reaksi aglutinasi pada penerima.',
    icon: '❤️',
  },

  // ── 4. Genetika Dasar ──────────────────────────────────────
  {
    id: 'mod-004',
    title: 'Genetika Dasar',
    grade: 12,
    chapter: 3,
    difficulty: 'Sulit',
    estimatedMinutes: 40,
    instructorId: 'inst-003',
    videoTitle: 'Hukum Mendel & Pola Pewarisan Sifat',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoThumbnail: 'https://picsum.photos/seed/genetika/640/360',
    videoDuration: 810,
    summary:
      'Genetika mempelajari pewarisan sifat dari induk ke keturunan. Gregor Mendel menemukan hukum segregasi dan hukum pengelompokan bebas melalui percobaan pada tanaman kacang kapri.',
    keyPoints: [
      'Gen adalah unit pewarisan sifat yang terletak pada kromosom.',
      'Hukum I Mendel (Segregasi): pasangan alel berpisah saat pembentukan gamet.',
      'Hukum II Mendel (Pengelompokan Bebas): gen-gen pada kromosom berbeda diwariskan secara independen.',
      'Genotipe adalah susunan gen, fenotipe adalah penampakan sifat yang teramati.',
      'Dominan penuh, dominan tidak penuh, dan kodominan adalah pola pewarisan sifat.',
    ],
    example:
      'Pada persilangan monohibrid Mendel (Bb × Bb), diperoleh rasio fenotipe 3:1. Contoh: 3 tanaman bunga ungu dan 1 tanaman bunga putih.',
    icon: '🧬',
  },

  // ── 5. Ekosistem ────────────────────────────────────────────
  {
    id: 'mod-005',
    title: 'Ekosistem',
    grade: 10,
    chapter: 10,
    difficulty: 'Sedang',
    estimatedMinutes: 28,
    instructorId: 'inst-004',
    videoTitle: 'Komponen & Interaksi dalam Ekosistem',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoThumbnail: 'https://picsum.photos/seed/ekosistem/640/360',
    videoDuration: 670,
    summary:
      'Ekosistem adalah kesatuan antara komponen biotik dan abiotik yang saling berinteraksi. Energi mengalir melalui rantai makanan, sedangkan materi didaur ulang melalui siklus biogeokimia.',
    keyPoints: [
      'Komponen biotik: produsen, konsumen, dan dekomposer.',
      'Komponen abiotik: cahaya, suhu, air, tanah, dan udara.',
      'Rantai makanan menggambarkan aliran energi satu arah.',
      'Jaring-jaring makanan adalah kumpulan rantai makanan yang saling terhubung.',
      'Piramida ekologi menggambarkan jumlah, biomassa, atau energi tiap tingkat trofik.',
    ],
    example:
      'Di ekosistem sawah: padi (produsen) → belalang (konsumen I) → katak (konsumen II) → ular (konsumen III) → elang (konsumen puncak). Jika populasi katak menurun, populasi belalang meledak dan merusak tanaman padi.',
    icon: '🌿',
  },

  // ── 6. Mitosis dan Meiosis ──────────────────────────────────
  {
    id: 'mod-006',
    title: 'Mitosis dan Meiosis',
    grade: 12,
    chapter: 1,
    difficulty: 'Sulit',
    estimatedMinutes: 35,
    instructorId: 'inst-003',
    videoTitle: 'Pembelahan Sel: Mitosis vs Meiosis',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoThumbnail: 'https://picsum.photos/seed/mitosis/640/360',
    videoDuration: 750,
    summary:
      'Pembelahan sel terdiri dari mitosis (pembelahan untuk pertumbuhan) dan meiosis (pembelahan untuk pembentukan sel gamet). Mitosis menghasilkan 2 sel identik, meiosis menghasilkan 4 sel dengan setengah jumlah kromosom.',
    keyPoints: [
      'Mitosis terdiri dari profase, metafase, anafase, dan telofase.',
      'Meiosis terdiri dari meiosis I (reduksi) dan meiosis II (ekuasi).',
      'Mitosis: 2n → 2n (diploid → diploid), Meiosis: 2n → n (diploid → haploid).',
      'Crossing over pada meiosis I menghasilkan variasi genetik.',
      'Mitosis terjadi di sel somatik, meiosis terjadi di sel gonad (penghasil gamet).',
    ],
    example:
      'Pertumbuhan luka pada kulit terjadi melalui mitosis — sel-sel kulit baru yang identik menggantikan sel yang rusak. Sementara itu, pembentukan sel sperma dan sel telur terjadi melalui meiosis.',
    icon: '🧫',
  },
];
