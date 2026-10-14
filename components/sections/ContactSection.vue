<script setup lang="ts">
import { profile, socials } from '~/data/portfolio'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: false, email: false, message: false })
const status = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

const contacts = [
  { icon: 'mail', value: profile.email, url: `mailto:${profile.email}` },
  { icon: 'chat', value: profile.whatsapp.label, url: profile.whatsapp.url },
  { icon: 'pin', value: `${profile.location}` },
]

// Opens the visitor's email client with the message pre-filled.
function submit() {
  errors.name = !form.name.trim()
  errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  errors.message = !form.message.trim()

  if (errors.name || errors.email || errors.message) {
    status.value = { type: 'err', text: 'Mohon lengkapi nama, email yang valid, dan pesan.' }
    return
  }

  const body = `${form.message}\n\n— ${form.name} (${form.email})`
  window.location.href =
    `mailto:${profile.email}?subject=${encodeURIComponent(form.subject || 'Halo Herman!')}` +
    `&body=${encodeURIComponent(body)}`

  status.value = { type: 'ok', text: 'Terima kasih! Aplikasi email Anda akan terbuka untuk mengirim pesan.' }
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
}
</script>

<template>
  <section id="contact" class="container">
    <div v-reveal class="panel contact reveal">
      <div class="contact__info">
        <h2 class="contact__title marker">
          Ayo bikin<br />
          sesuatu yang
          <span class="contact__circled">
            KEREN!
            <AppDoodle name="scribble" :size="'100%'" class="contact__scribble" />
          </span>
        </h2>
        <p class="contact__sub">
          Terbuka untuk magang, freelance, maupun kolaborasi proyek. Kirim pesan dan saya balas secepatnya.
        </p>

        <ul class="contact__list">
          <li v-for="c in contacts" :key="c.icon">
            <AppIcon :name="c.icon" :size="20" />
            <a v-if="c.url" :href="c.url" :target="c.url.startsWith('http') ? '_blank' : undefined" rel="noopener">
              {{ c.value }}
            </a>
            <span v-else>{{ c.value }}</span>
          </li>
        </ul>

        <img :src="profile.poses.jump" alt="" class="pose contact__pose" width="335" height="561" loading="lazy" />
        <div class="socials">
          <a
            v-for="s in socials"
            :key="s.name"
            :href="s.url"
            :target="s.url.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
            :aria-label="s.name"
            :title="s.name"
          >
            <AppIcon :name="s.icon" :size="18" />
          </a>
        </div>
      </div>

      <form class="form" novalidate @submit.prevent="submit">
        <AppDoodle name="heart" :size="34" class="form__heart wiggle" />
        <div class="form__row">
          <div class="field" :class="{ 'has-error': errors.name }">
            <label for="name">Nama</label>
            <input id="name" v-model="form.name" type="text" placeholder="Nama lengkap" autocomplete="name" required />
          </div>
          <div class="field" :class="{ 'has-error': errors.email }">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" placeholder="email@contoh.com" autocomplete="email" required />
          </div>
        </div>
        <div class="field">
          <label for="subject">Subjek</label>
          <input id="subject" v-model="form.subject" type="text" placeholder="Tentang proyek..." />
        </div>
        <div class="field" :class="{ 'has-error': errors.message }">
          <label for="message">Pesan</label>
          <textarea id="message" v-model="form.message" rows="4" placeholder="Ceritakan kebutuhan Anda..." required />
        </div>
        <button type="submit" class="btn btn--accent btn--block">
          Kirim Pesan <AppIcon name="send" :size="17" />
        </button>
        <p class="form__status" :class="status?.type" role="status">
          <template v-if="status">
            <AppIcon :name="status.type === 'ok' ? 'check' : 'alert'" :size="16" /> {{ status.text }}
          </template>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.contact > * { min-width: 0; }

.contact__title { font-size: clamp(2rem, 4.2vw, 3rem); line-height: 1.15; text-transform: uppercase; transform: rotate(-2deg); }
.contact__circled { position: relative; z-index: 0; display: inline-block; color: var(--accent); padding: 4px 14px; margin: 6px 0 0 6px; }
.contact__scribble { position: absolute; z-index: -1; left: -14%; top: 50%; width: 128%; transform: translateY(-50%) rotate(-2deg); color: var(--brand-2); }
.contact__sub { margin-top: 36px; color: var(--text-muted); font-size: 0.95rem; max-width: 330px; }

.contact__info { position: relative; }
.contact__pose { position: absolute; right: -24px; bottom: -56px; width: 150px; transform: rotate(4deg); }
.contact__list { display: grid; gap: 12px; margin-top: 26px; }
.contact__list li { display: flex; align-items: center; gap: 14px; font-weight: 500; font-size: 0.95rem; word-break: break-word; }
.contact__list li :deep(svg) { color: var(--accent); }
.contact__list a:hover { color: var(--accent); }

.socials { display: flex; gap: 10px; margin-top: 26px; }
.socials a {
  width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
  border: 1.5px solid var(--border-strong);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.3s var(--ease);
}
.socials a:hover { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); transform: translateY(-3px) rotate(-8deg); }

.form {
  position: relative; display: grid; gap: 14px;
  padding: 26px; border-radius: var(--radius); background: var(--panel-2); border: 1px solid var(--border);
}
.form__heart { position: absolute; top: -16px; right: 22px; color: var(--yellow); }
.form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; }
.field input, .field textarea {
  width: 100%; padding: 12px 15px; border-radius: 12px;
  background: var(--bg); border: 1.5px solid var(--border-strong); color: var(--text);
  font: inherit; font-size: 0.92rem; resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field input::placeholder, .field textarea::placeholder { color: var(--text-subtle); }
.field input:focus, .field textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent); }
.field.has-error input, .field.has-error textarea { border-color: var(--danger); }
.form__status { display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 1.5em; font-size: 0.85rem; text-align: center; }
.form__status.ok { color: var(--success); }
.form__status.err { color: var(--danger); }

@media (max-width: 960px) {
  .contact { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 560px) {
  /* In normal flow under the socials so it never covers the contact details. */
  .contact__pose { position: static; width: 120px; margin: 18px 0 -10px auto; }
  .form { padding: 20px; }
  .form__row { grid-template-columns: 1fr; }
}
</style>
