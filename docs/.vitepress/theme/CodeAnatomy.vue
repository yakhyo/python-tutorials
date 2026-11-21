<script setup>
// Draws a ```anatomy block: one line of code split into colored parts, each with a number, and
// a numbered list saying what each part is. One part per line, written `code :: explanation`.
import { computed } from 'vue'

const props = defineProps({ source: { type: String, required: true } })
const parts = computed(() => decodeURIComponent(props.source).split('\n').filter(line => line.trim()).map(line => {
 const [code, ...label] = line.split(' :: ')
 return { code, label: label.join(' :: ') }
}))
</script>

<template>
 <figure class="anatomy">
  <div class="anatomy-code" aria-hidden="true">
   <span v-for="(part, i) in parts" :key="i" :class="['anatomy-part', `tone-${i % 4}`]"><span class="anatomy-text">{{ part.code }}</span><span class="anatomy-number">{{ i + 1 }}</span></span>
  </div>
  <ol class="anatomy-list">
   <li v-for="(part, i) in parts" :key="i" :class="`tone-${i % 4}`"><span class="anatomy-number">{{ i + 1 }}</span><code>{{ part.code }}</code><span>{{ part.label }}</span></li>
  </ol>
 </figure>
</template>

<style scoped>
.anatomy { margin: 24px 0; padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); }
.tone-0 { --tone: var(--vp-c-brand-1); } .tone-1 { --tone: var(--vp-c-green-1); } .tone-2 { --tone: var(--vp-c-yellow-1); } .tone-3 { --tone: var(--vp-c-red-1); }
.anatomy-code { display: flex; flex-wrap: wrap; justify-content: center; gap: 0 4px; font-family: var(--vp-font-family-mono); font-size: 24px; line-height: 1.4; }
.anatomy-part { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.anatomy-text { padding: 0 4px 4px; border-bottom: 3px solid var(--tone); color: var(--vp-c-text-1); white-space: pre; }
.anatomy-number { flex: none; display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 999px; background: var(--tone); color: var(--vp-c-bg); font: 600 13px/1 var(--vp-font-family-base); }
.anatomy-list { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 8px; }
.anatomy-list li { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); }
@media (max-width: 600px) { .anatomy { padding: 16px; } .anatomy-code { font-size: 18px; } }
</style>
