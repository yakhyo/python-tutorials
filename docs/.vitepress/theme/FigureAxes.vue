<script setup>
// The matplotlib picture of a Figure (the whole image) holding two Axes (one chart each).
// "Figure" and "Axes" are matplotlib's own names; the other words come from the lesson.
defineProps({
 label: { type: String, required: true },
 title: { type: String, default: 'title' },
 data: { type: String, default: 'data' }
})
const charts = [{ x: 40, line: 'M0 76L40 52L80 60L120 28L160 36L196 8' }, { x: 336, line: 'M0 20L40 44L80 32L120 64L160 52L196 80' }]
</script>

<template>
 <figure class="figure-axes">
  <svg viewBox="0 0 640 292" role="img" :aria-label="label">
   <rect class="figure" x="12" y="28" width="616" height="252" rx="10" />
   <rect class="tab" x="28" y="14" width="76" height="28" rx="6" /><text class="tab-text" x="66" y="33" text-anchor="middle">Figure</text>
   <g v-for="chart in charts" :key="chart.x" :transform="`translate(${chart.x} 76)`">
    <rect class="axes" width="264" height="188" rx="8" />
    <rect class="tab is-axes" x="12" y="-14" width="60" height="28" rx="6" /><text class="tab-text is-axes" x="42" y="5" text-anchor="middle">Axes</text>
    <text class="word" x="132" y="34" text-anchor="middle">{{ title }}</text>
    <path class="axis" d="M44 52V148H244" />
    <text class="word" x="28" y="64" text-anchor="middle">y</text>
    <text class="word" x="238" y="170" text-anchor="middle">x</text>
    <path class="line" :d="chart.line" transform="translate(48 60)" />
    <text class="word is-data" x="150" y="134" text-anchor="middle">{{ data }}</text>
   </g>
  </svg>
 </figure>
</template>

<style scoped>
.figure-axes { margin: 24px 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); overflow-x: auto; }
svg { display: block; width: 100%; min-width: 480px; max-width: 640px; height: auto; margin: 0 auto; }
.figure { fill: var(--vp-c-bg); stroke: var(--vp-c-text-3); stroke-width: 1.5; stroke-dasharray: 6 6; }
.axes { fill: var(--vp-c-bg-soft); stroke: var(--vp-c-brand-3); stroke-width: 1.5; }
.tab { fill: var(--vp-c-text-2); }
.tab.is-axes { fill: var(--vp-c-brand-3); }
.tab-text { fill: var(--vp-c-bg); font: 600 14px var(--vp-font-family-mono); }
.tab-text.is-axes { fill: #fff; }
.word { fill: var(--vp-c-text-2); font: 14px var(--vp-font-family-base); }
.word.is-data { fill: var(--vp-c-brand-1); font-size: 13px; }
.axis { fill: none; stroke: var(--vp-c-text-2); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.line { fill: none; stroke: var(--vp-c-brand-3); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
</style>
