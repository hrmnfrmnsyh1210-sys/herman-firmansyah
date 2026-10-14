<script setup lang="ts">
import { navLinks } from "~/data/portfolio";

const links = [{ id: "home", label: "Home" }, ...navLinks];

const scrolled = ref(false);
const progress = ref(0);
const menuOpen = ref(false);
const active = ref("home");

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrolled.value = window.scrollY > 20;
  progress.value = max > 0 ? (window.scrollY / max) * 100 : 0;
}

let observer: IntersectionObserver | undefined;

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) active.value = entry.target.id;
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  document
    .querySelectorAll("main > section[id]")
    .forEach((s) => observer!.observe(s));
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  observer?.disconnect();
});
</script>

<template>
  <div
    class="progress"
    :style="{ transform: `scaleX(${progress / 100})` }"
    aria-hidden="true"
  />
  <header class="nav" :class="{ 'is-scrolled': scrolled || menuOpen }">
    <div class="container nav__inner">
      <a href="#home" class="nav__logo marker" @click="menuOpen = false"
        >HERMAN<span class="accent">.</span></a
      >

      <nav
        class="nav__menu"
        :class="{ 'is-open': menuOpen }"
        aria-label="Navigasi utama"
      >
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav__link"
          :class="{ 'is-active': active === link.id }"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </a>
      </nav>

      <a
        href="#contact"
        class="nav__round nav__hire"
        aria-label="Hubungi saya"
        title="Hubungi saya"
      >
        <AppIcon name="chat" :size="20" />
      </a>
      <button
        class="nav__round nav__burger"
        :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="20" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  height: 3px;
  background: var(--accent);
  transform-origin: 0 50%;
}

.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--nav-h);
  transition:
    background-color 0.3s,
    backdrop-filter 0.3s,
    box-shadow 0.3s;
}
.nav.is-scrolled {
  background: rgba(9, 9, 13, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 var(--border);
}
.nav__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav__logo {
  font-size: 1.6rem;
  line-height: 1;
  margin-right: auto;
  transform: rotate(-2deg);
}

.nav__menu {
  display: flex;
  gap: 4px;
}
.nav__link {
  position: relative;
  padding: 8px 14px;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text);
  transition: color 0.2s;
}
.nav__link::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 2px;
  height: 3px;
  border-radius: 3px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}
.nav__link:hover,
.nav__link.is-active {
  color: var(--accent);
}
.nav__link.is-active::after {
  transform: scaleX(1);
}

.nav__round {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--brand);
  color: #fff;
  box-shadow: 0 10px 28px -10px
    color-mix(in srgb, var(--brand) 90%, transparent);
  transition:
    transform 0.3s var(--ease),
    background-color 0.2s;
}
.nav__round:hover {
  transform: rotate(-10deg) scale(1.06);
  background: var(--brand-2);
}
.nav__burger {
  display: none;
}

@media (max-width: 860px) {
  .nav__menu {
    position: fixed;
    top: var(--nav-h);
    left: 12px;
    right: 12px;
    flex-direction: column;
    gap: 2px;
    padding: 12px;
    background: var(--panel);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transform: translateY(-8px);
    opacity: 0;
    visibility: hidden;
    transition:
      transform 0.3s var(--ease),
      opacity 0.3s,
      visibility 0.3s;
  }
  .nav__menu.is-open {
    transform: none;
    opacity: 1;
    visibility: visible;
  }
  .nav__link {
    padding: 12px 14px;
    font-size: 1rem;
  }
  .nav__link::after {
    left: 14px;
    right: auto;
    width: 24px;
  }
  .nav__hire {
    display: none;
  }
  .nav__burger {
    display: grid;
  }
}
</style>
