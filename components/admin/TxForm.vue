<script setup lang="ts">
import type { Tx, TxType } from '~/utils/finance'

const props = defineProps<{
  editing: Tx | null
  knownCategories: { type: TxType; category: string }[]
  closable?: boolean
}>()
const emit = defineEmits<{
  saved: [message: string, date: string]
  deleted: [message: string]
  close: []
  unauthorized: []
}>()

const QUICK = [10_000, 50_000, 100_000, 500_000]

const blank = (type: TxType = 'expense', date = todayISO()) => ({ type, amount: 0, category: '', description: '', date })
const form = reactive(blank())
const amountText = ref('')
const saving = ref(false)
const error = ref('')

const groupFmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })
function setAmount(n: number) {
  form.amount = n
  amountText.value = n ? groupFmt.format(n) : ''
}
function onAmountInput(e: Event) {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 13)
  setAmount(Number(digits))
}

watch(
  () => props.editing,
  (tx) => {
    Object.assign(form, tx ? { ...tx } : blank(form.type, form.date))
    setAmount(tx ? Math.round(tx.amount) : 0)
    error.value = ''
  },
  { immediate: true },
)

const categories = computed(() => {
  const set = new Set(DEFAULT_CATEGORIES[form.type])
  for (const c of props.knownCategories) if (c.type === form.type) set.add(c.category)
  return [...set]
})

function fail(e: any, fallback: string) {
  if (e?.statusCode === 401 || e?.response?.status === 401) emit('unauthorized')
  error.value = e?.data?.statusMessage || fallback
}

async function save() {
  error.value = ''
  if (!form.amount) return (error.value = 'Isi nominalnya dulu.')
  saving.value = true
  try {
    const body = { type: form.type, amount: form.amount, category: form.category, description: form.description, date: form.date }
    if (props.editing) await $fetch(`/api/transactions/${props.editing.id}`, { method: 'PUT', body })
    else await $fetch('/api/transactions', { method: 'POST', body })
    const message = props.editing ? 'Transaksi diperbarui' : 'Transaksi dicatat'
    // Keep type & date for quick consecutive entries.
    Object.assign(form, blank(form.type, form.date))
    setAmount(0)
    emit('saved', message, body.date)
  } catch (e) {
    fail(e, 'Gagal menyimpan transaksi.')
  } finally {
    saving.value = false
  }
}

async function remove() {
  const tx = props.editing
  if (!tx || !confirm(`Hapus "${tx.category}" sebesar ${rupiah(tx.amount)}?`)) return
  saving.value = true
  try {
    await $fetch(`/api/transactions/${tx.id}`, { method: 'DELETE' })
    emit('deleted', 'Transaksi dihapus')
  } catch (e) {
    fail(e, 'Gagal menghapus transaksi.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="txform" @submit.prevent="save">
    <header class="txform__head">
      <h2 class="street-title">
        <AppDoodle :name="editing ? 'swirl' : 'bolt'" :size="22" />
        {{ editing ? 'Edit catatan' : 'Catat transaksi' }}
      </h2>
      <button v-if="closable || editing" type="button" class="sicon" aria-label="Tutup" @click="emit('close')">✕</button>
    </header>

    <div class="types" role="radiogroup" aria-label="Jenis transaksi">
      <button type="button" role="radio" :aria-checked="form.type === 'income'"
        class="type type--income" :class="{ on: form.type === 'income' }" @click="form.type = 'income'">
        <span class="type__arrow">↓</span> Masuk
      </button>
      <button type="button" role="radio" :aria-checked="form.type === 'expense'"
        class="type type--expense" :class="{ on: form.type === 'expense' }" @click="form.type = 'expense'">
        <span class="type__arrow">↑</span> Keluar
      </button>
    </div>

    <label class="sfield">
      <span class="sfield__label">Nominal</span>
      <div class="amount">
        <span class="amount__rp">Rp</span>
        <input :value="amountText" class="sinput amount__input" inputmode="numeric" autocomplete="off"
          placeholder="0" aria-label="Nominal dalam rupiah" @input="onAmountInput" />
      </div>
    </label>
    <div class="quick">
      <button v-for="q in QUICK" :key="q" type="button" class="schip" @click="setAmount(form.amount + q)">+{{ rupiahShort(q).replace('Rp', '') }}</button>
      <button v-if="form.amount" type="button" class="schip" aria-label="Kosongkan nominal" @click="setAmount(0)">C</button>
    </div>

    <div class="sfield">
      <span class="sfield__label">Kategori</span>
      <div class="cats">
        <button v-for="c in categories" :key="c" type="button" class="schip" :class="{ on: form.category === c }"
          @click="form.category = c">{{ c }}</button>
      </div>
      <input v-model="form.category" class="sinput" maxlength="100" placeholder="…atau ketik kategori baru" required aria-label="Kategori" />
    </div>

    <div class="row">
      <label class="sfield">
        <span class="sfield__label">Tanggal</span>
        <input v-model="form.date" type="date" class="sinput" required />
      </label>
    </div>

    <label class="sfield">
      <span class="sfield__label">Catatan <em>(opsional)</em></span>
      <textarea v-model="form.description" rows="2" maxlength="255" class="sinput" placeholder="Contoh: makan siang bareng tim" />
    </label>

    <p v-if="error" class="salert" role="alert">{{ error }}</p>

    <div class="actions">
      <button class="sbtn sbtn--block" :disabled="saving">
        {{ saving ? 'Menyimpan…' : editing ? 'Simpan' : 'Tambah' }}
      </button>
      <button v-if="editing" type="button" class="sbtn sbtn--danger" :disabled="saving" aria-label="Hapus transaksi" @click="remove">Hapus</button>
    </div>
  </form>
</template>

<style scoped>
.txform { display: grid; gap: 16px; }
.txform__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }

.types { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.type {
  min-height: 52px; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--marker); font-size: 1.05rem; text-transform: uppercase;
  color: var(--text-muted); background: var(--panel-2);
  border: 2.5px solid var(--ink); border-radius: 14px;
  transition: transform 0.12s, box-shadow 0.12s, background-color 0.2s, color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.type__arrow { font-family: var(--font); font-weight: 800; }
.type.on { color: var(--ink); box-shadow: 4px 4px 0 var(--ink); transform: rotate(-1.2deg); }
.type--income.on { background: var(--income); }
.type--expense.on { background: var(--expense); transform: rotate(1.2deg); }

.amount { position: relative; }
.amount__rp {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  font-family: var(--marker); color: var(--accent); font-size: 1.1rem; pointer-events: none;
}
.amount__input { padding-left: 50px; min-height: 56px; font-family: var(--mono); font-size: 1.5rem; font-weight: 500; }
.quick { display: flex; flex-wrap: wrap; gap: 6px; margin-top: -8px; }
.quick .schip { font-family: var(--mono); }
.cats { display: flex; flex-wrap: wrap; gap: 6px; }
.row { display: grid; gap: 12px; }

.actions { display: flex; gap: 10px; }
.actions .sbtn { min-height: 52px; font-size: 1.1rem; }
</style>
