<script setup lang="ts">
import { profile, projectFilters, projects } from '~/data/portfolio'

const filter = ref<(typeof projectFilters)[number]['value']>('all')

const visible = computed(() =>
  filter.value === 'all' ? projects : projects.filter((p) => p.category === filter.value),
)

const categoryLabel = (value: string) => projectFilters.find((f) => f.value === value)?.label

const host = (url?: string) => {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, '') : ''
  } catch {
    return ''
  }
}

// Each card gets a different doodle in its thumbnail.
const thumbDoodles = ['star', 'sparkle', 'bolt', 'heart', 'smiley', 'swirl']
</script>

<template>
  <section id="projects" class="container">
    <div v-reveal class="panel projects-panel reveal">
      <img :src="profile.poses.sit" alt="" class="pose projects__pose" width="341" height="533" loading="lazy" />
      <div class="panel__head">
        <h2 class="panel__title">
          Proyek Pilihan
          <AppDoodle name="squiggle" :size="70" />
        </h2>

        <div class="filters" role="group" aria-label="Filter proyek">
          <button
            v-for="f in projectFilters"
            :key="f.value"
            class="filter"
            :class="{ 'is-active': filter === f.value }"
            :aria-pressed="filter === f.value"
            @click="filter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <TransitionGroup tag="div" name="grid" class="projects">
        <article v-for="p in visible" :key="p.title" class="project">
          <div class="project__thumb" :style="{ '--c1': p.colors[0], '--c2': p.colors[1] }">
            <AppDoodle :name="thumbDoodles[projects.indexOf(p) % thumbDoodles.length]!" :size="38" class="project__doodle" />
            <AppDoodle name="dots" :size="54" class="project__dots" />
            <!-- Real screenshot in a small browser window, or an icon sticker as fallback -->
            <div v-if="p.image" class="shot">
              <div class="shot__bar">
                <i /><i /><i />
                <span class="shot__url">{{ host(p.links[0]?.url) }}</span>
              </div>
              <img :src="p.image" :alt="`Tampilan ${p.title}`" width="800" height="450" loading="lazy" />
            </div>
            <span class="project__sticker" :class="{ 'project__sticker--mini': p.image }">
              <AppIcon :name="p.icon" :size="p.image ? 20 : 34" :stroke-width="2.2" />
            </span>
            <span class="project__cat">{{ categoryLabel(p.category) }}</span>
          </div>

          <div class="project__body">
            <div class="project__top">
              <div>
                <h3>{{ p.title }}</h3>
                <p class="project__stack">{{ p.stack.join(' · ') }}</p>
              </div>
              <a
                :href="p.links[0]?.url"
                class="project__go"
                target="_blank"
                rel="noopener"
                :aria-label="`${p.links[0]?.label} — ${p.title}`"
              >
                <AppIcon name="arrow-up-right" :size="18" />
              </a>
            </div>
            <p class="project__desc">{{ p.description }}</p>
            <div class="project__links">
              <a v-for="l in p.links" :key="l.label" :href="l.url" target="_blank" rel="noopener">{{ l.label }}</a>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.panel__title :deep(.doodle) { color: var(--yellow); }
.projects-panel .panel__head { padding-right: 160px; min-height: 110px; align-items: flex-end; }
.projects__pose { position: absolute; z-index: 2; top: -40px; right: 40px; width: 112px; }

.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.filter {
  padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 500;
  border: 1.5px solid var(--border-strong); color: var(--text-muted);
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}
.filter:hover { color: var(--text); border-color: var(--accent); }
.filter.is-active { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 600; }

.projects { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

.project {
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--panel-2); border: 1px solid var(--border); border-radius: var(--radius);
  transition: transform 0.4s var(--ease), border-color 0.3s;
}
.project:hover { transform: translateY(-6px) rotate(-0.6deg); border-color: var(--border-strong); }

.project__thumb {
  position: relative; aspect-ratio: 16 / 9; overflow: hidden; display: grid; place-items: center;
  background:
    radial-gradient(circle at 80% 110%, var(--c2) 0 34%, transparent 35%),
    var(--c1);
}
.project__thumb::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(rgba(0, 0, 0, 0.16) 1.5px, transparent 1.5px);
  background-size: 12px 12px;
}
.project__sticker {
  position: relative; width: 84px; height: 84px; border-radius: 22px; display: grid; place-items: center;
  background: #fff; color: #0a1430; border: 3px solid #0a1430;
  box-shadow: 6px 6px 0 #0a1430; transform: rotate(-6deg);
  transition: transform 0.4s var(--ease);
}
.project:hover .project__sticker { transform: rotate(4deg) scale(1.08); }
.project__sticker--mini {
  position: absolute; z-index: 2; left: 14px; bottom: 14px;
  width: 44px; height: 44px; border-radius: 13px; border-width: 2.5px; box-shadow: 4px 4px 0 #0a1430;
}

.shot {
  position: absolute; left: 9%; right: 9%; top: 18%; bottom: -6%;
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: 10px 10px 0 0; border: 2.5px solid #0a1430; border-bottom: 0;
  background: #fff; box-shadow: 0 -8px 28px -10px rgba(2, 6, 20, 0.55);
  transform: rotate(-1.5deg);
  transition: transform 0.5s var(--ease);
}
.project:hover .shot { transform: rotate(0) translateY(-6px); }
.shot__bar {
  display: flex; align-items: center; gap: 5px; flex-shrink: 0;
  padding: 6px 10px; background: #eef1f7; border-bottom: 1px solid rgba(10, 20, 48, 0.12);
}
.shot__bar i { width: 7px; height: 7px; border-radius: 50%; background: #ff5f57; }
.shot__bar i:nth-child(2) { background: #febc2e; }
.shot__bar i:nth-child(3) { background: #28c840; }
.shot__url {
  flex: 1; min-width: 0; margin-left: 8px; padding: 1px 10px; border-radius: 999px;
  font-family: var(--mono); font-size: 0.62rem; color: #4a5568; background: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.shot img { flex: 1; min-height: 0; width: 100%; object-fit: cover; object-position: top; }
.project__doodle { position: absolute; top: 14px; left: 16px; color: #0a1430; opacity: 0.85; }
.project__dots { position: absolute; bottom: 12px; left: 18px; color: rgba(255, 255, 255, 0.55); }
.project__cat {
  position: absolute; top: 12px; right: 12px;
  padding: 3px 11px; border-radius: 999px; font-size: 0.7rem; font-weight: 600;
  background: #0a1430; color: #fff;
}

.project__body { display: flex; flex-direction: column; gap: 10px; flex: 1; padding: 18px 18px 20px; }
.project__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.project h3 { font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.01em; line-height: 1.35; }
.project__stack { font-size: 0.78rem; color: var(--text-subtle); margin-top: 2px; }
.project__go {
  flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center;
  border: 1.5px solid var(--border-strong); transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.3s var(--ease);
}
.project__go:hover { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); transform: rotate(45deg); }
.project__desc {
  font-size: 0.86rem; color: var(--text-muted);
  display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
}
.project__links { display: flex; gap: 16px; margin-top: auto; font-size: 0.82rem; font-weight: 600; }
.project__links a { color: var(--accent); }
.project__links a:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Filter transitions */
.grid-move, .grid-enter-active, .grid-leave-active { transition: opacity 0.4s var(--ease), transform 0.5s var(--ease); }
.grid-enter-from, .grid-leave-to { opacity: 0; transform: scale(0.92) rotate(-2deg); }
.grid-leave-active { position: absolute; }

@media (max-width: 1024px) {
  .projects { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .projects-panel .panel__head { padding-right: 84px; min-height: 0; }
  .projects__pose { width: 78px; top: -30px; right: 12px; }
  .projects { grid-template-columns: 1fr; }
}
</style>
