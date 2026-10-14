// https://nuxt.com/docs/api/configuration/nuxt-config
const favicon =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='18' fill='%232a55c9'/><text x='50%25' y='58%25' font-family='Arial Black,sans-serif' font-size='28' font-weight='900' fill='%23ffc928' text-anchor='middle' dominant-baseline='middle'>H.</text></svg>"

// Hide .reveal content only when JS runs; if the app hasn't started within
// 2.5s (blocked/failed bundle), drop the class so everything stays visible.
const revealGuard = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__hfReveal)d.classList.remove('js')},2500)})()`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Herman Firmansyah — Software Developer',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Portofolio Herman Firmansyah, lulusan S1 Informatika Universitas Bina Sarana Informatika (UBSI) Pontianak dan software developer.',
        },
        { property: 'og:title', content: 'Herman Firmansyah — Software Developer' },
        {
          property: 'og:description',
          content: 'Membangun aplikasi web & mobile yang cepat, rapi, dan berdampak.',
        },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#071129' },
      ],
      link: [
        { rel: 'icon', href: favicon },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=JetBrains+Mono:wght@400;500&family=Kaushan+Script&family=Permanent+Marker&family=Poppins:wght@400;500;600;700;800&display=swap',
        },
      ],
      script: [{ innerHTML: revealGuard, tagPosition: 'head' }],
      noscript: [{ innerHTML: '<style>.reveal{opacity:1!important;transform:none!important}</style>' }],
    },
  },
})
