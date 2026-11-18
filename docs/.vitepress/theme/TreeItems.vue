<script setup>
// One level of a TreeDiagram; it renders itself for the levels below.
defineProps({ items: { type: Array, required: true }, root: { type: Boolean, default: false } })
</script>

<template>
 <ul :class="['tree-items', { 'is-root': root }]">
  <li v-for="item in items" :key="item.text" class="tree-item">
   <code v-if="item.code" class="tree-name">{{ item.text }}</code><span v-else class="tree-name">{{ item.text }}</span>
   <TreeItems v-if="item.children.length" :items="item.children" />
  </li>
 </ul>
</template>

<style scoped>
/* Each child hangs from a vertical line that comes down from its parent, with a short branch
   to its own name. The line stops at the last child. */
.tree-items { list-style: none; margin: 0; padding: 0 0 0 12px; }
.tree-items.is-root { padding: 0; }
.tree-item { position: relative; margin: 0; padding: 4px 0 4px 28px; }
.is-root > .tree-item { padding-left: 0; }
.tree-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; border-left: 2px solid var(--vp-c-text-3); }
.tree-item::after { content: ''; position: absolute; left: 0; top: 19px; width: 20px; border-top: 2px solid var(--vp-c-text-3); }
.tree-item:last-child::before { bottom: auto; height: 20px; }
.is-root > .tree-item::before, .is-root > .tree-item::after { display: none; }
.tree-name { display: inline-block; font-size: 14px; line-height: 1.6; white-space: nowrap; }
</style>
