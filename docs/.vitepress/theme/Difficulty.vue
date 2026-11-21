<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
const { lang } = useData()
const props = defineProps({ level: { type: [Number, String], default: 1 } })
const n = computed(() => Math.min(3, Math.max(1, Number(props.level) || 1)))
const label = computed(() => (lang.value?.startsWith('uz') ? ['Oson', 'Örtaça', 'Qiyin'] : ['Easy', 'Medium', 'Hard'])[n.value - 1])
const prefix = computed(() => lang.value?.startsWith('uz') ? 'Qiyinlik' : 'Difficulty')
</script>
<template>
 <span class="difficulty ignore-header" role="img" :aria-label="`${prefix}: ${label}`" :title="label">
  <span v-for="i in 3" :key="i" aria-hidden="true" :class="i <= n ? 'on' : 'off'">&#x2605;&#xFE0E;</span>
 </span>
</template>
