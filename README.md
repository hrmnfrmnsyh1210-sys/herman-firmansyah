# Herman Firmansyah — Portfolio (Nuxt 3)

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # build statis ke .output/public (siap deploy ke Netlify/Vercel/GitHub Pages)
```

## Struktur

- `data/portfolio.ts` — **semua konten** (profil, skill, proyek, pengalaman, kontak). Edit di sini.
- `components/sections/` — tiap section halaman (Hero, About, Skills, Projects, Experience, Contact).
- `components/AppNav.vue`, `AppFooter.vue`, `AppIcon.vue` — navbar, footer, ikon SVG.
- `components/AppDoodle.vue` — coretan dekoratif (bintang, mahkota, petir, dll).
- `assets/css/main.css` — warna (navy, biru royal, kuning, krem), font, tombol, panel, dan gaya bersama.
- `plugins/directives.ts` — `v-reveal` (animasi muncul saat scroll) & `v-spotlight` (efek cahaya kartu).
- `public/` — file statis: `herman-character.webp` (hero, latar transparan dari `image.png`), dan `poses/pose-*.webp` — 8 stiker pose dari sticker sheet (path-nya diatur di `profile.poses`). Screenshot proyek ada di `projects/*.webp` (16:9, ~800x450). Taruh juga `CV-Herman-Firmansyah.pdf` di sini.
- `legacy/` — versi HTML/CSS/JS lama, untuk referensi.

## Panel Admin Keuangan (`/admin`)

Pencatatan pemasukan & pengeluaran, tersimpan di TiDB Cloud.

1. Salin `.env.example` → `.env`, isi kredensial TiDB, `ADMIN_PASSWORD`, dan `SESSION_SECRET` (≥ 32 karakter acak).
2. `npm run dev` → buka http://localhost:3000/admin.
3. Database (`DB_NAME`, default `keuangan`) serta tabel `transactions` & `admins` dibuat otomatis saat request pertama.

Akun admin disimpan di tabel `admins` (password di-hash scrypt). Saat tabel masih kosong, akun dibuat dari
`ADMIN_USERNAME`/`ADMIN_PASSWORD` di `.env`. Untuk menambah akun atau mengganti password:

```bash
npm run admin:set                          # pakai ADMIN_USERNAME / ADMIN_PASSWORD dari .env
npm run admin:set -- herman passwordBaru   # atau langsung lewat argumen
```

- `server/api/` — endpoint: `auth/*` (login/logout/me), `transactions` (CRUD), `summary`, `categories`.
- `server/utils/` — koneksi TiDB (`db.ts`, TLS), sesi admin (`auth.ts`), validasi & filter transaksi.
- `pages/admin/` — halaman login & dashboard. `middleware/admin.ts` — proteksi halaman.

> Panel admin butuh server Node (API + database), jadi deploy dengan `npm run build`
> (Vercel/Netlify/Node), **bukan** `npm run generate` (statis) — di hosting statis, `/api` tidak tersedia.
