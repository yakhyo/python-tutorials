<script setup>
// The nested rows inside one step of a FlowDiagram (it renders itself for deeper levels).
defineProps({ items: { type: Array, required: true } })
</script>

<template>
 <ul class="flow-items">
  <li v-for="(item, i) in items" :key="i" class="flow-item">
   <div class="flow-line">
    <span class="flow-label"><template v-for="(part, j) in item.label" :key="j"><code v-if="part.code" :class="{ 'is-short': part.text.length <= 24 }">{{ part.text }}</code><template v-else>{{ part.text }}</template></template><span v-for="tag in item.tags" :key="tag" class="flow-tag">{{ tag }}</span></span>
    <span v-if="item.result" class="flow-result"><template v-for="(part, j) in item.result" :key="j"><code v-if="part.code" :class="{ 'is-short': part.text.length <= 24 }">{{ part.text }}</code><template v-else>{{ part.text }}</template></template></span>
    <span v-if="item.note" class="flow-note"><template v-for="(part, j) in item.note" :key="j"><code v-if="part.code" :class="{ 'is-short': part.text.length <= 24 }">{{ part.text }}</code><template v-else>{{ part.text }}</template></template></span>
   </div>
   <FlowItems v-if="item.children.length" :items="item.children" />
  </li>
 </ul>
</template>

<style scoped>
.flow-items { list-style: none; margin: 0; padding: 0; }
.flow-items .flow-items { margin: 0 0 4px 8px; padding-left: 16px; border-left: 2px solid var(--vp-c-divider); }
.flow-item { margin: 0; }
.flow-line { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 16px; padding: 4px 0; font-size: 14px; line-height: 1.6; }
/* Long code breaks at a space when it has to, never in the middle of a name unless the name
   alone is wider than the card. */
.flow-label { min-width: 0; overflow-wrap: break-word; color: var(--vp-c-text-1); }
.flow-result, .flow-note { min-width: 0; overflow-wrap: break-word; color: var(--vp-c-text-2); }
.flow-line code { overflow-wrap: break-word; word-break: normal; }
.flow-line code.is-short { white-space: nowrap; }
.flow-tag { white-space: nowrap; }
.flow-result::before { content: '→ '; color: var(--vp-c-text-3); }
.flow-tag { margin-left: 8px; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: var(--vp-c-text-3); }
</style>
