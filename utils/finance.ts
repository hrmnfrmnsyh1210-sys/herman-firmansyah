export type TxType = 'income' | 'expense'

export interface Tx {
  id: number
  type: TxType
  amount: number
  category: string
  description: string
  date: string
}

export interface Summary {
  income: number
  expense: number
  net: number
  count: number
  balance: number
  daily: { date: string; type: TxType; total: number }[]
  categories: { type: TxType; category: string; total: number }[]
}

export interface TrendPoint {
  month: string
  income: number
  expense: number
}

export const DEFAULT_CATEGORIES: Record<TxType, string[]> = {
  income: ['Gaji', 'Freelance', 'Proyek', 'Bonus', 'Investasi', 'Lainnya'],
  expense: ['Makan', 'Transportasi', 'Tagihan', 'Belanja', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya'],
}

const rupiahFmt = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
const shortFmt = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 })

export const rupiah = (n: number) => rupiahFmt.format(n)
/** "Rp1,2 jt" style label for chart axes and tight spaces. */
export const rupiahShort = (n: number) => `Rp${shortFmt.format(n)}`
/** Signed amount using a true minus sign. */
export const rupiahSigned = (n: number) => `${n < 0 ? '−' : '+'}${rupiah(Math.abs(n))}`

export const todayISO = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const parseDay = (s: string) => new Date(`${s}T00:00:00`)
export const fmtDate = (s: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  new Intl.DateTimeFormat('id-ID', opts).format(parseDay(s))
export const fmtMonth = (ym: string, opts: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat('id-ID', opts).format(parseDay(`${ym}-01`))

/** A round axis maximum with `ticks` evenly spaced steps (1/2/2.5/5 × 10ⁿ). */
export function niceScale(max: number, ticks = 4) {
  if (max <= 0) return { max: ticks, step: 1 }
  const raw = max / ticks
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((s) => s >= raw)!
  return { max: step * ticks, step }
}

/** SVG path for a bar with 4px rounded top corners and a square baseline. */
export function barPath(x: number, y: number, w: number, h: number, r = 4) {
  if (h <= 0 || w <= 0) return ''
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`
}

/**
 * Category donut colours (dark categorical slots, validated on #0c1938).
 * A category's slot comes from its all-time rank, so it keeps its colour from
 * month to month; ranks past 5 fold into "Lainnya". Slices are drawn in the
 * fixed ring order below, which keeps every pair that may end up adjacent
 * (even when a slot is missing that month) apart enough for colour-blind readers.
 */
export const CATEGORY_SLOTS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181']
export const OTHER_COLOR = '#9aa0b8'
const CATEGORY_RING: (number | 'other')[] = [0, 2, 1, 'other', 4, 3]

export function categoryDonut(
  type: TxType,
  monthTotals: { type: TxType; category: string; total: number }[],
  allTimeRanked: { type: TxType; category: string }[],
) {
  const top = allTimeRanked.filter((c) => c.type === type).slice(0, CATEGORY_SLOTS.length).map((c) => c.category)
  const bySlot = new Map<number | 'other', { label: string; value: number }[]>()
  for (const c of monthTotals) {
    if (c.type !== type || c.total <= 0) continue
    const slot = top.indexOf(c.category)
    const key = slot === -1 ? 'other' : slot
    bySlot.set(key, [...(bySlot.get(key) ?? []), { label: c.category, value: c.total }])
  }
  return CATEGORY_RING.filter((slot) => bySlot.has(slot)).map((slot) => {
    const members = bySlot.get(slot)!
    const value = members.reduce((a, m) => a + m.value, 0)
    return slot === 'other'
      ? { key: 'other', label: 'Lainnya', value, color: OTHER_COLOR, members }
      : { key: members[0].label, label: members[0].label, value, color: CATEGORY_SLOTS[slot] }
  })
}
