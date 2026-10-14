<script setup lang="ts">
import { highlights, profile, services } from '~/data/portfolio'
</script>

<template>
  <section id="about" class="container">
    <div v-reveal class="panel about reveal">
      <div class="about__card">
        <AppDoodle name="sparkle" :size="22" class="about__spark" />
        <p class="about__words marker">Fokus<br />Disiplin<br />Konsisten</p>
        <img :src="profile.poses.crossed" :alt="profile.name" class="pose about__photo" width="265" height="588" loading="lazy" />
      </div>

      <div class="about__text">
        <h2 class="panel__title">
          Tentang Saya
          <AppDoodle name="squiggle" :size="60" />
        </h2>

        <p class="about__lead">
          Saya <strong>{{ profile.name }}</strong>, lulusan <strong>S1 Informatika</strong> di
          <strong>{{ profile.campus }}</strong> Pontianak. Sehari-hari saya membangun aplikasi web & mobile — mulai dari
          memahami kebutuhan, merancang database, menulis kode yang bersih, hingga deploy.
        </p>
        <p>
          Buat saya, software yang baik bukan cuma soal kode yang jalan, tapi juga <strong>mudah dirawat</strong>,
          <strong>cepat</strong>, dan <strong>enak dipakai</strong>. Latar belakang Informatika bikin saya paham
          alur sistem secara utuh — dari database, backend, sampai tampilan.
        </p>

        <ul class="stats">
          <li v-for="h in highlights" :key="h.value">
            <strong class="marker">{{ h.value }}</strong>
            <span>{{ h.label }}</span>
          </li>
        </ul>

        <ul class="services">
          <li v-for="s in services" :key="s.title" :title="s.text">
            <AppIcon :name="s.icon" :size="15" /> {{ s.title }}
          </li>
        </ul>

        <a href="#contact" class="text-link">
          Ayo Kerja Sama <span class="text-link__circle"><AppIcon name="arrow-right" :size="13" /></span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about { display: grid; grid-template-columns: 0.85fr 1.4fr; gap: 44px; align-items: center; }
.about > * { min-width: 0; }

.about__card {
  position: relative; overflow: hidden; aspect-ratio: 5 / 4;
  background: var(--accent); color: var(--accent-ink); border-radius: var(--radius);
  transform: rotate(-1.5deg);
}
.about__card::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(rgba(10, 20, 48, 0.14) 1.5px, transparent 1.5px);
  background-size: 14px 14px;
}
.about__words { position: absolute; z-index: 2; top: 20px; left: 20px; font-size: clamp(1rem, 2vw, 1.35rem); line-height: 1.2; transform: rotate(-12deg); }
.about__spark { position: absolute; z-index: 2; bottom: 20px; left: 22px; }
.about__photo { position: absolute; z-index: 1; right: 12%; top: 8%; width: 46%; }

.about__text .panel__title :deep(.doodle) { color: var(--yellow); }
.about__text p { margin-top: 14px; color: var(--text-muted); font-size: 0.95rem; }
.about__text p.about__lead { margin-top: 20px; color: var(--text); }
.about__text strong { color: var(--text); font-weight: 600; }

.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 24px 0 18px; }
.stats li { padding: 12px 14px; border-radius: var(--radius-sm); background: var(--panel-2); border: 1px solid var(--border); }
.stats strong { display: block; font-size: 1.4rem; line-height: 1.2; color: var(--accent); }
.stats span { font-size: 0.72rem; color: var(--text-muted); line-height: 1.35; display: block; }

.services { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.services li {
  display: inline-flex; align-items: center; gap: 7px; padding: 6px 13px; border-radius: 999px;
  font-size: 0.8rem; border: 1.5px solid var(--border-strong); cursor: default;
}
.services li :deep(svg) { color: var(--accent); }

@media (max-width: 960px) {
  .about { grid-template-columns: 1fr; gap: 36px; }
  .about__card { max-width: 440px; width: 100%; margin-inline: auto; }
}
@media (max-width: 560px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
