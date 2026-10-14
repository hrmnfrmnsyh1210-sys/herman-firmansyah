<script setup lang="ts">
import { profile } from "~/data/portfolio";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p>
        © {{ year }} {{ profile.name }} · Dibuat dengan Nuxt &amp; banyak
        Americano
        <AppDoodle name="heart" :size="14" class="footer__heart" />
      </p>
      <a href="#home" class="footer__top"
        >Kembali ke atas <AppIcon name="arrow-up" :size="15"
      /></a>
    </div>
    <img
      :src="profile.poses.lookback"
      alt=""
      class="pose footer__pose"
      width="263"
      height="579"
      loading="lazy"
    />
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  padding: 26px 0 34px;
}
.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: var(--text-subtle);
  padding-right: 110px;
}
.footer__heart {
  color: var(--yellow);
  vertical-align: -2px;
}
.footer__top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}
.footer__top:hover {
  color: var(--accent);
}
.footer {
  padding-top: 40px;
}
.footer__pose {
  position: absolute;
  right: 8px;
  bottom: -112px;
  width: 92px;
  filter: none;
}

@media (max-width: 560px) {
  .footer__inner {
    justify-content: center;
    text-align: center;
    padding-right: 0;
    padding-bottom: 40px;
  }
}
</style>
