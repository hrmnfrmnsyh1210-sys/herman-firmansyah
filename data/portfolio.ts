// =========================================================
// Semua konten portofolio ada di sini — edit file ini untuk
// mengganti teks, proyek, pengalaman, dan kontak.
// =========================================================

export const profile = {
  name: 'Herman Firmansyah',
  shortName: 'Herman',
  role: 'Software Developer',
  campus: 'Universitas Bina Sarana Informatika (UBSI)',
  location: 'Pontianak, Kalimantan Barat',
  email: 'hrmnfrmnsyh1210@gmail.com',
  whatsapp: { label: '+62 857-0504-1136', url: 'https://wa.me/6285705041136' },
  // Taruh file CV di folder public/ dengan nama ini.
  cv: '/CV-Herman-Firmansyah.pdf',
  tagline: 'Better Code, Bigger Dreams',
  // Ilustrasi diri (ada di folder public/).
  images: {
    character: '/herman-character.webp', // hero (latar transparan, dari image.png)
  },
  // Stiker pose dari sticker sheet (latar transparan, folder public/poses/).
  poses: {
    peace: '/poses/pose-peace.webp', // Showcase
    sit: '/poses/pose-sit.webp', // Proyek
    think: '/poses/pose-think.webp', // Keahlian
    crossed: '/poses/pose-crossed.webp', // Tentang Saya
    backpack: '/poses/pose-backpack.webp', // Perjalanan
    jump: '/poses/pose-jump.webp', // Kontak
    lookback: '/poses/pose-lookback.webp', // Footer
    stand: '/poses/pose-stand.webp', // cadangan (hero memakai versi resolusi tinggi)
  },
  available: 'Terbuka untuk magang & freelance',
  roles: ['Software Developer', 'Full-Stack Web', 'Mobile App'],
}

export const socials = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/hrmnfrmnsyh1210-sys' },
  { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/her___1210' },
  { name: 'Email', icon: 'mail', url: `mailto:${profile.email}` },
]

export const navLinks = [
  { id: 'about', label: 'Tentang' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'projects', label: 'Proyek' },
  { id: 'experience', label: 'Pengalaman' },
  { id: 'contact', label: 'Kontak' },
]

export const highlights = [
  { value: 'UBSI', label: 'Universitas Bina Sarana Informatika' },
  { value: 'S1', label: 'Lulusan Program Studi Informatika' },
  { value: 'PNK', label: 'Pontianak, Kalimantan Barat' },
  { value: 'Open', label: 'Magang & Freelance' },
]

export const services = [
  { icon: 'layers', title: 'Full-stack Web', text: 'Aplikasi web end-to-end, dari database hingga UI yang responsif.' },
  { icon: 'plug', title: 'REST API & Integrasi', text: 'API yang rapi, terdokumentasi, dan mudah diintegrasikan.' },
  { icon: 'smartphone', title: 'Mobile Cross-platform', text: 'Aplikasi Android & iOS dari satu basis kode.' },
  { icon: 'database', title: 'Database & Query', text: 'Desain skema yang tepat dan optimasi query.' },
  { icon: 'sparkles', title: 'Integrasi AI & Bot', text: 'Otomasi lewat bot Telegram/WhatsApp dan fitur berbasis AI.' },
  { icon: 'heart', title: 'Fokus pada Pengguna', text: 'Antarmuka yang nyaman dipakai, bukan sekadar berjalan.' },
]

export const skillGroups = [
  {
    icon: 'layout',
    title: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
  },
  {
    icon: 'server',
    title: 'Backend',
    items: ['Node.js', 'Express', 'NestJS', 'PHP', 'Laravel', 'Python', 'REST API', 'GraphQL'],
  },
  { icon: 'smartphone', title: 'Mobile', items: ['Flutter', 'Dart', 'React Native', 'Firebase'] },
  { icon: 'database', title: 'Database', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma'] },
  {
    icon: 'cloud',
    title: 'DevOps & Cloud',
    items: ['Docker', 'Linux', 'Nginx', 'GitHub Actions', 'AWS', 'Vercel'],
  },
  {
    icon: 'plug',
    title: 'Integrasi & Otomasi',
    items: ['Bot Telegram', 'Bot WhatsApp', 'AI / LLM API', 'Google OAuth & SSO', 'Laporan Excel & PDF'],
  },
  {
    icon: 'pen-tool',
    title: 'UI/UX Design',
    items: ['User Flow', 'Wireframe', 'Prototype', 'Design System', 'Figma', 'Usability Testing'],
  },
  { icon: 'wrench', title: 'Tools', items: ['Git', 'VS Code', 'Figma', 'Postman', 'Jira'] },
]

// Deretan ikon di section Keahlian. `icon` = logo dari simple-icons (lihat
// SkillsSection.vue) atau nama ikon AppIcon untuk skill tanpa logo brand.
export const skillTiles = [
  { icon: 'typescript', name: 'TypeScript' },
  { icon: 'vue', name: 'Vue / Nuxt' },
  { icon: 'react', name: 'React' },
  { icon: 'nodejs', name: 'Node.js' },
  { icon: 'laravel', name: 'Laravel' },
  { icon: 'python', name: 'Python' },
  { icon: 'flutter', name: 'Flutter' },
  { icon: 'postgresql', name: 'PostgreSQL' },
  { icon: 'docker', name: 'Docker' },
  { icon: 'git', name: 'Git' },
  { icon: 'figma', name: 'Figma' },
  { icon: 'pen-tool', name: 'UI/UX Design', color: '#ffc928' },
]

export type ProjectCategory = 'gov' | 'platform' | 'business'

export const projectFilters: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'gov', label: 'Pemerintahan' },
  { value: 'platform', label: 'Platform / SaaS' },
  { value: 'business', label: 'Bisnis' },
]

// Proyek nyata. Thumbnail = screenshot situs di public/projects/.
// Untuk menambah proyek: salin satu objek, isi datanya, dan taruh screenshot
// (rasio 16:9, mis. 800x450 .webp) di public/projects/.
export const projects: {
  title: string
  description: string
  category: ProjectCategory
  icon: string
  image?: string
  colors: [string, string]
  stack: string[]
  links: { label: string; url: string }[]
}[] = [
  {
    title: 'Pivot — Pemulihan Finansial & Karier',
    description:
      'Membantu fresh graduate, korban PHK, dan orang yang terjerat pinjol menghitung Target Income dari biaya hidup & utang, lalu memandu lima langkah: pemetaan skill gap, roadmap belajar 14–30 hari, CV ATS dan lowongan yang sesuai, hingga micro-gig. Data utang diproses sepenuhnya di perangkat, dilengkapi asisten AI.',
    category: 'platform',
    icon: 'rocket',
    image: '/projects/pivot.webp',
    colors: ['#c81e1e', '#ffc928'],
    stack: ['Nuxt', 'Tailwind CSS', 'AI Assistant', 'Google OAuth', 'Vercel'],
    links: [{ label: 'Kunjungi Situs', url: 'https://pivot-id.vercel.app/' }],
  },
  {
    title: 'Absensi QR — SMP Islam Bina 45',
    description:
      'Sistem absensi digital berbasis QR: siswa menampilkan kartu QR pribadi untuk dipindai guru, absensi tercatat per mata pelajaran, rekap otomatis ke Excel & PDF, dan orang tua bisa memantau kehadiran anak tanpa perlu akun.',
    category: 'platform',
    icon: 'check',
    image: '/projects/absensi-bina45.webp',
    colors: ['#16a34a', '#2dd4bf'],
    stack: ['React', 'Vite', 'QR Scanner', 'Excel & PDF', 'Vercel'],
    links: [{ label: 'Kunjungi Situs', url: 'https://absensi-bina-45.vercel.app/' }],
  },
  {
    title: 'SISPER — Platform Rekrutmen Berbasis AI',
    description:
      'Platform rekrutmen dengan screening CV otomatis berbasis AI: menganalisis skill, pengalaman, dan pendidikan pelamar lalu merangking kandidat untuk HR. Pelamar dapat melacak status lamaran secara real-time.',
    category: 'platform',
    icon: 'sparkles',
    image: '/projects/sisper.webp',
    colors: ['#2a55c9', '#ffc928'],
    stack: ['Nuxt', 'AI CV Screening', 'Vercel'],
    links: [{ label: 'Kunjungi Situs', url: 'https://www.sisper.web.id/' }],
  },
  {
    title: 'TxStream — Pencatatan Keuangan Usaha via Chat',
    description:
      'Panel admin untuk memantau pemasukan & pengeluaran usaha secara otomatis: transaksi dicatat lewat bot Telegram & WhatsApp, laporan Excel/PDF dibuat otomatis, dan mendukung banyak usaha serta tim sekaligus.',
    category: 'platform',
    icon: 'wallet',
    image: '/projects/txstream.webp',
    colors: ['#ff6a1a', '#ffc928'],
    stack: ['Nuxt', 'Bootstrap', 'Bot Telegram & WhatsApp', 'Vercel'],
    links: [{ label: 'Kunjungi Situs', url: 'https://txstream.web.id/login' }],
  },
  {
    title: 'ComPos — POS & Toko Online untuk UMKM',
    description:
      'Platform kasir (POS) sekaligus toko online untuk UMKM: setiap toko mendapat subdomain sendiri, stok terpusat untuk penjualan offline & online, scan barcode, member & poin loyalti, laporan laba otomatis, serta akses bertingkat Owner/Manager/Kasir.',
    category: 'platform',
    icon: 'cart',
    image: '/projects/compos.webp',
    colors: ['#ff1f5a', '#ffc928'],
    stack: ['React', 'Vite', 'Multi-tenant', 'Vercel'],
    links: [{ label: 'Kunjungi Situs', url: 'https://shofiashop.vercel.app/' }],
  },
  {
    title: 'SITARA — Sistem Tes Akademik Terpadu',
    description:
      'Platform ujian berbasis komputer (CBT) multi-sekolah: bank soal multimedia, beragam tipe soal, penilaian & analisis butir otomatis, timer auto-submit, dan mode anti-curang.',
    category: 'platform',
    icon: 'graduation',
    image: '/projects/sitara.webp',
    colors: ['#3f74ff', '#2dd4bf'],
    stack: ['Bootstrap', 'Multi-tenant', 'CBT'], // TODO: tambahkan stack backend
    links: [{ label: 'Kunjungi Situs', url: 'https://sitara.simpeda.id/' }],
  },
  {
    title: 'HadirKu — Absensi Rapat Pemprov Kalbar',
    description:
      'Sistem absensi rapat modern untuk Pemerintah Provinsi Kalimantan Barat, dengan jalur masuk terpisah untuk ASN dan masyarakat serta dukungan single sign-on.',
    category: 'gov',
    icon: 'check',
    image: '/projects/hadirku.webp',
    colors: ['#16a34a', '#ffc928'],
    stack: ['Laravel', 'PHP 8.3', 'SSO'],
    links: [{ label: 'Kunjungi Situs', url: 'https://hadirku.kalbarprov.go.id/login' }],
  },
  {
    title: 'e-StaffMail — Layanan Email Dinas',
    description:
      'Layanan online Pemprov Kalbar untuk permohonan akun email dinas baru dan reset password: pengajuan dengan unggah dokumen, notifikasi status real-time, dan asisten virtual STAFFi.',
    category: 'gov',
    icon: 'mail',
    image: '/projects/ems.webp',
    colors: ['#ffc928', '#0f1d4a'],
    stack: ['Laravel', 'PHP 8.3'],
    links: [{ label: 'Kunjungi Situs', url: 'https://ems.kalbarprov.go.id/' }],
  },
  {
    title: 'SiMPeDa — Sistem Pengaduan Masyarakat Desa',
    description:
      'Platform pengaduan warga Desa Pancaroba, Sungai Ambawang: buat dan lacak pengaduan secara real-time, lengkap dengan statistik publik, pengumuman desa, dan login Google.',
    category: 'gov',
    icon: 'chat',
    image: '/projects/simpeda.webp',
    colors: ['#2a55c9', '#5b86ff'],
    stack: ['Tailwind CSS', 'Google OAuth'], // TODO: tambahkan stack backend
    links: [{ label: 'Kunjungi Situs', url: 'https://simpeda.id/beranda' }],
  },
  {
    title: 'Solusi Mitra Bangunan — Toko Bangunan Online',
    description:
      'E-commerce bahan bangunan: katalog produk dengan stok real-time, keranjang belanja, checkout dengan opsi COD, login Google untuk pelanggan, dan panel admin terpisah.',
    category: 'business',
    icon: 'cart',
    image: '/projects/mitrabangunan.webp',
    colors: ['#7c5cff', '#ffc928'],
    stack: ['Tailwind CSS', 'Alpine.js', 'Google OAuth'], // TODO: tambahkan stack backend
    links: [{ label: 'Kunjungi Situs', url: 'https://solusimitrabangunan.com/' }],
  },
  {
    title: 'PT. Triputra Khatulistiwa — Company Profile',
    description:
      'Website company profile perusahaan ekspedisi di Kalimantan Barat: profil perusahaan, visi-misi, katalog layanan logistik, dan kontak WhatsApp.',
    category: 'business',
    icon: 'truck',
    image: '/projects/triputra.webp',
    colors: ['#0f766e', '#ffc928'],
    stack: ['React', 'Vercel'],
    links: [{ label: 'Kunjungi Situs', url: 'https://pt-triputra.vercel.app/' }],
  },
]

// TODO: tambahkan magang, organisasi kampus, sertifikasi, atau lomba di sini.
export const experience = [
  {
    icon: 'graduation',
    period: 'Lulus', // TODO: isi tahun, mis. "2022 — 2026"
    title: 'S1 Informatika',
    place: 'Universitas Bina Sarana Informatika (UBSI), Pontianak',
    points: [
      'Mempelajari pemrograman, basis data, dan pengembangan perangkat lunak.',
      'Mengerjakan proyek dan tugas berbasis web serta aplikasi sebagai bagian dari masa studi.',
    ],
  },
  {
    icon: 'code',
    period: 'Sekarang',
    title: 'Software Developer — Proyek Nyata',
    place: 'Pengembangan Aplikasi Web & Mobile',
    points: [
      'Membangun dan mengembangkan aplikasi web dan mobile untuk proyek nyata yang digunakan langsung oleh pengguna.',
      'Menangani alur kerja end-to-end: analisis kebutuhan, perancangan database, REST API, hingga deployment dan pemeliharaan.',
    ],
  },
]
