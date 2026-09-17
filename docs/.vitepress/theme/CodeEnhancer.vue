<script setup>
// Adds interactivity to lesson pages (English and Uzbek) without changing the Markdown:
//  - a "Run" button on every ```python code block (opens an editor with that code)
//  - a "Solve in the browser" editor with a Check button above every exercise solution
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import Playground from './Playground.vue'
import { useT } from './i18n.js'

const route = useRoute()
const t = useT()
const editors = ref([])
let counter = 0

function codeOf(block) {
 return (block.querySelector('pre code')?.textContent || '').replace(/\n$/, '')
}

function addButton(parent, className, label, onClick) {
 const button = document.createElement('button')
 button.type = 'button'
 button.className = className
 button.textContent = label
 button.addEventListener('click', onClick)
 parent.appendChild(button)
 return button
}

function scan() {
 editors.value = []
 const doc = document.querySelector('.vp-doc')
 if (!doc) return

 // Exercises: details blocks titled "Solution" that contain Python code.
 doc.querySelectorAll('details.details').forEach(details => {
  if (details.dataset.enhanced) return
  const summary = details.querySelector('summary')?.textContent.trim()
  const block = details.querySelector('div.language-python')
  if (!['Solution', 'Yeçim'].includes(summary) || !block) return
  details.dataset.enhanced = '1'
  const bar = document.createElement('div')
  bar.className = 'exercise-bar'
  const target = document.createElement('div')
  target.id = `py-exercise-${++counter}`
  const solution = codeOf(block)
  const button = addButton(bar, 'exercise-toggle', t.value.solveHere, () => {
   const open = editors.value.find(e => e.id === target.id)
   if (open) { editors.value = editors.value.filter(e => e.id !== target.id); button.textContent = t.value.solveHere }
   else { editors.value = [...editors.value, { id: target.id, code: '', solution, closable: false }]; button.textContent = t.value.closeEditor }
  })
  details.before(bar, target)
 })

 // Every Python code block gets a Run bar; the editor replaces the block while it is open.
 doc.querySelectorAll('div.language-python').forEach(block => {
  if (block.dataset.enhanced) return
  block.dataset.enhanced = '1'
  block.classList.add('has-run-bar')
  const bar = document.createElement('div')
  bar.className = 'code-run-bar'
  const target = document.createElement('div')
  target.id = `py-run-${++counter}`
  addButton(bar, 'run-code', t.value.runBlock, () => {
   if (editors.value.some(e => e.id === target.id)) return // already open for this block
   block.hidden = true; bar.hidden = true
   editors.value = [...editors.value, { id: target.id, code: codeOf(block), solution: '', closable: true, onClose: () => { block.hidden = false; bar.hidden = false } }]
  })
  block.after(bar, target)
 })
}

async function rescan() {
 editors.value = []
 await nextTick()
 setTimeout(scan, 50)
}

onMounted(rescan)
watch(() => route.path, rescan)
</script>

<template>
 <Teleport v-for="editor in editors" :key="editor.id" :to="`#${editor.id}`">
  <Playground :code="editor.code" :solution="editor.solution" :closable="editor.closable"
   @close="editors = editors.filter(e => e.id !== editor.id); editor.onClose?.()" />
 </Teleport>
</template>
