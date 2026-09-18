<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
// <Yes /> and <No />: theme-colored check and cross marks (no emoji)
const props = defineProps({ ok: { type: Boolean, default: false } })
const { lang } = useData()
const label = computed(() => lang.value?.startsWith('uz') ? (props.ok ? 'Ha' : 'Yöq') : (props.ok ? 'Yes' : 'No'))
</script>
<template>
 <span :class="['mark', ok ? 'mark-yes' : 'mark-no']" role="img" :aria-label="label" :title="label">
  <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true">
   <path v-if="ok" d="M3.5 8.5l3 3 6-7" />
   <path v-else d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </svg>
 </span>
</template>
