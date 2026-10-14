<script setup lang="ts">
import { experience, profile } from '~/data/portfolio'
</script>

<template>
  <section id="experience" class="container">
    <div v-reveal class="panel journey reveal">
      <div class="panel__head">
        <h2 class="panel__title">
          Perjalanan
          <AppDoodle name="arrow-loop" :size="64" />
        </h2>
      </div>

      <ol class="timeline">
        <li v-for="(item, i) in experience" :key="item.title" v-spotlight class="tl spotlight" :style="{ '--r': i % 2 ? '0.6deg' : '-0.6deg' }">
          <span class="tl__icon"><AppIcon :name="item.icon" :size="22" /></span>
          <div class="tl__body">
            <span class="tl__date">{{ item.period }}</span>
            <h3>{{ item.title }}</h3>
            <h4>{{ item.place }}</h4>
            <ul>
              <li v-for="pt in item.points" :key="pt">{{ pt }}</li>
            </ul>
          </div>
        </li>
      </ol>
      <img :src="profile.poses.backpack" alt="" class="pose journey__pose" width="259" height="590" loading="lazy" />
    </div>
  </section>
</template>

<style scoped>
.panel__title :deep(.doodle) { color: var(--yellow); }

.journey { display: grid; grid-template-columns: 1fr 170px; column-gap: 28px; align-items: end; }
.journey .panel__head { grid-column: 1 / -1; }
.journey__pose { width: 150px; margin: -60px 0 -48px auto; align-self: end; }
.timeline { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; align-self: center; }
.tl {
  display: flex; gap: 18px; padding: 22px; border-radius: var(--radius);
  background: var(--panel-2); border: 1px solid var(--border);
  transform: rotate(var(--r)); transition: transform 0.4s var(--ease), border-color 0.3s;
}
.tl:hover { transform: rotate(0) translateY(-4px); border-color: var(--border-strong); }
.tl__icon {
  flex-shrink: 0; width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center;
  background: var(--brand); color: #fff; transform: rotate(-6deg);
}
.tl__body { min-width: 0; }
.tl__date {
  display: inline-block; padding: 2px 12px; border-radius: 999px; margin-bottom: 8px;
  font-size: 0.74rem; font-weight: 600; background: var(--accent); color: var(--accent-ink);
}
.tl h3 { font-size: 1.05rem; font-weight: 700; }
.tl h4 { font-size: 0.86rem; font-weight: 500; color: var(--text-muted); margin-bottom: 10px; }
.tl li { position: relative; padding-left: 18px; font-size: 0.88rem; color: var(--text-muted); margin-top: 4px; }
.tl li::before { content: '✦'; position: absolute; left: 0; color: var(--accent); font-size: 0.75rem; top: 2px; }

@media (max-width: 860px) {
  .journey { grid-template-columns: minmax(0, 1fr); }
  .journey .panel__head { padding-right: 90px; min-height: 100px; }
  .journey__pose { position: absolute; top: 12px; right: 16px; width: 54px; margin: 0; }
  .timeline { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 560px) {
  /* Icon above the text so the text gets the full card width. */
  .tl { flex-direction: column; gap: 12px; padding: 20px; }
  .tl__icon { width: 44px; height: 44px; }
}
</style>
