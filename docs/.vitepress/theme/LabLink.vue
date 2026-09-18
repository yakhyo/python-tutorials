<script setup>
// On every lesson page: a link to that module's practice notebook in the Python Lab.
// The notebook file names come from scripts/make-notebooks.py, which numbers and slugifies
// the English module name, so the English course.json drives this in both languages.
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import course from '../course.json'
import { useT } from './i18n.js'

const route = useRoute()
const t = useT()

const notebook = computed(() => {
 const match = route.path.match(/\/(?:lessons|uz\/darslar)\/([a-z0-9-]+)(?:\.html)?$/)
 const lesson = match && course.find(item => item.slug === match[1])
 if (!lesson) return null
 const [number, name] = lesson.group.split(' · ')
 const slug = name.replace(/\(.*?\)/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
 return `${number}-${slug}.ipynb`
})
</script>

<template>
 <p v-if="notebook" class="lab-footer">
  <a :href="withBase(`/lab/lab/index.html?path=${notebook}`)" target="_blank" rel="noopener">{{ t.labLink }}</a>
 </p>
</template>
