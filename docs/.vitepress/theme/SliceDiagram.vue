<script setup>
// Draws a string with its index positions sitting between the characters, and marks one slice:
// <SliceDiagram text="Python" name="word" :start="0" :stop="3" /> shows word[0:3] → "Pyt".
import { computed } from 'vue'

const props = defineProps({
 text: { type: String, required: true },
 name: { type: String, default: 'text' },
 start: { type: Number, required: true },
 stop: { type: Number, required: true }
})
const CELL = 56, LEFT = 24
const chars = computed(() => [...props.text])
const x = index => LEFT + index * CELL
const width = computed(() => LEFT * 2 + chars.value.length * CELL)
const result = computed(() => `${props.name}[${props.start}:${props.stop}] → "${chars.value.slice(props.start, props.stop).join('')}"`)
</script>

<template>
 <figure class="slice">
  <svg :viewBox="`0 0 ${width} 172`" :style="{ maxWidth: `${width}px` }" role="img" :aria-label="result">
   <g v-for="(char, i) in chars" :key="i">
    <rect :class="i >= start && i < stop ? 'cell is-in' : 'cell'" :x="x(i)" y="12" :width="CELL" :height="CELL" />
    <text class="char" :x="x(i) + CELL / 2" y="49" text-anchor="middle">{{ char }}</text>
   </g>
   <g v-for="i in chars.length + 1" :key="`index-${i}`">
    <path class="tick" :d="`M${x(i - 1)} 68v8`" />
    <text :class="i - 1 === start || i - 1 === stop ? 'index is-edge' : 'index'" :x="x(i - 1)" y="94" text-anchor="middle">{{ i - 1 }}</text>
   </g>
   <path class="bracket" :d="`M${x(start)} 104v10H${x(stop)}v-10`" />
   <text class="result" :x="(x(start) + x(stop)) / 2" y="144" text-anchor="middle">{{ result }}</text>
  </svg>
 </figure>
</template>

<style scoped>
.slice { margin: 24px 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); overflow-x: auto; }
svg { display: block; width: 100%; min-width: 300px; height: auto; margin: 0 auto; overflow: visible; }
.cell { fill: var(--vp-c-bg); stroke: var(--vp-c-divider); stroke-width: 1.5; }
.cell.is-in { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-brand-3); }
.char { fill: var(--vp-c-text-1); font: 600 24px var(--vp-font-family-mono); }
.tick { stroke: var(--vp-c-text-3); stroke-width: 1.5; }
.index { fill: var(--vp-c-text-2); font: 14px var(--vp-font-family-mono); }
.index.is-edge { fill: var(--vp-c-brand-1); font-weight: 600; }
.bracket { fill: none; stroke: var(--vp-c-brand-3); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.result { fill: var(--vp-c-text-1); font: 14px var(--vp-font-family-mono); }
</style>
