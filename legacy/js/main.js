// =========================================================
// Herman Firmansyah — Portfolio interactions
// =========================================================

const root = document.documentElement;

// ---------- Theme toggle (remembered per browser) ----------
const THEME_KEY = "hf-theme";
function getSavedTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* storage unavailable */ }
}
const initialTheme =
  getSavedTheme() ||
  (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
root.setAttribute("data-theme", initialTheme);

document.getElementById("themeToggle").addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ---------- Navbar: scrolled state + mobile menu ----------
const nav = document.getElementById("nav");
const navMenu = document.getElementById("navMenu");
const burger = document.getElementById("navBurger");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function closeMenu() {
  navMenu.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
}
burger.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
navMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

// ---------- Active nav link on scroll ----------
const links = [...document.querySelectorAll(".nav__link")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) =>
        l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Typing effect ----------
const roles = [
  "Lulusan S1 Informatika UBSI",
  "Software Developer",
  "Full-Stack Web Developer",
  "Mobile App Developer",
  "Problem Solver",
];
const typedEl = document.getElementById("typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];
  typedEl.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(type, 80);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1600);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 40);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ---------- Reveal on scroll + counters ----------
function animateCounter(el) {
  const target = Number(el.dataset.target);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll(".counter").forEach(animateCounter);
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

// ---------- Project filter ----------
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.filter;
    projects.forEach((p) => {
      p.classList.toggle("is-hidden", cat !== "all" && p.dataset.category !== cat);
    });
  });
});

// ---------- Contact form (opens the visitor's email client) ----------
const CONTACT_EMAIL = "hello@hermanfirmansyah.dev";
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll("[required]").forEach((input) => {
    const ok =
      input.value.trim() !== "" &&
      (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    input.parentElement.classList.toggle("has-error", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    statusEl.textContent = "Mohon lengkapi nama, email yang valid, dan pesan.";
    statusEl.className = "form-status err";
    return;
  }

  const { name, email, subject, message } = Object.fromEntries(new FormData(form));
  const body = `${message}\n\n— ${name} (${email})`;
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || "Halo Herman!")}` +
    `&body=${encodeURIComponent(body)}`;

  statusEl.textContent = "Terima kasih! Aplikasi email Anda akan terbuka untuk mengirim pesan.";
  statusEl.className = "form-status ok";
  form.reset();
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
