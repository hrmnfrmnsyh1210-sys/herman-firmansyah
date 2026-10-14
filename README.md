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
