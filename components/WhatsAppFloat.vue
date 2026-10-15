<script setup lang="ts">
import { siWhatsapp } from 'simple-icons'
import { profile } from '~/data/portfolio'

const url = `${profile.whatsapp.url}?text=${encodeURIComponent('Halo Herman! Saya lihat portofoliomu dan ingin ngobrol.')}`
</script>

<template>
  <a :href="url" target="_blank" rel="noopener" class="wa" aria-label="Chat via WhatsApp">
    <span class="wa__label">Chat WhatsApp</span>
    <span class="wa__btn">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path :d="siWhatsapp.path" />
      </svg>
    </span>
  </a>
</template>

<style scoped>
.wa {
  position: fixed; z-index: 90;
  right: 20px; bottom: calc(20px + env(safe-area-inset-bottom));
  display: flex; align-items: center; gap: 10px;
}
.wa__btn {
  position: relative;
  width: 58px; height: 58px; border-radius: 50%;
  display: grid; place-items: center;
  background: #25d366; color: #fff;
  box-shadow: 0 12px 28px -10px rgba(37, 211, 102, 0.75), 0 0 0 3px var(--bg);
  transition: transform 0.3s var(--ease);
}
/* soft pulse ring */
.wa__btn::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  border: 2px solid #25d366; opacity: 0;
  animation: wa-pulse 2.8s ease-out infinite;
}
.wa__label {
  padding: 8px 14px; border-radius: 999px;
  background: var(--cream); color: var(--accent-ink);
  font-weight: 600; font-size: 0.85rem; white-space: nowrap;
  box-shadow: var(--shadow);
  opacity: 0; transform: translateX(8px); pointer-events: none;
  transition: opacity 0.25s, transform 0.3s var(--ease);
}
.wa:hover .wa__btn, .wa:focus-visible .wa__btn { transform: translateY(-3px) rotate(-8deg); }
.wa:hover .wa__label, .wa:focus-visible .wa__label { opacity: 1; transform: none; }
.wa:focus-visible { outline: none; }
.wa:focus-visible .wa__btn { outline: 2px solid var(--accent); outline-offset: 3px; }

@keyframes wa-pulse {
  0% { opacity: 0.7; transform: scale(1); }
  70%, 100% { opacity: 0; transform: scale(1.45); }
}
@media (max-width: 560px) {
  .wa { right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); }
  .wa__btn { width: 54px; height: 54px; }
}
</style>
