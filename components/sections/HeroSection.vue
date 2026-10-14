<script setup lang="ts">
import { profile } from "~/data/portfolio";
</script>

<template>
  <section id="home" class="hero">
    <!-- Diagonal brush streaks -->
    <div class="streaks" aria-hidden="true">
      <svg
        class="streak streak--1"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0 64 40 30l60 10 70-26 90 14 80-22 110 18 60-14 90 6-30 24 40 6-60 30 50 10-120 10-90 22-70-12-100 18-80-10-60 14-50-8 30-18z"
        />
      </svg>
      <svg
        class="streak streak--2"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
      >
        <path
          d="M10 70 60 40l90 4 60-22 100 12 90-20 90 14 60-6-20 26 60 8-80 24 30 14-120 4-70 20-90-14-80 16-70-12-60 8 20-16z"
        />
      </svg>
      <svg
        class="streak streak--3"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 50 34l80 8 90-20 80 16 100-18 70 12 80-4 50 18-40 14 30 16-110 6-80 18-90-10-90 14-60-10-50 6 20-18z"
        />
      </svg>
    </div>

    <div class="container hero__inner">
      <div class="hero__text">
        <p v-reveal class="hero__hey hand reveal">
          Halo,
          <AppDoodle name="arrow-curve" :size="46" class="hero__hey-arrow" />
        </p>

        <h1 v-reveal="80" class="hero__title reveal">
          <span class="hero__im marker">Saya</span>
          <span class="hero__name marker">
            {{ profile.shortName.toUpperCase() }}
            <AppDoodle name="crown" :size="54" class="hero__crown wiggle" />
          </span>
          <AppDoodle name="underline" :size="'100%'" class="hero__underline" />
          <span class="sr-only">{{ profile.name }}</span>
        </h1>

        <p v-reveal="140" class="hero__tagline script reveal">
          {{ profile.tagline }}
        </p>

        <p v-reveal="180" class="hero__roles reveal">
          <template v-for="(r, i) in profile.roles" :key="r">
            <span v-if="i" class="hero__dot" />
            {{ r }}
          </template>
        </p>

        <p v-reveal="220" class="hero__desc reveal">
          {{ profile.name }} — lulusan
          <strong>S1 Informatika UBSI</strong> Pontianak yang suka mengubah ide
          jadi aplikasi yang cepat, rapi, dan enak dipakai.
        </p>

        <div v-reveal="280" class="hero__buttons reveal">
          <a href="#projects" class="btn btn--accent">
            <AppIcon name="play" :size="16" /> Lihat Proyek
          </a>
          <a :href="profile.cv" class="btn btn--outline" download>
            Unduh CV <AppIcon name="arrow-up-right" :size="17" />
          </a>
        </div>
      </div>

      <div v-reveal="150" class="hero__art reveal">
        <svg class="art__brush" viewBox="0 0 400 400" aria-hidden="true">
          <path
            d="M60 120c40-50 120-80 200-70s120 60 110 130-40 140-120 160S80 330 50 260 20 170 60 120z"
          />
        </svg>
        <img
          class="character"
          :src="profile.images.character"
          :alt="`Ilustrasi kartun ${profile.name}`"
          width="743"
          height="1409"
        />
        <span class="character__shadow" />

        <div class="bubble">
          <span class="marker">Ayo bikin<br />sesuatu<br />yang keren!</span>
        </div>
        <ul class="steps hand">
          <li><AppIcon name="code" :size="18" /> Code</li>
          <li><AppIcon name="layers" :size="18" /> Build</li>
          <li><AppIcon name="chart" :size="18" /> Improve</li>
          <li><AppIcon name="rocket" :size="18" /> Achieve</li>
        </ul>
        <AppDoodle name="sparkle" :size="20" class="d d-sparkle spin-slow" />
      </div>
    </div>

    <a href="#showcase" class="scroll-down">
      <span class="scroll-down__mouse"><span /></span> Scroll Down
    </a>
  </section>

  <!-- ============ SHOWCASE ============ -->
  <section id="showcase" class="container">
    <div v-reveal class="panel showcase reveal">
      <div class="showcase__text">
        <h2 class="panel__title">
          <AppDoodle name="star-outline" :size="30" />
          Showcase
        </h2>
        <p class="showcase__tagline script">{{ profile.tagline }}.</p>
        <p>
          Menulis kode yang lebih baik setiap hari, dengan mimpi yang lebih
          besar: <em>code</em>, <em>build</em>, <em>improve</em>,
          <em>achieve</em>.
        </p>
        <a href="#projects" class="text-link">
          Lihat Karya
          <span class="text-link__circle"
            ><AppIcon name="play" :size="10"
          /></span>
        </a>
      </div>

      <img
        :src="profile.poses.peace"
        alt=""
        class="pose showcase__pose"
        width="302"
        height="508"
        loading="lazy"
      />
    </div>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.hero {
  position: relative;
  padding: calc(var(--nav-h) + 12px) 0 90px;
  overflow: hidden;
  isolation: isolate;
}

/* Brush streaks */
.streaks {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.streak {
  position: absolute;
}
.streak--1 {
  width: 760px;
  height: 150px;
  top: 60px;
  right: -120px;
  fill: var(--brand);
  opacity: 0.55;
  transform: rotate(-24deg);
}
.streak--2 {
  width: 520px;
  height: 90px;
  bottom: 120px;
  right: 2%;
  fill: var(--yellow);
  transform: rotate(-24deg);
}
.streak--3 {
  width: 520px;
  height: 110px;
  bottom: 30px;
  left: -200px;
  fill: var(--brand);
  opacity: 0.6;
  transform: rotate(-20deg);
}

.hero__inner {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 40px;
  align-items: start;
}
.hero__text {
  padding-top: clamp(12px, 5vh, 56px);
}
.hero__inner > * {
  min-width: 0;
}

.hero__hey {
  position: relative;
  display: inline-block;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
  margin-left: 4px;
}
.hero__hey-arrow {
  position: absolute;
  left: 30px;
  top: 30px;
  color: var(--text);
  transform: rotate(-12deg);
}

.hero__title {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  margin-top: 10px;
  line-height: 0.95;
}
.hero__im {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  margin-left: clamp(60px, 9vw, 110px);
  transform: rotate(-3deg);
}
.hero__name {
  position: relative;
  font-size: clamp(4.2rem, 11vw, 8.6rem);
  transform: rotate(-3deg);
  letter-spacing: 0.02em;
}
.hero__crown {
  position: absolute;
  top: -34px;
  right: -26px;
  color: var(--yellow);
}
.hero__underline {
  width: 82%;
  margin: 2px 0 0 8%;
  color: var(--yellow);
  transform: rotate(-3deg);
}

.hero__tagline {
  margin-top: 18px;
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  line-height: 1.2;
  color: var(--yellow);
  rotate: -2deg;
}
.hero__roles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  margin-top: 14px;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  font-weight: 500;
}
.hero__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--yellow);
}
.hero__desc {
  margin-top: 12px;
  max-width: 480px;
  color: var(--text-muted);
}
.hero__desc strong {
  color: var(--text);
  font-weight: 600;
}
.hero__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

/* Art side: transparent character on a brush blob */
.hero__art {
  position: relative;
  /* Width leaves 104px on the right for .steps (which sticks out 96px), and is
     capped by the viewport height so the whole character fits on screen. */
  width: min(100% - 104px, 400px, (100svh - var(--nav-h) - 70px) * 0.528);
  margin-left: auto;
  margin-right: 104px;
}
.art__brush {
  position: absolute;
  z-index: -1;
  inset: 8% -18% 6% -18%;
  width: 136%;
  height: auto;
  fill: var(--brand);
  opacity: 0.35;
}
.character {
  position: relative;
  z-index: 1;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 24px 40px rgba(2, 6, 20, 0.6));
  transform-origin: 50% 100%;
  animation: sway 6s ease-in-out infinite;
}
@keyframes sway {
  0%,
  100% {
    transform: rotate(-1deg);
  }
  50% {
    transform: rotate(1deg) translateY(-6px);
  }
}
.character__shadow {
  position: absolute;
  z-index: 0;
  left: 18%;
  right: 18%;
  bottom: -10px;
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(2, 6, 20, 0.7), transparent);
}

.bubble {
  position: absolute;
  z-index: 3;
  top: 4%;
  left: -30%;
  padding: 18px 20px;
  border-radius: 50%;
  background: var(--yellow);
  color: var(--accent-ink);
  text-align: center;
  font-size: 0.92rem;
  line-height: 1.15;
  transform: rotate(-10deg);
  box-shadow: 0 16px 34px -14px
    color-mix(in srgb, var(--yellow) 70%, transparent);
  animation: bob 5s ease-in-out infinite;
}
.bubble::after {
  content: "";
  position: absolute;
  bottom: -12px;
  right: 26px;
  width: 24px;
  height: 24px;
  background: var(--yellow);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
.steps {
  position: absolute;
  z-index: 3;
  right: -96px;
  bottom: 30%;
  display: grid;
  gap: 4px;
  padding: 14px 18px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--navy) 88%, transparent);
  border: 2px solid var(--cream);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  transform: rotate(-4deg);
  box-shadow: var(--shadow);
}
.steps li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.steps li :deep(svg) {
  color: var(--yellow);
}
.d {
  position: absolute;
  z-index: 3;
}
.d-sparkle {
  top: 2%;
  right: -30px;
  color: var(--cream);
}

.scroll-down {
  position: absolute;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.scroll-down__mouse {
  position: relative;
  width: 20px;
  height: 32px;
  border: 2px solid currentColor;
  border-radius: 12px;
}
.scroll-down__mouse span {
  position: absolute;
  top: 6px;
  left: 50%;
  width: 3px;
  height: 6px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: currentColor;
  animation: scroll 1.8s infinite;
}
@keyframes scroll {
  to {
    transform: translateY(10px);
    opacity: 0;
  }
}

/* ---------- Showcase panel ---------- */
.showcase {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 36px;
  align-items: end;
}
.showcase > * {
  min-width: 0;
}
.showcase__text .panel__title :deep(.doodle) {
  color: var(--yellow);
}
.showcase__tagline {
  margin-top: 14px;
  font-size: 1.5rem;
  line-height: 1.2;
  color: var(--yellow);
}
.showcase__text p:not(.showcase__tagline) {
  margin: 10px 0 22px;
  max-width: 560px;
  color: var(--text-muted);
  font-size: 0.95rem;
}
.showcase__pose {
  width: 160px;
  margin: -20px 240px -48px 0;
  transform: rotate(3deg);
}
.showcase__text em {
  color: var(--text);
  font-style: normal;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .bubble {
    left: -14%;
  }
}
@media (max-width: 960px) {
  .hero {
    padding-bottom: 70px;
  }
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero__text {
    padding-top: 8px;
  }
  .hero__art {
    width: 100%;
    max-width: 300px;
    margin: 10px auto 0;
  }
  /* Keep the bubble and the steps card close to the character so they
     stay inside the screen on tablets / large phones. */
  .bubble {
    left: -18%;
  }
  .steps {
    right: -56px;
    font-size: 1.15rem;
  }
  .scroll-down {
    display: none;
  }
  .showcase {
    grid-template-columns: 1fr 96px;
    gap: 12px;
  }
  .showcase__pose {
    width: 96px;
    margin: 0 0 -28px;
  }
}
@media (max-width: 560px) {
  .hero__art {
    max-width: min(210px, 54vw);
    margin: 10px 0 0;
  }
  .bubble {
    left: auto;
    right: -110px;
    top: 0;
    font-size: 0.72rem;
    padding: 14px 15px;
  }
  .steps {
    right: -110px;
    bottom: 22%;
    font-size: 1.05rem;
    padding: 10px 12px;
  }
  .d-sparkle {
    display: none;
  }
  .streak--1 {
    width: 480px;
  }
}
/* Very small phones: no room beside the Showcase title for the sticker. */
@media (max-width: 380px) {
  .showcase {
    grid-template-columns: 1fr;
  }
  .showcase__pose {
    display: none;
  }
}
</style>
