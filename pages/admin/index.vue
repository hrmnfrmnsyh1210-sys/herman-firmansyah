<script setup lang="ts">
import '~/assets/css/admin.css'
import type { Summary, TrendPoint, Tx, TxType } from '~/utils/finance'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Panel Keuangan — Admin', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

// ---------- Filters ----------
const month = ref(todayISO().slice(0, 7))
const typeFilter = ref<'' | TxType>('')
const search = ref('')
const debouncedSearch = ref('')
const searchOpen = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => (debouncedSearch.value = v), 300)
})

function shiftMonth(delta: number) {
  const [y, m] = month.value.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  month.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
const monthInput = ref<HTMLInputElement | null>(null)
const isThisMonth = computed(() => month.value === todayISO().slice(0, 7))

// ---------- Data ----------
const txs = ref<Tx[]>([])
const summary = ref<Summary | null>(null)
const trend = ref<TrendPoint[]>([])
const knownCategories = ref<{ type: TxType; category: string }[]>([])
const loading = ref(true)
const loadError = ref('')

async function onUnauthorized() {
  await navigateTo('/admin/login')
}

async function loadAll() {
  loading.value = true
  loadError.value = ''
  try {
    const [list, sum, tr, cats] = await Promise.all([
      $fetch<Tx[]>('/api/transactions', { query: { month: month.value, type: typeFilter.value, q: debouncedSearch.value } }),
      $fetch<Summary>('/api/summary', { query: { month: month.value } }),
      $fetch<TrendPoint[]>('/api/trend', { query: { month: month.value, months: 6 } }),
      $fetch<{ type: TxType; category: string }[]>('/api/categories'),
    ])
    txs.value = list
    summary.value = sum
    trend.value = tr
    knownCategories.value = cats
  } catch (e: any) {
    if (e?.statusCode === 401 || e?.response?.status === 401) return onUnauthorized()
    loadError.value = e?.data?.statusMessage || 'Gagal memuat data dari database.'
  } finally {
    loading.value = false
  }
}
watch([month, typeFilter, debouncedSearch], loadAll)

// ---------- Composer (side panel on desktop, bottom sheet on mobile) ----------
const isDesktop = ref(false)
const sheetOpen = ref(false)
const editing = ref<Tx | null>(null)
let mq: MediaQueryList | undefined
const syncMq = () => (isDesktop.value = !!mq?.matches)

onMounted(() => {
  mq = window.matchMedia('(min-width: 960px)')
  syncMq()
  mq.addEventListener('change', syncMq)
  loadAll()
})
onBeforeUnmount(() => {
  mq?.removeEventListener('change', syncMq)
  document.documentElement.style.overflow = ''
})
watch([sheetOpen, isDesktop], ([open, desk]) => {
  document.documentElement.style.overflow = open && !desk ? 'hidden' : ''
})

function openNew() {
  editing.value = null
  sheetOpen.value = true
}
function startEdit(tx: Tx) {
  editing.value = tx
  sheetOpen.value = true
  if (isDesktop.value) window.scrollTo({ top: 0, behavior: 'smooth' })
}
function closeComposer() {
  editing.value = null
  sheetOpen.value = false
}
async function onSaved(message: string, date: string) {
  toast(message)
  editing.value = null
  if (!isDesktop.value) sheetOpen.value = false
  // Jump to the saved entry's month so it shows up in the list.
  if (date.slice(0, 7) !== month.value) month.value = date.slice(0, 7)
  else await loadAll()
}
async function onDeleted(message: string) {
  toast(message)
  closeComposer()
  await loadAll()
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

// ---------- Derived ----------
const s = computed(() => summary.value ?? { income: 0, expense: 0, net: 0, count: 0, balance: 0, daily: [], categories: [] })
const spentRatio = computed(() => (s.value.income > 0 ? (s.value.expense / s.value.income) * 100 : s.value.expense > 0 ? 100 : 0))

const chartTab = ref<'trend' | 'daily'>('trend')
const catTab = ref<TxType>('expense')
const categoryDonutData = computed(() => categoryDonut(catTab.value, s.value.categories, knownCategories.value))

function exportCsv() {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const rows = [
    ['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal'],
    ...txs.value.map((t) => [t.date, t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', t.category, t.description, t.amount]),
  ]
  const blob = new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `keuangan-${month.value}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

// ---------- Toast ----------
const toastMsg = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function toast(text: string) {
  toastMsg.value = text
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastMsg.value = null), 2600)
}
</script>

<template>
  <div class="admin">
    <!-- Top bar -->
    <header class="topbar">
      <div class="wrap topbar__inner">
        <NuxtLink to="/" class="brand" aria-label="Ke portofolio">
          <span class="brand__h marker">H<span class="accent">.</span></span>
          <span class="street-label">Kas</span>
        </NuxtLink>

        <div class="month">
          <button class="sicon" aria-label="Bulan sebelumnya" @click="shiftMonth(-1)">‹</button>
          <label class="month__label">
            <span class="marker">{{ fmtMonth(month, { month: 'short', year: 'numeric' }) }}</span>
            <input ref="monthInput" v-model="month" type="month" class="month__input" aria-label="Pilih bulan"
              @click="monthInput?.showPicker?.()" />
          </label>
          <button class="sicon" aria-label="Bulan berikutnya" @click="shiftMonth(1)">›</button>
        </div>

        <button class="sicon logout" aria-label="Keluar" title="Keluar" @click="logout">⏻</button>
      </div>
    </header>

    <div class="wrap layout">
      <!-- Composer -->
      <div v-if="sheetOpen && !isDesktop" class="backdrop" @click="closeComposer" />
      <aside class="composer sticker tape tape--left" :class="{ open: sheetOpen }" :aria-hidden="!isDesktop && !sheetOpen">
        <div class="composer__grip" aria-hidden="true" />
        <AdminTxForm :editing="editing" :known-categories="knownCategories" :closable="!isDesktop"
          @saved="onSaved" @deleted="onDeleted" @close="closeComposer" @unauthorized="onUnauthorized" />
      </aside>

      <main class="content">
        <!-- Heading -->
        <div class="hero">
          <p class="hero__eyebrow mono">// {{ isThisMonth ? 'bulan ini' : 'arsip' }} · {{ s.count }} transaksi</p>
          <h1 class="hero__title marker">
            Kas <span class="accent">{{ fmtMonth(month, { month: 'long' }) }}</span>
            <AppDoodle name="crown" :size="34" class="hero__crown wiggle" />
          </h1>
          <AppDoodle name="underline" :size="190" class="hero__underline" />
        </div>

        <p v-if="loadError" class="salert" role="alert">
          {{ loadError }} <button class="retry" @click="loadAll">Coba lagi</button>
        </p>

        <!-- Stat posters -->
        <section class="stats" :class="{ loading: loading && !summary }" aria-label="Ringkasan">
          <article class="poster poster--income">
            <span class="poster__label">↓ Pemasukan</span>
            <strong class="poster__value">{{ rupiah(s.income) }}</strong>
          </article>
          <article class="poster poster--expense">
            <span class="poster__label">↑ Pengeluaran</span>
            <strong class="poster__value">{{ rupiah(s.expense) }}</strong>
          </article>
          <article class="poster poster--net">
            <span class="poster__label">Selisih</span>
            <strong class="poster__value">{{ rupiahSigned(s.net) }}</strong>
            <div class="meter" :title="`${spentRatio.toFixed(0)}% pemasukan terpakai`">
              <div class="meter__fill" :class="{ over: spentRatio > 100 }" :style="{ width: `${Math.min(spentRatio, 100)}%` }" />
            </div>
            <span class="poster__note">{{ s.income ? `${spentRatio.toFixed(0)}% pemasukan terpakai` : 'Belum ada pemasukan' }}</span>
          </article>
          <article class="poster poster--balance">
            <span class="poster__label">Saldo total</span>
            <strong class="poster__value">{{ s.balance < 0 ? '−' : '' }}{{ rupiah(Math.abs(s.balance)) }}</strong>
            <AppDoodle name="star" :size="22" class="poster__star spin-slow" />
          </article>
        </section>

        <!-- Comparison charts -->
        <section class="sticker tape tape--right box">
          <div class="box__head">
            <h2 class="street-title"><AppDoodle name="bolt" :size="20" /> Perbandingan</h2>
            <div class="tabs" role="tablist" aria-label="Jenis grafik">
              <button role="tab" class="schip" :class="{ on: chartTab === 'trend' }" :aria-selected="chartTab === 'trend'" @click="chartTab = 'trend'">6 bulan</button>
              <button role="tab" class="schip" :class="{ on: chartTab === 'daily' }" :aria-selected="chartTab === 'daily'" @click="chartTab = 'daily'">Harian</button>
            </div>
          </div>
          <p class="box__sub">
            {{ chartTab === 'trend' ? 'Pemasukan vs pengeluaran per bulan. Ketuk batang untuk detail, ketuk lagi untuk pindah bulan.' : `Akumulasi masuk vs keluar sepanjang ${fmtMonth(month, { month: 'long' })}.` }}
          </p>
          <AdminChartTrend v-if="chartTab === 'trend'" :data="trend" :current="month" @select="(m) => (month = m)" />
          <AdminChartDaily v-else :daily="s.daily" :month="month" />
        </section>

        <!-- Categories -->
        <section class="sticker sticker--tilt-r box">
          <div class="box__head">
            <h2 class="street-title"><AppDoodle name="sparkle" :size="18" /> Per kategori</h2>
            <div class="tabs" role="tablist" aria-label="Jenis kategori">
              <button role="tab" class="schip" :class="{ on: catTab === 'expense' }" :aria-selected="catTab === 'expense'" @click="catTab = 'expense'">Keluar</button>
              <button role="tab" class="schip" :class="{ on: catTab === 'income' }" :aria-selected="catTab === 'income'" @click="catTab = 'income'">Masuk</button>
            </div>
          </div>
          <p v-if="!categoryDonutData.length" class="muted small">Belum ada data bulan ini.</p>
          <AdminChartDonut v-else :segments="categoryDonutData"
            :title="`${catTab === 'income' ? 'Pemasukan' : 'Pengeluaran'} per kategori, ${fmtMonth(month)}`" />
        </section>

        <!-- Transactions -->
        <section class="sticker box">
          <div class="box__head">
            <h2 class="street-title"><AppDoodle name="squiggle" :size="34" /> Catatan</h2>
            <div class="list-tools">
              <button class="sicon" :class="{ on: searchOpen }" aria-label="Cari" @click="searchOpen = !searchOpen">⌕</button>
              <button class="sbtn sbtn--sm sbtn--ghost" :disabled="!txs.length" @click="exportCsv">CSV</button>
            </div>
          </div>
          <div class="filters">
            <div class="tabs" role="tablist" aria-label="Filter jenis">
              <button v-for="t in ([['', 'Semua'], ['income', 'Masuk'], ['expense', 'Keluar']] as const)" :key="t[0]"
                role="tab" class="schip" :class="{ on: typeFilter === t[0] }" :aria-selected="typeFilter === t[0]"
                @click="typeFilter = t[0]">{{ t[1] }}</button>
            </div>
            <input v-if="searchOpen" v-model="search" type="search" class="sinput search" placeholder="Cari kategori / catatan" autofocus />
          </div>
          <AdminTxList :txs="txs" :editing-id="editing?.id ?? null" :loading="loading" @edit="startEdit" />
        </section>
      </main>
    </div>

    <!-- Mobile: floating add button -->
    <button v-if="!isDesktop && !sheetOpen" class="fab" aria-label="Catat transaksi baru" @click="openNew">
      <span>+</span>
    </button>

    <Transition name="toast">
      <div v-if="toastMsg" class="toast" role="status">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.wrap { width: min(1240px, 100% - 32px); margin-inline: auto; }
.small { font-size: 0.85rem; }

/* ---------- Top bar ---------- */
.topbar {
  position: sticky; top: 0; z-index: 20;
  background: rgba(8, 19, 48, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 2.5px solid var(--ink);
  box-shadow: 0 4px 0 rgba(3, 8, 23, 0.5);
}
.topbar__inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; height: 68px; }
.brand { display: inline-flex; align-items: center; gap: 8px; }
.brand__h { font-size: 1.9rem; line-height: 1; }
.month { display: flex; align-items: center; gap: 8px; }
.month__label {
  position: relative; display: grid; place-items: center;
  min-width: 112px; min-height: 44px; padding: 0 12px;
  background: var(--paper); color: var(--ink);
  border: 2.5px solid var(--ink); border-radius: 12px; box-shadow: 3px 3px 0 var(--ink);
  font-size: 1rem; text-transform: capitalize; cursor: pointer;
  transform: rotate(-1.5deg);
}
.month__input { position: absolute; inset: 0; opacity: 0; width: 100%; cursor: pointer; }
.logout { font-size: 1rem; }
@media (max-width: 420px) {
  .brand .street-label { display: none; }
  .month__label { min-width: 96px; font-size: 0.9rem; }
}

/* ---------- Layout ---------- */
.layout { display: grid; gap: 22px; padding: 22px 0 120px; }
.content { display: grid; gap: 22px; min-width: 0; }
@media (min-width: 960px) {
  .layout { grid-template-columns: 370px minmax(0, 1fr); align-items: start; gap: 28px; padding-top: 30px; }
}

/* ---------- Composer: sticky panel ≥960px, bottom sheet below ---------- */
.composer__grip { display: none; }
@media (min-width: 960px) {
  .composer { position: sticky; top: 96px; transform: rotate(-0.6deg); }
}
@media (max-width: 959px) {
  .composer {
    position: fixed; z-index: 40; left: 0; right: 0; bottom: 0;
    max-height: 92vh; max-height: 92dvh; overflow-y: auto; overscroll-behavior: contain;
    border-radius: 22px 22px 0 0; border-bottom: none;
    padding: 12px 18px calc(20px + env(safe-area-inset-bottom));
    box-shadow: 0 -6px 0 var(--ink);
    transform: translateY(105%);
    visibility: hidden;
    transition: transform 0.32s var(--ease), visibility 0s 0.32s;
  }
  .composer.open { transform: none; visibility: visible; transition: transform 0.32s var(--ease); }
  .composer.tape::before { display: none; }
  .composer__grip { display: block; width: 52px; height: 5px; margin: 0 auto 12px; border-radius: 99px; background: var(--border-strong); }
}
.backdrop { position: fixed; inset: 0; z-index: 35; background: rgba(3, 8, 23, 0.65); backdrop-filter: blur(2px); }

/* ---------- Hero ---------- */
.hero { position: relative; padding-top: 4px; }
.hero__eyebrow { font-size: 0.78rem; color: var(--text-subtle); }
.hero__title {
  display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap;
  font-size: clamp(2.1rem, 7vw, 3.2rem); line-height: 1.05; text-transform: uppercase;
  text-shadow: 3px 3px 0 var(--ink);
}
.hero__title .accent { text-transform: capitalize; }
.hero__crown { color: var(--accent); }
.hero__underline { display: block; color: var(--brand-2); margin-top: -2px; opacity: 0.9; }
.retry { color: var(--accent); text-decoration: underline; margin-left: 6px; }

/* ---------- Stat posters ---------- */
.stats { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.stats.loading { opacity: 0.55; }
@media (min-width: 1200px) { .stats { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.poster {
  position: relative; display: grid; align-content: start; gap: 4px;
  min-height: 108px; padding: 16px;
  container-type: inline-size;
  color: var(--ink);
  border: 2.5px solid var(--ink); border-radius: 16px;
  box-shadow: var(--sticker-shadow);
}
.poster:nth-child(odd) { transform: rotate(-0.8deg); }
.poster:nth-child(even) { transform: rotate(0.7deg); }
.poster--income { background: var(--income); }
.poster--expense { background: var(--expense); }
.poster--net { background: var(--paper); }
.poster--balance { background: var(--accent); }
.poster__label { font-family: var(--marker); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.03em; }
.poster__value { font-family: var(--mono); font-weight: 500; font-size: min(1.35rem, 10.5cqi); line-height: 1.25; white-space: nowrap; }
.poster__note { font-size: 0.72rem; font-weight: 600; opacity: 0.75; }
.poster__star { position: absolute; top: 10px; right: 10px; color: var(--ink); opacity: 0.85; }
.meter { height: 10px; margin-top: 6px; border: 2px solid var(--ink); border-radius: 99px; background: rgba(3, 8, 23, 0.08); overflow: hidden; }
.meter__fill {
  height: 100%; border-radius: inherit;
  background: repeating-linear-gradient(45deg, var(--ink) 0 4px, rgba(3, 8, 23, 0.6) 4px 8px);
  transition: width 0.5s var(--ease);
}
.meter__fill.over { background: repeating-linear-gradient(45deg, var(--expense) 0 4px, #b8391c 4px 8px); }

/* ---------- Boxes ---------- */
.box__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
.box__sub { font-size: 0.82rem; color: var(--text-subtle); margin-bottom: 8px; }
.tabs { display: flex; flex-wrap: wrap; gap: 6px; }

/* List */
.list-tools { display: flex; gap: 8px; align-items: center; }
.list-tools .sicon.on { background: var(--paper); color: var(--ink); }
.filters { display: grid; gap: 10px; margin: 8px 0 16px; }

/* ---------- FAB ---------- */
.fab {
  position: fixed; z-index: 30;
  right: 18px; bottom: calc(20px + env(safe-area-inset-bottom));
  width: 64px; height: 64px; border-radius: 20px;
  display: grid; place-items: center;
  background: var(--accent); color: var(--ink);
  border: 3px solid var(--ink); box-shadow: 5px 5px 0 var(--ink);
  font-family: var(--marker); font-size: 2.3rem; line-height: 1;
  transform: rotate(-6deg);
  transition: transform 0.12s, box-shadow 0.12s;
  -webkit-tap-highlight-color: transparent;
}
.fab span { transform: translateY(-2px); }
.fab:active { transform: rotate(-6deg) translate(3px, 3px); box-shadow: 1px 1px 0 var(--ink); }

/* ---------- Toast ---------- */
.toast {
  position: fixed; z-index: 60; left: 50%; bottom: calc(100px + env(safe-area-inset-bottom));
  transform: translateX(-50%) rotate(-1.5deg);
  max-width: calc(100% - 32px);
  padding: 12px 20px;
  font-family: var(--marker); font-size: 1rem; text-transform: uppercase;
  background: var(--paper); color: var(--ink);
  border: 2.5px solid var(--ink); border-radius: 12px; box-shadow: 4px 4px 0 var(--ink);
}
@media (min-width: 960px) { .toast { bottom: 32px; } }
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 14px) rotate(-1.5deg); }
</style>
