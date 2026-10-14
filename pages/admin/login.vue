<script setup lang="ts">
import '~/assets/css/admin.css'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Login Admin — Keuangan', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    await navigateTo('/admin')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Gagal login, coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="admin login">
    <form class="login__card sticker tape" @submit.prevent="submit">
      <AppDoodle name="crown" :size="44" class="login__crown wiggle" />
      <span class="street-label">// admin only</span>
      <h1 class="login__title marker">Panel <span class="accent">Kas</span></h1>
      <p class="login__sub">Masuk buat catat pemasukan &amp; pengeluaran.</p>

      <label class="sfield">
        <span class="sfield__label">Username</span>
        <input v-model="username" class="sinput" autocomplete="username" autocapitalize="off" required autofocus />
      </label>
      <label class="sfield">
        <span class="sfield__label">Password</span>
        <input v-model="password" class="sinput" type="password" autocomplete="current-password" required />
      </label>

      <p v-if="error" class="salert" role="alert">{{ error }}</p>

      <button class="sbtn sbtn--block login__btn" :disabled="loading">
        {{ loading ? 'Memeriksa…' : 'Masuk' }}
      </button>
      <NuxtLink to="/" class="login__back">← Kembali ke portofolio</NuxtLink>
      <AppDoodle name="arrow-loop" :size="70" class="login__arrow" />
    </form>
  </main>
</template>

<style scoped>
.login { display: grid; place-items: center; padding: 40px 16px; }
.login__card { width: min(400px, 100%); display: grid; gap: 16px; padding: 30px 24px 26px; transform: rotate(-1deg); }
.login__crown { position: absolute; top: -30px; right: 22px; color: var(--accent); }
.login__title { font-size: clamp(2.4rem, 10vw, 3rem); line-height: 1; text-transform: uppercase; text-shadow: 3px 3px 0 var(--ink); }
.login__sub { color: var(--text-muted); font-size: 0.92rem; margin-top: -8px; }
.street-label { justify-self: start; }
.login__btn { min-height: 52px; font-size: 1.15rem; margin-top: 4px; }
.login__back { text-align: center; font-size: 0.85rem; color: var(--text-subtle); padding: 6px; }
.login__back:hover { color: var(--text); }
.login__arrow { position: absolute; left: -46px; bottom: 40px; color: var(--brand-2); opacity: 0.7; }
@media (max-width: 520px) { .login__arrow { display: none; } }
</style>
