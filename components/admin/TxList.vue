<script setup lang="ts">
import type { Tx } from '~/utils/finance'

const props = defineProps<{ txs: Tx[]; editingId: number | null; loading: boolean }>()
const emit = defineEmits<{ edit: [tx: Tx] }>()

const days = computed(() => {
  const groups = new Map<string, Tx[]>()
  for (const t of props.txs) groups.set(t.date, [...(groups.get(t.date) ?? []), t])
  return [...groups].map(([date, items]) => ({
    date,
    items,
    net: items.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0),
  }))
})
</script>

<template>
  <div>
    <p v-if="loading && !txs.length" class="empty">Memuat…</p>
    <div v-else-if="!txs.length" class="empty">
      <AppDoodle name="smiley" :size="40" />
      <p>Belum ada transaksi untuk filter ini.</p>
    </div>

    <section v-for="d in days" :key="d.date" class="day">
      <header class="day__head">
        <span class="day__date">{{ fmtDate(d.date, { weekday: 'long', day: 'numeric', month: 'short' }) }}</span>
        <span class="day__net mono">{{ rupiahSigned(d.net) }}</span>
      </header>
      <ul class="items">
        <li v-for="t in d.items" :key="t.id">
          <button type="button" class="item" :class="{ editing: editingId === t.id }"
            :aria-label="`Edit ${t.category} ${rupiah(t.amount)}`" @click="emit('edit', t)">
            <span class="item__icon" :class="t.type" aria-hidden="true">{{ t.type === 'income' ? '↓' : '↑' }}</span>
            <span class="item__text">
              <strong>{{ t.category }}</strong>
              <small v-if="t.description">{{ t.description }}</small>
            </span>
            <span class="item__amount mono">
              {{ t.type === 'income' ? '+' : '−' }}{{ rupiah(t.amount) }}
              <small>{{ t.type === 'income' ? 'masuk' : 'keluar' }}</small>
            </span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.empty { display: grid; justify-items: center; gap: 8px; padding: 32px 0; color: var(--text-subtle); font-size: 0.9rem; text-align: center; }
.empty .doodle { color: var(--accent); }

.day + .day { margin-top: 18px; }
.day__head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 0 4px 8px; margin-bottom: 8px;
  border-bottom: 2px dashed rgba(178, 196, 255, 0.15);
}
.day__date { font-family: var(--marker); font-size: 0.9rem; text-transform: capitalize; color: var(--text); }
.day__net { font-size: 0.78rem; color: var(--text-subtle); }

.items { display: grid; gap: 8px; }
.item {
  width: 100%; min-height: 60px;
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px;
  padding: 10px 12px; text-align: left;
  background: var(--panel-2); border: 2px solid var(--ink); border-radius: 14px;
  transition: transform 0.12s, box-shadow 0.12s, background-color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.item:hover { box-shadow: 3px 3px 0 var(--ink); transform: translate(-1px, -1px); }
.item:active { transform: translate(1px, 1px); box-shadow: none; }
.item.editing { background: var(--panel-3); outline: 2px dashed var(--accent); outline-offset: 2px; }

.item__icon {
  display: grid; place-items: center; width: 38px; height: 38px;
  font-weight: 800; font-size: 1.05rem; color: var(--ink);
  border: 2px solid var(--ink); border-radius: 12px;
  transform: rotate(-4deg);
}
.item__icon.income { background: var(--income); }
.item__icon.expense { background: var(--expense); transform: rotate(4deg); }

.item__text { display: grid; min-width: 0; }
.item__text strong { font-weight: 600; font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item__text small { color: var(--text-muted); font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.item__amount { display: grid; justify-items: end; font-size: 0.9rem; font-weight: 500; white-space: nowrap; color: var(--text); }
.item__amount small { font-family: var(--font); font-size: 0.7rem; color: var(--text-subtle); }
</style>
