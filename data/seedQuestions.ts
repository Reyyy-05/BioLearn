import { QuizQuestion } from '@/types';

export const seedQuestions: QuizQuestion[] = [
  // ══════════════════════════════════════════════════════════════
  // MOD-001: Sel dan Organel
  // ══════════════════════════════════════════════════════════════
  {
    id: 'q-001-1',
    moduleId: 'mod-001',
    question: 'Organel sel yang berfungsi sebagai penghasil energi (ATP) adalah...',
    options: ['Ribosom', 'Mitokondria', 'Badan Golgi', 'Lisosom'],
    correctAnswerIndex: 1,
    explanation:
      'Mitokondria disebut "power house of the cell" karena menjadi tempat utama respirasi seluler yang menghasilkan ATP.',
  },
  {
    id: 'q-001-2',
    moduleId: 'mod-001',
    question: 'Perbedaan utama sel prokariotik dan eukariotik terletak pada...',
    options: [
      'Ukuran sel',
      'Ada tidaknya membran inti',
      'Ada tidaknya ribosom',
      'Bentuk sel',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Sel prokariotik tidak memiliki membran inti (nukleus) sehingga materi genetiknya tersebar di sitoplasma, sedangkan sel eukariotik memiliki membran inti.',
  },
  {
    id: 'q-001-3',
    moduleId: 'mod-001',
    question: 'Retikulum endoplasma kasar ditempeli oleh organel...',
    options: ['Mitokondria', 'Lisosom', 'Ribosom', 'Sentriol'],
    correctAnswerIndex: 2,
    explanation:
      'RE kasar memiliki ribosom yang menempel pada permukaannya, sehingga berperan dalam sintesis protein.',
  },
  {
    id: 'q-001-4',
    moduleId: 'mod-001',
    question: 'Organel yang berperan dalam pencernaan intrasel dan mengandung enzim hidrolitik adalah...',
    options: ['Lisosom', 'Vakuola', 'Ribosom', 'Nukleolus'],
    correctAnswerIndex: 0,
    explanation:
      'Lisosom mengandung enzim hidrolitik yang berfungsi mencerna materi asing dan organel yang rusak (autofagi).',
    difficulty: 'medium',
    topicTag: 'organel',
    competency: 'Mengidentifikasi fungsi organel sel',
  },
  {
    id: 'q-001-5',
    moduleId: 'mod-001',
    question: 'Bagian sel tumbuhan yang tidak ditemukan pada sel hewan adalah...',
    options: ['Membran sel', 'Dinding sel', 'Sitoplasma', 'Inti sel'],
    correctAnswerIndex: 1,
    explanation:
      'Dinding sel dari selulosa hanya dimiliki sel tumbuhan, memberi bentuk tetap dan perlindungan; sel hewan tidak memilikinya.',
    difficulty: 'easy',
    topicTag: 'struktur-sel',
    competency: 'Membedakan sel hewan dan tumbuhan',
  },

  // ══════════════════════════════════════════════════════════════
  // MOD-002: Sistem Pernapasan Manusia
  // ══════════════════════════════════════════════════════════════
  {
    id: 'q-002-1',
    moduleId: 'mod-002',
    question: 'Pertukaran gas O₂ dan CO₂ dalam paru-paru terjadi di...',
    options: ['Bronkus', 'Bronkiolus', 'Alveolus', 'Trakea'],
    correctAnswerIndex: 2,
    explanation:
      'Alveolus memiliki dinding yang sangat tipis dan dikelilingi kapiler darah, memungkinkan pertukaran gas secara difusi.',
  },
  {
    id: 'q-002-2',
    moduleId: 'mod-002',
    question: 'Pernapasan dada terjadi karena kontraksi otot...',
    options: [
      'Diafragma',
      'Antar tulang rusuk (interkostal)',
      'Perut',
      'Punggung',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Pada pernapasan dada, otot antar tulang rusuk (interkostal) berkontraksi sehingga rongga dada membesar dan udara masuk.',
  },
  {
    id: 'q-002-3',
    moduleId: 'mod-002',
    question: 'Volume udara yang keluar-masuk paru-paru saat bernapas normal disebut...',
    options: [
      'Volume residu',
      'Volume tidal',
      'Kapasitas vital',
      'Volume cadangan',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Volume tidal adalah volume udara yang keluar-masuk paru-paru saat bernapas biasa, yaitu sekitar 500 ml.',
  },
  {
    id: 'q-002-4',
    moduleId: 'mod-002',
    question: 'Setelah melewati trakea, udara pernapasan selanjutnya menuju...',
    options: ['Faring', 'Bronkus', 'Alveolus', 'Laring'],
    correctAnswerIndex: 1,
    explanation:
      'Urutan saluran: hidung → faring → laring → trakea → bronkus → bronkiolus → alveolus. Setelah trakea, udara masuk ke bronkus.',
    difficulty: 'medium',
    topicTag: 'organ-pernapasan',
    competency: 'Mengurutkan saluran pernapasan',
  },
  {
    id: 'q-002-5',
    moduleId: 'mod-002',
    question: 'Faktor yang memengaruhi cepat-lambatnya frekuensi pernapasan adalah...',
    options: ['Golongan darah', 'Aktivitas tubuh', 'Warna kulit', 'Tinggi badan'],
    correctAnswerIndex: 1,
    explanation:
      'Semakin tinggi aktivitas tubuh, semakin besar kebutuhan oksigen sehingga frekuensi pernapasan meningkat.',
    difficulty: 'easy',
    topicTag: 'mekanisme-pernapasan',
    competency: 'Menganalisis faktor frekuensi pernapasan',
  },

  // ══════════════════════════════════════════════════════════════
  // MOD-003: Sistem Peredaran Darah
  // ══════════════════════════════════════════════════════════════
  {
    id: 'q-003-1',
    moduleId: 'mod-003',
    question: 'Pembuluh darah yang membawa darah dari jantung ke seluruh tubuh adalah...',
    options: ['Vena', 'Kapiler', 'Arteri', 'Venula'],
    correctAnswerIndex: 2,
    explanation:
      'Arteri membawa darah dari jantung ke seluruh tubuh dengan tekanan tinggi, memiliki dinding yang tebal dan elastis.',
  },
  {
    id: 'q-003-2',
    moduleId: 'mod-003',
    question: 'Peredaran darah kecil pada manusia melalui rute...',
    options: [
      'Jantung → seluruh tubuh → jantung',
      'Jantung → paru-paru → jantung',
      'Jantung → otak → jantung',
      'Paru-paru → jantung → otak',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Peredaran darah kecil: ventrikel kanan → arteri pulmonalis → paru-paru → vena pulmonalis → atrium kiri.',
  },
  {
    id: 'q-003-3',
    moduleId: 'mod-003',
    question: 'Golongan darah O disebut donor universal karena...',
    options: [
      'Memiliki antigen A dan B',
      'Tidak memiliki antigen A maupun B',
      'Memiliki antibodi A dan B',
      'Memiliki Rhesus positif',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Eritrosit golongan darah O tidak memiliki antigen A maupun B sehingga tidak menimbulkan reaksi aglutinasi pada penerima.',
  },
  {
    id: 'q-003-4',
    moduleId: 'mod-003',
    question: 'Sel darah yang berperan utama dalam proses pembekuan darah adalah...',
    options: ['Eritrosit', 'Leukosit', 'Trombosit', 'Plasma darah'],
    correctAnswerIndex: 2,
    explanation:
      'Trombosit (keping darah) berperan dalam pembekuan darah dengan membentuk benang-benang fibrin saat terjadi luka.',
    difficulty: 'medium',
    topicTag: 'komponen-darah',
    competency: 'Mengidentifikasi fungsi sel darah',
  },
  {
    id: 'q-003-5',
    moduleId: 'mod-003',
    question: 'Ruang jantung yang memompa darah bersih ke seluruh tubuh adalah...',
    options: ['Serambi kanan', 'Serambi kiri', 'Bilik kanan', 'Bilik kiri'],
    correctAnswerIndex: 3,
    explanation:
      'Bilik kiri (ventrikel kiri) memiliki otot paling tebal karena memompa darah ke seluruh tubuh melalui aorta.',
    difficulty: 'medium',
    topicTag: 'anatomi-jantung',
    competency: 'Menjelaskan fungsi ruang jantung',
  },

  // ══════════════════════════════════════════════════════════════
  // MOD-004: Genetika Dasar
  // ══════════════════════════════════════════════════════════════
  {
    id: 'q-004-1',
    moduleId: 'mod-004',
    question: 'Hukum I Mendel dikenal juga sebagai hukum...',
    options: [
      'Pengelompokan bebas',
      'Segregasi',
      'Dominansi',
      'Pautan gen',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Hukum I Mendel (Hukum Segregasi) menyatakan bahwa pasangan alel akan berpisah saat pembentukan gamet.',
  },
  {
    id: 'q-004-2',
    moduleId: 'mod-004',
    question: 'Pada persilangan Bb × Bb, rasio genotipe keturunannya adalah...',
    options: ['1:1', '3:1', '1:2:1', '1:1:1:1'],
    correctAnswerIndex: 2,
    explanation:
      'Persilangan Bb × Bb menghasilkan rasio genotipe 1 BB : 2 Bb : 1 bb = 1:2:1.',
  },
  {
    id: 'q-004-3',
    moduleId: 'mod-004',
    question: 'Penampakan sifat yang dapat diamati pada suatu organisme disebut...',
    options: ['Genotipe', 'Fenotipe', 'Alel', 'Kromosom'],
    correctAnswerIndex: 1,
    explanation:
      'Fenotipe adalah sifat yang tampak atau teramati pada organisme, yang merupakan hasil ekspresi genotipe dan pengaruh lingkungan.',
  },
  {
    id: 'q-004-4',
    moduleId: 'mod-004',
    question: 'Persilangan yang melibatkan dua sifat beda disebut persilangan...',
    options: ['Monohibrid', 'Dihibrid', 'Trihibrid', 'Resiprok'],
    correctAnswerIndex: 1,
    explanation:
      'Persilangan dihibrid melibatkan dua sifat beda sekaligus, contohnya bentuk dan warna biji.',
    difficulty: 'medium',
    topicTag: 'persilangan',
    competency: 'Membedakan jenis persilangan',
  },
  {
    id: 'q-004-5',
    moduleId: 'mod-004',
    question: 'Pada persilangan monohibrid dominan penuh Bb × Bb, rasio fenotipe keturunannya adalah...',
    options: ['1:1', '3:1', '1:2:1', '9:3:3:1'],
    correctAnswerIndex: 1,
    explanation:
      'Bb × Bb menghasilkan 3 berfenotipe dominan : 1 berfenotipe resesif, sehingga rasio fenotipenya 3:1.',
    difficulty: 'hard',
    topicTag: 'hukum-mendel',
    competency: 'Menghitung rasio fenotipe',
  },

  // ══════════════════════════════════════════════════════════════
  // MOD-005: Ekosistem
  // ══════════════════════════════════════════════════════════════
  {
    id: 'q-005-1',
    moduleId: 'mod-005',
    question: 'Organisme yang berperan sebagai pengurai dalam ekosistem adalah...',
    options: ['Produsen', 'Konsumen', 'Dekomposer', 'Predator'],
    correctAnswerIndex: 2,
    explanation:
      'Dekomposer (pengurai) menguraikan organisme mati menjadi zat anorganik yang dapat digunakan kembali oleh produsen.',
  },
  {
    id: 'q-005-2',
    moduleId: 'mod-005',
    question: 'Yang termasuk komponen abiotik dalam ekosistem adalah...',
    options: ['Tumbuhan', 'Bakteri', 'Cahaya matahari', 'Jamur'],
    correctAnswerIndex: 2,
    explanation:
      'Komponen abiotik adalah komponen tak hidup seperti cahaya, suhu, air, tanah, dan udara.',
  },
  {
    id: 'q-005-3',
    moduleId: 'mod-005',
    question: 'Dalam piramida energi, energi terbesar terdapat pada tingkat trofik...',
    options: [
      'Konsumen puncak',
      'Konsumen primer',
      'Produsen',
      'Dekomposer',
    ],
    correctAnswerIndex: 2,
    explanation:
      'Energi terbesar terdapat pada tingkat produsen karena energi berkurang sekitar 90% pada setiap perpindahan tingkat trofik.',
  },
  {
    id: 'q-005-4',
    moduleId: 'mod-005',
    question: 'Hubungan antara kupu-kupu dan bunga termasuk simbiosis...',
    options: ['Parasitisme', 'Komensalisme', 'Mutualisme', 'Kompetisi'],
    correctAnswerIndex: 2,
    explanation:
      'Simbiosis mutualisme saling menguntungkan: kupu-kupu mendapat nektar, bunga terbantu penyerbukannya.',
    difficulty: 'easy',
    topicTag: 'interaksi',
    competency: 'Mengklasifikasikan jenis simbiosis',
  },
  {
    id: 'q-005-5',
    moduleId: 'mod-005',
    question: 'Kumpulan beberapa populasi berbeda yang hidup dan berinteraksi di suatu area disebut...',
    options: ['Individu', 'Komunitas', 'Bioma', 'Habitat'],
    correctAnswerIndex: 1,
    explanation:
      'Komunitas adalah kumpulan berbagai populasi makhluk hidup yang menempati dan berinteraksi di area yang sama.',
    difficulty: 'medium',
    topicTag: 'tingkat-organisasi',
    competency: 'Menjelaskan tingkat organisasi kehidupan',
  },

  // ══════════════════════════════════════════════════════════════
  // MOD-006: Mitosis dan Meiosis
  // ══════════════════════════════════════════════════════════════
  {
    id: 'q-006-1',
    moduleId: 'mod-006',
    question: 'Hasil dari pembelahan mitosis adalah...',
    options: [
      '4 sel anak diploid',
      '2 sel anak diploid',
      '4 sel anak haploid',
      '2 sel anak haploid',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Mitosis menghasilkan 2 sel anak yang identik dengan sel induk, masing-masing bersifat diploid (2n).',
  },
  {
    id: 'q-006-2',
    moduleId: 'mod-006',
    question: 'Crossing over terjadi pada tahap...',
    options: [
      'Profase mitosis',
      'Profase I meiosis',
      'Metafase II meiosis',
      'Anafase mitosis',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Crossing over (pindah silang) terjadi pada profase I meiosis, di mana kromosom homolog bertukar segmen, menghasilkan variasi genetik.',
  },
  {
    id: 'q-006-3',
    moduleId: 'mod-006',
    question: 'Pembelahan meiosis terjadi pada sel...',
    options: ['Somatik', 'Gonad', 'Saraf', 'Otot'],
    correctAnswerIndex: 1,
    explanation:
      'Meiosis terjadi di sel gonad (organ reproduksi) untuk menghasilkan sel gamet (sperma dan ovum) yang bersifat haploid.',
  },
  {
    id: 'q-006-4',
    moduleId: 'mod-006',
    question: 'Meiosis menghasilkan sel anak sebanyak...',
    options: [
      '2 sel haploid',
      '4 sel haploid',
      '2 sel diploid',
      '4 sel diploid',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Meiosis terdiri dari dua kali pembelahan dan menghasilkan 4 sel anak yang bersifat haploid (n).',
    difficulty: 'medium',
    topicTag: 'pembelahan-sel',
    competency: 'Menjelaskan hasil pembelahan meiosis',
  },
  {
    id: 'q-006-5',
    moduleId: 'mod-006',
    question: 'Tahap pembelahan saat kromatid saudara bergerak menuju kutub yang berlawanan adalah...',
    options: ['Profase', 'Metafase', 'Anafase', 'Telofase'],
    correctAnswerIndex: 2,
    explanation:
      'Pada anafase, kromatid saudara terpisah dan ditarik menuju kutub sel yang berlawanan oleh benang spindel.',
    difficulty: 'hard',
    topicTag: 'fase-pembelahan',
    competency: 'Mengidentifikasi tahap pembelahan sel',
  },
];
