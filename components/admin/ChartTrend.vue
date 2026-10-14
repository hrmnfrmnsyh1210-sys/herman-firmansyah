<script setup lang="ts">
import type { TrendPoint } from '~/utils/finance'

const props = defineProps<{ data: TrendPoint[]; current: string }>()
const emit = defineEmits<{ select: [month: string] }>()

const wrap = ref<HTMLElement | null>(null)
const width = useElementWidth(wrap)
const height = 236
const m = { top: 36, right: 6, bottom: 30, left: 52 }

const innerW = computed(() => Math.max(width.value - m.left - m.right, 0))
const innerH = height - m.top - m.bottom
const scale = computed(() => niceScale(Math.max(0, ...props.data.flatMap((d) => [d.income, d.expense]))))
const y = (v: number) => m.top + innerH - (v / scale.value.max) * innerH
const ticks = computed(() => Array.from({ length: 5 }, (_, i) => i * scale.value.step))
const hasData = computed(() => props.data.some((d) => d.income || d.expense))

const groups = computed(() => {
  const n = props.data.length || 1
  const band = innerW.value / n
  // Two bars per group with a 2px gap; bars stay thin even on wide screens.
  const barW = Math.max(Math.min(26, (band * 0.62 - 2) / 2), 3)
  return props.data.map((d, i) => {
    const cx = m.left + band * i + band / 2
    const xIn = cx - barW - 1
    const xOut = cx + 1
    return {
      ...d,
      i,
      cx,
      band,
      x0: m.left + band * i,
      incomePath: barPath(xIn, y(d.income), barW, m.top + innerH - y(d.income)),
      expensePath: barPath(xOut, y(d.expense), barW, m.top + innerH - y(d.expense)),
      incomeTop: y(d.income),
      expenseTop: y(d.expense),
      xIn: xIn + barW / 2,
      xOut: xOut + barW / 2,
      label: fmtMonth(d.month, { month: 'short' }),
    }
  })
})

const hover = ref<number | null>(null)
const active = computed(() => (hover.value === null ? null : groups.value[hover.value]))
const tipStyle = computed(() => {
  if (!active.value) return {}
  const left = Math.min(Math.max(active.value.cx - 90, 0), Math.max(width.value - 180, 0))
  return { left: `${left}px`, top: '0px' }
})
const currentGroup = computed(() => groups.value.find((g) => g.month === props.current))
</script>

<template>
  <div>
    <div class="legend" aria-hidden="true">
      <span><i class="swatch swatch--income" /> Pemasukan</span>
      <span><i class="swatch swatch--expense" /> Pengeluaran</span>
    </div>

    <div ref="wrap" class="chart" @pointerleave="hover = null">
      <svg v-if="width" :width="width" :height="height" role="img"
        :aria-label="`Grafik pemasukan dan pengeluaran ${data.length} bulan terakhir`">
        <!-- grid + y labels -->
        <g class="grid">
          <g v-for="t in ticks" :key="t">
            <line :x1="m.left" :x2="width - m.right" :y1="y(t)" :y2="y(t)" :class="{ base: t === 0 }" />
            <text :x="m.left - 8" :y="y(t)" dy="0.32em" text-anchor="end">{{ t === 0 ? '0' : rupiahShort(t) }}</text>
          </g>
        </g>

        <!-- highlight for the selected month -->
        <rect v-if="currentGroup" class="current" :x="currentGroup.x0 + 2" :y="m.top - 8"
          :width="currentGroup.band - 4" :height="innerH + 8" rx="10" />

        <!-- bars -->
        <g v-for="g in groups" :key="g.month" :class="{ dim: hover !== null && hover !== g.i }" class="group">
          <path :d="g.incomePath" class="bar bar--income" />
          <path :d="g.expensePath" class="bar bar--expense" />
          <text :x="g.cx" :y="height - 10" text-anchor="middle" class="xlabel" :class="{ on: g.month === current }">{{ g.label }}</text>
        </g>

        <!-- selective direct labels: only the selected month, stacked above the group -->
        <g v-if="currentGroup && hover === null && hasData" class="vlabel">
          <text :x="currentGroup.cx" :y="Math.min(currentGroup.incomeTop, currentGroup.expenseTop) - 22" text-anchor="middle">↓ {{ rupiahShort(currentGroup.income) }}</text>
          <text :x="currentGroup.cx" :y="Math.min(currentGroup.incomeTop, currentGroup.expenseTop) - 8" text-anchor="middle">↑ {{ rupiahShort(currentGroup.expense) }}</text>
        </g>

        <!-- hit targets: whole band, taller than the bars -->
        <rect v-for="g in groups" :key="`hit-${g.month}`" class="hit" :x="g.x0" :y="m.top - 8"
          :width="g.band" :height="innerH + m.bottom + 8"
          @pointerenter="hover = g.i" @pointerdown="hover = g.i" @click="emit('select', g.month)" />
      </svg>

      <p v-if="width && !hasData" class="empty">Belum ada transaksi di periode ini.</p>

      <div v-if="active" class="ctip" :style="tipStyle" role="status">
        <div class="ctip__title">{{ fmtMonth(active.month) }}</div>
        <div class="ctip__row"><span><i class="swatch swatch--income" />Masuk</span><strong>{{ rupiah(active.income) }}</strong></div>
        <div class="ctip__row"><span><i class="swatch swatch--expense" />Keluar</span><strong>{{ rupiah(active.expense) }}</strong></div>
        <div class="ctip__row ctip__row--total"><span>Selisih</span><strong>{{ rupiahSigned(active.income - active.expense) }}</strong></div>
      </div>
    </div>

    <details class="cdetails">
      <summary>Lihat sebagai tabel</summary>
      <div class="ctable-wrap">
        <table class="ctable">
          <thead><tr><th>Bulan</th><th>Masuk</th><th>Keluar</th><th>Selisih</th></tr></thead>
          <tbody>
            <tr v-for="d in data" :key="d.month">
              <td>{{ fmtMonth(d.month, { month: 'short', year: 'numeric' }) }}</td>
              <td>{{ rupiah(d.income) }}</td>
              <td>{{ rupiah(d.expense) }}</td>
              <td>{{ rupiahSigned(d.income - d.expense) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>

<style scoped>
.chart { position: relative; margin-top: 10px; min-height: 220px; touch-action: pan-y; }
svg { display: block; overflow: visible; }
.grid line { stroke: rgba(178, 196, 255, 0.08); stroke-width: 1; }
.grid line.base { stroke: rgba(178, 196, 255, 0.3); stroke-width: 1.5; }
.grid text, .xlabel { fill: var(--text-subtle); font-size: 11px; font-family: var(--mono); }
.xlabel { text-transform: capitalize; font-family: var(--font); font-size: 12px; }
.xlabel.on { fill: var(--text); font-weight: 700; }
.current { fill: rgba(255, 201, 40, 0.07); stroke: rgba(255, 201, 40, 0.35); stroke-width: 1.5; stroke-dasharray: 5 4; }
.group { transition: opacity 0.2s; }
.group.dim { opacity: 0.35; }
.bar--income { fill: var(--income); }
.bar--expense { fill: var(--expense); }
.vlabel text { fill: var(--text); font-size: 11px; font-weight: 600; font-family: var(--mono); }
.hit { fill: transparent; cursor: pointer; }
.empty { position: absolute; inset: 0 0 30px 52px; display: grid; place-items: center; color: var(--text-subtle); font-size: 0.85rem; }
</style>
