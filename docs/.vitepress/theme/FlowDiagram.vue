<script setup>
// Draws a ```flow block from a lesson: steps joined by arrows, with indented rows inside a step
// and side-by-side steps for work that branches. The markdown plugin in config.mjs passes the
// block's text in `source`. The format, one item per line:
//
//   `read_lines(path)` :: generator: yields non-blank lines      step, with a note
//     `shuffled(items)` -> new list [pure]                       indented row: result and a tag
//   | `to_csv()` -> `report.csv`                                 "| " steps sit next to each other
//   |= objects                                                   caption for that group of steps
//
// Backticks mark code. Two spaces of indent make a row belong to the line above it.
import { computed } from 'vue'
import FlowItems from './FlowItems.vue'

const props = defineProps({ source: { type: String, required: true } })

const inline = text => text.split(/(`[^`]*`)/).filter(Boolean).map(part => (
 part.startsWith('`') ? { code: true, text: part.slice(1, -1) } : { code: false, text: part }
))

function parseLine(raw) {
 let text = raw.trim()
 const tags = []
 for (let tag; (tag = text.match(/\s\[([^\[\]`]+)\]$/));) { tags.unshift(tag[1]); text = text.slice(0, tag.index) }
 const [main, ...notes] = text.split(' :: ')
 const arrow = main.indexOf(' -> ')
 return {
  label: inline(arrow === -1 ? main : main.slice(0, arrow)),
  result: arrow === -1 ? null : inline(main.slice(arrow + 4)),
  note: notes.length ? inline(notes.join(' :: ')) : null,
  tags, children: [], size: text.replace(/`/g, '').length
 }
}

// Rows of steps: a row holds one step, or several "| " steps that sit side by side.
const rows = computed(() => {
 const result = []
 const stack = []
 let caption = ''
 for (const raw of decodeURIComponent(props.source).split('\n')) {
  if (!raw.trim()) continue
  if (raw.startsWith('|= ')) { caption = raw.slice(3).trim(); const last = result.at(-1); if (last?.parallel) last.caption = caption; continue }
  const parallel = raw.startsWith('| ')
  const line = parallel ? raw.slice(2) : raw
  const depth = Math.floor(line.match(/^ */)[0].length / 2)
  const item = parseLine(line)
  if (depth === 0) {
   const last = result.at(-1)
   if (parallel && last?.parallel) last.steps.push(item)
   else { result.push({ parallel, steps: [item], caption: parallel ? caption : '' }); caption = '' }
  } else {
   (stack[depth - 1] || stack.findLast(Boolean))?.children.push(item)
  }
  stack.length = depth
  stack[depth] = item
 }
 // Three short cards with nothing inside fit across one lesson column; anything longer gets two.
 for (const row of result) row.compact = row.parallel && row.steps.length === 3 && row.steps.every(step => !step.children.length && step.size <= 22)
 return result
})
</script>

<template>
 <figure class="flow">
  <ol class="flow-rows">
   <template v-for="(row, i) in rows" :key="i">
    <li v-if="i" class="flow-arrow" aria-hidden="true"><svg viewBox="0 0 16 32"><path d="M8 1v28M2 22l6 8l6-8" /></svg></li>
    <li :class="['flow-row', { 'is-parallel': row.parallel, 'is-compact': row.compact }]">
     <p v-if="row.caption" class="flow-caption">{{ row.caption }}</p>
     <div v-for="(step, j) in row.steps" :key="j" :class="['flow-step', { 'has-items': step.children.length }]">
      <FlowItems :items="[{ ...step, children: [] }]" class="flow-head" />
      <FlowItems v-if="step.children.length" :items="step.children" class="flow-body" />
     </div>
    </li>
   </template>
  </ol>
 </figure>
</template>

<style scoped>
.flow { container-type: inline-size; margin: 24px 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); }
.flow-rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.flow-row { margin: 0; display: grid; gap: 16px; }
/* The arrow between two rows: drawn, centered under the step it leaves, pointing at the next one. */
.flow-arrow { margin: 4px 0; display: flex; justify-content: center; }
.flow-arrow svg { display: block; width: 16px; height: 32px; fill: none; stroke: var(--vp-c-text-2); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
/* Steps that branch share one dashed frame, so the arrows point into and out of the group as a
   whole. Two cards fit across a lesson column; a third one takes the full width below them. */
.flow-row.is-parallel { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; padding: 12px; border: 2px dashed var(--vp-c-divider); border-radius: 12px; }
.flow-row.is-parallel > .flow-step:last-child:nth-of-type(odd) { grid-column: 1 / -1; }
.flow-row.is-compact { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.flow-row.is-compact > .flow-step:last-child:nth-of-type(odd) { grid-column: auto; }
.flow-caption { grid-column: 1 / -1; margin: 0; font-size: 12px; line-height: 1.5; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--vp-c-text-2); }
@container (max-width: 560px) {
 .flow-row.is-parallel { grid-template-columns: minmax(0, 1fr); }
}
.flow-step { min-width: 0; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); }
.flow-head { padding: 4px 16px; }
.flow-head :deep(.flow-label) { font-weight: 600; }
.flow-step.has-items .flow-head { border-bottom: 1px solid var(--vp-c-divider); }
.flow-body { padding: 8px 16px; }
</style>
