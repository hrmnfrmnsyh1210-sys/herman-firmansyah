<script setup lang="ts">
import type { Summary } from '~/utils/finance'

const props = defineProps<{ daily: Summary['daily']; month: string }>()

const wrap = ref<HTMLElement | null>(null)
const width = useElementWidth(wrap)
const height = 200
const m = { top: 14, right: 12, bottom: 28, left: 52 }
const innerH = height - m.top - m.bottom

// Cumulative totals per day; stops at today for the running month.
const points = computed(() => {
  const [yy, mm] = props.month.split('-').map(Number)
  const daysInMonth = new Date(yy, mm, 0).getDate()
  const today = todayISO()
  const lastDay = today.startsWith(props.month) ? Number(today.slice(8, 10)) : daysInMonth
  const perDay = new Map<number, { income: number; expense: number }>()
  for (const d of props.daily) {
    const day = Number(d.date.slice(8, 10))
    const entry = perDay.get(day) ?? { income: 0, expense: 0 }
    entry[d.type] += d.total
    perDay.set(day, entry)
  }
  let income = 0
  let expense = 0
  return Array.from({ length: Math.max(lastDay, 1) }, (_, i) => {
    const day = i + 1
    const totals = perDay.get(day) ?? { income: 0, expense: 0 }
    income += totals.income
    expense += totals.expense
    return { day, date: `${props.month}-${String(day).padStart(2, '0')}`, income, expense, dayIncome: totals.income, dayExpense: totals.expense, daysInMonth }
  })
})

const daysInMonth = computed(() => points.value[0]?.daysInMonth ?? 30)
const scale = computed(() => niceScale(Math.max(0, ...points.value.flatMap((p) => [p.income, p.expense]))))
const x = (day: number) => m.left + ((day - 1) / Math.max(daysInMonth.value - 1, 1)) * Math.max(width.value - m.left - m.right, 0)
const y = (v: number) => m.top + innerH - (v / scale.value.max) * innerH
const ticks = computed(() => Array.from({ length: 5 }, (_, i) => i * scale.value.step))
const xTicks = computed(() => [1, 8, 15, 22, daysInMonth.value].filter((d, i, a) => a.indexOf(d) === i))
const hasData = computed(() => props.daily.length > 0)

const line = (key: 'income' | 'expense') =>
  points.value.map((p, i) => `${i ? 'L' : 'M'}${x(p.day).toFixed(1)},${y(p[key]).toFixed(1)}`).join('')
const area = (key: 'income' | 'expense') => {
  const pts = points.value
  if (!pts.length) return ''
  return `${line(key)}L${x(pts[pts.length - 1].day)},${y(0)}L${x(1)},${y(0)}Z`
}

const hover = ref<number | null>(null)
const active = computed(() => (hover.value === null ? null : points.value[hover.value]))
function onMove(e: PointerEvent) {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const px = e.clientX - rect.left
  const ratio = (px - m.left) / Math.max(width.value - m.left - m.right, 1)
  const day = Math.round(ratio * (daysInMonth.value - 1)) + 1
  hover.value = Math.min(Math.max(day, 1), points.value.length) - 1
}
const tipStyle = computed(() => {
  if (!active.value) return {}
  const px = x(active.value.day)
  const tipW = 200
  const left = px > width.value / 2 ? px - tipW - 14 : px + 14
  // Narrow screens: the tooltip spans most of the width, so pick a vertical
  // slot (top of plot, bottom of plot, or above the chart) that clears both dots.
  const tipH = 96
  const dots = [y(active.value.income), y(active.value.expense)]
  const clear = (top: number) => dots.every((d) => d < top - 8 || d > top + tipH + 8)
  const wide = width.value >= 560
  const top = wide || clear(0) ? 0 : clear(y(0) - tipH) ? y(0) - tipH : -tipH - 8
  return { left: `${Math.min(Math.max(left, 0), Math.max(width.value - tipW, 0))}px`, top: `${top}px` }
})
const last = computed(() => points.value[points.value.length - 1])
</script>

<template>
  <div>
    <div class="legend" aria-hidden="true">
      <span><i class="swatch swatch--income" /> Masuk {{ last ? rupiahShort(last.income) : '' }}</span>
      <span><i class="swatch swatch--expense" /> Keluar {{ last ? rupiahShort(last.expense) : '' }}</span>
    </div>

    <div ref="wrap" class="chart">
      <svg v-if="width" :width="width" :height="height" role="img"
        :aria-label="`Arus kumulatif pemasukan dan pengeluaran ${fmtMonth(month)}`"
        @pointermove="onMove" @pointerdown="onMove" @pointerleave="hover = null">
        <g class="grid">
          <g v-for="t in ticks" :key="t">
            <line :x1="m.left" :x2="width - m.right" :y1="y(t)" :y2="y(t)" :class="{ base: t === 0 }" />
            <text :x="m.left - 8" :y="y(t)" dy="0.32em" text-anchor="end">{{ t === 0 ? '0' : rupiahShort(t) }}</text>
          </g>
          <text v-for="d in xTicks" :key="`x${d}`" :x="x(d)" :y="height - 8" text-anchor="middle">{{ d }}</text>
        </g>

        <template v-if="hasData">
          <path :d="area('income')" class="area area--income" />
          <path :d="area('expense')" class="area area--expense" />
          <path :d="line('income')" class="line line--income" />
          <path :d="line('expense')" class="line line--expense" />
        </template>

        <g v-if="active && hasData">
          <line class="crosshair" :x1="x(active.day)" :x2="x(active.day)" :y1="m.top" :y2="y(0)" />
          <circle :cx="x(active.day)" :cy="y(active.income)" r="5" class="dot dot--income" />
          <circle :cx="x(active.day)" :cy="y(active.expense)" r="5" class="dot dot--expense" />
        </g>
        <rect class="hit" :x="m.left - 10" :y="0" :width="Math.max(width - m.left - m.right + 20, 0)" :height="height" />
      </svg>

      <p v-if="width && !hasData" class="empty">Belum ada transaksi bulan ini.</p>

      <div v-if="active && hasData" class="ctip" :style="tipStyle" role="status">
        <div class="ctip__title">{{ fmtDate(active.date, { weekday: 'short', day: 'numeric', month: 'short' }) }}</div>
        <div class="ctip__row"><span><i class="swatch swatch--income" />Masuk</span><strong>{{ rupiah(active.income) }}</strong></div>
        <div class="ctip__row"><span><i class="swatch swatch--expense" />Keluar</span><strong>{{ rupiah(active.expense) }}</strong></div>
        <div v-if="active.dayIncome || active.dayExpense" class="ctip__row ctip__row--total">
          <span>Hari ini</span><strong>{{ rupiahSigned(active.dayIncome - active.dayExpense) }}</strong>
        </div>
      </div>
    </div>

    <details class="cdetails">
      <summary>Lihat sebagai tabel</summary>
      <div class="ctable-wrap">
        <table class="ctable">
          <thead><tr><th>Tanggal</th><th>Masuk</th><th>Keluar</th><th>Kumulatif selisih</th></tr></thead>
          <tbody>
            <tr v-for="p in points.filter((p) => p.dayIncome || p.dayExpense)" :key="p.day">
              <td>{{ fmtDate(p.date, { day: '2-digit', month: 'short' }) }}</td>
              <td>{{ rupiah(p.dayIncome) }}</td>
              <td>{{ rupiah(p.dayExpense) }}</td>
              <td>{{ rupiahSigned(p.income - p.expense) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>

<style scoped>
.chart { position: relative; margin-top: 10px; min-height: 200px; touch-action: pan-y; }
svg { display: block; overflow: visible; }
.grid line { stroke: rgba(178, 196, 255, 0.08); stroke-width: 1; }
.grid line.base { stroke: rgba(178, 196, 255, 0.3); stroke-width: 1.5; }
.grid text { fill: var(--text-subtle); font-size: 11px; font-family: var(--mono); }
.line { fill: none; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.line--income { stroke: var(--income); }
.line--expense { stroke: var(--expense); }
.area { stroke: none; }
.area--income { fill: var(--income); opacity: 0.1; }
.area--expense { fill: var(--expense); opacity: 0.1; }
.crosshair { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 3 3; }
.dot { stroke: var(--panel); stroke-width: 2; }
.dot--income { fill: var(--income); }
.dot--expense { fill: var(--expense); }
.hit { fill: transparent; }
.empty { position: absolute; inset: 0 0 28px 52px; display: grid; place-items: center; color: var(--text-subtle); font-size: 0.85rem; }
</style>
