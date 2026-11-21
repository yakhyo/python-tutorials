<script setup>
// A small drawing for each course project on the landing page: what the finished program is
// about, in the site's own colors (so it follows light and dark mode). Keyed by lesson slug.
defineProps({ name: { type: String, required: true } })
</script>

<template>
 <svg class="project-art" viewBox="0 0 360 200" aria-hidden="true">
  <!-- Number guessing game: two wrong guesses on a number line point toward the answer. -->
  <g v-if="name === 'number-guessing-game'">
   <circle class="ink-fill" cx="44" cy="44" r="5" /><circle class="ink-fill" cx="62" cy="44" r="5" /><circle class="accent" cx="80" cy="44" r="5" />
   <path class="rule" d="M40 124H320M40 116v16M110 118v12M180 118v12M250 118v12M320 116v16" />
   <text class="label" x="40" y="156" text-anchor="middle">1</text><text class="label" x="320" y="156" text-anchor="middle">100</text>
   <circle class="hollow" cx="96" cy="124" r="9" /><path class="ink" d="M86 96h20m-6-6l6 6l-6 6" />
   <circle class="hollow" cx="268" cy="124" r="9" /><path class="ink" d="M278 96h-20m6-6l-6 6l6 6" />
   <rect class="accent-soft" x="172" y="62" width="48" height="30" rx="8" /><text class="value" x="196" y="82" text-anchor="middle">42</text>
   <circle class="accent" cx="196" cy="124" r="14" /><path class="on-accent" d="M189 124l5 5l9-10" />
  </g>

  <!-- Quiz game: four answers, one chosen and correct, and a running score. -->
  <g v-else-if="name === 'quiz-game'">
   <rect class="soft" x="48" y="26" width="176" height="12" rx="6" />
   <rect class="accent-soft" x="264" y="18" width="48" height="28" rx="14" /><text class="value" x="288" y="37" text-anchor="middle">3/3</text>
   <g v-for="(letter, i) in ['A', 'B', 'C', 'D']" :key="letter" :transform="`translate(0 ${58 + i * 34})`">
    <rect :class="i === 1 ? 'chosen' : 'card'" x="48" width="264" height="26" rx="8" />
    <circle :class="i === 1 ? 'accent' : 'hollow'" cx="64" cy="13" r="8" />
    <text :class="i === 1 ? 'on-accent-text' : 'label'" x="64" y="17" text-anchor="middle">{{ letter }}</text>
    <rect class="soft" x="82" y="9" :width="[96, 132, 76, 110][i]" height="8" rx="4" />
    <path v-if="i === 1" class="accent-line" d="M286 13l5 5l9-10" />
   </g>
  </g>

  <!-- Expense tracker: spending by category against a budget line, one category over it. -->
  <g v-else-if="name === 'expense-tracker'">
   <rect class="card" x="48" y="18" width="92" height="28" rx="8" /><rect class="soft" x="58" y="28" width="28" height="8" rx="4" /><rect class="ink-fill" x="94" y="28" width="36" height="8" rx="4" />
   <path class="rule" d="M48 164H312" />
   <path class="budget" d="M48 76H312" />
   <rect class="accent" x="68" y="104" width="40" height="60" rx="4" />
   <rect class="accent" x="128" y="88" width="40" height="76" rx="4" />
   <rect class="accent" x="188" y="124" width="40" height="40" rx="4" />
   <rect class="warn" x="248" y="52" width="40" height="112" rx="4" />
   <rect v-for="x in [68, 128, 188, 248]" :key="x" class="soft" :x="x + 6" y="174" width="28" height="6" rx="3" />
  </g>

  <!-- Library system: books on a shelf, one borrowed (dashed slot) with a due date. -->
  <g v-else-if="name === 'oop-project'">
   <rect class="accent" x="64" y="72" width="24" height="92" rx="3" />
   <rect class="soft" x="92" y="88" width="18" height="76" rx="3" />
   <rect class="accent-soft" x="114" y="64" width="28" height="100" rx="3" />
   <rect class="ink-fill" x="146" y="82" width="20" height="82" rx="3" />
   <rect class="slot" x="172" y="76" width="24" height="88" rx="3" />
   <rect class="accent" x="202" y="92" width="20" height="72" rx="3" />
   <rect class="soft" x="226" y="60" width="26" height="104" rx="3" />
   <rect class="accent-soft" x="258" y="80" width="22" height="84" rx="3" transform="rotate(12 269 164)" />
   <path class="shelf" d="M48 166H312" />
   <rect class="warn-soft" x="158" y="30" width="52" height="28" rx="8" /><circle class="warn-line" cx="174" cy="44" r="7" /><path class="warn-line" d="M174 40v4l3 2" /><rect class="warn" x="187" y="40" width="16" height="8" rx="4" />
   <path class="budget" d="M184 58v14" />
  </g>

  <!-- Text analyzer: a page of text on the left, its most common words as bars on the right. -->
  <g v-else-if="name === 'text-processing-project'">
   <rect class="card" x="40" y="24" width="132" height="152" rx="8" />
   <g v-for="(row, i) in [[40, 30, 26], [28, 44, 22], [50, 24, 20], [24, 34, 36], [44, 28, 22], [30, 50, 16], [38, 30]]" :key="i">
    <rect v-for="(width, j) in row" :key="j" :class="(i + j) % 4 === 1 ? 'accent' : 'soft'" :x="54 + row.slice(0, j).reduce((sum, w) => sum + w + 6, 0)" :y="42 + i * 18" :width="width" height="8" rx="4" />
   </g>
   <path class="ink" d="M184 100h20m-6-6l6 6l-6 6" />
   <g v-for="(width, i) in [84, 62, 46, 30]" :key="width">
    <rect class="soft" x="216" :y="54 + i * 28" width="24" height="8" rx="4" />
    <rect class="accent" x="216" :y="66 + i * 28" :width="width" height="10" rx="5" :opacity="1 - i * 0.2" />
   </g>
  </g>
 </svg>
</template>

<style scoped>
.project-art { display: block; width: 100%; height: auto; background: var(--vp-c-bg-soft); }
.project-art * { stroke-linecap: round; stroke-linejoin: round; }
.card { fill: var(--vp-c-bg); stroke: var(--vp-c-divider); }
.chosen { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-brand-3); }
.soft { fill: var(--vp-c-default-soft); }
.ink-fill { fill: var(--vp-c-text-3); }
.accent { fill: var(--vp-c-brand-3); }
.accent-soft { fill: var(--vp-c-brand-soft); }
.warn { fill: var(--vp-c-yellow-2); }
.warn-soft { fill: var(--vp-c-yellow-soft); }
.hollow { fill: var(--vp-c-bg); stroke: var(--vp-c-text-3); stroke-width: 2; }
.slot { fill: none; stroke: var(--vp-c-text-3); stroke-width: 2; stroke-dasharray: 5 5; }
.rule { fill: none; stroke: var(--vp-c-text-3); stroke-width: 2; }
.shelf { fill: none; stroke: var(--vp-c-text-2); stroke-width: 4; }
.ink { fill: none; stroke: var(--vp-c-text-3); stroke-width: 2; }
.budget { fill: none; stroke: var(--vp-c-yellow-2); stroke-width: 2; stroke-dasharray: 6 6; }
.warn-line { fill: none; stroke: var(--vp-c-yellow-1); stroke-width: 2; }
.accent-line { fill: none; stroke: var(--vp-c-brand-3); stroke-width: 2.5; }
.on-accent { fill: none; stroke: #fff; stroke-width: 2.5; }
.label { fill: var(--vp-c-text-2); font: 600 12px var(--vp-font-family-base); }
.on-accent-text { fill: #fff; font: 600 12px var(--vp-font-family-base); }
.value { fill: var(--vp-c-brand-1); font: 600 14px var(--vp-font-family-base); }
</style>
