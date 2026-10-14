/** Tracks an element's content width so charts can draw in real pixels. */
export function useElementWidth(el: Ref<HTMLElement | null>) {
  const width = ref(0)
  let observer: ResizeObserver | undefined
  onMounted(() => {
    observer = new ResizeObserver(([entry]) => (width.value = entry.contentRect.width))
    if (el.value) observer.observe(el.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return width
}
