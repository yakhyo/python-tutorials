<script setup>
// Draws a ```tree block as a family tree with connector lines (for example the exception
// hierarchy). One name per line, two spaces of indent per level, backticks around code.
import { computed } from 'vue'
import TreeItems from './TreeItems.vue'

const props = defineProps({ source: { type: String, required: true } })

const tree = computed(() => {
 const roots = []
 const stack = []
 for (const raw of decodeURIComponent(props.source).split('\n')) {
  if (!raw.trim()) continue
  const depth = Math.floor(raw.match(/^ */)[0].length / 2)
  const text = raw.trim()
  const item = { code: text.startsWith('`') && text.endsWith('`'), text: text.replace(/^`|`$/g, ''), children: [] }
  if (depth === 0) roots.push(item)
  else (stack[depth - 1] || stack.findLast(Boolean))?.children.push(item)
  stack.length = depth
  stack[depth] = item
 }
 return roots
})
</script>

<template>
 <figure class="tree"><TreeItems :items="tree" root /></figure>
</template>

<style scoped>
.tree { margin: 24px 0; padding: 16px 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); overflow-x: auto; }
</style>
