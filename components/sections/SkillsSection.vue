<script setup lang="ts">
import {
  siDocker, siFigma, siFlutter, siGit, siLaravel, siNodedotjs,
  siPostgresql, siPython, siReact, siTypescript, siVuedotjs,
} from 'simple-icons'
import { profile, skillGroups, skillTiles } from '~/data/portfolio'

// Brand logos (simple-icons, CC0). Tiles without an entry here fall back to AppIcon.
const brands: Record<string, { path: string; hex: string }> = {
  typescript: siTypescript,
  vue: siVuedotjs,
  react: siReact,
  nodejs: siNodedotjs,
  laravel: siLaravel,
  python: siPython,
  flutter: siFlutter,
  postgresql: siPostgresql,
  docker: siDocker,
  git: siGit,
  figma: siFigma,
}

const tileColor = (t: { icon: string; color?: string }) => t.color ?? `#${brands[t.icon]?.hex ?? 'ffc928'}`
</script>

<template>
  <section id="skills" class="container">
    <div v-reveal class="panel skills reveal">
      <img :src="profile.poses.think" alt="" class="pose skills__pose" width="321" height="514" loading="lazy" />

      <div class="skills__row">
        <h2 class="panel__title skills__title">
          Keahlian
          <AppDoodle name="underline" :size="'100%'" class="skills__underline" />
        </h2>

        <ul class="tiles">
          <li v-for="(t, i) in skillTiles" :key="t.name" class="tile" :style="{ '--c': tileColor(t), '--r': `${(i % 3) - 1}deg` }">
            <span class="tile__icon">
              <svg v-if="brands[t.icon]" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                <path :d="brands[t.icon]!.path" />
              </svg>
              <AppIcon v-else :name="t.icon" :size="28" />
            </span>
            <span class="tile__name">{{ t.name }}</span>
          </li>
        </ul>
      </div>

      <div class="groups">
        <div v-for="g in skillGroups" :key="g.title" v-spotlight class="group spotlight">
          <h3><AppIcon :name="g.icon" :size="16" /> {{ g.title }}</h3>
          <div class="tags">
            <span v-for="item in g.items" :key="item" class="tag">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills { overflow: hidden; }
.skills__pose { position: absolute; right: 30px; top: 22px; width: 160px; }

.skills__row { display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; }
.skills__row > * { min-width: 0; }
.skills__title { flex-direction: column; align-items: flex-start; gap: 0; }
.skills__underline { width: 100%; color: var(--brand-2); margin-top: -4px; }

.tiles { display: flex; flex-wrap: wrap; gap: 18px 22px; padding-right: 190px; min-height: 230px; align-content: center; }
.tile { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 76px; text-align: center; }
.tile__icon {
  width: 58px; height: 58px; border-radius: 14px; display: grid; place-items: center;
  /* Brand colour, lifted a little so dark logos stay readable on navy. */
  color: color-mix(in srgb, var(--c) 80%, white);
  background: color-mix(in srgb, var(--c) 14%, #0a1430);
  border: 2px solid color-mix(in srgb, var(--c) 75%, transparent);
  transform: rotate(var(--r));
  transition: transform 0.35s var(--ease), box-shadow 0.35s;
}
.tile:hover .tile__icon { transform: translateY(-6px) rotate(calc(var(--r) * -3)); box-shadow: 0 12px 26px -10px var(--c); }
.tile__name { font-size: 0.74rem; line-height: 1.25; color: var(--text-muted); }

.groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-top: 36px; padding-top: 32px; border-top: 1px dashed var(--border-strong); }
.group { padding: 16px 18px; border-radius: var(--radius-sm); background: var(--panel-2); border: 1px solid var(--border); }
.group h3 { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; margin-bottom: 10px; }
.group h3 :deep(svg) { color: var(--accent); }

@media (max-width: 960px) {
  .skills__row { grid-template-columns: 1fr; gap: 26px; }
  .tiles { padding-right: 0; min-height: 0; }
  /* Title row is tall enough for the sticker, so the tiles start below it. */
  .skills__title { padding-right: 110px; min-height: 140px; justify-content: center; }
  .skills__pose { width: 88px; right: 16px; top: 14px; }
}
@media (max-width: 560px) {
  .tiles { gap: 16px 10px; justify-content: space-between; }
  .tile { width: 64px; }
  .tile__icon { width: 52px; height: 52px; }
  .tile__icon svg { width: 24px; height: 24px; }
}
</style>
