<script setup lang="ts">
export interface DonutSegment {
  key: string
  label: string
  value: number
  color: string
  members?: { label: string; value: number }[]
}

// Segments arrive in fixed ring order (see CATEGORY_RING in utils/finance.ts);
// the legend below is sorted by value for reading.
const props = defineProps<{ segments: DonutSegment[]; title: string }>()

const size = 220
const c = size / 2
const R = 100
const r = 62

const total = computed(() => props.segments.reduce((a, s) => a + s.value, 0))
const active = ref<string | null>(null)

const pt = (radius: number, a: number) => `${(c + radius * Math.cos(a)).toFixed(2)},${(c + radius * Math.sin(a)).toFixed(2)}`
function arc(a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${pt(R, a0)}A${R},${R} 0 ${large} 1 ${pt(R, a1)}L${pt(r, a1)}A${r},${r} 0 ${large} 0 ${pt(r, a0)}Z`
}

const arcs = computed(() => {
  let a = -Math.PI / 2
  return props.segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const sweep = (s.value / (total.value || 1)) * Math.PI * 2
      const a0 = a
      a += sweep
      const mid = a0 + sweep / 2
      // A lone segment is a full ring: split it so the arc command stays valid.
      const d = sweep >= Math.PI * 2 - 1e-6 ? arc(a0, a0 + Math.PI) + arc(a0 + Math.PI, a0 + Math.PI * 2 - 1e-4) : arc(a0, a)
      return { ...s, d, pct: (s.value / (total.value || 1)) * 100, dx: Math.cos(mid) * 6, dy: Math.sin(mid) * 6 }
    })
})

const legend = computed(() =>
  [...arcs.value].sort((a, b) => (a.key === 'other' ? 1 : b.key === 'other' ? -1 : b.value - a.value)),
)
const focus = computed(() => arcs.value.find((a) => a.key === active.value) ?? null)
const toggle = (key: string) => (active.value = active.value === key ? null : key)
</script>

<template>
  <div class="donut">
    <div class="donut__chart" @pointerleave="active = null">
      <svg :viewBox="`0 0 ${size} ${size}`" role="img" :aria-label="`${title}: ${legend.map((s) => `${s.label} ${s.pct.toFixed(0)}%`).join(', ')}`">
        <circle :cx="c" :cy="c" :r="(R + r) / 2" class="track" :stroke-width="R - r" />
        <path v-for="s in arcs" :key="s.key" :d="s.d" class="slice"
          :class="{ dim: active && active !== s.key }"
          :style="{ fill: s.color, transform: active === s.key ? `translate(${s.dx}px, ${s.dy}px)` : undefined }"
          @pointerenter="active = s.key" @click="toggle(s.key)" />
      </svg>
      <div class="donut__center" aria-hidden="true">
        <template v-if="focus">
          <span class="donut__k">{{ focus.label }}</span>
          <strong class="donut__v">{{ focus.pct.toFixed(0) }}%</strong>
          <span class="donut__s mono">{{ rupiahShort(focus.value) }}</span>
        </template>
        <template v-else>
          <span class="donut__k">Total</span>
          <strong class="donut__v donut__v--total">{{ rupiahShort(total) }}</strong>
          <span class="donut__s">{{ legend.length }} kategori</span>
        </template>
      </div>
    </div>

    <ul class="donut__legend">
      <li v-for="s in legend" :key="s.key">
        <button type="button" class="row" :class="{ on: active === s.key, dim: active && active !== s.key }"
          :aria-pressed="active === s.key" @click="toggle(s.key)" @pointerenter="active = s.key" @pointerleave="active = null">
          <i class="row__sw" :style="{ background: s.color }" />
          <span class="row__label">{{ s.label }}</span>
          <span class="row__val mono">{{ rupiah(s.value) }}</span>
          <b class="row__pct mono">{{ s.pct.toFixed(0) }}%</b>
        </button>
        <p v-if="s.members?.length && active === s.key" class="row__members">
          {{ s.members.map((m) => `${m.label} ${rupiahShort(m.value)}`).join(' · ') }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut { display: grid; gap: 18px; align-items: center; }
@media (min-width: 640px) {
  .donut { grid-template-columns: 220px minmax(0, 1fr); gap: 28px; }
}

.donut__chart { position: relative; width: min(220px, 70vw); aspect-ratio: 1; margin-inline: auto; touch-action: manipulation; }
svg { display: block; width: 100%; height: 100%; overflow: visible; }
.track { fill: none; stroke: var(--panel-3); }
/* 2px surface gap between neighbouring slices */
.slice { stroke: var(--panel); stroke-width: 2; stroke-linejoin: round; cursor: pointer; transition: transform 0.2s var(--ease), opacity 0.2s; }
.slice.dim { opacity: 0.35; }

.donut__center {
  position: absolute; inset: 0; display: grid; place-content: center; justify-items: center;
  text-align: center; pointer-events: none; padding: 0 30%;
}
.donut__k { font-family: var(--marker); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.donut__v { font-family: var(--marker); font-weight: 400; font-size: 1.9rem; line-height: 1.1; color: var(--text); }
.donut__v--total { font-family: var(--mono); font-weight: 500; font-size: 1.15rem; }
.donut__s { font-size: 0.72rem; color: var(--text-subtle); }

.donut__legend { display: grid; gap: 6px; width: 100%; max-width: 440px; }
.row {
  width: 100%; min-height: 44px;
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 10px;
  padding: 6px 10px; text-align: left;
  border: 2px solid transparent; border-radius: 12px;
  transition: background-color 0.2s, border-color 0.2s, opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.row.on { background: var(--panel-2); border-color: var(--ink); box-shadow: 3px 3px 0 var(--ink); }
.row.dim { opacity: 0.5; }
.row__sw { width: 14px; height: 14px; border-radius: 4px; border: 2px solid var(--ink); }
.row__label { font-weight: 600; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row__val { font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; }
.row__pct { font-weight: 500; font-size: 0.82rem; color: var(--text); min-width: 3ch; text-align: right; }
.row__members { font-size: 0.76rem; color: var(--text-subtle); padding: 4px 12px 2px 36px; }
@media (max-width: 380px) { .row__val { display: none; } }
</style>
