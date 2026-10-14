<script setup lang="ts">
// Hand-drawn decorative shapes. Colour comes from `currentColor`.
const shapes: Record<string, { box: string; svg: string; fill?: boolean }> = {
  star: { box: '0 0 24 24', fill: true, svg: '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.5 6.6-.8z" stroke-linejoin="round"/>' },
  'star-outline': { box: '0 0 24 24', svg: '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.5 6.6-.8z"/>' },
  sparkle: { box: '0 0 24 24', fill: true, svg: '<path d="M12 1c.7 5.6 2.6 8.3 10 11-7.4 2.7-9.3 5.4-10 11-.7-5.6-2.6-8.3-10-11 7.4-2.7 9.3-5.4 10-11z"/>' },
  squiggle: { box: '0 0 120 24', svg: '<path d="M3 14C13 2 23 2 31 12s18 10 28 0 20-10 30 0 20 10 28-2"/>' },
  crown: { box: '0 0 48 36', svg: '<path d="M5 30 8 8l10 12 6-16 6 16 10-12 3 22z"/><path d="M6 33h36"/>' },
  bolt: { box: '0 0 24 24', fill: true, svg: '<path d="M14 1 3.5 14H11l-2 9L20.5 9H13z"/>' },
  smiley: { box: '0 0 40 40', svg: '<circle cx="20" cy="20" r="16"/><path d="M14 16v2M26 16v2"/><path d="M12 23c4 6 12 6 16 0"/>' },
  'arrow-curve': { box: '0 0 64 64', svg: '<path d="M8 6c-2 22 10 42 46 44"/><path d="M44 41l11 9-12 7"/>' },
  'arrow-loop': { box: '0 0 80 60', svg: '<path d="M4 12c20-6 34 2 30 14s-18 8-12-2 26-12 34 4c5 10 6 18 6 24"/><path d="M53 42l9 10 8-11"/>' },
  swirl: { box: '0 0 70 70', svg: '<path d="M8 60C-2 30 36 2 46 26c6 16-22 22-20 6 2-14 32-18 38 4 4 14-4 26-14 30"/>' },
  scribble: { box: '0 0 200 80', svg: '<path d="M148 9c30 2 48 13 48 29 0 21-40 36-96 36S4 61 4 40 46 6 100 6c30 0 56 3 74 10"/>' },
  underline: { box: '0 0 300 26', svg: '<path d="M6 16C90 6 200 4 294 10" stroke-width="12"/><path d="M24 22c80-7 170-9 250-6" stroke-width="4" opacity=".7"/>' },
  dashes: { box: '0 0 40 40', svg: '<path d="M6 30 14 22M16 34l10-4M10 16l2-10"/>' },
  heart: { box: '0 0 24 24', svg: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>' },
  loops: { box: '0 0 120 60', svg: '<path d="M4 46c10-36 34-36 26-6s18 30 22 0-10-34 12-30 22 34 30 18 8-26 22-14"/>' },
  dots: { box: '0 0 40 40', fill: true, svg: '<circle cx="6" cy="6" r="3"/><circle cx="20" cy="6" r="3"/><circle cx="34" cy="6" r="3"/><circle cx="6" cy="20" r="3"/><circle cx="20" cy="20" r="3"/><circle cx="34" cy="20" r="3"/><circle cx="6" cy="34" r="3"/><circle cx="20" cy="34" r="3"/><circle cx="34" cy="34" r="3"/>' },
}

const props = withDefaults(defineProps<{ name: string; size?: number | string; stroke?: number | string }>(), {
  size: 32,
  stroke: 3,
})

const shape = computed(() => shapes[props.name]!)
</script>

<template>
  <svg
    class="doodle"
    :viewBox="shape.box"
    :width="size"
    :fill="shape.fill ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="shape.fill ? 0 : stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="shape.svg"
  />
</template>
