// v-reveal: fades an element in when it scrolls into view.
//   The element must also carry class="reveal" so it is hidden in the
//   server-rendered HTML. Optional value = delay in ms (v-reveal="120").
// v-spotlight: feeds pointer position to the .spotlight hover glow.
export default defineNuxtPlugin((nuxtApp) => {
  // Tells the inline guard in nuxt.config.ts that the app started.
  if (import.meta.client) (window as Window & { __hfReveal?: boolean }).__hfReveal = true

  let observer: IntersectionObserver | undefined

  const getObserver = () =>
    (observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer!.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    ))

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, { value }) {
      if (value) el.style.transitionDelay = `${value}ms`
      getObserver().observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    },
  })

  const onMove = (e: PointerEvent) => {
    const el = e.currentTarget as HTMLElement
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  nuxtApp.vueApp.directive<HTMLElement>('spotlight', {
    getSSRProps: () => ({}),
    mounted(el) {
      el.addEventListener('pointermove', onMove)
    },
    unmounted(el) {
      el.removeEventListener('pointermove', onMove)
    },
  })
})
